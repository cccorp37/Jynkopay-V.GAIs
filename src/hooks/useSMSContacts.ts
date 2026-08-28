import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SMSContact {
  id: string;
  phone: string;
  name: string | null;
  group_name: string;
  created_at: string;
}

interface ContactGroup {
  name: string;
  count: number;
}

export function useSMSContacts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<SMSContact[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const { data, error } = await supabase
        .from("sms_contacts")
        .select("*")
        .eq("firebase_uid", user.uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts((data as unknown as SMSContact[]) || []);

      // Calculate groups
      const groupMap = new Map<string, number>();
      (data as unknown as SMSContact[])?.forEach((contact) => {
        const groupName = contact.group_name || "default";
        groupMap.set(groupName, (groupMap.get(groupName) || 0) + 1);
      });

      const groupsList: ContactGroup[] = Array.from(groupMap.entries()).map(
        ([name, count]) => ({ name, count })
      );
      setGroups(groupsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.uid, toast]);

  const addContact = async (phone: string, name?: string, groupName?: string) => {
    if (!user?.uid) return null;

    try {
      // Format phone number
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;

      const { data, error } = await supabase
        .from("sms_contacts")
        .insert({
          firebase_uid: user.uid,
          phone: formattedPhone,
          name: name || null,
          group_name: groupName || "default",
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Contact existant",
            description: "Ce numéro existe déjà dans vos contacts",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return null;
      }

      toast({
        title: "Contact ajouté",
        description: `${name || formattedPhone} a été ajouté à vos contacts`,
      });

      await fetchContacts();
      return data;
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le contact",
        variant: "destructive",
      });
      return null;
    }
  };

  const addMultipleContacts = async (
    contactsData: Array<{ phone: string; name?: string; groupName?: string }>
  ) => {
    if (!user?.uid) return { added: 0, skipped: 0 };

    let added = 0;
    let skipped = 0;

    for (const contact of contactsData) {
      const formattedPhone = contact.phone.startsWith("+")
        ? contact.phone
        : `+${contact.phone}`;

      const { error } = await supabase.from("sms_contacts").insert({
        firebase_uid: user.uid,
        phone: formattedPhone,
        name: contact.name || null,
        group_name: contact.groupName || "default",
      });

      if (error) {
        skipped++;
      } else {
        added++;
      }
    }

    toast({
      title: "Import terminé",
      description: `${added} contacts ajoutés, ${skipped} ignorés (doublons)`,
    });

    await fetchContacts();
    return { added, skipped };
  };

  const updateContact = async (
    contactId: string,
    updates: { phone?: string; name?: string; groupName?: string }
  ) => {
    try {
      const updateData: Record<string, string | null> = {};
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.groupName) updateData.group_name = updates.groupName;

      const { error } = await supabase
        .from("sms_contacts")
        .update(updateData)
        .eq("id", contactId)
        .eq("firebase_uid", user?.uid);

      if (error) throw error;

      toast({
        title: "Contact mis à jour",
        description: "Les modifications ont été enregistrées",
      });

      await fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le contact",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from("sms_contacts")
        .delete()
        .eq("id", contactId)
        .eq("firebase_uid", user?.uid);

      if (error) throw error;

      toast({
        title: "Contact supprimé",
        description: "Le contact a été supprimé avec succès",
      });

      await fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contact",
        variant: "destructive",
      });
    }
  };

  const deleteMultipleContacts = async (contactIds: string[]) => {
    try {
      const { error } = await supabase
        .from("sms_contacts")
        .delete()
        .in("id", contactIds)
        .eq("firebase_uid", user?.uid);

      if (error) throw error;

      toast({
        title: "Contacts supprimés",
        description: `${contactIds.length} contacts ont été supprimés`,
      });

      await fetchContacts();
    } catch (error) {
      console.error("Error deleting contacts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les contacts",
        variant: "destructive",
      });
    }
  };

  const getContactsByGroup = (groupName: string): SMSContact[] => {
    return contacts.filter((c) => c.group_name === groupName);
  };

  const getAllPhones = (): string[] => {
    return contacts.map((c) => c.phone);
  };

  const getPhonesByGroup = (groupName: string): string[] => {
    return getContactsByGroup(groupName).map((c) => c.phone);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchContacts();
    }
  }, [user?.uid, fetchContacts]);

  return {
    contacts,
    groups,
    loading,
    addContact,
    addMultipleContacts,
    updateContact,
    deleteContact,
    deleteMultipleContacts,
    getContactsByGroup,
    getAllPhones,
    getPhonesByGroup,
    refetch: fetchContacts,
  };
}
