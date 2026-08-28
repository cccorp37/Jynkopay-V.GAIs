import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
        
        {/* Grand Finale Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 text-center border border-primary/30 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(4, 7, 17, 0.95) 0%, rgba(10, 18, 44, 0.98) 100%)",
          }}
        >
          {/* Ambient Inner Lighting */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inscription Gratuite & Instantanée</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-6">
            Prêt à transformer votre gestion financière et votre{" "}
            <span className="text-gradient-primary">visibilité digitale ?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Rejoignez plus de 50 000 particuliers, entrepreneurs et créateurs qui font confiance à Jynkopay au quotidien.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto h-14 px-8 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <Link to="/signup" className="flex items-center justify-center gap-2.5">
                <span>Ouvrir un compte gratuitement</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto h-14 px-7 rounded-2xl border-white/20 bg-white/5 backdrop-blur-xl text-white font-semibold text-base hover:bg-white/10"
            >
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>

          {/* Highlights beneath */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Chiffrement bancaire 256-bit</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Création de compte en 2 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>Compatible Wave, OM & Cartes</span>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
