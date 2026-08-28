import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company?: string;
  city?: string;
  country: string;
  tags: string[];
  total_spent: number;
  currency: string;
  orders: number;
  last_contact: string;
  status: "active" | "inactive" | "vip";
  created_at: string;
}

export const useCRM = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
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
        .from("crm_contacts")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.message.includes("Could not find the table")) {
           // Fallback to empty if table doesn't exist
           console.warn("Table crm_contacts does not exist yet. Please apply migrations.");
           setContacts([]);
        } else {
           throw error;
        }
      } else {
        setContacts(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching contacts:", err);
      setError("Impossible de charger les contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  return { contacts, isLoading, error, refetch: fetchContacts };
};
