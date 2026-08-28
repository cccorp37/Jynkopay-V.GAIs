import { motion } from "framer-motion";
import { 
  Wallet, 
  CreditCard, 
  Flame, 
  Store, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  ArrowUpRight, 
  Sparkles, 
  Smartphone,
  Lock,
  Layers
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Wallet,
    tag: "Multi-Devises",
    title: "Portefeuille Digital & Mobile Money",
    description: "Rechargez et retirez instantanément via Wave, Orange Money, MTN, Moov Money, cartes et virements bancaires en toute fluidité.",
    color: "#00D2FF",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    span: "lg:col-span-8",
    badge: "Instant 0s"
  },
  {
    icon: CreditCard,
    tag: "Paiements Mondiaux",
    title: "Cartes Virtuelles Visa / Mastercard",
    description: "Générez des cartes internationales pour vos abonnements et campagnes publicitaires (Facebook Ads, TikTok Ads, Google, Netflix).",
    color: "#0047FF",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
    span: "lg:col-span-4",
    badge: "3D Secure"
  },
  {
    icon: Flame,
    tag: "Propulsion Digitale",
    title: "Social Boost - Visibilité & Croissance",
    description: "Augmentez votre notoriété avec des likes, abonnés et avis réels et qualifiés sur Instagram, TikTok, Facebook et Google Reviews.",
    color: "#FF007A",
    gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
    span: "lg:col-span-4",
    badge: "Exclusif"
  },
  {
    icon: Store,
    tag: "E-Commerce",
    title: "Boutique en Ligne & Liens de Paiement",
    description: "Créez votre catalogue de produits, encaissez vos clients par QR Code ou lien de paiement sécurisé, sans compétence technique.",
    color: "#00E6A5",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    span: "lg:col-span-4",
    badge: "Sans commission"
  },
  {
    icon: BarChart3,
    tag: "Intelligence Financière",
    title: "CRM & Analyse des Ventes",
    description: "Visualisez en temps réel l'évolution de vos revenus, vos dépenses mensuelles et la fidélité de vos clients dans un tableau de bord intuitif.",
    color: "#FFB800",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    span: "lg:col-span-4",
    badge: "Temps réel"
  },
  {
    icon: ShieldCheck,
    tag: "Sécurité Maximale",
    title: "Protection Bancaire & Chiffrement Militaire",
    description: "Vos fonds et données sont verrouillés par un chiffrement AES-256 de grade militaire, une authentification forte à 2 facteurs et un KYC automatisé.",
    color: "#10B981",
    gradient: "from-emerald-500/20 via-cyan-500/10 to-transparent",
    span: "lg:col-span-12",
    badge: "Certifié PCI-DSS"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Écosystème</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight">
            Tout votre univers financier dans{" "}
            <span className="text-gradient-primary">une seule Super-App</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Fini la fragmentation. Jynkopay combine banque digitale, cartes virtuelles, marketing social et outils commerçants.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative rounded-3xl bg-card/90 backdrop-blur-xl border border-border/80 p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden ${feature.span}`}
              >
                {/* Subtle Hover Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  {/* Top pill & icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-13 h-13 rounded-2xl flex items-center justify-center p-3.5 shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{ 
                        backgroundColor: `${feature.color}18`, 
                        color: feature.color,
                        border: `1px solid ${feature.color}35`
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span 
                      className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                      style={{ 
                        backgroundColor: `${feature.color}15`, 
                        color: feature.color,
                        border: `1px solid ${feature.color}30`
                      }}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Feature Title & Category */}
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    {feature.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors duration-200 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom link */}
                <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Découvrir le service</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
