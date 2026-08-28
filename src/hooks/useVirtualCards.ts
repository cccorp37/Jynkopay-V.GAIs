import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface VirtualCardDB {
  id: string;
  wallet_id: string;
  card_name: string;
  card_number_last4: string;
  card_type: string;
  card_status: string;
  balance: number;
  daily_limit: number;
  monthly_limit: number;
  expires_at: string;
  created_at: string;
}

export const useVirtualCards = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<VirtualCardDB[]>([]);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);

      // Get profile → wallet
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!profile) { setIsLoading(false); return; }

      const { data: wallet } = await supabase
        .from("wallets")
        .select("id")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (!wallet) { setIsLoading(false); return; }

      setWalletId(wallet.id);

      const { data: cardsData, error: cardsError } = await supabase
        .from("virtual_cards")
        .select("*")
        .eq("wallet_id", wallet.id)
        .order("created_at", { ascending: false });

      if (cardsError) throw cardsError;
      setCards(cardsData || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Impossible de charger les cartes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [user]);

  return { cards, walletId, isLoading, error, refetch: fetchCards };
};
