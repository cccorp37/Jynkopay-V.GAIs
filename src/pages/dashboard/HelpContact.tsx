import { useState } from "react";
import { HelpCircle, Send, MessageSquare, ShieldCheck, Mail, Sparkles, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function HelpContact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("support_tickets").insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        status: "open"
      });
      if (error) throw error;
      toast({
        title: "Message transmis avec succès ✨",
        description: "Notre équipe d'assistance vous répondra par email dans les plus brefs délais."
      });
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-glow-cyan">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
            Centre d'Aide & Assistance
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Une question sur un transfert, une carte ou un boost ? Notre équipe de support dédiée vous répond sous 24h.
          </p>
        </div>

        {/* Contact Form Card */}
        <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-10 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Votre Nom Complet
              </label>
              <Input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Jean Dupont" 
                className="h-12 rounded-2xl bg-secondary/50 border-border text-sm" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Adresse Email de Contact
              </label>
              <Input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ex: jean.dupont@gmail.com" 
                className="h-12 rounded-2xl bg-secondary/50 border-border text-sm" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Détail de votre demande
              </label>
              <Textarea 
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Expliquez-nous votre problème ou votre question avec le maximum de détails..." 
                className="rounded-2xl bg-secondary/50 border-border text-sm min-h-[160px] resize-none p-4" 
                required 
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl gradient-primary text-black font-bold text-base shadow-glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {loading ? "Envoi du ticket..." : (
                <span className="flex items-center justify-center gap-2">
                  <span>Envoyer ma demande</span>
                  <Send size={18} />
                </span>
              )}
            </Button>
          </form>

          {/* Quick FAQ / Assurances */}
          <div className="pt-6 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-primary shrink-0" />
              <span>Temps de réponse moyen : <strong>&lt; 2 heures</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <span>Assistance prioritaire 7j/7</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
