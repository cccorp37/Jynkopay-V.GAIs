import { useState, useEffect } from "react";
import { ShieldCheck, Users, Ticket, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ users: 0, tickets: 0, revenue: 0 });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (user?.email !== "cccorp37@gmail.com") return;
      
      const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact" });
      const { data: ticketsData } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
      
      setStats({
        users: usersCount || 0,
        tickets: ticketsData?.length || 0,
        revenue: 0
      });
      setTickets((ticketsData || []) as SupportTicket[]);
    };
    fetchAdminData();
  }, [user]);

  if (user?.email !== "cccorp37@gmail.com") {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-destructive">
          <p className="text-lg font-bold">Accès refusé</p>
          <p className="text-sm text-muted-foreground mt-1">Cet espace est strictement réservé à la direction générale.</p>
        </div>
      </DashboardLayout>
    );
  }

  const resolveTicket = async (id: string) => {
    const { error } = await supabase.from("support_tickets").update({ status: "resolved" }).eq("id", id);
    if (!error) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status: "resolved" } : t));
      toast({ title: "Ticket résolu", description: "Le ticket est marqué comme traité." });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Admin Header */}
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-red-500/15 text-red-500 rounded-2xl border border-red-500/30">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-foreground">
              Console Super-Administrateur
            </h1>
            <p className="text-sm text-muted-foreground">
              Supervision globale des utilisateurs, commandes et tickets de support
            </p>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Inscrits</span>
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <Users size={20} />
              </div>
            </div>
            <p className="text-3xl font-mono-numbers font-black text-foreground">{stats.users}</p>
          </div>

          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tickets en Attente</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Ticket size={20} />
              </div>
            </div>
            <p className="text-3xl font-mono-numbers font-black text-foreground">
              {tickets.filter(t => t.status === "open").length}
            </p>
          </div>

          <div className="rounded-3xl bg-card border border-border/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volume Plateforme</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
            </div>
            <p className="text-3xl font-mono-numbers font-black text-foreground">{stats.revenue} XOF</p>
          </div>
        </div>

        {/* Support Tickets Section */}
        <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-display text-foreground">
            Demandes d'assistance reçues
          </h2>

          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                Aucun ticket de support pour l'instant.
              </p>
            ) : (
              tickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className="p-5 rounded-2xl bg-secondary/40 border border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground">{ticket.name}</span>
                      <span className="text-xs text-muted-foreground">({ticket.email})</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        ticket.status === 'open' ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-500'
                      }`}>
                        {ticket.status === 'open' ? 'En attente' : 'Résolu'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{ticket.message}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Reçu le {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>

                  {ticket.status === 'open' && (
                    <Button
                      size="sm"
                      onClick={() => resolveTicket(ticket.id)}
                      className="rounded-xl text-xs gradient-primary text-black font-bold shrink-0"
                    >
                      Marquer comme résolu
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
