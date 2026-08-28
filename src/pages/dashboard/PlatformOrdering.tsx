import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  ShoppingBag,
  Smartphone,
  Bot,
  Layout,
  Code,
  Send,
  CheckCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const platformTypes = [
  { id: "ecommerce", label: "Boutique E-commerce", icon: ShoppingBag, color: "#FFB84D" },
  { id: "landing", label: "Landing Page", icon: Layout, color: "#6C3FF5" },
  { id: "website", label: "Site Web", icon: Globe, color: "#00E5FF" },
  { id: "app", label: "Application Mobile", icon: Smartphone, color: "#00C896" },
  { id: "chatbot", label: "Chatbot IA", icon: Bot, color: "#FF006B" },
  { id: "custom", label: "Autre / Sur-mesure", icon: Code, color: "#FFD700" },
];

const PlatformOrdering = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [support, setSupport] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !domain || !description) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
      return;
    }

    setSending(true);
    try {
      // Send order via edge function (notify admin)
      await supabase.functions.invoke("notify-kyc-admin", {
        body: {
          type: "platform_order",
          email: user?.email,
          data: {
            platformType: platformTypes.find(p => p.id === selectedType)?.label,
            support,
            domain,
            description,
            contactPhone,
            userEmail: user?.email,
          },
        },
      });

      setSubmitted(true);
      toast({ title: "Commande envoyée !", description: "Notre équipe vous contactera sous 24h" });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer la commande", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6 max-w-md">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
              <CheckCircle className="text-success" size={40} />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground">Commande reçue !</h2>
            <p className="text-muted-foreground">Notre équipe technique analysera votre demande et vous contactera dans les 24 heures pour discuter de votre projet.</p>
            <Button onClick={() => setSubmitted(false)} variant="outline">Passer une autre commande</Button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/dashboard/store" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={18} /> Retour
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground">Commander une plateforme numérique</h1>
          <p className="text-muted-foreground mt-1">Décrivez votre projet et notre équipe le réalisera pour vous</p>
        </motion.div>

        {/* Platform type selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <label className="text-sm font-medium text-foreground">Type de plateforme *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platformTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedType === type.id
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-card/50 hover:border-border"
                }`}
              >
                <type.icon size={24} style={{ color: type.color }} className="mb-2" />
                <span className="text-sm font-medium text-foreground">{type.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-2">
          <label className="text-sm font-medium text-foreground">Support de la plateforme</label>
          <Input
            placeholder="Ex: Web, Mobile iOS/Android, Les deux..."
            value={support}
            onChange={(e) => setSupport(e.target.value)}
          />
        </motion.div>

        {/* Domain */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
          <label className="text-sm font-medium text-foreground">Domaine d'activité *</label>
          <Input
            placeholder="Ex: Mode, Restauration, Santé, Éducation..."
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="space-y-2">
          <label className="text-sm font-medium text-foreground">Description du projet *</label>
          <Textarea
            placeholder="Décrivez en détail ce que vous souhaitez : fonctionnalités, design souhaité, public cible, références..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
          />
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
          <label className="text-sm font-medium text-foreground">Téléphone de contact</label>
          <Input
            placeholder="+237 6XX XXX XXX"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Button
            onClick={handleSubmit}
            disabled={!selectedType || !domain || !description || sending}
            className="w-full"
            size="lg"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Send size={18} className="mr-2" />
            )}
            {sending ? "Envoi en cours..." : "Envoyer ma commande"}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformOrdering;
