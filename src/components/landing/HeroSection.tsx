import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Sparkles, 
  TrendingUp, 
  Globe2, 
  Lock, 
  CheckCircle2, 
  Flame, 
  Send,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const [activeCurrency, setActiveCurrency] = useState<"XOF" | "EUR" | "USD">("XOF");

  const balances = {
    XOF: "2 850 000 FCFA",
    EUR: "4 345,50 €",
    USD: "$4,720.00"
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 lg:py-32">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[10%] right-[15%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[40%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[130px]" />
      </div>

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] -z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Message & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Innovation Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs md:text-sm font-semibold tracking-wide shadow-sm backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>Fintech & Super-App N°1 en Afrique Francophone</span>
              <Sparkles className="w-4 h-4 text-primary ml-0.5" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08]"
            >
              Votre argent, vos cartes & votre visibilité.{" "}
              <span className="text-gradient-primary block mt-1 sm:mt-2">
                En toute liberté.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Rechargez via Mobile Money (Wave, OM, MTN, Moov), générez des cartes Visa/Mastercard virtuelles illimitées et boostez vos réseaux sociaux en quelques clics.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto h-14 px-8 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <Link to="/signup" className="flex items-center justify-center gap-3">
                  <span>Créer mon compte gratuit</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="w-full sm:w-auto h-14 px-7 rounded-2xl border-border bg-card/60 backdrop-blur-xl text-foreground font-semibold text-base hover:bg-secondary transition-all duration-200"
              >
                <Link to="/login" className="flex items-center justify-center gap-2.5">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Accéder à mon espace</span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust Matrix & Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-border/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">50k+</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Membres actifs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold font-display text-primary">0.00 %</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Frais d'ouverture</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-bold font-display text-foreground">99.9%</span>
                <span className="text-xs sm:text-sm text-muted-foreground">Disponibilité</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Holographic Neo-Card & Live Interactive Mockup */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md"
            >
              {/* Dynamic Glow aura behind the card */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-cyan-400 opacity-30 blur-2xl -z-10" />

              {/* Glass Card Container */}
              <div className="rounded-3xl bg-card/80 backdrop-blur-2xl border border-border/80 p-6 shadow-2xl space-y-6">
                
                {/* Header with Currency Switcher */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Solde en temps réel
                    </span>
                  </div>
                  
                  {/* Currency Pills */}
                  <div className="flex items-center bg-secondary/80 rounded-xl p-1 border border-border/50">
                    {(["XOF", "EUR", "USD"] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setActiveCurrency(curr)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                          activeCurrency === curr
                            ? "bg-primary text-black shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Live Balance */}
                <div className="space-y-1">
                  <span className="text-3xl sm:text-4xl font-mono-numbers font-extrabold text-foreground tracking-tight block">
                    {balances[activeCurrency]}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% ce mois-ci via Wave & OM</span>
                  </div>
                </div>

                {/* Titanium Virtual Card Visual */}
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative h-52 sm:h-56 rounded-2xl p-6 overflow-hidden text-white shadow-xl flex flex-col justify-between"
                  style={{
                    background: "linear-gradient(135deg, #0A122C 0%, #060919 50%, #03050E 100%)",
                    border: "1px solid rgba(0, 210, 255, 0.35)",
                    boxShadow: "0 20px 40px -15px rgba(0, 210, 255, 0.25)"
                  }}
                >
                  {/* Holographic metallic shimmer */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
                  
                  {/* Top card bar */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/40">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-display font-bold text-sm tracking-wider uppercase text-white/90">
                        Jynkopay Titanium
                      </span>
                    </div>
                    {/* Contactless symbol */}
                    <div className="text-white/60 font-mono text-xs">
                      VISA PLATINUM
                    </div>
                  </div>

                  {/* Chip & NFC */}
                  <div className="flex items-center gap-3 relative z-10 my-auto">
                    <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-100 border border-amber-300 shadow-sm flex items-center justify-center opacity-90">
                      <div className="w-7 h-5 border border-amber-800/40 rounded" />
                    </div>
                    <div className="w-6 h-6 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center text-[10px] text-white/60">
                      )))
                    </div>
                  </div>

                  {/* Card numbers & holder */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="font-mono-numbers text-base sm:text-lg tracking-widest text-white/90 font-medium">
                        4532 •••• •••• 8892
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-white/60 uppercase">
                        <span>EXP: 08/29</span>
                        <span>CVV: •••</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>SÉCURISÉE</span>
                    </div>
                  </div>
                </motion.div>

                {/* Live Floating Feed item: Social Boost & Transfer */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-2xl bg-secondary/70 border border-border/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-foreground truncate">Social Boost</p>
                      <p className="text-[10px] text-emerald-500 font-medium truncate">+2,500 Followers</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-secondary/70 border border-border/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-foreground truncate">Transfert Wave</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate">Instantané 0s</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
