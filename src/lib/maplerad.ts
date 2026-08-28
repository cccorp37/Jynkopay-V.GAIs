import { supabase } from "@/integrations/supabase/client";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;

const invokeMapleradFunction = async (functionName: string, body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

// KYC / Customers
export const mapleradCreateCustomer = (firebase_uid: string, data: { first_name?: string; last_name?: string; country?: string }) =>
  invokeMapleradFunction("maplerad-customers", { action: "create_customer", firebase_uid, data });

export const mapleradUpgradeTier1 = (firebase_uid: string, data: {
  phone: string; dob: string; id_number: string; id_type?: string;
  address?: string; city?: string; state?: string; postal_code?: string;
}) => invokeMapleradFunction("maplerad-customers", { action: "upgrade_tier1", firebase_uid, data });

export const mapleradUpgradeTier2 = (firebase_uid: string, data: {
  document_type?: string; document_image: string;
}) => invokeMapleradFunction("maplerad-customers", { action: "upgrade_tier2", firebase_uid, data });

export const mapleradGetCustomer = (firebase_uid: string) =>
  invokeMapleradFunction("maplerad-customers", { action: "get_customer", firebase_uid, data: {} });

// Cards
export const mapleradCreateCard = (firebase_uid: string, data: {
  amount?: number; brand?: string; card_name?: string; card_type?: string;
}) => invokeMapleradFunction("maplerad-cards", { action: "create_card", firebase_uid, data });

export const mapleradFundCard = (firebase_uid: string, card_id: string, amount: number) =>
  invokeMapleradFunction("maplerad-cards", { action: "fund_card", firebase_uid, data: { card_id, amount } });

export const mapleradFreezeCard = (firebase_uid: string, card_id: string) =>
  invokeMapleradFunction("maplerad-cards", { action: "freeze_card", firebase_uid, data: { card_id } });

export const mapleradUnfreezeCard = (firebase_uid: string, card_id: string) =>
  invokeMapleradFunction("maplerad-cards", { action: "unfreeze_card", firebase_uid, data: { card_id } });

export const mapleradGetCardDetails = (firebase_uid: string, card_id: string) =>
  invokeMapleradFunction("maplerad-cards", { action: "get_card_details", firebase_uid, data: { card_id } });

export const mapleradGetCardTransactions = (firebase_uid: string, card_id: string) =>
  invokeMapleradFunction("maplerad-cards", { action: "get_card_transactions", firebase_uid, data: { card_id } });

// Transfers (Withdrawals)
export const mapleradWithdraw = (firebase_uid: string, data: {
  amount: number; phone: string; operator: string; recipient_name?: string;
}) => invokeMapleradFunction("maplerad-transfers", { action: "withdraw", firebase_uid, data });

export const mapleradGetTransferStatus = (firebase_uid: string, transfer_id: string) =>
  invokeMapleradFunction("maplerad-transfers", { action: "get_transfer_status", firebase_uid, data: { transfer_id } });

export const mapleradGetBanks = (firebase_uid: string, country?: string) =>
  invokeMapleradFunction("maplerad-transfers", { action: "get_banks", firebase_uid, data: { country } });
