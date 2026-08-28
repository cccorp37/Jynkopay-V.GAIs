import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TermsModal } from "@/components/TermsModal";

const logoJynkopay = "/images/jynkopay-icon.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }

    if (formData.password.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, "particulier", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      
      toast({
        title: "Compte créé avec succès ! 🎉",
        description: "Bienvenue dans l'univers Jynkopay.",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      let message = "Impossible de créer le compte";
      const err = error as Error | undefined;
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("email-already-in-use")) {
        message = "Cet email est déjà utilisé par un autre compte";
      } else if (msg.includes("weak-password")) {
        message = "Mot de passe trop simple";
      }
      toast({ title: "Erreur d'inscription", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      toast({ title: "Erreur", description: "Impossible de continuer avec Google", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      {/* Left Column: Branding Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-card items-center justify-center p-12 overflow-hidden border-r border-border/80">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-lg space-y-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-primary/40 blur group-hover:bg-primary transition-all duration-300" />
              <img
                src={logoJynkopay}
                alt="Jynkopay"
                className="relative w-12 h-12 rounded-2xl object-contain ring-1 ring-border shadow-lg"
              />
            </div>
            <span className="text-3xl font-display font-black tracking-tight">
              <span className="text-foreground">Jynko</span>
              <span className="text-gradient-primary">pay</span>
            </span>
          </Link>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-foreground tracking-tight leading-tight">
              Prenez une longueur d'avance dès aujourd'hui.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ouvrez votre compte en 2 minutes sans frais d'ouverture et recevez immédiatement votre carte virtuelle.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/60">
            {[
              "Création de compte gratuite & sans engagement",
              "Sécurité bancaire de niveau mondial",
              "Recharge instantanée par Mobile Money",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <img src={logoJynkopay} alt="Jynkopay" className="w-10 h-10 rounded-xl" />
              <span className="text-2xl font-display font-black">
                <span className="text-foreground">Jynko</span>
                <span className="text-gradient-primary">pay</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Rejoignez plus de 50 000 entrepreneurs et créateurs en Afrique.
            </p>
          </div>

          {/* Social Signup */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full h-12 rounded-2xl bg-card border border-border/80 hover:bg-secondary flex items-center justify-center gap-3 font-semibold text-sm transition-all text-foreground"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>S'inscrire avec Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/80 w-full" />
            <span className="bg-background px-3 text-xs font-semibold text-muted-foreground uppercase">
              ou formulaire direct
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Prénom</label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jean"
                  className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Nom</label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Dupont"
                  className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jean.dupont@exemple.com"
                className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-muted-foreground">Téléphone (Optionnel)</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+225 07..."
                className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Mot de passe</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-muted-foreground">Confirmer</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-secondary/50 border-border text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
            >
              {isLoading ? "Création en cours..." : "Créer mon compte Jynkopay"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Se connecter
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
