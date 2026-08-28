import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

const logoJynkopay = "/images/jynkopay-icon.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithGoogle, loginWithApple } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Connexion réussie !",
        description: "Ravi de vous revoir sur Jynkopay",
      });
      navigate("/dashboard");
    } catch (error: unknown) {
      let message = "Identifiants incorrects";
      const err = error as Error | undefined;
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("user-not-found") || msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        message = "Email ou mot de passe incorrect";
      } else if (msg.includes("too-many-requests")) {
        message = "Trop de tentatives. Veuillez patienter quelques minutes";
      }
      toast({
        title: "Erreur de connexion",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter avec Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased">
      {/* Top right quick utilities */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>

      {/* Left Column: Atmospheric Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-card items-center justify-center p-12 overflow-hidden border-r border-border/80">
        {/* Glow ambient background */}
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
              L'écosystème financier nouvelle génération.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Cartes virtuelles Visa sans limites, recharges instantanées par Mobile Money et Social Boost pour propulser votre entreprise.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/60">
            {[
              "Cartes Visa 3D Secure instantanées",
              "Dépôts & Retraits Wave & Orange Money",
              "Social Boost TikTok, Instagram & Google Avis",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Clean Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <img src={logoJynkopay} alt="Jynkopay" className="w-10 h-10 rounded-xl" />
              <span className="text-2xl font-display font-black">
                <span className="text-foreground">Jynko</span>
                <span className="text-gradient-primary">pay</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground tracking-tight">
              Connexion à votre espace
            </h1>
            <p className="text-sm text-muted-foreground">
              Accédez à vos portefeuilles et gérez vos cartes en toute sérénité.
            </p>
          </div>

          {/* Social Auth */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-2xl bg-card border border-border/80 hover:bg-secondary flex items-center justify-center gap-3 font-semibold text-sm transition-all text-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuer avec Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/80 w-full" />
            <span className="bg-background px-3 text-xs font-semibold text-muted-foreground uppercase">
              ou avec votre email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Adresse Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="h-12 pl-11 rounded-2xl bg-secondary/50 border-border text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-semibold">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-11 pr-11 rounded-2xl bg-secondary/50 border-border text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
            >
              {isLoading ? "Vérification..." : "Se connecter"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Vous n'avez pas encore de compte ?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
