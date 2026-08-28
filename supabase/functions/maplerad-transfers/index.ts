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

    // Get profile + wallet
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

    const wallet = profile.wallets?.[0];
    if (!wallet) {
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "withdraw": {
        // Withdraw from wallet to Orange Money / MTN MoMo via Maplerad Transfers
        const { amount, phone, operator, recipient_name } = data;

        if (!amount || amount <= 0) {
          return new Response(JSON.stringify({ error: "Invalid amount" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check balance
        if (wallet.balance < amount) {
          return new Response(JSON.stringify({ error: "Solde insuffisant" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Apply KYC limits
        const dailyLimit = (profile.maplerad_tier || 0) >= 1 ? 500000 : 100000;
        if (amount > dailyLimit) {
          return new Response(JSON.stringify({ error: `Limite journalière dépassée (${dailyLimit} XAF)` }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Calculate fees (1% min 100 XAF)
        const fees = Math.max(Math.round(amount * 0.01), 100);
        const totalDebit = amount + fees;

        if (wallet.balance < totalDebit) {
          return new Response(JSON.stringify({ error: "Solde insuffisant (frais inclus)" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Bank codes: Orange CM = 531, MTN CM = 
        const bankCode = operator === "orange" ? "531" : "532";
        const reference = `withdraw-jynkopay-${firebase_uid.slice(0, 8)}-${Date.now()}`;

        const response = await fetch(`${MAPLERAD_BASE_URL}/transfers`, {
          method: "POST",
          headers: mapleradHeaders,
          body: JSON.stringify({
            bank_code: bankCode,
            account_number: phone.replace("+", ""),
            amount,
            currency: "XAF",
            reason: "Retrait Wallet Jynkopay",
            reference,
            meta: {
              scheme: "MOBILEMONEY",
              counterparty: {
                name: recipient_name || profile.display_name || `${profile.first_name} ${profile.last_name}`,
              },
            },
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Transfer failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Create pending transaction (wallet balance will be updated by webhook on success)
        await supabase.from("transactions").insert({
          wallet_id: wallet.id,
          type: "outgoing",
          category: "mobile_money",
          title: `Retrait ${operator === "orange" ? "Orange Money" : "MTN MoMo"}`,
          description: `Vers ${phone}`,
          amount: totalDebit,
          currency: "XAF",
          status: "pending",
          reference,
        });

        return new Response(JSON.stringify({ success: true, reference, fees, transfer: result.data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_transfer_status": {
        const { transfer_id } = data;
        const response = await fetch(`${MAPLERAD_BASE_URL}/transfers/${transfer_id}`, {
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, transfer: result.data }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_banks": {
        const country = data?.country || "CM";
        const response = await fetch(`${MAPLERAD_BASE_URL}/banks?country=${country}`, {
          headers: mapleradHeaders,
        });

        const result = await response.json();
        return new Response(JSON.stringify({ success: response.ok, banks: result.data }), {
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
