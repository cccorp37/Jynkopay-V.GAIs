import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  ThumbsUp, 
  Users, 
  Star, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";

const platforms = [
  { id: "tiktok", name: "TikTok", icon: Share2, color: "#FF0050", badge: "Très Populaire" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E1306C", badge: "Recommandé" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2", badge: "Classique" },
  { id: "website", name: "Google & Web Reviews", icon: Star, color: "#00E6A5", badge: "5 Étoiles" }
];

const servicePackages = [
  { 
    id: "followers", 
    title: "Abonnés / Followers", 
    description: "Comptes actifs avec photo et biographie", 
    icon: Users, 
    color: "#00D2FF", 
    unitPrice: 3.5, // 3.5 FCFA per unit
    options: [250, 500, 1000, 2500, 5000, 10000] 
  },
  { 
    id: "likes", 
    title: "Likes & Réactions", 
    description: "Engagement rapide sur vos publications", 
    icon: ThumbsUp, 
    color: "#FF007A", 
    unitPrice: 1.5, // 1.5 FCFA per unit
    options: [200, 500, 1000, 3000, 5000] 
  },
  { 
    id: "reviews", 
    title: "Avis Positifs 5 Étoiles", 
    description: "Commentaires personnalisés et crédibles", 
    icon: Star, 
    color: "#FFB800", 
    unitPrice: 150, // 150 FCFA per review
    options: [10, 25, 50, 100, 200] 
  }
];

interface SocialBoostOrder {
  id: string;
  platform: string;
  package_type: string;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
}

export default function SocialBoost() {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0].id);
  const [selectedPackage, setSelectedPackage] = useState(servicePackages[0].id);
  const [quantity, setQuantity] = useState(servicePackages[0].options[2]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<SocialBoostOrder[]>([]);

  const activeService = servicePackages.find(p => p.id === selectedPackage) || servicePackages[0];
  const totalPrice = Math.round(quantity * activeService.unitPrice);

  const fetchOrders = async () => {
    if (!userProfile?.uid) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", userProfile.uid)
        .single();

      if (profile) {
        const { data } = await supabase
          .from("social_boost_orders")
          .select("*")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false });
        if (data) setOrders(data as SocialBoostOrder[]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userProfile]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !url.includes("http")) {
      toast({
        title: "Lien manquant ou invalide",
        description: "Veuillez saisir l'URL complète (ex: https://instagram.com/moncompte)",
        variant: "destructive"
      });
      return;
    }

    if (!userProfile) return;

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("firebase_uid", userProfile.uid)
        .single();

      if (profile) {
        const { error } = await supabase.from("social_boost_orders").insert({
          profile_id: profile.id,
          platform: selectedPlatform,
          package_type: selectedPackage,
          quantity,
          target_url: url,
          price: totalPrice,
          status: "in_progress"
        });

        if (error) throw error;

        toast({
          title: "Boost Commandé avec Succès ! 🚀",
          description: `Votre commande de ${quantity} ${activeService.title} pour ${selectedPlatform} est en cours de livraison.`
        });
        setUrl("");
        fetchOrders();
      }
    } catch (err: unknown) {
      const error = err as Error | undefined;
      toast({
        title: "Erreur de validation",
        description: error?.message || "Impossible de valider la commande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 text-pink-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame size={14} />
              <span>Propulseur de Notoriété</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Social Boost Studio
            </h1>
            <p className="text-sm text-muted-foreground">
              Développez l'influence de votre entreprise avec des signaux sociaux authentiques.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-2xl bg-secondary border border-border">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Livraison garantie sous 12h à 24h</span>
          </div>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Choose Platform */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">1</span>
                <span>Sélectionnez votre plateforme</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {platforms.map((p) => {
                  const Icon = p.icon;
                  const isSelected = selectedPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-glow-cyan"
                          : "bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${p.color}15`, color: p.color }}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Service Type */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">2</span>
                <span>Type de service</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {servicePackages.map((pkg) => {
                  const Icon = pkg.icon;
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => {
                        setSelectedPackage(pkg.id);
                        setQuantity(pkg.options[1]);
                      }}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                        isSelected
                          ? "bg-primary/10 border-primary text-foreground shadow-glow-cyan"
                          : "bg-secondary/40 border-border/70 text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${pkg.color}15`, color: pkg.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{pkg.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{pkg.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Choose Quantity */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">3</span>
                <span>Quantité souhaitée</span>
              </label>

              <div className="flex flex-wrap gap-2.5">
                {activeService.options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setQuantity(opt)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      quantity === opt
                        ? "gradient-primary text-black shadow-glow-cyan"
                        : "bg-secondary border border-border text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    +{opt.toLocaleString()} {activeService.id === "reviews" ? "avis" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: URL & Submit */}
            <form onSubmit={handlePurchase} className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[11px]">4</span>
                <span>Lien de votre page / publication</span>
              </label>

              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/votre-compte ou lien du post..."
                className="h-12 rounded-2xl bg-secondary/60 border-border text-sm"
                required
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {loading ? "Traitement en cours..." : `Valider et Booster (${totalPrice.toLocaleString()} FCFA)`}
              </Button>
            </form>

          </div>

          {/* Right Summary & History (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Order Summary Card */}
            <div className="rounded-3xl bg-gradient-to-br from-card to-secondary/50 border border-primary/30 p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <span className="text-xs font-bold uppercase text-muted-foreground">Récapitulatif</span>
                <span className="text-xs font-bold text-emerald-500">100% Sécurisé</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plateforme cible</span>
                  <span className="font-bold text-foreground capitalize">{selectedPlatform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pack sélectionné</span>
                  <span className="font-bold text-foreground">{activeService.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume commandé</span>
                  <span className="font-bold text-primary">+{quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vitesse de livraison</span>
                  <span className="font-semibold text-foreground">Progressive (naturelle)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total à régler</p>
                  <p className="text-2xl font-mono-numbers font-black text-foreground">
                    {totalPrice.toLocaleString()} FCFA
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
                  Débité du Wallet
                </span>
              </div>
            </div>

            {/* Recent Orders List */}
            <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Vos Commandes de Boost
              </h3>

              {orders.length > 0 ? (
                <div className="divide-y divide-border/60">
                  {orders.map((ord) => (
                    <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-foreground capitalize">
                          {ord.platform} • +{ord.quantity} {ord.package_type}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase">
                        {ord.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Aucune commande de boost effectuée pour l'instant.
                </p>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
