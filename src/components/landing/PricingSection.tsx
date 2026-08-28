import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Particulier",
    tagline: "Idéal pour vos dépenses quotidiennes et achats en ligne.",
    priceMonthly: "0",
    priceAnnual: "0",
    currency: "FCFA",
    period: "/mois à vie",
    popular: false,
    color: "#00D2FF",
    features: [
      "Wallet multi-devises (XOF, EUR, USD)",
      "1 Carte virtuelle Visa / Mastercard incluse",
      "Recharges Mobile Money illimitées (Wave, OM, MTN)",
      "Plafond mensuel de 1 000 000 FCFA",
      "Accès aux boosts de réseaux sociaux",
      "Support standard par ticket",
    ],
    buttonText: "Commencer gratuitement",
    buttonVariant: "outline" as const,
  },
  {
    name: "Business Pro",
    tagline: "Pour les e-commerçants, créateurs et agences en forte croissance.",
    priceMonthly: "9 900",
    priceAnnual: "7 900",
    currency: "FCFA",
    period: "/mois",
    popular: true,
    color: "#0047FF",
    features: [
      "Tout ce qui est inclus dans Particulier",
      "Jusqu'à 5 Cartes virtuelles Visa illimitées",
      "Boutique e-commerce & liens de paiement sans commission",
      "Plafond mensuel de 15 000 000 FCFA",
      "Tarifs préférentiels sur le Social Boost (-20%)",
      "CRM client et analyses financières avancées",
      "Support prioritaire WhatsApp & Tickets 24/7",
    ],
    buttonText: "Choisir Business Pro",
    buttonVariant: "default" as const,
  },
  {
    name: "Entreprise Elite",
    tagline: "La solution sur mesure pour grands comptes et plateformes.",
    priceMonthly: "35 000",
    priceAnnual: "28 000",
    currency: "FCFA",
    period: "/mois",
    popular: false,
    color: "#FFB800",
    features: [
      "Tout ce qui est inclus dans Business Pro",
      "Cartes virtuelles illimitées avec gestion d'équipe",
      "Plafonds de transaction déplafonnés",
      "API pour paiements et recharges automatisées",
      "Gestionnaire de compte dédié et conseil fiscal",
      "Accompagnement VIP sur mesure",
    ],
    buttonText: "Contacter le service VIP",
    buttonVariant: "outline" as const,
  },
];

export const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tarification Transparente</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Des formules conçues pour{" "}
            <span className="text-gradient-primary">votre succès</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Aucun frais caché. Annulez ou changez de forfait à tout moment en un clic.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="p-1 rounded-2xl bg-card border border-border flex items-center shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  !isAnnual
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isAnnual
                    ? "gradient-primary text-black font-bold shadow-glow-cyan"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Annuel</span>
                <span className="text-[10px] uppercase font-extrabold bg-black/20 text-black px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, index) => {
            const price = isAnnual ? tier.priceAnnual : tier.priceMonthly;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative rounded-3xl bg-card backdrop-blur-xl border p-8 flex flex-col justify-between shadow-lg transition-all duration-300 ${
                  tier.popular
                    ? "border-primary/80 ring-2 ring-primary/30 shadow-glow-cyan"
                    : "border-border/80 hover:border-border"
                }`}
              >
                {/* Popular Ribbon */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-black text-xs font-black uppercase tracking-wider shadow-md">
                    ⭐ Choix Recommandé
                  </div>
                )}

                <div>
                  {/* Plan Name & Tagline */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold font-display text-foreground mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground min-h-[40px]">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-border/60">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-mono-numbers font-black tracking-tight text-foreground">
                        {price}
                      </span>
                      <span className="text-base font-bold text-muted-foreground ml-1">
                        {tier.currency}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {tier.period}
                      </span>
                    </div>
                    {isAnnual && tier.priceMonthly !== "0" && (
                      <p className="text-xs text-emerald-500 font-semibold mt-1">
                        Facturé annuellement (2 mois offerts)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm text-foreground/90">
                        <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to action button */}
                <Button
                  asChild
                  size="lg"
                  variant={tier.popular ? "default" : "outline"}
                  className={`w-full rounded-2xl h-12 font-bold text-sm ${
                    tier.popular
                      ? "gradient-primary text-black shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]"
                      : "hover:bg-secondary"
                  }`}
                >
                  <Link to="/signup">{tier.buttonText}</Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Security & Guarantee Note */}
        <div className="mt-14 p-6 rounded-2xl bg-card border border-border/70 max-w-2xl mx-auto flex items-center justify-center gap-4 text-center">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            Garantie sans engagement. Vos données et vos fonds sont protégés par le protocole de sécurité bancaire certifié.
          </p>
        </div>

      </div>
    </section>
  );
};
