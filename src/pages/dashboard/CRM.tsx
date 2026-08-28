import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Star,
  ChevronRight,
  UserPlus,
  Download,
  Upload,
  Edit,
  Trash2,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useCRM, Contact } from "@/hooks/useCRM";

const CRM = () => {
  const { toast } = useToast();
  const { contacts, isLoading } = useCRM();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  const filteredContacts = contacts.filter(c => 
    c.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const crmStats = useMemo(() => {
    const total = contacts.length;
    const active = contacts.filter(c => c.status === "active").length;
    const totalValue = contacts.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0);
    const avgValue = total > 0 ? Math.round(totalValue / total) : 0;
    
    return [
      { title: "Contacts totaux", value: total.toString(), change: "", icon: Users, color: "#00D2FF" },
      { title: "Clients actifs", value: active.toString(), change: "", icon: TrendingUp, color: "#00C896" },
      { title: "Valeur moyenne", value: new Intl.NumberFormat("fr-FR").format(avgValue), unit: "XOF", icon: DollarSign, color: "#FFB84D" },
      { title: "Nouveaux (30j)", value: "0", change: "", icon: UserPlus, color: "#00E5FF" },
    ];
  }, [contacts]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("fr-FR").format(amount || 0) + " " + currency;
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "vip": return { bg: "rgba(255,184,77,0.1)", text: "#FFB84D" };
      case "active": return { bg: "rgba(0,200,150,0.1)", text: "#00C896" };
      case "inactive": return { bg: "rgba(107,114,128,0.1)", text: "#6B7280" };
      default: return { bg: "rgba(107,114,128,0.1)", text: "#6B7280" };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">CRM</h1>
            <p className="text-[#9CA3AF]">Gérez vos contacts et relations clients</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Upload size={18} className="mr-2" />
              Importer
            </Button>
            <Button variant="secondary">
              <Download size={18} className="mr-2" />
              Exporter
            </Button>
            <Button onClick={() => setShowNewContactModal(true)}>
              <Plus size={18} className="mr-2" />
              Nouveau contact
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {crmStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl glass border border-[rgba(45,51,82,0.5)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon style={{ color: stat.color }} size={20} />
                </div>
                {stat.change && (
                  <span className="text-sm font-medium text-[#00C896] bg-[rgba(0,200,150,0.1)] px-2 py-0.5 rounded-lg">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#9CA3AF] mb-1">{stat.title}</p>
              <p className="text-2xl font-bold font-mono-numbers text-white">
                {stat.value} {stat.unit && <span className="text-sm text-[#6B7280]">{stat.unit}</span>}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contacts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl glass border border-[rgba(45,51,82,0.5)]"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-[rgba(45,51,82,0.5)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Users className="text-[#6C3FF5]" size={24} />
                <h3 className="text-lg font-display font-bold text-white">Contacts ({contacts.length})</h3>
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un contact..."
                    className="pl-10 w-64 h-10 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]"
                  />
                </div>
                <Button variant="secondary" size="sm">
                  <Filter size={16} className="mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </div>
          
          {/* Contacts List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(45,51,82,0.5)]">
                  <th className="text-left p-4 text-sm font-medium text-[#9CA3AF]">Contact</th>
                  <th className="text-left p-4 text-sm font-medium text-[#9CA3AF] hidden md:table-cell">Téléphone</th>
                  <th className="text-left p-4 text-sm font-medium text-[#9CA3AF] hidden lg:table-cell">Localisation</th>
                  <th className="text-left p-4 text-sm font-medium text-[#9CA3AF] hidden lg:table-cell">Tags</th>
                  <th className="text-right p-4 text-sm font-medium text-[#9CA3AF]">Valeur</th>
                  <th className="text-center p-4 text-sm font-medium text-[#9CA3AF]">Statut</th>
                  <th className="text-center p-4 text-sm font-medium text-[#9CA3AF]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => {
                  const statusStyle = getStatusColor(contact.status);
                  
                  return (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-[rgba(45,51,82,0.3)] hover:bg-[rgba(108,63,245,0.05)] cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedContact(contact);
                        setShowContactModal(true);
                      }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center text-white font-bold text-sm">
                            {contact.first_name[0]}{contact.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">{contact.first_name} {contact.last_name}</p>
                            <p className="text-sm text-[#6B7280]">{contact.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-[#D1D5DB]">{contact.phone}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1 text-[#9CA3AF]">
                          <MapPin size={14} />
                          <span>{contact.city}, {contact.country}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex gap-1 flex-wrap">
                          {contact.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag} 
                              className="px-2 py-0.5 rounded-full text-xs font-medium bg-[rgba(108,63,245,0.1)] text-[#6C3FF5]"
                            >
                              {tag}
                            </span>
                          ))}
                          {contact.tags.length > 2 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[rgba(107,114,128,0.1)] text-[#6B7280]">
                              +{contact.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-mono-numbers text-white">{formatAmount(contact.total_spent, contact.currency)}</p>
                        <p className="text-xs text-[#6B7280]">{contact.orders} commandes</p>
                      </td>
                      <td className="p-4 text-center">
                        <span 
                          className="px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {contact.status === "vip" && <Star size={12} />}
                          {contact.status === "vip" ? "VIP" : contact.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ title: "Email envoyé", description: `Email envoyé à ${contact.email}` });
                            }}
                            className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                          >
                            <Mail size={16} className="text-[#6B7280]" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                          >
                            <MessageSquare size={16} className="text-[#6B7280]" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors"
                          >
                            <MoreHorizontal size={16} className="text-[#6B7280]" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-4 gap-4"
        >
          {[
            { label: "Tous les contacts", count: 3245, color: "#6C3FF5" },
            { label: "Clients VIP", count: 156, color: "#FFB84D" },
            { label: "Actifs (30j)", count: 892, color: "#00C896" },
            { label: "À relancer", count: 234, color: "#FF4757" },
          ].map((segment, index) => (
            <motion.button
              key={segment.label}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl border border-[rgba(45,51,82,0.5)] bg-[rgba(21,25,50,0.5)] hover:border-[rgba(108,63,245,0.3)] transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#D1D5DB]">{segment.label}</span>
                <ChevronRight size={16} className="text-[#6B7280]" />
              </div>
              <p className="text-2xl font-bold font-mono-numbers text-white mt-2" style={{ color: segment.color }}>
                {segment.count}
              </p>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Contact Detail Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          {selectedContact && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center text-white font-bold">
                    {selectedContact.first_name[0]}{selectedContact.last_name[0]}
                  </div>
                  <div>
                    <p>{selectedContact.first_name} {selectedContact.last_name}</p>
                    {selectedContact.company && (
                      <p className="text-sm text-[#9CA3AF] font-normal">{selectedContact.company}</p>
                    )}
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <Mail size={18} className="text-[#6B7280]" />
                    <span className="text-[#D1D5DB]">{selectedContact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <Phone size={18} className="text-[#6B7280]" />
                    <span className="text-[#D1D5DB]">{selectedContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <MapPin size={18} className="text-[#6B7280]" />
                    <span className="text-[#D1D5DB]">{selectedContact.city}, {selectedContact.country}</span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.2)] text-center">
                    <p className="text-2xl font-bold font-mono-numbers text-[#00C896]">{selectedContact.orders}</p>
                    <p className="text-xs text-[#9CA3AF]">Commandes</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(108,63,245,0.1)] border border-[rgba(108,63,245,0.2)] text-center">
                    <p className="text-lg font-bold font-mono-numbers text-[#6C3FF5]">{formatAmount(selectedContact.total_spent, "").split(" ")[0]}</p>
                    <p className="text-xs text-[#9CA3AF]">Total dépensé</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[rgba(255,184,77,0.1)] border border-[rgba(255,184,77,0.2)] text-center">
                    <p className="text-lg font-bold font-mono-numbers text-[#FFB84D]">{Math.round(selectedContact.total_spent / selectedContact.orders).toLocaleString()}</p>
                    <p className="text-xs text-[#9CA3AF]">Panier moyen</p>
                  </div>
                </div>
                
                {/* Tags */}
                {selectedContact.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-[#9CA3AF] mb-2">Tags</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedContact.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(108,63,245,0.1)] text-[#6C3FF5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Mail size={18} className="mr-2" />
                    Envoyer un email
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <MessageSquare size={18} className="mr-2" />
                    SMS
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Contact Modal */}
      <Dialog open={showNewContactModal} onOpenChange={setShowNewContactModal}>
        <DialogContent className="sm:max-w-lg bg-[#151932] border-[rgba(45,51,82,0.5)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center">
                <UserPlus className="text-white" size={20} />
              </div>
              Nouveau contact
            </DialogTitle>
            <DialogDescription className="text-[#9CA3AF]">
              Ajoutez un nouveau contact à votre CRM
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Prénom</label>
                <Input placeholder="Marie" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Nom</label>
                <Input placeholder="Konaté" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Email</label>
              <Input placeholder="email@exemple.com" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Téléphone</label>
              <Input placeholder="+221 77 123 45 67" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Entreprise (optionnel)</label>
              <Input placeholder="Nom de l'entreprise" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
            </div>
            
            <Button 
              className="w-full h-12" 
              onClick={() => {
                toast({ title: "Contact créé", description: "Le contact a été ajouté avec succès" });
                setShowNewContactModal(false);
              }}
            >
              <Plus size={18} className="mr-2" />
              Créer le contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CRM;
