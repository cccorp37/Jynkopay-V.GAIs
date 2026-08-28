import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: "active" | "draft" | "completed" | "scheduled";
  sent: number;
  opened: number;
  clicked: number;
  spent: number;
  currency: string;
  date: string;
  created_at: string;
}

export const useMarketing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!profile) { setIsLoading(false); return; }

      const { data, error } = await supabase
        .from("marketing_campaigns")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.message.includes("Could not find the table")) {
           console.warn("Table marketing_campaigns does not exist yet. Please apply migrations.");
           setCampaigns([]);
        } else {
           throw error;
        }
      } else {
        setCampaigns(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching campaigns:", err);
      setError("Impossible de charger les campagnes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [user]);

  return { campaigns, isLoading, error, refetch: fetchCampaigns };
};
