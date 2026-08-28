import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CreditCard, 
  ShoppingBag,
  Users,
  Plus,
  Send,
  Download,
  Sparkles,
  Eye,
  EyeOff,
  MoreHorizontal,
  Wallet,
  Loader2,
  Flame,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Copy,
  Check
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { wallet, transactions, monthlyStats, isLoading, formatAmount, formatDate, refreshWallet } = useWallet();
  const { userProfile, user } = useAuth();
  const { toast } = useToast();
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Entrepreneur";

  const handleCopyId = () => {
    if (wallet?.id) {
      navigator.clipboard.writeText(wallet.id);
      setCopied(true);
      toast({ title: "Identifiant copié", description: "Votre ID de wallet est dans le presse-papier." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = [
    {
      title: "Solde Total Disponible",
      value: wallet ? (balanceHidden ? "••••••••" : formatAmount(wallet.balance, wallet.currency)) : "—",
      change: "Disponible immédiatement",
      positive: true,
      icon: Wallet,
      color: "#00D2FF",
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      title: "Reçu ce mois",
      value: monthlyStats ? (balanceHidden ? "••••••••" : formatAmount(monthlyStats.total_incoming, wallet?.currency || "XOF")) : "—",
      change: monthlyStats ? `${monthlyStats.transaction_count} transactions` : "0 transaction",
      positive: true,
      icon: ArrowDownLeft,
      color: "#00E6A5",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "Dépensé ce mois",
      value: monthlyStats ? (balanceHidden ? "••••••••" : formatAmount(monthlyStats.total_outgoing, wallet?.currency || "XOF")) : "—",
      change: "Achats & Retraits",
      positive: false,
      icon: ArrowUpRight,
      color: "#FF007A",
      gradient: "from-pink-500/20 to-rose-500/20",
    },
    {
      title: "Cartes Virtuelles Actives",
      value: "1 Carte Visa",
      change: "Plafond mensuel 1M",
      positive: true,
      icon: CreditCard,
      color: "#FFB800",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Top Welcome Banner & Quick Actions */}
        <div className="relative rounded-3xl bg-card border border-border/80 p-6 sm:p-8 overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Ambient background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Espace Personnel Sécurisé</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-foreground tracking-tight">
              Ravi de vous revoir, {displayName} 👋
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Gérez votre argent, rechargez via Mobile Money ou lancez un boost de visibilité en un instant.
            </p>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Button
              asChild
              className="h-12 px-6 rounded-2xl gradient-primary text-black font-bold shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Link to="/dashboard/wallet" className="flex items-center gap-2">
                <Plus size={18} />
                <span>Recharger</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 px-5 rounded-2xl border-border hover:bg-secondary font-semibold"
            >
              <Link to="/dashboard/wallet" className="flex items-center gap-2">
                <Send size={16} className="text-primary" />
                <span>Transférer</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 px-5 rounded-2xl border-border hover:bg-secondary font-semibold"
            >
              <Link to="/dashboard/social-boost" className="flex items-center gap-2 text-pink-500 hover:text-pink-600">
                <Flame size={16} />
                <span>Boost</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative rounded-3xl bg-card border border-border/80 p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                        border: `1px solid ${stat.color}30`,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    {index === 0 && (
                      <button
                        onClick={() => setBalanceHidden(!balanceHidden)}
                        className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title={balanceHidden ? "Afficher le solde" : "Masquer le solde"}
                      >
                        {balanceHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {stat.title}
                  </p>

                  {isLoading ? (
                    <div className="h-9 flex items-center">
                      <Loader2 size={20} className="animate-spin text-primary" />
                    </div>
                  ) : (
                    <p className="text-2xl sm:text-3xl font-mono-numbers font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{stat.change}</span>
                  {stat.positive && <TrendingUp size={14} className="text-emerald-500" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Middle Dual Section: Virtual Card + Social Boost Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Virtual Card Showcase (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-card border border-border/80 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-foreground">
                  Votre Carte Virtuelle
                </h3>
                <p className="text-xs text-muted-foreground">
                  Visa Internationale 3D-Secure
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                <Link to="/dashboard/cards">Gérer les cartes</Link>
              </Button>
            </div>

            {/* Visual Card */}
            <div
              className="relative h-48 sm:h-52 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden my-2"
              style={{
                background: "linear-gradient(135deg, #0A122C 0%, #060919 50%, #03050E 100%)",
                border: "1px solid rgba(0, 210, 255, 0.4)",
              }}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className="font-display font-extrabold text-sm tracking-wider uppercase text-primary">
                  JYNKOPAY PLATINUM
                </span>
                <span className="text-xs font-mono font-bold tracking-widest text-white/70">
                  VISA
                </span>
              </div>

              <div className="relative z-10 font-mono-numbers text-lg sm:text-xl tracking-widest text-white/95 font-semibold my-auto">
                4532 •••• •••• 8892
              </div>

              <div className="flex items-end justify-between relative z-10 text-xs font-mono text-white/70">
                <div>
                  <p className="text-[10px] uppercase text-white/50">Titulaire</p>
                  <p className="font-semibold text-white uppercase">{displayName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50">Expire</p>
                  <p className="font-semibold text-white">08/29</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                <ShieldCheck size={16} /> Prête pour Facebook & TikTok Ads
              </span>
              <Link to="/dashboard/cards" className="text-primary hover:underline font-medium">
                Voir détails
              </Link>
            </div>
          </div>

          {/* Social Boost Spotlight (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/20 p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 text-pink-500 text-xs font-bold uppercase tracking-wider">
                  <Flame size={14} />
                  <span>Service Exclusif</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">Livraison en 24h</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-2">
                Propulsez votre marque avec le <span className="text-pink-500">Social Boost</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Obtenez des abonnés réels, des likes ciblés et des avis 5 étoiles sur TikTok, Instagram, Facebook et Google pour démultiplier vos ventes.
              </p>

              {/* Platform Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { name: "TikTok", boost: "+2,500 vues/jour", color: "#FF0050" },
                  { name: "Instagram", boost: "+1,000 abonnés", color: "#E1306C" },
                  { name: "Facebook", boost: "+500 avis/likes", color: "#1877F2" },
                  { name: "Google Avis", boost: "5★ garanties", color: "#00E6A5" },
                ].map((plat) => (
                  <div
                    key={plat.name}
                    className="p-3 rounded-2xl bg-card border border-border/80 flex flex-col items-start"
                  >
                    <span className="text-xs font-bold text-foreground">{plat.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{plat.boost}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg shadow-pink-500/20"
            >
              <Link to="/dashboard/social-boost" className="flex items-center justify-center gap-2">
                <Flame size={16} />
                <span>Configurer mon premier boost</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

        </div>

        {/* Recent Transactions List */}
        <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold font-display text-foreground">
                Historique Récent des Transactions
              </h3>
              <p className="text-xs text-muted-foreground">
                Mouvements financiers sur votre compte
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshWallet}
              className="rounded-xl text-xs gap-1.5"
            >
              <RefreshCw size={14} />
              <span>Actualiser</span>
            </Button>
          </div>

          {transactions && transactions.length > 0 ? (
            <div className="divide-y divide-border/60">
              {transactions.slice(0, 5).map((tx) => {
                const isIncoming = tx.type === "deposit" || tx.type === "transfer_in";
                return (
                  <div
                    key={tx.id}
                    className="py-4 flex items-center justify-between hover:bg-secondary/40 px-3 rounded-2xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          isIncoming
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-pink-500/15 text-pink-500"
                        }`}
                      >
                        {isIncoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {tx.description || (isIncoming ? "Recharge reçue" : "Paiement envoyé")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.created_at)} • {tx.payment_method || "Wallet"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm sm:text-base font-mono-numbers font-bold ${
                          isIncoming ? "text-emerald-500" : "text-foreground"
                        }`}
                      >
                        {isIncoming ? "+" : "-"}{formatAmount(tx.amount, tx.currency)}
                      </p>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-muted-foreground">
                <Wallet size={24} />
              </div>
              <p className="text-sm font-semibold text-foreground">Aucune transaction pour le moment</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Effectuez une première recharge via Wave ou Orange Money pour commencer vos transactions.
              </p>
              <Button asChild size="sm" className="rounded-xl gradient-primary text-black font-bold mt-2">
                <Link to="/dashboard/wallet">Recharger maintenant</Link>
              </Button>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
