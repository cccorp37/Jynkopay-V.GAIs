import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SMSCredits {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

interface PackPurchase {
  id: string;
  pack_name: string;
  sms_count: number;
  price_per_sms: number;
  total_price: number;
  status: string;
  created_at: string;
}

const SMS_PACKS = [
  { name: "Starter", count: 500, pricePerSms: 125, popular: false },
  { name: "Business", count: 1000, pricePerSms: 120, popular: true },
  { name: "Pro", count: 2500, pricePerSms: 110, popular: false },
  { name: "Enterprise", count: 5000, pricePerSms: 100, popular: false },
  { name: "Premium", count: 10000, pricePerSms: 90, popular: false },
];

export function useSMSCredits() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<SMSCredits>({ totalCredits: 0, usedCredits: 0, remainingCredits: 0 });
  const [purchases, setPurchases] = useState<PackPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const { data } = await supabase
        .from("sms_credits")
        .select("*")
        .eq("firebase_uid", user.uid)
        .single();

      if (data) {
        setCredits({
          totalCredits: (data as any).total_credits || 0,
          usedCredits: (data as any).used_credits || 0,
          remainingCredits: ((data as any).total_credits || 0) - ((data as any).used_credits || 0),
        });
      }
    } catch {
      // No credits row yet
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchPurchases = useCallback(async () => {
    if (!user?.uid) return;
    const { data } = await supabase
      .from("sms_pack_purchases")
      .select("*")
      .eq("firebase_uid", user.uid)
      .order("created_at", { ascending: false });
    if (data) setPurchases(data as unknown as PackPurchase[]);
  }, [user?.uid]);

  const purchasePack = async (packName: string, smsCount: number, pricePerSms: number) => {
    if (!user?.uid) return;
    const totalPrice = smsCount * pricePerSms;

    try {
      // Record the purchase
      const { error: purchaseError } = await supabase
        .from("sms_pack_purchases")
        .insert({
          firebase_uid: user.uid,
          pack_name: packName,
          sms_count: smsCount,
          price_per_sms: pricePerSms,
          total_price: totalPrice,
          status: "completed",
        });
      if (purchaseError) throw purchaseError;

      // Upsert credits
      const { data: existing } = await supabase
        .from("sms_credits")
        .select("*")
        .eq("firebase_uid", user.uid)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("sms_credits")
          .update({ total_credits: ((existing as any).total_credits || 0) + smsCount })
          .eq("firebase_uid", user.uid);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sms_credits")
          .insert({ firebase_uid: user.uid, total_credits: smsCount, used_credits: 0 });
        if (error) throw error;
      }

      toast({ title: "Pack acheté !", description: `${smsCount} crédits SMS ajoutés à votre compte` });
      await fetchCredits();
      await fetchPurchases();
    } catch (error) {
      console.error("Error purchasing pack:", error);
      toast({ title: "Erreur", description: "Impossible d'acheter le pack", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchCredits();
      fetchPurchases();
    }
  }, [user?.uid, fetchCredits, fetchPurchases]);

  return { credits, purchases, loading, purchasePack, packs: SMS_PACKS, refetch: fetchCredits };
}
