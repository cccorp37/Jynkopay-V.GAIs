import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSStatusPayload {
  messageId: string;
  status: string;
  // Common status values: delivered, failed, sent, pending, expired, rejected
  deliveredAt?: string;
  errorCode?: string;
  errorMessage?: string;
  // EKOTECH specific fields - adjust based on their actual API
  id?: string;
  state?: string;
  dlr_status?: string;
  delivery_time?: string;
  error?: string;
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse incoming webhook data
    let payload: SMSStatusPayload;
    
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries()) as unknown as SMSStatusPayload;
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        const params = new URLSearchParams(text);
        payload = Object.fromEntries(params.entries()) as unknown as SMSStatusPayload;
      }
    }

    console.log("SMS Webhook Status - Payload:", JSON.stringify(payload));

    // Normalize fields (EKOTECH may use different field names)
    const messageId = payload.messageId || payload.id || "";
    const status = normalizeStatus(payload.status || payload.state || payload.dlr_status || "unknown");
    const deliveredAt = payload.deliveredAt || payload.delivery_time || null;
    const errorCode = payload.errorCode || null;
    const errorMessage = payload.errorMessage || payload.error || payload.reason || null;

    if (!messageId) {
      console.error("No messageId provided in status webhook");
      return new Response(
        JSON.stringify({ error: "messageId is required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Update SMS status in database
    const { error: updateError } = await supabase
      .from("sms_messages")
      .update({
        status: status,
        delivered_at: status === "delivered" ? (deliveredAt || new Date().toISOString()) : null,
        error_code: errorCode,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq("external_id", messageId);

    if (updateError) {
      console.error("Error updating SMS status:", updateError);
      // Don't fail the webhook, just log the error
    }

    // Log the status update
    await supabase
      .from("sms_status_logs")
      .insert({
        message_id: messageId,
        status: status,
        raw_payload: payload,
        received_at: new Date().toISOString()
      });

    console.log(`SMS ${messageId} status updated: ${status}`);

    // Update campaign statistics if applicable
    if (status === "delivered" || status === "failed") {
      try {
        // Get the campaign ID from the message
        const { data: message } = await supabase
          .from("sms_messages")
          .select("campaign_id")
          .eq("external_id", messageId)
          .single();

        const msgData = message as { campaign_id?: string } | null;
        if (msgData?.campaign_id) {
          const statField = status === "delivered" ? "delivered_count" : "failed_count";
          // Log stats update attempt (actual increment would be done via DB trigger or function)
          console.log(`Campaign ${msgData.campaign_id} - ${statField} should be incremented`);
        }
      } catch (statsError) {
        console.error("Error updating campaign stats:", statsError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: messageId,
        status: status
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("SMS Webhook Status Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

// Normalize various status formats to standard values
function normalizeStatus(rawStatus: string): string {
  const status = rawStatus.toLowerCase().trim();
  
  // Map common status values
  const statusMap: Record<string, string> = {
    // Delivered statuses
    "delivered": "delivered",
    "delivrd": "delivered",
    "dlvrd": "delivered",
    "success": "delivered",
    "ok": "delivered",
    // Failed statuses
    "failed": "failed",
    "failure": "failed",
    "undelivered": "failed",
    "undeliv": "failed",
    "error": "failed",
    "rejected": "failed",
    "rejectd": "failed",
    // Pending statuses
    "pending": "pending",
    "sent": "sent",
    "submitted": "sent",
    "accepted": "sent",
    "enroute": "pending",
    // Expired
    "expired": "expired",
    "expird": "expired",
    // Unknown
    "unknown": "unknown",
  };

  return statusMap[status] || "unknown";
}

serve(handler);
