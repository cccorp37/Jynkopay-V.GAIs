import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  category: string;
  image: string;
  status: "active" | "draft" | "out_of_stock";
  sales: number;
  created_at: string;
}

export const useStore = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
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
        .from("store_products")
        .select("*")
        .eq("profile_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) {
        if (error.message.includes("Could not find the table")) {
           console.warn("Table store_products does not exist yet. Please apply migrations.");
           setProducts([]);
        } else {
           throw error;
        }
      } else {
        setProducts(data || []);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("Impossible de charger les produits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return { products, isLoading, error, refetch: fetchProducts };
};
