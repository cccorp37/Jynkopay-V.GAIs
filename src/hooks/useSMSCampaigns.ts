import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SMSCampaign {
  id: string;
  name: string;
  message_content: string;
  sender_name: string;
  status: string;
  scheduled_at: string | null;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
}

interface CampaignStats {
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  contactsCount: number;
  deliveryRate: number;
}

interface CreateCampaignData {
  name: string;
  messageContent: string;
  senderName?: string;
  recipients: string[];
  scheduledAt?: string;
  sendNow?: boolean;
}

export function useSMSCampaigns() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const { data, error } = await supabase
        .from("sms_campaigns")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns((data as unknown as SMSCampaign[]) || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les campagnes SMS",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid, toast]);

  const fetchStats = useCallback(async () => {
    if (!user?.uid) return;

    try {
      // Calculate stats from campaigns
      const { data: campaignsData } = await supabase
        .from("sms_campaigns")
        .select("total_recipients, sent_count, delivered_count, failed_count")
        .eq("firebase_uid", user.uid);

      const { count: contactsCount } = await supabase
        .from("sms_contacts")
        .select("*", { count: "exact", head: true })
        .eq("firebase_uid", user.uid);

      const statsData: CampaignStats = {
        totalRecipients: 0,
        sentCount: 0,
        deliveredCount: 0,
        failedCount: 0,
        contactsCount: contactsCount || 0,
        deliveryRate: 0,
      };

      (campaignsData as unknown as SMSCampaign[])?.forEach((c) => {
        statsData.totalRecipients += c.total_recipients || 0;
        statsData.sentCount += c.sent_count || 0;
        statsData.deliveredCount += c.delivered_count || 0;
        statsData.failedCount += c.failed_count || 0;
      });

      if (statsData.sentCount > 0) {
        statsData.deliveryRate = Math.round(
          (statsData.deliveredCount / statsData.sentCount) * 100
        );
      }

      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [user?.uid]);

  const createCampaign = async (data: CreateCampaignData) => {
    if (!user?.uid) return null;

    setSending(true);
    try {
      // Insert campaign
      const { data: campaign, error } = await supabase
        .from("sms_campaigns")
        .insert({
          firebase_uid: user.uid,
          name: data.name,
          message_content: data.messageContent,
          sender_name: data.senderName || "Jynkopay",
          status: data.sendNow ? "sending" : data.scheduledAt ? "scheduled" : "draft",
          scheduled_at: data.scheduledAt || null,
          total_recipients: data.recipients.length,
        })
        .select()
        .single();

      if (error) throw error;

      // If sendNow, call the edge function
      if (data.sendNow && data.recipients.length > 0) {
        const response = await supabase.functions.invoke("send-sms", {
          body: {
            to: data.recipients,
            message: data.messageContent,
            senderName: data.senderName || "Jynkopay",
            campaignId: (campaign as unknown as SMSCampaign).id,
            firebaseUid: user.uid,
          },
        });

        if (response.error) {
          console.error("Error sending SMS:", response.error);
          toast({
            title: "Erreur d'envoi",
            description: "Une erreur est survenue lors de l'envoi des SMS",
            variant: "destructive",
          });
        } else {
          const result = response.data;
          toast({
            title: "Campagne envoyée",
            description: `${result.summary?.sent || 0} SMS envoyés sur ${result.summary?.total || 0}`,
          });

          // Update campaign status
          await supabase
            .from("sms_campaigns")
            .update({
              status: "completed",
              sent_count: result.summary?.sent || 0,
              failed_count: result.summary?.failed || 0,
            })
            .eq("id", (campaign as unknown as SMSCampaign).id);
        }
      } else {
        toast({
          title: "Campagne créée",
          description: data.scheduledAt
            ? "La campagne a été programmée"
            : "La campagne a été enregistrée comme brouillon",
        });
      }

      await fetchCampaigns();
      await fetchStats();
      return campaign;
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from("sms_campaigns")
        .delete()
        .eq("id", campaignId)
        .eq("firebase_uid", user?.uid);

      if (error) throw error;

      toast({
        title: "Campagne supprimée",
        description: "La campagne a été supprimée avec succès",
      });

      await fetchCampaigns();
      await fetchStats();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive",
      });
    }
  };

  const sendQuickSMS = async (to: string | string[], message: string, senderName?: string) => {
    if (!user?.uid) return null;

    setSending(true);
    try {
      const response = await supabase.functions.invoke("send-sms", {
        body: {
          to,
          message,
          senderName: senderName || "Jynkopay",
          firebaseUid: user.uid,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: "SMS envoyé",
        description: `${response.data.summary?.sent || 1} SMS envoyé(s) avec succès`,
      });

      await fetchStats();
      return response.data;
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le SMS",
        variant: "destructive",
      });
      return null;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCampaigns();
      fetchStats();
    }
  }, [user?.uid, fetchCampaigns, fetchStats]);

  return {
    campaigns,
    stats,
    loading,
    sending,
    createCampaign,
    deleteCampaign,
    sendQuickSMS,
    refetch: fetchCampaigns,
  };
}
