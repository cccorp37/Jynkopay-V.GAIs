import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendSMSRequest {
  to: string | string[];
  message: string;
  senderName?: string;
  campaignId?: string;
  firebaseUid: string;
}

interface OrangeTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
}

interface OrangeSMSResponse {
  outboundSMSMessageRequest: {
    resourceURL: string;
    senderAddress: string;
    outboundSMSTextMessage: {
      message: string;
    };
  };
}

const ORANGE_TOKEN_URL = "https://api.orange.com/oauth/v3/token";
const ORANGE_SMS_URL = "https://api.orange.com/smsmessaging/v1/outbound";

// deno-lint-ignore no-explicit-any
async function getAccessToken(supabase: any): Promise<string> {
  // Check for cached token
  const { data: cachedToken } = await supabase
    .from("sms_oauth_tokens")
    .select("access_token, expires_at")
    .eq("provider", "orange")
    .single();

  if (cachedToken && new Date(cachedToken.expires_at) > new Date()) {
    console.log("Using cached Orange OAuth token");
    return cachedToken.access_token;
  }

  // Get new token
  console.log("Fetching new Orange OAuth token");
  const authHeader = Deno.env.get("ORANGE_AUTH_HEADER")!;
  
  const response = await fetch(ORANGE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OAuth error:", errorText);
    throw new Error(`Failed to get OAuth token: ${response.status} - ${errorText}`);
  }

  const tokenData: OrangeTokenResponse = await response.json();
  
  // Calculate expiry (subtract 1 hour for safety margin)
  const expiresAt = new Date(Date.now() + (tokenData.expires_in - 3600) * 1000);

  // Cache the token
  await supabase
    .from("sms_oauth_tokens")
    .upsert({
      provider: "orange",
      access_token: tokenData.access_token,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "provider"
    });

  return tokenData.access_token;
}

// deno-lint-ignore no-explicit-any
async function checkOptOut(supabase: any, phone: string): Promise<boolean> {
  const { data } = await supabase
    .from("sms_optouts")
    .select("opted_out")
    .eq("phone", phone)
    .single();

  return data?.opted_out === true;
}

async function sendSingleSMS(
  accessToken: string,
  to: string,
  message: string,
  senderName: string,
  senderAddress: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Format phone number (ensure it starts with tel:+)
  const formattedTo = to.startsWith("tel:") ? to : `tel:${to.startsWith("+") ? to : `+${to}`}`;
  const formattedSender = senderAddress.startsWith("tel:") ? senderAddress : `tel:${senderAddress.startsWith("+") ? senderAddress : `+${senderAddress}`}`;
  
  const url = `${ORANGE_SMS_URL}/${encodeURIComponent(formattedSender)}/requests`;

  const body = {
    outboundSMSMessageRequest: {
      address: formattedTo,
      senderAddress: formattedSender,
      senderName: senderName,
      outboundSMSTextMessage: {
        message: message,
      },
    },
  };

  console.log(`Sending SMS to ${formattedTo} from ${senderName}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`SMS send error: ${response.status} - ${responseText}`);
      return { success: false, error: `${response.status}: ${responseText}` };
    }

    const responseData = JSON.parse(responseText) as OrangeSMSResponse;
    const resourceURL = responseData.outboundSMSMessageRequest?.resourceURL || "";
    const messageId = resourceURL.split("/").pop() || crypto.randomUUID();

    console.log(`SMS sent successfully, messageId: ${messageId}`);
    return { success: true, messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`SMS send exception: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { to, message, senderName = "Jynkopay", campaignId, firebaseUid }: SendSMSRequest = await req.json();

    if (!to || !message || !firebaseUid) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, message, firebaseUid" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get access token
    const accessToken = await getAccessToken(supabase);

    // Sender address (should be registered with Orange)
    const senderAddress = Deno.env.get("ORANGE_SENDER_ADDRESS") || "+237699999999";

    // Handle single or multiple recipients
    const recipients = Array.isArray(to) ? to : [to];
    const results: Array<{ phone: string; success: boolean; messageId?: string; error?: string; skipped?: boolean }> = [];

    for (const phone of recipients) {
      // Check opt-out
      const isOptedOut = await checkOptOut(supabase, phone);
      if (isOptedOut) {
        console.log(`Skipping opted-out number: ${phone}`);
        results.push({ phone, success: false, error: "Opted out", skipped: true });
        continue;
      }

      // Send SMS
      const result = await sendSingleSMS(accessToken, phone, message, senderName, senderAddress);

      // Log message in database
      const { error: insertError } = await supabase
        .from("sms_messages")
        .insert({
          firebase_uid: firebaseUid,
          campaign_id: campaignId || null,
          recipient_phone: phone,
          message_content: message,
          sender_name: senderName,
          external_id: result.messageId || null,
          status: result.success ? "sent" : "failed",
          sent_at: result.success ? new Date().toISOString() : null,
          error_message: result.error || null,
        });

      if (insertError) {
        console.error("Error logging SMS:", insertError);
      }

      results.push({ phone, ...result });
    }

    // Update campaign stats if applicable
    if (campaignId) {
      const sentCount = results.filter(r => r.success).length;
      const failedCount = results.filter(r => !r.success && !r.skipped).length;

      const { error: updateError } = await supabase
        .from("sms_campaigns")
        .update({
          sent_count: supabase.rpc("increment", { row_id: campaignId, field: "sent_count", amount: sentCount }),
          failed_count: supabase.rpc("increment", { row_id: campaignId, field: "failed_count", amount: failedCount }),
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", campaignId);

      if (updateError) {
        console.error("Error updating campaign:", updateError);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: recipients.length,
          sent: successCount,
          failed: failedCount,
        },
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Send SMS Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
