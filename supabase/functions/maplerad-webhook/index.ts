import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-maplerad-signature",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const payload = await req.json();
    const eventId = payload.id || `evt_${Date.now()}`;
    const eventType = payload.event;

    console.log(`Maplerad webhook received: ${eventType}`, JSON.stringify(payload));

    // Idempotence check
    const { data: existing } = await supabase
      .from("maplerad_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existing) {
      console.log(`Event ${eventId} already processed, skipping`);
      return new Response(JSON.stringify({ ok: true, duplicate: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store event
    await supabase.from("maplerad_events").insert({
      event_id: eventId,
      event_type: eventType,
      payload,
      processed: false,
    });

    // Process event
    switch (eventType) {
      case "transfer.successful": {
        const reference = payload.reference || payload.data?.reference;
        if (reference) {
          // Update transaction status
          await supabase
            .from("transactions")
            .update({ status: "completed", completed_at: new Date().toISOString() })
            .eq("reference", reference);
        }
        break;
      }

      case "transfer.failed": {
        const reference = payload.reference || payload.data?.reference;
        if (reference) {
          // Mark transaction as failed and refund
          const { data: tx } = await supabase
            .from("transactions")
            .update({ status: "failed" })
            .eq("reference", reference)
            .select()
            .maybeSingle();

          if (tx) {
            // Refund: create incoming transaction
            await supabase.from("transactions").insert({
              wallet_id: tx.wallet_id,
              type: "incoming",
              category: "refund",
              title: "Remboursement retrait échoué",
              description: `Ref: ${reference}`,
              amount: tx.amount,
              currency: tx.currency,
              status: "completed",
              reference: `refund-${reference}`,
            });
          }
        }
        break;
      }

      case "issuing.created.successful": {
        console.log("Card created successfully:", payload.data);
        break;
      }

      case "issuing.created.failed": {
        console.log("Card creation failed:", payload.data);
        break;
      }

      case "issuing.transaction": {
        // Card transaction (debit/credit)
        const cardId = payload.data?.card_id;
        const mode = payload.data?.mode; // CREDIT or DEBIT
        const amount = payload.data?.amount;
        console.log(`Card ${cardId} ${mode}: ${amount}`);
        break;
      }

      case "collection.successful": {
        // Mobile Money collection (recharge wallet)
        const reference = payload.reference || payload.data?.reference;
        if (reference) {
          await supabase
            .from("transactions")
            .update({ status: "completed", completed_at: new Date().toISOString() })
            .eq("reference", reference);
        }
        break;
      }

      default:
        console.log(`Unhandled event: ${eventType}`);
    }

    // Mark as processed
    await supabase
      .from("maplerad_events")
      .update({ processed: true })
      .eq("event_id", eventId);

    // Always respond 200 quickly
    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent retries on our errors
    return new Response(JSON.stringify({ ok: true, error: error.message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
