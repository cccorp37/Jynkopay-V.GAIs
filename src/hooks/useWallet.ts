import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface WalletData {
  id: string;
  wallet_id: string;
  balance: number;
  currency: string;
  max_balance: number;
  is_active: boolean;
}

export interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  category: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  created_at: string;
  status: string;
  reference: string | null;
}

export interface MonthlyStats {
  total_incoming: number;
  total_outgoing: number;
  transaction_count: number;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // 1. Get the profile to link firebase_uid → profile_id → wallet
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        setIsLoading(false);
        return;
      }

      // 2. Get the wallet
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("profile_id", profile.id)
        .maybeSingle();

      if (walletError) throw walletError;
      if (!walletData) {
        setIsLoading(false);
        return;
      }

      setWallet(walletData);

      // 3. Get recent transactions (last 20)
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .eq("wallet_id", walletData.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (txError) throw txError;
      setTransactions(
        (txData || []).map((tx) => ({
          ...tx,
          type: tx.type as "incoming" | "outgoing",
          description: tx.description ?? null,
        }))
      );

      // 4. Get current month stats
      const currentYearMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
      const { data: statsData, error: statsError } = await supabase
        .from("monthly_stats")
        .select("total_incoming, total_outgoing, transaction_count")
        .eq("wallet_id", walletData.id)
        .eq("year_month", currentYearMonth)
        .maybeSingle();

      if (statsError) throw statsError;
      setMonthlyStats(
        statsData ?? { total_incoming: 0, total_outgoing: 0, transaction_count: 0 }
      );
    } catch (err: unknown) {
      console.error("Error fetching wallet data:", err);
      setError("Impossible de charger les données du wallet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const formatAmount = (amount: number, currency: string = "XOF") =>
    new Intl.NumberFormat("fr-FR").format(amount) + " " + currency;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 0)
      return `Aujourd'hui, ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    if (diffDays === 1)
      return `Hier, ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    wallet,
    transactions,
    monthlyStats,
    isLoading,
    error,
    formatAmount,
    formatDate,
    refetch: fetchWalletData,
  };
};
