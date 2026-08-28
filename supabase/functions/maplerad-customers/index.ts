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

  try {
    const { action, firebase_uid, data } = await req.json();

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("firebase_uid", firebase_uid)
      .maybeSingle();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mapleradHeaders = {
      Authorization: `Bearer ${MAPLERAD_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    switch (action) {
      case "create_customer": {
        // Tier 0 — basic customer creation
        const response = await fetch(`${MAPLERAD_BASE_URL}/customers`, {
          method: "POST",
          headers: mapleradHeaders,
          body: JSON.stringify({
            first_name: profile.first_name || data.first_name,
            last_name: profile.last_name || data.last_name,
            email: profile.email,
            country: data.country || "CM",
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Maplerad customer creation failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const customerId = result.data?.id;
        // Save to profile
        await supabase
          .from("profiles")
          .update({ maplerad_customer_id: customerId, maplerad_tier: 0 })
          .eq("id", profile.id);

        return new Response(JSON.stringify({ success: true, customer_id: customerId, tier: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upgrade_tier1": {
        if (!profile.maplerad_customer_id) {
          return new Response(JSON.stringify({ error: "Customer not created yet. Create customer first." }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const response = await fetch(
          `${MAPLERAD_BASE_URL}/customers/${profile.maplerad_customer_id}/upgrade/tier1`,
          {
            method: "PATCH",
            headers: mapleradHeaders,
            body: JSON.stringify({
              phone: data.phone,
              dob: data.dob,
              id_number: data.id_number,
              id_type: data.id_type || "NATIONAL_ID",
              address: {
                street: data.address || data.home_address,
                city: data.city || "Douala",
                state: data.state || "Littoral",
                country: "CM",
                postal_code: data.postal_code || "00000",
              },
            }),
          }
        );

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Tier 1 upgrade failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase
          .from("profiles")
          .update({ maplerad_tier: 1, kyc_level: 1, phone: data.phone })
          .eq("id", profile.id);

        return new Response(JSON.stringify({ success: true, tier: 1 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upgrade_tier2": {
        if (!profile.maplerad_customer_id) {
          return new Response(JSON.stringify({ error: "Customer not created yet" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const response = await fetch(
          `${MAPLERAD_BASE_URL}/customers/${profile.maplerad_customer_id}/upgrade/tier2`,
          {
            method: "PATCH",
            headers: mapleradHeaders,
            body: JSON.stringify({
              document_type: data.document_type || "NIN",
              document_image: data.document_image,
            }),
          }
        );

        const result = await response.json();
        if (!response.ok) {
          return new Response(JSON.stringify({ error: "Tier 2 upgrade failed", details: result }), {
            status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase
          .from("profiles")
          .update({ maplerad_tier: 2, kyc_level: 2 })
          .eq("id", profile.id);

        return new Response(JSON.stringify({ success: true, tier: 2 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_customer": {
        if (!profile.maplerad_customer_id) {
          return new Response(JSON.stringify({ customer: null, tier: profile.maplerad_tier || 0 }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const response = await fetch(
          `${MAPLERAD_BASE_URL}/customers/${profile.maplerad_customer_id}`,
          { headers: mapleradHeaders }
        );

        const result = await response.json();
        return new Response(JSON.stringify({ customer: result.data, tier: profile.maplerad_tier }), {
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
