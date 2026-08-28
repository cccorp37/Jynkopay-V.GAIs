import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Flame,
  Store,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Send,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const logoJynkopay = "/images/jynkopay-icon.jpg";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const { toast } = useToast();

  const isAdmin = user?.email === "cccorp37@gmail.com";

  const menuItems = useMemo(() => {
    const items = [
      { icon: LayoutDashboard, label: "Vue Générale", href: "/dashboard", color: "#00D2FF" },
      { icon: Wallet, label: "Portefeuille & Dépôts", href: "/dashboard/wallet", color: "#00E6A5" },
      { icon: CreditCard, label: "Cartes Virtuelles", href: "/dashboard/cards", color: "#0047FF" },
      { icon: Flame, label: "Social Boost", href: "/dashboard/social-boost", color: "#FF007A" },
      { icon: Sparkles, label: "Commander Plateforme", href: "/dashboard/platform-order", color: "#FFB800" },
      { icon: ShieldCheck, label: "Vérification KYC", href: "/kyc", color: "#10B981" },
      { icon: BarChart3, label: "Analytics & Flux", href: "/dashboard/analytics", color: "#00D2FF" },
      { icon: Users, label: "Clients & CRM", href: "/dashboard/crm", color: "#0047FF" },
    ];
    if (isAdmin) {
      items.push({ icon: ShieldCheck, label: "Administration", href: "/admin", color: "#EF4444" });
    }
    return items;
  }, [isAdmin]);

  const bottomMenuItems = [
    { icon: HelpCircle, label: "Aide & Assistance", href: "/dashboard/help" },
    { icon: Settings, label: "Paramètres Compte", href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Session clôturée",
        description: "À très bientôt sur Jynkopay !",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    }
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split("@")[0] || "Utilisateur";
  const firstName = userProfile?.firstName || displayName.split(" ")[0];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased">
      
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-card/95 backdrop-blur-2xl border-r border-border/80 flex flex-col z-50 transition-all duration-300 ${
          collapsed ? "w-20" : "w-72"
        } ${
          mobileMenuOpen ? "translate-x-0 !w-72" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-border/60">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl bg-primary/40 blur-sm group-hover:bg-primary transition-all duration-300" />
              <img
                src={logoJynkopay}
                alt="Jynkopay"
                className="relative w-9 h-9 rounded-xl object-contain ring-1 ring-border shadow-sm"
              />
            </div>
            {(!collapsed || mobileMenuOpen) && (
              <div className="flex flex-col">
                <span className="text-xl font-display font-black tracking-tight">
                  <span className="text-foreground">Jynko</span>
                  <span className="text-gradient-primary">pay</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground -mt-0.5">
                  Super-App
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle for Desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-secondary hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors"
            title={collapsed ? "Agrandir" : "Réduire"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Close for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl bg-secondary text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 group ${
                  isActive
                    ? "text-black font-bold gradient-primary shadow-glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? "bg-black/15 text-black"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {(!collapsed || mobileMenuOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu & Logout */}
        <div className="p-3 border-t border-border/60 space-y-1 bg-secondary/30">
          {bottomMenuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {(!collapsed || mobileMenuOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
          >
            <LogOut size={16} className="shrink-0" />
            {(!collapsed || mobileMenuOpen) && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {/* Top Header Command Bar */}
        <header className="h-20 bg-background/85 backdrop-blur-2xl border-b border-border/70 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          
          {/* Left: Mobile hamburger & Search bar */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-secondary transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-secondary/70 border border-border/60 w-64 lg:w-80">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Rechercher transaction, carte, service..."
                className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none w-full"
              />
            </div>
          </div>

          {/* Right: Quick actions, Theme, Notifications & User */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notifications Button */}
            <button
              className="relative p-2.5 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </button>

            {/* User Pill */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-border/60">
              <div className="w-10 h-10 rounded-2xl gradient-primary text-black font-extrabold flex items-center justify-center shadow-sm text-sm">
                {initials}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-foreground truncate max-w-[120px]">
                  {firstName}
                </span>
                <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Vérifié
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
