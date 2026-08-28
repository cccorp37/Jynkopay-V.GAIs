import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
const logoJynkopay = "/images/jynkopay-icon.jpg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelector />
      </div>
      
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary rounded-full blur-[150px] opacity-20" />
      <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500 rounded-full blur-[150px] opacity-15" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <motion.img src={logoJynkopay} alt="Jynkopay" className="w-12 h-12 object-contain" whileHover={{ scale: 1.1, rotate: 5 }} />
            <span className="text-2xl font-display font-bold">
              <span className="text-white">Jynko</span>
              <span className="text-gradient-primary">Pay</span>
            </span>
          </Link>
        </div>

        <div className="glass rounded-3xl p-8 border border-[rgba(108,63,245,0.2)]">
          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(108,63,245,0.1)] border border-[rgba(108,63,245,0.2)] mb-6">
                  <Sparkles className="text-[#6C3FF5]" size={14} />
                  <span className="text-sm text-[#6C3FF5]">Récupération de compte</span>
                </motion.div>
                <h2 className="text-2xl font-display font-bold mb-2 text-white">Mot de passe oublié ?</h2>
                <p className="text-[#9CA3AF]">Entrez votre email pour recevoir un lien de réinitialisation</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#D1D5DB]">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#6C3FF5] transition-colors" size={20} />
                    <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-14 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] rounded-xl focus:border-[#6C3FF5] focus:ring-1 focus:ring-[#6C3FF5] text-white placeholder:text-[#6B7280]" required />
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" className="w-full h-14 text-base" size="lg" variant="default" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                        Envoi en cours...
                      </span>
                    ) : (
                      <>Envoyer le lien <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ArrowRight size={18} /></motion.span></>
                    )}
                  </Button>
                </motion.div>
              </form>
            </>
          ) : (
            <motion.div className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <motion.div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[rgba(0,200,150,0.15)] border border-[rgba(0,200,150,0.3)] flex items-center justify-center" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <CheckCircle className="text-[#00C896]" size={40} />
              </motion.div>
              <h2 className="text-2xl font-display font-bold mb-2 text-white">Email envoyé !</h2>
              <p className="text-[#9CA3AF] mb-6">
                Nous avons envoyé un lien de réinitialisation à{" "}
                <span className="text-[#6C3FF5] font-medium">{email}</span>
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="secondary" className="w-full h-14" onClick={() => setEmailSent(false)}>Renvoyer l'email</Button>
              </motion.div>
            </motion.div>
          )}
        </div>

        <motion.div whileHover={{ x: -5 }}>
          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-[#9CA3AF] hover:text-white transition-colors">
            <ArrowLeft size={18} />
            Retour à la connexion
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
