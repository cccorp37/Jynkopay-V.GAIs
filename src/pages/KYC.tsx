import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Camera, Check, AlertCircle, Shield, FileText, User,
  ArrowRight, X, Loader2, Phone, Calendar, MapPin, CreditCard
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TermsModal } from "@/components/TermsModal";
import { 
  mapleradCreateCustomer, mapleradUpgradeTier1, mapleradUpgradeTier2, mapleradGetCustomer 
} from "@/lib/maplerad";

type KycStatus = "pending" | "tier0" | "tier1" | "tier2" | "submitted" | "verified" | "rejected";

const KYC = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<KycStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mapleradTier, setMapleradTier] = useState(0);
  const [mapleradCustomerId, setMapleradCustomerId] = useState<string | null>(null);

  // Tier 1 form
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Douala");

  // Tier 2 form
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const kycTermsAccepted = localStorage.getItem("jynkopay_kyc_terms_accepted");
    if (!kycTermsAccepted) {
      setShowTermsModal(true);
    } else {
      setTermsAccepted(true);
    }
  }, []);

  useEffect(() => {
    if (user) fetchMapleradStatus();
  }, [user]);

  const fetchMapleradStatus = async () => {
    if (!user) return;
    try {
      const result = await mapleradGetCustomer(user.uid);
      setMapleradTier(result.tier || 0);
      if (result.customer) setMapleradCustomerId(result.customer.id);
      if (result.tier >= 2) setKycStatus("verified");
      else if (result.tier === 1) setKycStatus("tier1");
      else if (result.customer) setKycStatus("tier0");
    } catch (e) {
      console.error("Error fetching Maplerad status:", e);
    }
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    localStorage.setItem("jynkopay_kyc_terms_accepted", "true");
  };

  const handleCreateCustomer = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const result = await mapleradCreateCustomer(user.uid, {
        first_name: userProfile?.firstName || "User",
        last_name: userProfile?.lastName || "Jynkopay",
        country: "CM",
      });
      setMapleradCustomerId(result.customer_id);
      setMapleradTier(0);
      setKycStatus("tier0");
      toast({ title: "Compte Maplerad créé !", description: "Tier 0 activé — vous pouvez maintenant utiliser les transferts" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Impossible de créer le compte", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeTier1 = async () => {
    if (!user || !phone || !dob || !idNumber || !address) {
      toast({ title: "Champs requis", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await mapleradUpgradeTier1(user.uid, { phone, dob, id_number: idNumber, address, city });
      setMapleradTier(1);
      setKycStatus("tier1");
      toast({ title: "Tier 1 activé !", description: "Vous pouvez maintenant créer des cartes virtuelles" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Échec de la mise à niveau", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Format invalide", description: "Veuillez sélectionner une image", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Fichier trop volumineux", description: "Taille max: 10 MB", variant: "destructive" });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      setDocumentImage(reader.result as string);
      setDocumentName(file.name);
    };
    reader.readAsDataURL(file);

    // Also upload to storage for backup
    if (user) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.uid}/kyc_document_${Date.now()}.${fileExt}`;
      await supabase.storage.from("kyc-documents").upload(fileName, file, { cacheControl: "3600", upsert: true });
    }
  };

  const handleUpgradeTier2 = async () => {
    if (!user || !documentImage) {
      toast({ title: "Document requis", description: "Veuillez télécharger votre pièce d'identité", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await mapleradUpgradeTier2(user.uid, { document_type: "NIN", document_image: documentImage });
      setMapleradTier(2);
      setKycStatus("verified");
      toast({ title: "Tier 2 activé !", description: "Accès complet à tous les services Jynkopay" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message || "Échec de la vérification", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = [
    { level: 0, name: "Base", limit: "Transferts & FX", services: "Transfers, FX, Bills", required: "Prénom, Nom, Email" },
    { level: 1, name: "Standard", limit: "Cartes & Collections", services: "+ Cartes virtuelles, Collections", required: "Téléphone, Date de naissance, N° identité, Adresse" },
    { level: 2, name: "Premium", limit: "Accès complet", services: "+ Tout (comptes USD)", required: "Document d'identité (scan CNI/NIN)" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center">
              <Shield className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Vérification KYC</h1>
              <p className="text-muted-foreground">Conformité Maplerad — Tier {mapleradTier}</p>
            </div>
          </div>

          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl border ${
              kycStatus === "verified" 
                ? "bg-[rgba(0,200,150,0.1)] border-[rgba(0,200,150,0.3)]"
                : kycStatus === "tier1"
                ? "bg-[rgba(108,63,245,0.1)] border-[rgba(108,63,245,0.3)]"
                : kycStatus === "tier0"
                ? "bg-[rgba(255,184,77,0.1)] border-[rgba(255,184,77,0.3)]"
                : "bg-[rgba(108,63,245,0.1)] border-[rgba(108,63,245,0.3)]"
            }`}
          >
            <div className="flex items-center gap-3">
              {kycStatus === "verified" && <Check className="text-[#00C896]" size={20} />}
              {kycStatus === "tier1" && <Shield className="text-[#6C3FF5]" size={20} />}
              {kycStatus === "tier0" && <AlertCircle className="text-[#FFB84D]" size={20} />}
              {kycStatus === "pending" && <Shield className="text-[#6C3FF5]" size={20} />}
              <div>
                <p className="font-medium text-foreground">
                  {kycStatus === "verified" && "✅ Tier 2 — Accès complet"}
                  {kycStatus === "tier1" && "🔷 Tier 1 — Cartes virtuelles activées"}
                  {kycStatus === "tier0" && "🟡 Tier 0 — Transferts activés"}
                  {kycStatus === "pending" && "Vérification requise"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {kycStatus === "verified" && "Vous avez accès à tous les services Jynkopay"}
                  {kycStatus === "tier1" && "Passez au Tier 2 pour un accès complet"}
                  {kycStatus === "tier0" && "Passez au Tier 1 pour débloquer les cartes virtuelles"}
                  {kycStatus === "pending" && "Créez votre compte Maplerad pour commencer"}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tier Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-[rgba(45,51,82,0.5)] mb-8"
        >
          <h3 className="text-lg font-display font-bold text-foreground mb-4">Niveaux de vérification Maplerad</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  mapleradTier >= tier.level
                    ? "bg-[rgba(0,200,150,0.1)] border-[rgba(0,200,150,0.3)]"
                    : mapleradTier === tier.level - 1
                    ? "bg-[rgba(108,63,245,0.1)] border-[rgba(108,63,245,0.3)]"
                    : "bg-[rgba(21,25,50,0.5)] border-[rgba(45,51,82,0.5)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    mapleradTier >= tier.level
                      ? "bg-[rgba(0,200,150,0.3)]" 
                      : "bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF]"
                  }`}>
                    {mapleradTier >= tier.level ? (
                      <Check className="text-[#00C896]" size={16} />
                    ) : (
                      <span className="text-white font-bold text-sm">{tier.level}</span>
                    )}
                  </div>
                  <span className="font-medium text-foreground">{tier.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.services}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step: Create Customer (Tier 0) */}
        {kycStatus === "pending" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-[rgba(45,51,82,0.5)] mb-6"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4">Étape 1 — Créer votre compte financier</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Vos informations de base (nom, email) seront utilisées pour créer votre profil financier Maplerad.
              Ceci débloque les transferts et le change de devises.
            </p>
            <Button onClick={handleCreateCustomer} disabled={isLoading} className="w-full h-14" size="lg">
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ArrowRight className="mr-2" size={20} />}
              Créer mon compte financier (Tier 0)
            </Button>
          </motion.div>
        )}

        {/* Step: Upgrade to Tier 1 */}
        {kycStatus === "tier0" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-[rgba(45,51,82,0.5)] mb-6"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4">
              Étape 2 — Passer au Tier 1 <span className="text-sm text-muted-foreground">(pour cartes virtuelles)</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+237690000000" className="pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Date de naissance</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Numéro d'identité (CNI/Passeport)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="1234567890" className="pl-10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Akwa, Douala" className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Ville</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Douala" />
                </div>
              </div>
              <Button onClick={handleUpgradeTier1} disabled={isLoading} className="w-full h-14" size="lg" variant="gold">
                {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Shield className="mr-2" size={20} />}
                Vérifier et passer au Tier 1
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Upgrade to Tier 2 */}
        {kycStatus === "tier1" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-[rgba(45,51,82,0.5)] mb-6"
          >
            <h3 className="text-lg font-display font-bold text-foreground mb-4">
              Étape 3 — Passer au Tier 2 <span className="text-sm text-muted-foreground">(accès complet)</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Téléchargez un scan de votre CNI ou NIN pour débloquer l'accès complet à tous les services.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleDocumentSelect}
              className="hidden"
            />

            {documentImage ? (
              <div className="p-4 rounded-xl bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.3)] mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="text-[#00C896]" size={20} />
                  <span className="text-foreground">{documentName}</span>
                </div>
                <button onClick={() => { setDocumentImage(null); setDocumentName(""); }}
                  className="p-2 rounded-lg bg-[rgba(255,71,87,0.1)] hover:bg-[rgba(255,71,87,0.2)]">
                  <X className="text-[#FF4757]" size={16} />
                </button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="w-full mb-4 h-14">
                <Camera className="mr-2" size={20} />
                Télécharger le document d'identité
              </Button>
            )}

            <Button onClick={handleUpgradeTier2} disabled={isLoading || !documentImage} className="w-full h-14" size="lg" variant="gold">
              {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <ArrowRight className="mr-2" size={20} />}
              Soumettre et passer au Tier 2
            </Button>
          </motion.div>
        )}

        {/* Verified state */}
        {kycStatus === "verified" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 border border-[rgba(0,200,150,0.3)] text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[rgba(0,200,150,0.15)] flex items-center justify-center mx-auto mb-4">
              <Check className="text-[#00C896]" size={40} />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-2">Vérification complète !</h3>
            <p className="text-muted-foreground">
              Vous avez accès à l'ensemble des services Jynkopay : cartes virtuelles, transferts, wallet et marketplace.
            </p>
          </motion.div>
        )}
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} onAccept={handleTermsAccept} type="kyc" />
    </DashboardLayout>
  );
};

export default KYC;
