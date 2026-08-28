import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet as WalletIcon,
  Plus,
  Send,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Building2,
  CreditCard,
  QrCode,
  History,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
  Zap,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { mapleradWithdraw } from "@/lib/maplerad";

const rechargeProviders = [
  { id: "orange", name: "Orange Money", icon: Smartphone, color: "#FF6B00", countries: ["SN", "CI", "ML", "BF"] },
  { id: "wave", name: "Wave", icon: Smartphone, color: "#1DC7F6", countries: ["SN", "CI"] },
  { id: "mtn", name: "MTN MoMo", icon: Smartphone, color: "#FFCC00", countries: ["CI", "GH", "CM"] },
  { id: "moov", name: "Moov Money", icon: Smartphone, color: "#0066B3", countries: ["CI", "BJ", "TG"] },
  { id: "card", name: "Carte bancaire", icon: CreditCard, color: "#6C3FF5", countries: ["all"] },
  { id: "bank", name: "Virement bancaire", icon: Building2, color: "#00C896", countries: ["all"] },
];

const Wallet = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const { wallet, transactions, monthlyStats, isLoading, error, formatAmount, formatDate, refetch } = useWallet();

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [copiedWalletId, setCopiedWalletId] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "incoming" | "outgoing">("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawOperator, setWithdrawOperator] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const kycLevel = userProfile?.kycLevel || 0;
  const currency = wallet?.currency || "XOF";

  const copyWalletId = () => {
    if (!wallet?.wallet_id) return;
    navigator.clipboard.writeText(wallet.wallet_id);
    setCopiedWalletId(true);
    toast({ title: "Copié !", description: "ID du wallet copié dans le presse-papier" });
    setTimeout(() => setCopiedWalletId(false), 2000);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tx.title.toLowerCase().includes(q) || (tx.description || "").toLowerCase().includes(q);
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "transfer": return Send;
      case "card": return CreditCard;
      case "mobile_money": return Smartphone;
      case "bank": return Building2;
      case "payment": return WalletIcon;
      default: return WalletIcon;
    }
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
            <h1 className="text-2xl font-display font-bold text-foreground">Portefeuille</h1>
            <p className="text-muted-foreground">Gérez votre argent en toute sécurité</p>
          </div>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setShowRechargeModal(true)}>
                <Plus size={18} className="mr-2" />
                Recharger
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" onClick={() => setShowSendModal(true)}>
                <Send size={18} className="mr-2" />
                Envoyer
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="secondary" onClick={() => setShowWithdrawModal(true)}>
                <Download size={18} className="mr-2" />
                Retirer
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Error state */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
            <Button variant="ghost" size="sm" onClick={refetch} className="ml-auto">
              <RefreshCw size={16} className="mr-1" /> Réessayer
            </Button>
          </div>
        )}

        {/* Main Wallet Card + Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="overflow-hidden rounded-3xl glass border border-[rgba(45,51,82,0.5)]">
              {/* Premium Card Visual */}
              <div className="relative p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6C3FF5] via-[#5B2FE5] to-[#00E5FF]" />
                
                <motion.div 
                  animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div 
                  animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute bottom-0 left-0 w-48 h-48 bg-[#00E5FF]/20 rounded-full blur-3xl"
                />
                
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Solde disponible</p>
                      {isLoading ? (
                        <div className="flex items-center gap-3 mt-2">
                          <Loader2 size={28} className="animate-spin text-white/70" />
                          <span className="text-white/50 text-lg">Chargement...</span>
                        </div>
                      ) : (
                        <>
                          <motion.p 
                            className="text-white text-4xl font-bold font-mono-numbers"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            {wallet ? formatAmount(wallet.balance, wallet.currency) : "0 XOF"}
                          </motion.p>
                          <p className="text-white/50 text-sm mt-1">
                            Limite max: {wallet ? formatAmount(wallet.max_balance, wallet.currency) : "—"}
                          </p>
                        </>
                      )}
                    </div>
                    <motion.div 
                      className="w-16 h-12 bg-gradient-to-br from-[#FFD700] to-[#FFB84D] rounded-xl shadow-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <WalletIcon className="text-[#0A0E27]" size={24} />
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Wallet ID</p>
                      <button 
                        onClick={copyWalletId}
                        className="flex items-center gap-2 text-white/90 font-mono text-sm tracking-widest hover:text-white transition-colors"
                        disabled={isLoading || !wallet}
                      >
                        {isLoading ? "—" : (wallet?.wallet_id || "Non créé")}
                        {!isLoading && wallet && (copiedWalletId ? <Check size={14} /> : <Copy size={14} />)}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1.5 rounded-lg ${
                        kycLevel >= 2 
                          ? "bg-[rgba(0,200,150,0.2)] text-[#00C896]" 
                          : "bg-[rgba(255,184,77,0.2)] text-[#FFB84D]"
                      }`}>
                        <span className="text-xs font-medium">KYC Niveau {kycLevel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="p-6 grid grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: "Recharger", color: "#00C896", onClick: () => setShowRechargeModal(true) },
                  { icon: Send, label: "Envoyer", color: "#6C3FF5", onClick: () => setShowSendModal(true) },
                  { icon: Download, label: "Retirer", color: "#00E5FF", onClick: () => setShowWithdrawModal(true) },
                  { icon: QrCode, label: "QR Code", color: "#FFB84D", onClick: () => toast({ title: "Bientôt disponible", description: "Cette fonctionnalité arrive prochainement" }) },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.onClick}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[rgba(21,25,50,0.5)] border border-[rgba(45,51,82,0.5)] hover:border-[rgba(108,63,245,0.3)] transition-all"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <action.icon style={{ color: action.color }} size={22} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Monthly Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="h-full rounded-3xl glass border border-[rgba(45,51,82,0.5)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-foreground">Ce mois-ci</h3>
                <button 
                  onClick={refetch}
                  className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                >
                  <RefreshCw size={18} className={`text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 size={28} className="animate-spin text-[#6C3FF5]" />
                </div>
              ) : (
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-center justify-between p-4 rounded-xl bg-[rgba(0,200,150,0.08)] border border-[rgba(0,200,150,0.2)]"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(0,200,150,0.15)] flex items-center justify-center">
                        <ArrowDownLeft className="text-[#00C896]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reçu</p>
                        <p className="font-semibold font-mono-numbers text-foreground">
                          +{formatAmount(monthlyStats?.total_incoming || 0, currency)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-4 rounded-xl bg-[rgba(108,63,245,0.08)] border border-[rgba(108,63,245,0.2)]"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(108,63,245,0.15)] flex items-center justify-center">
                        <ArrowUpRight className="text-[#6C3FF5]" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dépensé</p>
                        <p className="font-semibold font-mono-numbers text-foreground">
                          -{formatAmount(monthlyStats?.total_outgoing || 0, currency)}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="pt-4 border-t border-[rgba(45,51,82,0.2)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Solde net</span>
                      <span className={`font-semibold font-mono-numbers ${
                        (monthlyStats?.total_incoming || 0) >= (monthlyStats?.total_outgoing || 0) 
                          ? "text-[#00C896]" : "text-[#FF4757]"
                      }`}>
                        {(monthlyStats?.total_incoming || 0) >= (monthlyStats?.total_outgoing || 0) ? "+" : ""}
                        {formatAmount((monthlyStats?.total_incoming || 0) - (monthlyStats?.total_outgoing || 0), currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp size={14} className="text-[#00C896]" />
                      <span>{monthlyStats?.transaction_count || 0} transactions ce mois</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-3xl glass border border-[rgba(45,51,82,0.5)]">
            {/* Header */}
            <div className="p-6 border-b border-[rgba(45,51,82,0.2)]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <History className="text-[#6C3FF5]" size={24} />
                  <h3 className="text-lg font-display font-bold text-foreground">Historique des transactions</h3>
                </div>
                
                <div className="flex gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher..."
                      className="pl-10 w-48 h-10 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]"
                    />
                  </div>
                  
                  {/* Filter Tabs */}
                  <div className="flex rounded-xl bg-[rgba(21,25,50,0.5)] p-1">
                    {[
                      { value: "all", label: "Tout" },
                      { value: "incoming", label: "Reçu" },
                      { value: "outgoing", label: "Envoyé" },
                    ].map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setFilterType(filter.value as typeof filterType)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          filterType === filter.value
                            ? "bg-[#6C3FF5] text-white"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transactions */}
            <div className="p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={32} className="animate-spin text-[#6C3FF5]" />
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <WalletIcon className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="font-medium text-foreground mb-1">Aucune transaction trouvée</p>
                  <p className="text-sm text-muted-foreground">Vos transactions apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((tx, index) => {
                    return (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5, backgroundColor: "rgba(108, 63, 245, 0.05)" }}
                        className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            tx.type === "incoming" ? "bg-[rgba(0,200,150,0.15)]" : "bg-[rgba(108,63,245,0.15)]"
                          }`}>
                            {tx.type === "incoming" ? (
                              <ArrowDownLeft className="text-[#00C896]" size={22} />
                            ) : (
                              <ArrowUpRight className="text-[#6C3FF5]" size={22} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{tx.title}</p>
                              {tx.status === "pending" && (
                                <span className="px-2 py-0.5 rounded-full bg-[rgba(255,184,77,0.1)] text-[#FFB84D] text-xs">
                                  En attente
                                </span>
                              )}
                              {tx.status === "failed" && (
                                <span className="px-2 py-0.5 rounded-full bg-[rgba(255,71,87,0.1)] text-[#FF4757] text-xs">
                                  Échoué
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{tx.description || tx.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold font-mono-numbers ${
                            tx.type === "incoming" ? "text-[#00C896]" : "text-foreground"
                          }`}>
                            {tx.type === "incoming" ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                        </div>
                        <ChevronRight className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recharge Modal */}
      <Dialog open={showRechargeModal} onOpenChange={setShowRechargeModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00C896] to-[#00A67C] flex items-center justify-center">
                <Plus className="text-white" size={20} />
              </div>
              Recharger le wallet
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              Choisissez un mode de paiement et entrez le montant
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Montant ({currency})</label>
              <div className="relative">
                <Input
                  type="number"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                  placeholder="Ex: 50000"
                  className="h-14 text-2xl font-mono-numbers bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000, 100000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(amount.toString())}
                    className="px-3 py-1.5 rounded-lg bg-[rgba(108,63,245,0.1)] text-[#6C3FF5] text-sm font-medium hover:bg-[rgba(108,63,245,0.2)] transition-colors"
                  >
                    {(amount / 1000)}k
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-3 block">Mode de paiement</label>
              <div className="grid grid-cols-2 gap-3">
                {rechargeProviders.map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedProvider === provider.id
                        ? "border-[#6C3FF5] bg-[rgba(108,63,245,0.1)]"
                        : "border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)] hover:border-[rgba(108,63,245,0.3)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${provider.color}20` }}
                      >
                        <provider.icon style={{ color: provider.color }} size={20} />
                      </div>
                      <span className="font-medium text-white text-sm">{provider.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {kycLevel < 2 && (
              <div className="p-4 rounded-xl bg-[rgba(255,184,77,0.1)] border border-[rgba(255,184,77,0.3)]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-[#FFB84D] flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-[#FFB84D] font-medium">Limite de rechargement</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Votre niveau KYC limite le rechargement à {formatAmount(wallet?.max_balance || 100000, currency)}. 
                      Vérifiez votre identité pour augmenter vos limites.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full h-14" 
              variant="gold"
              disabled={!rechargeAmount || !selectedProvider}
              onClick={() => {
                toast({
                  title: "Fonctionnalité en développement",
                  description: "L'intégration des paiements est en cours. Cette fonctionnalité sera bientôt disponible.",
                });
              }}
            >
              <Zap size={20} className="mr-2" />
              Recharger maintenant
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#5B2FE5] flex items-center justify-center">
                <Send className="text-white" size={20} />
              </div>
              Envoyer de l'argent
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              Transfert gratuit et instantané vers un autre utilisateur Jynkopay
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Destinataire</label>
              <Input
                placeholder="Email, téléphone ou Wallet ID"
                className="h-12 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Montant ({currency})</label>
              <Input
                type="number"
                placeholder="Ex: 25000"
                className="h-14 text-2xl font-mono-numbers bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Note (optionnel)</label>
              <Input
                placeholder="Ex: Remboursement déjeuner"
                className="h-12 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            
            <Button 
              className="w-full h-14"
              onClick={() => {
                toast({
                  title: "Fonctionnalité en développement",
                  description: "Les transferts seront bientôt disponibles.",
                });
              }}
            >
              <Send size={20} className="mr-2" />
              Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#00B8CC] flex items-center justify-center">
                <Download className="text-white" size={20} />
              </div>
              Retirer vers Mobile Money
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              Retrait via Maplerad Transfers vers Orange Money ou MTN MoMo
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-3 block">Opérateur</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "orange", name: "Orange Money", color: "#FF6B00" },
                  { id: "mtn", name: "MTN MoMo", color: "#FFCC00" },
                ].map((op) => (
                  <motion.button
                    key={op.id}
                    onClick={() => setWithdrawOperator(op.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border transition-all ${
                      withdrawOperator === op.id
                        ? "border-[#6C3FF5] bg-[rgba(108,63,245,0.1)]"
                        : "border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${op.color}20` }}>
                        <Smartphone style={{ color: op.color }} size={20} />
                      </div>
                      <span className="font-medium text-white text-sm">{op.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Numéro de téléphone</label>
              <Input
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value)}
                placeholder="+237690000000"
                className="h-12 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Montant ({currency})</label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Ex: 50000"
                className="h-14 text-2xl font-mono-numbers bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] text-white"
              />
              {withdrawAmount && (
                <p className="text-xs text-muted-foreground mt-2">
                  Frais: {formatAmount(Math.max(Math.round(Number(withdrawAmount) * 0.01), 100), currency)} • 
                  Total débité: {formatAmount(Number(withdrawAmount) + Math.max(Math.round(Number(withdrawAmount) * 0.01), 100), currency)}
                </p>
              )}
            </div>
            
            <Button 
              className="w-full h-14" 
              variant="gold"
              disabled={!withdrawAmount || !withdrawPhone || !withdrawOperator || isWithdrawing}
              onClick={async () => {
                if (!user) return;
                setIsWithdrawing(true);
                try {
                  const result = await mapleradWithdraw(user.uid, {
                    amount: Number(withdrawAmount),
                    phone: withdrawPhone,
                    operator: withdrawOperator!,
                  });
                  toast({
                    title: "Retrait initié !",
                    description: `Référence: ${result.reference}. Frais: ${formatAmount(result.fees, currency)}`,
                  });
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                  setWithdrawPhone("");
                  setWithdrawOperator(null);
                  refetch();
                } catch (error: any) {
                  toast({
                    title: "Erreur de retrait",
                    description: error.message || "Impossible d'effectuer le retrait",
                    variant: "destructive",
                  });
                } finally {
                  setIsWithdrawing(false);
                }
              }}
            >
              {isWithdrawing ? <Loader2 className="animate-spin mr-2" size={20} /> : <Download size={20} className="mr-2" />}
              Retirer via Maplerad
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Wallet;
