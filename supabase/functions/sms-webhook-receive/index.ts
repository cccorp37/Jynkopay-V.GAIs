import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SMSReceivePayload {
  from: string;
  to: string;
  message: string;
  messageId?: string;
  timestamp?: string;
  // EKOTECH specific fields - adjust based on their actual API
  sender?: string;
  receiver?: string;
  text?: string;
  id?: string;
  date?: string;
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
    let payload: SMSReceivePayload;
    
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries()) as unknown as SMSReceivePayload;
    } else {
      // Try to parse as JSON by default
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch {
        // Parse as query string
        const params = new URLSearchParams(text);
        payload = Object.fromEntries(params.entries()) as unknown as SMSReceivePayload;
      }
    }

    console.log("SMS Webhook Receive - Payload:", JSON.stringify(payload));

    // Normalize fields (EKOTECH may use different field names)
    const senderPhone = payload.from || payload.sender || "";
    const receiverPhone = payload.to || payload.receiver || "";
    const messageText = payload.message || payload.text || "";
    const messageId = payload.messageId || payload.id || crypto.randomUUID();
    const timestamp = payload.timestamp || payload.date || new Date().toISOString();

    // Check for STOP/unsubscribe keywords
    const stopKeywords = ["STOP", "UNSUBSCRIBE", "DESABONNER", "ARRET", "ARRETER"];
    const isStopRequest = stopKeywords.some(keyword => 
      messageText.toUpperCase().trim() === keyword
    );

    if (isStopRequest) {
      // Handle unsubscribe request
      console.log(`STOP request received from ${senderPhone}`);
      
      // Update contact opt-out status in database
      const { error: updateError } = await supabase
        .from("sms_optouts")
        .upsert({
          phone: senderPhone,
          opted_out: true,
          opted_out_at: new Date().toISOString(),
          reason: "STOP keyword received"
        }, {
          onConflict: "phone"
        });

      if (updateError) {
        console.error("Error updating opt-out status:", updateError);
      }

      // Log the stop request
      await supabase
        .from("sms_incoming")
        .insert({
          sender_phone: senderPhone,
          receiver_phone: receiverPhone,
          message: messageText,
          message_id: messageId,
          received_at: timestamp,
          type: "stop_request",
          processed: true
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          action: "unsubscribed",
          message: "Contact has been unsubscribed"
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Log regular incoming SMS
    const { error: insertError } = await supabase
      .from("sms_incoming")
      .insert({
        sender_phone: senderPhone,
        receiver_phone: receiverPhone,
        message: messageText,
        message_id: messageId,
        received_at: timestamp,
        type: "incoming",
        processed: false
      });

    if (insertError) {
      console.error("Error logging incoming SMS:", insertError);
    }

    console.log(`SMS received from ${senderPhone}: ${messageText.substring(0, 50)}...`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        action: "received",
        messageId: messageId
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("SMS Webhook Receive Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
