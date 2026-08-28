import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
const logoJynkopay = "/images/logo-jynkopay.jpg";

const Privacy = () => {
  const sections = [
    {
      id: "collecte",
      icon: Database,
      title: "1. Collecte des Données",
      content: `Jynkopay collecte les données personnelles suivantes lors de l'utilisation de nos services :

**Données d'identification :**
• Nom et prénom
• Date de naissance
• Adresse email
• Numéro de téléphone
• Documents d'identité (CNI, passeport)

**Données de transaction :**
• Historique des transactions
• Montants et destinataires des transferts
• Méthodes de paiement utilisées

**Données techniques :**
• Adresse IP
• Type d'appareil et navigateur
• Données de géolocalisation (avec votre consentement)`
    },
    {
      id: "utilisation",
      icon: Eye,
      title: "2. Utilisation des Données",
      content: `Vos données personnelles sont utilisées pour :

**Fourniture des services :**
• Création et gestion de votre compte
• Exécution des transactions financières
• Émission des cartes virtuelles

**Conformité réglementaire :**
• Vérification d'identité (KYC/AML)
• Lutte contre le blanchiment d'argent
• Réponse aux demandes des autorités compétentes

**Amélioration des services :**
• Analyse et amélioration de l'expérience utilisateur
• Développement de nouvelles fonctionnalités
• Support client personnalisé

**Communication :**
• Notifications relatives à votre compte
• Informations sur les mises à jour des services
• Communications marketing (avec votre consentement)`
    },
    {
      id: "partage",
      icon: Globe,
      title: "3. Partage des Données",
      content: `Jynkopay peut partager vos données avec :

**Partenaires de paiement :**
• Opérateurs Mobile Money (Orange Money, Wave, MTN MoMo)
• Fournisseurs de cartes bancaires
• Institutions financières partenaires

**Prestataires de services :**
• Hébergeurs cloud sécurisés
• Fournisseurs de services d'envoi d'emails
• Services de vérification d'identité

**Autorités légales :**
• En réponse à une demande légale
• Pour prévenir la fraude ou activités illicites
• Pour protéger nos droits et ceux de nos utilisateurs

Nous ne vendons jamais vos données personnelles à des tiers à des fins commerciales.`
    },
    {
      id: "securite",
      icon: Lock,
      title: "4. Sécurité des Données",
      content: `Jynkopay met en œuvre des mesures de sécurité robustes :

**Protection technique :**
• Chiffrement SSL/TLS pour toutes les communications
• Chiffrement AES-256 pour les données stockées
• Authentification à deux facteurs (2FA)

**Protection organisationnelle :**
• Accès restreint aux données sensibles
• Formation régulière du personnel à la sécurité
• Audits de sécurité périodiques

**Stockage sécurisé :**
• Hébergement sur des serveurs certifiés
• Sauvegardes régulières et chiffrées
• Centres de données conformes aux normes ISO 27001

En cas de violation de données, nous vous informerons dans les 72 heures conformément au RGPD.`
    },
    {
      id: "droits",
      icon: UserCheck,
      title: "5. Vos Droits",
      content: `Conformément au RGPD et aux lois applicables, vous disposez des droits suivants :

**Droit d'accès :**
Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.

**Droit de rectification :**
Vous pouvez demander la correction des données inexactes ou incomplètes.

**Droit à l'effacement :**
Vous pouvez demander la suppression de vos données, sous réserve de nos obligations légales de conservation.

**Droit à la portabilité :**
Vous pouvez demander le transfert de vos données vers un autre prestataire.

**Droit d'opposition :**
Vous pouvez vous opposer au traitement de vos données à des fins marketing.

Pour exercer ces droits, contactez-nous à : privacy@jynkopay.com`
    },
    {
      id: "cookies",
      icon: Database,
      title: "6. Cookies et Technologies Similaires",
      content: `Jynkopay utilise des cookies pour :

**Cookies essentiels :**
• Maintien de votre session
• Sécurité et prévention de la fraude
• Fonctionnement de base de la plateforme

**Cookies analytiques :**
• Analyse de l'utilisation du service
• Amélioration de l'expérience utilisateur
• Statistiques anonymisées

**Cookies de préférences :**
• Mémorisation de vos paramètres
• Personnalisation de l'interface

Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.`
    },
    {
      id: "conservation",
      icon: Shield,
      title: "7. Durée de Conservation",
      content: `Vos données sont conservées :

**Données de compte :**
• Pendant la durée de votre utilisation du service
• 5 ans après la clôture du compte (obligation légale)

**Documents KYC :**
• 5 ans après la fin de la relation commerciale
• Conformément aux réglementations LCB-FT

**Données de transaction :**
• 10 ans (obligation comptable et fiscale)

**Données marketing :**
• 3 ans après le dernier contact

À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière irréversible.`
    },
    {
      id: "contact",
      icon: Globe,
      title: "8. Contact et Réclamations",
      content: `Pour toute question relative à la protection de vos données :

**Délégué à la Protection des Données (DPO) :**
• Email : privacy@jynkopay.com
• Adresse : [Adresse de Jynkopay]

**Autorité de contrôle :**
Vous avez le droit de déposer une réclamation auprès de la Commission de Protection des Données Personnelles (CDP) de votre pays de résidence.

**Date de dernière mise à jour :** 26 janvier 2026`
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0E27]/90 backdrop-blur-xl border-b border-[rgba(45,51,82,0.5)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoJynkopay} alt="Jynkopay" className="w-10 h-10 object-contain" />
            <span className="text-xl font-display font-bold">
              <span className="text-white">Jynko</span>
              <span className="text-gradient-primary">Pay</span>
            </span>
          </Link>
          <Link to="/signup">
            <Button variant="ghost" size="sm" className="text-[#9CA3AF] hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Retour
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(0,200,150,0.1)] border border-[rgba(0,200,150,0.2)] mb-6">
            <Lock className="text-[#00C896]" size={18} />
            <span className="text-sm text-[#00C896]">Vie privée</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            Comment nous protégeons et utilisons vos données personnelles
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-[rgba(45,51,82,0.5)] mb-8"
        >
          <h2 className="text-lg font-display font-bold mb-4">Sommaire</h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(0,200,150,0.1)] transition-colors text-[#9CA3AF] hover:text-white"
              >
                <section.icon size={16} className="text-[#00C896]" />
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </nav>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass rounded-2xl p-6 md:p-8 border border-[rgba(45,51,82,0.5)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C896] to-[#00E5FF] flex items-center justify-center">
                  <section.icon className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-display font-bold">{section.title}</h2>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <div 
                  className="text-[#D1D5DB] leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: section.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                      .replace(/•/g, '<span class="text-[#00C896]">•</span>')
                  }}
                />
              </div>
            </motion.section>
          ))}
        </div>

        {/* Back to Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link to="/signup">
            <Button variant="gold" size="lg">
              <ArrowLeft size={18} className="mr-2" />
              Retour à l'inscription
            </Button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
