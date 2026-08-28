import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Palette,
  Lock,
  Smartphone,
  Mail,
  Key,
  ChevronRight,
  Check,
  Camera,
  Save,
  LogOut,
  Trash2,
  ExternalLink,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Settings = () => {
  const { user, userProfile, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Paramètres sauvegardés", description: "Vos modifications ont été enregistrées" });
    setIsLoading(false);
  };

  const displayName = userProfile?.displayName || user?.displayName || "Utilisateur";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-white">Paramètres</h1>
          <p className="text-[#9CA3AF]">Gérez votre compte et vos préférences</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-[rgba(21,25,50,0.5)] p-1 h-auto flex-wrap">
              <TabsTrigger value="profile" className="data-[state=active]:bg-[#6C3FF5] px-4 py-2">
                <User size={16} className="mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#6C3FF5] px-4 py-2">
                <Shield size={16} className="mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#6C3FF5] px-4 py-2">
                <Bell size={16} className="mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-[#6C3FF5] px-4 py-2">
                <CreditCard size={16} className="mr-2" />
                Facturation
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Informations personnelles</h3>
                
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center text-white text-2xl font-bold">
                      {initials}
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#6C3FF5] flex items-center justify-center text-white shadow-lg hover:bg-[#5B2FE5] transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-white">{displayName}</p>
                    <p className="text-sm text-[#9CA3AF]">{user?.email}</p>
                    <p className="text-xs text-[#6C3FF5] capitalize mt-1">{userProfile?.accountType || "Particulier"}</p>
                  </div>
                </div>
                
                {/* Form */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Prénom</label>
                    <Input 
                      defaultValue={userProfile?.firstName || ""} 
                      className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Nom</label>
                    <Input 
                      defaultValue={userProfile?.lastName || ""} 
                      className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Email</label>
                    <Input 
                      defaultValue={user?.email || ""} 
                      disabled
                      className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)] opacity-60" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Téléphone</label>
                    <Input 
                      defaultValue={userProfile?.phone || ""} 
                      className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save size={16} className="mr-2" />
                    {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </div>
              </div>
              
              {/* Preferences */}
              <div className="rounded-2xl glass border border-border/50 p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-6">{t("settings.preferences")}</h3>
                
                <div className="space-y-4">
                  {/* Language Selector */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Globe className="text-primary" size={20} />
                      <div>
                        <p className="font-medium text-foreground">{t("settings.language")}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "fr" ? "Français" : "English"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={language === "fr" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setLanguage("fr")}
                        className="gap-2"
                      >
                        🇫🇷 FR
                      </Button>
                      <Button
                        variant={language === "en" ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setLanguage("en")}
                        className="gap-2"
                      >
                        🇬🇧 EN
                      </Button>
                    </div>
                  </div>
                  
                  {/* Currency */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-cyan-500" size={20} />
                      <div>
                        <p className="font-medium text-foreground">{t("settings.currency")}</p>
                        <p className="text-sm text-muted-foreground">XOF (Franc CFA)</p>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                  
                  {/* Theme Selector */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Palette className="text-gold" size={20} />
                      <div>
                        <p className="font-medium text-foreground">{t("settings.theme")}</p>
                        <p className="text-sm text-muted-foreground">
                          {theme === "light" ? t("settings.lightMode") : theme === "dark" ? t("settings.darkMode") : t("settings.systemMode")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "secondary"}
                        size="icon"
                        onClick={() => setTheme("light")}
                        className="h-9 w-9"
                      >
                        <Sun size={16} />
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "secondary"}
                        size="icon"
                        onClick={() => setTheme("dark")}
                        className="h-9 w-9"
                      >
                        <Moon size={16} />
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "secondary"}
                        size="icon"
                        onClick={() => setTheme("system")}
                        className="h-9 w-9"
                      >
                        <Monitor size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Mot de passe</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Mot de passe actuel</label>
                    <Input type="password" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Nouveau mot de passe</label>
                    <Input type="password" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#D1D5DB] mb-2 block">Confirmer le mot de passe</label>
                    <Input type="password" className="h-11 bg-[rgba(21,25,50,0.8)] border-[rgba(45,51,82,0.5)]" />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button>
                    <Lock size={16} className="mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              </div>
              
              {/* 2FA */}
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Authentification à deux facteurs</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-[#6C3FF5]" size={20} />
                      <div>
                        <p className="font-medium text-white">SMS</p>
                        <p className="text-sm text-[#6B7280]">Recevoir un code par SMS</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <div className="flex items-center gap-3">
                      <Mail className="text-[#00E5FF]" size={20} />
                      <div>
                        <p className="font-medium text-white">Email</p>
                        <p className="text-sm text-[#6B7280]">Recevoir un code par email</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                    <div className="flex items-center gap-3">
                      <Key className="text-[#FFB84D]" size={20} />
                      <div>
                        <p className="font-medium text-white">Application Authenticator</p>
                        <p className="text-sm text-[#6B7280]">Google Authenticator, Authy...</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
              
              {/* Sessions */}
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Sessions actives</h3>
                
                <div className="space-y-3">
                  {[
                    { device: "Chrome sur MacOS", location: "Dakar, Sénégal", current: true, time: "Maintenant" },
                    { device: "Safari sur iPhone", location: "Dakar, Sénégal", current: false, time: "Il y a 2h" },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{session.device}</p>
                          {session.current && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-[rgba(0,200,150,0.1)] text-[#00C896]">
                              Session actuelle
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6B7280]">{session.location} • {session.time}</p>
                      </div>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="text-[#FF4757]">
                          Déconnecter
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <Button variant="secondary" className="w-full mt-4 text-[#FF4757]">
                  <LogOut size={16} className="mr-2" />
                  Déconnecter toutes les sessions
                </Button>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Notifications par email</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Transactions", description: "Recevoir un email pour chaque transaction", enabled: true },
                    { title: "Sécurité", description: "Alertes de connexion et activité suspecte", enabled: true },
                    { title: "Marketing", description: "Offres et promotions Jynkopay", enabled: false },
                    { title: "Newsletter", description: "Actualités et conseils hebdomadaires", enabled: false },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                      <div>
                        <p className="font-medium text-white">{notif.title}</p>
                        <p className="text-sm text-[#6B7280]">{notif.description}</p>
                      </div>
                      <Switch defaultChecked={notif.enabled} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Notifications push</h3>
                
                <div className="space-y-4">
                  {[
                    { title: "Toutes les transactions", description: "Notification instantanée", enabled: true },
                    { title: "Mouvements importants", description: "> 100 000 XOF", enabled: true },
                    { title: "Rappels", description: "Paiements et renouvellements", enabled: true },
                  ].map((notif, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[rgba(21,25,50,0.5)]">
                      <div>
                        <p className="font-medium text-white">{notif.title}</p>
                        <p className="text-sm text-[#6B7280]">{notif.description}</p>
                      </div>
                      <Switch defaultChecked={notif.enabled} />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-display font-bold text-white">Abonnement actuel</h3>
                  <span className="px-3 py-1 rounded-lg bg-[rgba(108,63,245,0.1)] text-[#6C3FF5] font-medium">
                    {userProfile?.accountType === "entreprise" ? "Business" : "Gratuit"}
                  </span>
                </div>
                
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#6C3FF5] to-[#5B2FE5]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Plan actuel</p>
                      <p className="text-white text-2xl font-bold">Gratuit</p>
                    </div>
                    <Button variant="gold">
                      Passer Pro
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl glass border border-[rgba(45,51,82,0.5)] p-6">
                <h3 className="text-lg font-display font-bold text-white mb-6">Historique de facturation</h3>
                
                <div className="text-center py-8">
                  <CreditCard className="mx-auto mb-4 text-[#6B7280]" size={48} />
                  <p className="text-[#9CA3AF]">Aucune facture pour le moment</p>
                </div>
              </div>
              
              {/* Danger Zone */}
              <div className="rounded-2xl border border-[rgba(255,71,87,0.3)] bg-[rgba(255,71,87,0.05)] p-6">
                <h3 className="text-lg font-display font-bold text-[#FF4757] mb-4">Zone de danger</h3>
                <p className="text-sm text-[#9CA3AF] mb-4">
                  Actions irréversibles. Procédez avec prudence.
                </p>
                
                <div className="flex gap-3">
                  <Button variant="secondary" className="text-[#FF4757] border-[rgba(255,71,87,0.3)]">
                    <Trash2 size={16} className="mr-2" />
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
