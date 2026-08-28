import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAPLERAD_BASE_URL = "https://sandbox.maplerad.com/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const MAPLERAD_SECRET_KEY = Deno.env.get("MAPLERAD_SECRET_KEY");
  if (!MAPLERAD_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "MAPLERAD_SECRET_KEY not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const mapleradHeaders = {
    Authorization: `Bearer ${MAPLERAD_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const { action, firebase_uid, data } = await req.json();

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, wallets(*)")
      .eq("firebase_uid", firebase_uid)
      .maybeSingle();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!profile.maplerad_customer_id) {
      return new Response(JSON.stringify({ error: "Maplerad customer not created. Complete KYC first." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "create_card": {
        // Requires Tier 1
        if ((profile.maplerad_tier || 0) < 1) {
          return new Response(JSON.stringify({ error: "Tier 1 KYC required for card creation" }), {
            status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const amount = data.amount || 1000; // in cents USD
        const brand = data.brand || "VISA";

        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing`, {
          method: "POST",
          headers: mapleradHeaders,
          body: JSON.stringify({
            customer_id: profile.maplerad_customer_id,
            currency: "USD",
            type: "VIRTUAL",
            amount,
            brand,
            auto_approve: true,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Card creation failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const cardData = result.data;
        const wallet = profile.wallets?.[0];

        if (wallet) {
          // Save card locally
          await supabase.from("virtual_cards").insert({
            wallet_id: wallet.id,
            card_name: data.card_name || `Carte ${brand}`,
            card_number_last4: cardData?.masked_pan?.slice(-4) || String(Math.floor(1000 + Math.random() * 9000)),
            card_type: data.card_type || "virtual",
            card_status: "active",
            balance: amount,
            expires_at: cardData?.expiry_date || new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          });
        }

        return new Response(JSON.stringify({ success: true, card: cardData }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "fund_card": {
        const { card_id, amount } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing/${card_id}/fund`, {
          method: "POST",
          headers: mapleradHeaders,
          body: JSON.stringify({
            amount,
            reference: `fund-jynkopay-${Date.now()}`,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Card funding failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true, data: result.data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "freeze_card": {
        const { card_id } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing/${card_id}/freeze`, {
          method: "PATCH",
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, data: result.data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "unfreeze_card": {
        const { card_id } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing/${card_id}/unfreeze`, {
          method: "PATCH",
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, data: result.data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_card_details": {
        const { card_id } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing/${card_id}`, {
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, card: result.data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_card_transactions": {
        const { card_id } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/issuing/${card_id}/transactions`, {
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, transactions: result.data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
