import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateCampaignRequest {
  name: string;
  messageContent: string;
  senderName?: string;
  recipients: string[];
  firebaseUid: string;
  scheduledAt?: string;
  sendNow?: boolean;
}

interface CampaignStats {
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "create";

    switch (action) {
      case "create": {
        const {
          name,
          messageContent,
          senderName = "Jynkopay",
          recipients,
          firebaseUid,
          scheduledAt,
          sendNow = false,
        }: CreateCampaignRequest = await req.json();

        if (!name || !messageContent || !recipients || !firebaseUid) {
          return new Response(
            JSON.stringify({ error: "Missing required fields" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Filter out opted-out numbers
        const { data: optouts } = await supabase
          .from("sms_optouts")
          .select("phone")
          .eq("opted_out", true);

        const optedOutPhones = new Set(optouts?.map(o => o.phone) || []);
        const validRecipients = recipients.filter(phone => !optedOutPhones.has(phone));

        // Create campaign
        const { data: campaign, error: campaignError } = await supabase
          .from("sms_campaigns")
          .insert({
            firebase_uid: firebaseUid,
            name,
            message_content: messageContent,
            sender_name: senderName,
            status: sendNow ? "sending" : scheduledAt ? "scheduled" : "draft",
            scheduled_at: scheduledAt || null,
            total_recipients: validRecipients.length,
          })
          .select()
          .single();

        if (campaignError) {
          console.error("Error creating campaign:", campaignError);
          throw new Error("Failed to create campaign");
        }

        console.log(`Campaign created: ${campaign.id} with ${validRecipients.length} recipients`);

        // If sendNow, trigger sending
        if (sendNow && validRecipients.length > 0) {
          // Call send-sms function
          const sendResponse = await fetch(`${supabaseUrl}/functions/v1/send-sms`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: validRecipients,
              message: messageContent,
              senderName,
              campaignId: campaign.id,
              firebaseUid,
            }),
          });

          const sendResult = await sendResponse.json();
          
          // Update campaign status
          await supabase
            .from("sms_campaigns")
            .update({
              status: "completed",
              sent_count: sendResult.summary?.sent || 0,
              failed_count: sendResult.summary?.failed || 0,
              updated_at: new Date().toISOString(),
            })
            .eq("id", campaign.id);

          return new Response(
            JSON.stringify({
              success: true,
              campaign: campaign,
              sendResult,
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            campaign,
            skippedCount: recipients.length - validRecipients.length,
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "list": {
        const firebaseUid = url.searchParams.get("firebaseUid");
        if (!firebaseUid) {
          return new Response(
            JSON.stringify({ error: "firebaseUid is required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { data: campaigns, error } = await supabase
          .from("sms_campaigns")
          .select("*")
          .eq("firebase_uid", firebaseUid)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true, campaigns }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "stats": {
        const campaignId = url.searchParams.get("campaignId");
        const firebaseUid = url.searchParams.get("firebaseUid");

        if (!firebaseUid) {
          return new Response(
            JSON.stringify({ error: "firebaseUid is required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        if (campaignId) {
          // Get specific campaign stats
          const { data: campaign, error } = await supabase
            .from("sms_campaigns")
            .select("*")
            .eq("id", campaignId)
            .eq("firebase_uid", firebaseUid)
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify({ success: true, stats: campaign }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        // Get overall stats
        const { data: campaigns } = await supabase
          .from("sms_campaigns")
          .select("total_recipients, sent_count, delivered_count, failed_count")
          .eq("firebase_uid", firebaseUid);

        const stats: CampaignStats = {
          totalRecipients: 0,
          sentCount: 0,
          deliveredCount: 0,
          failedCount: 0,
        };

        campaigns?.forEach(c => {
          stats.totalRecipients += c.total_recipients || 0;
          stats.sentCount += c.sent_count || 0;
          stats.deliveredCount += c.delivered_count || 0;
          stats.failedCount += c.failed_count || 0;
        });

        // Get contacts count
        const { count: contactsCount } = await supabase
          .from("sms_contacts")
          .select("*", { count: "exact", head: true })
          .eq("firebase_uid", firebaseUid);

        return new Response(
          JSON.stringify({
            success: true,
            stats: {
              ...stats,
              contactsCount: contactsCount || 0,
              deliveryRate: stats.sentCount > 0 
                ? Math.round((stats.deliveredCount / stats.sentCount) * 100) 
                : 0,
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      case "delete": {
        const campaignId = url.searchParams.get("campaignId");
        const firebaseUid = url.searchParams.get("firebaseUid");

        if (!campaignId || !firebaseUid) {
          return new Response(
            JSON.stringify({ error: "campaignId and firebaseUid are required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }

        const { error } = await supabase
          .from("sms_campaigns")
          .delete()
          .eq("id", campaignId)
          .eq("firebase_uid", firebaseUid);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("SMS Campaign Error:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
