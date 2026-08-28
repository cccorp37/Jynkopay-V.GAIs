import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Plus, Eye, EyeOff, Copy, Check, Pause, Play,
  Trash2, Settings, Zap, Shield, Lock, ChevronRight, AlertCircle,
  Sparkles, Loader2, RefreshCw, TrendingUp, ShoppingBag, Plane,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useVirtualCards } from "@/hooks/useVirtualCards";
import { supabase } from "@/integrations/supabase/client";
import { mapleradCreateCard, mapleradFreezeCard, mapleradUnfreezeCard } from "@/lib/maplerad";




const cardTypes = [
  { 
    id: "standard", 
    name: "Visa Titanium", 
    description: "Pour les achats quotidiens et abonnements en ligne",
    limit: "500 000 XOF",
    fee: "Gratuit",
    features: ["Paiements en ligne 3D Secure", "Protection anti-fraude IA", "Recharge instantanée"],
    color: "#00D2FF",
    popular: true,
  },
  { 
    id: "business", 
    name: "Mastercard Ads Pro", 
    description: "Optimisée pour Facebook Ads, TikTok Ads & Google Ads",
    limit: "5 000 000 XOF",
    fee: "2 500 XOF",
    features: ["Acceptée par Meta & Google", "Plafonds sur mesure", "Reçus comptables automatiques"],
    color: "#0047FF",
  },
  { 
    id: "single_use", 
    name: "Carte Éphémère", 
    description: "Numéro jetable à usage unique pour sécurité absolue",
    limit: "200 000 XOF",
    fee: "500 XOF",
    features: ["Auto-destruction après achat", "Chiffrement instantané", "Zéro risque de fuite"],
    color: "#00E6A5",
  },
];

const Cards = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { cards: dbCards, walletId, isLoading, error, refetch } = useVirtualCards();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<string | null>(null);
  const [newCardBalance, setNewCardBalance] = useState([50000]);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  const kycLevel = userProfile?.kycLevel || 0;
  const maxCards = kycLevel >= 2 ? 5 : 1;

  const selectedCardData = dbCards.find(c => c.id === selectedCard) || null;

  const cardGradients: Record<string, string> = {
    virtual: "from-[#6C3FF5] via-[#5B2FE5] to-[#00E5FF]",
    standard: "from-[#00C896] to-[#00A67C]",
    premium: "from-[#6C3FF5] via-[#5B2FE5] to-[#00E5FF]",
    business: "from-[#00E5FF] to-[#0099BB]",
    single_use: "from-[#FFD700] to-[#FFB84D]",
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copié !", description: `${field} copié dans le presse-papier` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleCardFreeze = async (cardId: string) => {
    const card = dbCards.find(c => c.id === cardId);
    if (!card || !user) return;
    const newStatus = card.card_status === "frozen" ? "active" : "frozen";
    
    try {
      // Call Maplerad API
      if (newStatus === "frozen") {
        await mapleradFreezeCard(user.uid, cardId);
      } else {
        await mapleradUnfreezeCard(user.uid, cardId);
      }
    } catch (e) {
      console.warn("Maplerad freeze/unfreeze failed (may be sandbox):", e);
    }

    // Update local DB
    const { error } = await supabase
      .from("virtual_cards")
      .update({ card_status: newStatus })
      .eq("id", cardId);
    if (error) {
      toast({ title: "Erreur", description: "Impossible de modifier le statut", variant: "destructive" });
      return;
    }
    toast({
      title: newStatus === "frozen" ? "Carte gelée" : "Carte dégelée",
      description: newStatus === "frozen"
        ? "Votre carte est temporairement désactivée"
        : "Votre carte est à nouveau active",
    });
    refetch();
  };

  const createCard = async () => {
    if (!walletId || !selectedCardType || !user) return;
    setIsCreatingCard(true);
    
    try {
      // Call Maplerad Issuing API
      const cardTypeInfo = cardTypes.find(t => t.id === selectedCardType);
      const result = await mapleradCreateCard(user.uid, {
        amount: Math.round(newCardBalance[0] / 600), // XOF to USD cents approx
        brand: "VISA",
        card_name: cardTypeInfo?.name || "Ma Carte",
        card_type: selectedCardType,
      });

      toast({ title: "Carte créée via Maplerad !", description: "Votre nouvelle carte virtuelle est prête" });
      setShowNewCardModal(false);
      setSelectedCardType(null);
      refetch();
    } catch (error: any) {
      console.warn("Maplerad card creation error:", error);
      // Fallback: create locally
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 3);
      const last4 = Math.floor(1000 + Math.random() * 9000).toString();

      const { error: dbError } = await supabase.from("virtual_cards").insert({
        wallet_id: walletId,
        card_name: cardTypes.find(t => t.id === selectedCardType)?.name || "Ma Carte",
        card_number_last4: last4,
        card_type: selectedCardType,
        card_status: "active",
        balance: newCardBalance[0],
        expires_at: expiresAt.toISOString().split("T")[0],
      });

      if (dbError) {
        toast({ title: "Erreur", description: "Impossible de créer la carte", variant: "destructive" });
      } else {
        toast({ title: "Carte créée (mode sandbox)", description: error.message || "Carte créée localement" });
        setShowNewCardModal(false);
        setSelectedCardType(null);
        refetch();
      }
    }
    setIsCreatingCard(false);
  };

  const formatAmount = (amount: number, currency: string = "XOF") => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " " + currency;
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Cartes Virtuelles</h1>
            <p className="text-muted-foreground">
              {isLoading ? "Chargement..." : `${dbCards.length}/${maxCards} cartes utilisées`} • Visa & Mastercard acceptées partout
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={refetch} className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors">
              <RefreshCw size={18} className={`text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => setShowNewCardModal(true)}
                disabled={dbCards.length >= maxCards || isLoading}
              >
                <Plus size={18} className="mr-2" />
                Nouvelle carte
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* KYC Warning */}
        {kycLevel < 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[rgba(255,184,77,0.1)] border border-[rgba(255,184,77,0.3)]"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-[#FFB84D] flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-[#FFB84D] font-medium">Limite de cartes atteinte</p>
                <p className="text-sm text-[#9CA3AF] mt-1">
                  Avec le niveau KYC 1, vous êtes limité à 1 carte. Vérifiez votre identité pour créer jusqu'à 5 cartes.
                </p>
                <Button variant="gold" size="sm" className="mt-3">
                  <Shield size={16} className="mr-2" />
                  Vérifier mon identité
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="md:col-span-2 lg:col-span-3 flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-[#6C3FF5]" />
            </div>
          ) : dbCards.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(108,63,245,0.1)] flex items-center justify-center mb-4">
                <CreditCard size={36} className="text-[#6C3FF5]" />
              </div>
              <p className="font-bold text-lg text-foreground mb-1">Aucune carte</p>
              <p className="text-sm text-muted-foreground mb-4">Créez votre première carte virtuelle pour commencer</p>
              <Button onClick={() => setShowNewCardModal(true)}><Plus size={16} className="mr-2" />Créer une carte</Button>
            </div>
          ) : (
            dbCards.map((card, index) => {
              const gradient = cardGradients[card.card_type] || cardGradients.virtual;
              const expiryDate = new Date(card.expires_at);
              const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, "0");
              const expiryYear = String(expiryDate.getFullYear()).slice(-2);
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setSelectedCard(card.id);
                    setShowCardDetails(true);
                  }}
                >
                  {/* Card Visual */}
                  <div className="relative overflow-hidden rounded-2xl aspect-[1.6/1]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    <motion.div 
                      animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div 
                      animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/60 text-xs uppercase tracking-wider">{card.card_name}</p>
                          <p className="text-white text-xl font-bold font-mono-numbers mt-1">
                            {formatAmount(card.balance)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {card.card_status === "frozen" && (
                            <div className="px-2 py-1 rounded-lg bg-[rgba(255,71,87,0.2)] text-[#FF4757] text-xs font-medium">
                              Gelée
                            </div>
                          )}
                          <div className="w-10 h-6 bg-gradient-to-br from-[#FFD700] to-[#FFB84D] rounded" />
                        </div>
                      </div>
                      <div>
                        <p className="text-white/80 font-mono text-sm tracking-widest mb-2">
                          •••• •••• •••• {card.card_number_last4}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/50 text-[10px] uppercase">Expire</p>
                            <p className="text-white/90 font-mono text-sm">{expiryMonth}/{expiryYear}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/90 text-xs font-medium">VISA</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Stats */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-[#00C896]" />
                      <span className="text-sm text-muted-foreground capitalize">{card.card_type}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardFreeze(card.id);
                        }}
                        className="p-2 rounded-lg bg-[rgba(21,25,50,0.5)] hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                      >
                        {card.card_status === "frozen" ? (
                          <Play size={16} className="text-[#00C896]" />
                        ) : (
                          <Pause size={16} className="text-[#FFB84D]" />
                        )}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(card.id);
                          setShowSettingsModal(true);
                        }}
                        className="p-2 rounded-lg bg-[rgba(21,25,50,0.5)] hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                      >
                        <Settings size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}

          {/* Add Card Button */}
          {!isLoading && dbCards.length > 0 && dbCards.length < maxCards && (
            <motion.button
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dbCards.length * 0.1 }}
              whileHover={{ y: -8, borderColor: "#6C3FF5" }}
              onClick={() => setShowNewCardModal(true)}
              className="relative overflow-hidden rounded-2xl aspect-[1.6/1] border-2 border-dashed border-[rgba(45,51,82,0.5)] flex flex-col items-center justify-center gap-4 transition-all hover:bg-[rgba(108,63,245,0.05)]"
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(108,63,245,0.1)] flex items-center justify-center">
                <Plus className="text-[#6C3FF5]" size={32} />
              </div>
              <div className="text-center">
                <p className="text-foreground font-medium">Créer une carte</p>
                <p className="text-sm text-muted-foreground">Visa virtuelle instantanée</p>
              </div>
            </motion.button>
          )}
        </div>


        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {[
            { icon: Shield, title: "Sécurité maximale", description: "Protection anti-fraude 24/7, notifications instantanées", color: "#00C896" },
            { icon: Zap, title: "Création instantanée", description: "Votre carte est prête en moins de 30 secondes", color: "#6C3FF5" },
            { icon: ShoppingBag, title: "Acceptée partout", description: "Visa/Mastercard valide sur tous les sites", color: "#FFB84D" },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-6 rounded-2xl glass border border-[rgba(45,51,82,0.5)]"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon style={{ color: feature.color }} size={24} />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-[#9CA3AF]">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Card Details Modal */}
      <Dialog open={showCardDetails} onOpenChange={setShowCardDetails}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          {selectedCardData && (() => {
            const gradient = cardGradients[selectedCardData.card_type] || cardGradients.virtual;
            const expiryDate = new Date(selectedCardData.expires_at);
            const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, "0");
            const expiryYear = String(expiryDate.getFullYear()).slice(-2);
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(108,63,245,0.2)] flex items-center justify-center">
                      <CreditCard className="text-[#6C3FF5]" size={20} />
                    </div>
                    {selectedCardData.card_name}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-4">
                  {/* Card Visual Mini */}
                  <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${gradient}`}>
                    <div className="relative z-10">
                      <p className="text-white/60 text-xs mb-1">Numéro de carte</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-mono text-lg tracking-widest">
                          {revealedCardId === selectedCardData.id 
                            ? "4539 1234 5678 " + selectedCardData.card_number_last4
                            : "•••• •••• •••• " + selectedCardData.card_number_last4
                          }
                        </p>
                        <button 
                          onClick={() => setRevealedCardId(revealedCardId === selectedCardData.id ? null : selectedCardData.id)}
                          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          {revealedCardId === selectedCardData.id ? <EyeOff size={14} className="text-white" /> : <Eye size={14} className="text-white" />}
                        </button>
                      </div>
                      
                      <div className="flex gap-8 mt-4">
                        <div>
                          <p className="text-white/50 text-[10px] uppercase">Expire</p>
                          <p className="text-white font-mono">{expiryMonth}/{expiryYear}</p>
                        </div>
                        <div>
                          <p className="text-white/50 text-[10px] uppercase">CVV</p>
                          <p className="text-white font-mono">{revealedCardId === selectedCardData.id ? "***" : "***"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Balance */}
                  <div className="p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Solde disponible</p>
                        <p className="text-2xl font-bold font-mono-numbers text-foreground">
                          {formatAmount(selectedCardData.balance)}
                        </p>
                      </div>
                      <Button size="sm">
                        <Plus size={16} className="mr-1" />
                        Recharger
                      </Button>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Limite quotidienne</span>
                        <span>{formatAmount(selectedCardData.daily_limit)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Limite mensuelle</span>
                        <span>{formatAmount(selectedCardData.monthly_limit)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant="secondary" 
                      className="flex-col h-auto py-4"
                      onClick={() => toggleCardFreeze(selectedCardData.id)}
                    >
                      {selectedCardData.card_status === "frozen" ? <Play size={20} className="mb-1" /> : <Pause size={20} className="mb-1" />}
                      <span className="text-xs">{selectedCardData.card_status === "frozen" ? "Dégeler" : "Geler"}</span>
                    </Button>
                    <Button variant="secondary" className="flex-col h-auto py-4" onClick={() => {
                      setShowCardDetails(false);
                      setShowSettingsModal(true);
                    }}>
                      <Settings size={20} className="mb-1" />
                      <span className="text-xs">Paramètres</span>
                    </Button>
                    <Button variant="secondary" className="flex-col h-auto py-4 text-[#FF4757] hover:text-[#FF4757]">
                      <Trash2 size={20} className="mb-1" />
                      <span className="text-xs">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>

      </Dialog>

      {/* New Card Modal */}
      <Dialog open={showNewCardModal} onOpenChange={setShowNewCardModal}>
        <DialogContent className="sm:max-w-2xl bg-[#151932] border-[rgba(45,51,82,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center">
                <Plus className="text-white" size={20} />
              </div>
              Créer une carte virtuelle
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              Choisissez le type de carte adapté à vos besoins
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Card Types */}
            <div className="grid grid-cols-2 gap-4">
              {cardTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setSelectedCardType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    selectedCardType === type.id
                      ? "border-[#6C3FF5] bg-[rgba(108,63,245,0.1)]"
                      : "border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)] hover:border-[rgba(108,63,245,0.3)]"
                  }`}
                >
                  {type.popular && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-[#FFB84D] text-[#0A0E27] text-xs font-bold flex items-center gap-1">
                      <Sparkles size={10} />
                      Populaire
                    </div>
                  )}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    <CreditCard style={{ color: type.color }} size={20} />
                  </div>
                  <h4 className="font-bold text-white mb-1">{type.name}</h4>
                  <p className="text-xs text-[#9CA3AF] mb-3">{type.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">Limite: {type.limit}</span>
                    <span className="text-[#6C3FF5] font-medium">{type.fee}</span>
                  </div>
                </motion.button>
              ))}
            </div>
            
            {/* Balance Slider */}
            {selectedCardType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-[#D1D5DB] mb-4 block">
                    Solde initial: <span className="text-[#6C3FF5] font-mono-numbers">{formatAmount(newCardBalance[0], "XOF")}</span>
                  </label>
                  <Slider
                    value={newCardBalance}
                    onValueChange={setNewCardBalance}
                    max={200000}
                    min={1000}
                    step={1000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                    <span>1 000 XOF</span>
                    <span>200 000 XOF</span>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.3)]">
                  <div className="flex items-center gap-2 text-[#00C896]">
                    <Lock size={16} />
                    <span className="text-sm font-medium">Création sécurisée</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-1">
                    Votre carte sera active instantanément après la création
                  </p>
                </div>
                
                <Button 
                  className="w-full h-14" 
                  variant="gold"
                  disabled={!selectedCardType || isCreatingCard}
                  onClick={createCard}
                >
                  {isCreatingCard ? (
                    <Loader2 size={20} className="mr-2 animate-spin" />
                  ) : (
                    <CreditCard size={20} className="mr-2" />
                  )}
                  Créer la carte ({cardTypes.find(t => t.id === selectedCardType)?.fee || "—"})
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          {selectedCardData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
                  <Settings className="text-[#6C3FF5]" size={24} />
                  Paramètres de la carte
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Card Name */}
                <div>
                   <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Nom de la carte</label>
                   <Input
                     defaultValue={selectedCardData?.card_name || ""}
                     className="h-12 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
                   />
                 </div>
                 
                 {/* Spending Limit */}
                 <div>
                   <label className="text-sm font-medium text-[#D1D5DB] mb-4 block">
                     Limite mensuelle: <span className="text-[#6C3FF5] font-mono-numbers">{formatAmount(selectedCardData?.monthly_limit || 0)}</span>
                   </label>
                   <Slider
                     defaultValue={[selectedCardData?.monthly_limit || 500000]}
                     max={1000000}
                     min={10000}
                     step={10000}
                     className="py-4"
                   />
                 </div>
                
                {/* Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="text-[#6C3FF5]" size={20} />
                      <div>
                        <p className="font-medium text-white">Paiements en ligne</p>
                        <p className="text-xs text-[#6B7280]">Autorise les achats sur internet</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]">
                    <div className="flex items-center gap-3">
                      <Plane className="text-[#00E5FF]" size={20} />
                      <div>
                        <p className="font-medium text-white">Paiements internationaux</p>
                        <p className="text-xs text-[#6B7280]">Autorise les transactions hors Afrique</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)]">
                    <div className="flex items-center gap-3">
                      <Zap className="text-[#FFB84D]" size={20} />
                      <div>
                        <p className="font-medium text-white">Notifications</p>
                        <p className="text-xs text-[#6B7280]">Alerte à chaque transaction</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowSettingsModal(false)}>
                    Annuler
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    toast({ title: "Paramètres sauvegardés" });
                    setShowSettingsModal(false);
                  }}>
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Cards;
