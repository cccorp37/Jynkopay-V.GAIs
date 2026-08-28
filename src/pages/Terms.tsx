import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Users, CreditCard, AlertTriangle, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
const logoJynkopay = "/images/logo-jynkopay.jpg";

const Terms = () => {
  const sections = [
    {
      id: "introduction",
      icon: FileText,
      title: "1. Introduction et Objet",
      content: `Les présentes Conditions Générales d'Utilisation (ci-après "CGU") régissent l'utilisation de la plateforme Jynkopay (ci-après "la Plateforme"), accessible via l'application mobile et le site web.

Jynkopay est une plateforme fintech proposant des services de portefeuille électronique, de transfert d'argent, de cartes virtuelles et d'outils marketing.

En créant un compte sur Jynkopay, vous acceptez sans réserve les présentes CGU.`
    },
    {
      id: "services",
      icon: CreditCard,
      title: "2. Services Proposés",
      content: `Jynkopay propose les services suivants :

• **Portefeuille électronique** : Création et gestion d'un portefeuille permettant de stocker, envoyer et recevoir de l'argent.

• **Transferts d'argent** : Envoi et réception d'argent via Mobile Money (Orange Money, Wave, MTN MoMo).

• **Cartes virtuelles** : Création de cartes bancaires virtuelles pour les paiements en ligne.

• **Services Marketing** : Outils de SMS et Email Marketing pour les professionnels.

Certains services peuvent être soumis à des frais indiqués dans notre grille tarifaire.`
    },
    {
      id: "account",
      icon: Users,
      title: "3. Création de Compte et Éligibilité",
      content: `Pour utiliser Jynkopay, vous devez :

• Être âgé(e) d'au moins 18 ans ou avoir l'âge légal de la majorité dans votre pays de résidence.

• Fournir des informations exactes, complètes et à jour lors de l'inscription.

• Maintenir la confidentialité de vos identifiants de connexion.

• Compléter la vérification d'identité (KYC) pour accéder à l'ensemble des fonctionnalités.

Un seul compte par personne est autorisé. Jynkopay se réserve le droit de refuser ou suspendre tout compte en cas de non-respect des présentes CGU.`
    },
    {
      id: "kyc",
      icon: Shield,
      title: "4. Vérification d'Identité (KYC)",
      content: `Conformément aux réglementations en vigueur sur la lutte contre le blanchiment d'argent (LCB-FT), Jynkopay procède à une vérification de l'identité de ses utilisateurs.

**Documents requis :**
• Pièce d'identité valide (CNI, passeport ou titre de séjour)
• Selfie de vérification avec le document

**Niveaux de vérification :**
• Niveau 1 (Basique) : Limite de 100 000 XOF/jour
• Niveau 2 (Standard) : Limite de 1 000 000 XOF/jour
• Niveau 3 (Premium) : Transactions illimitées

Vos documents sont traités de manière sécurisée et confidentielle conformément à notre Politique de Confidentialité.`
    },
    {
      id: "data",
      icon: Shield,
      title: "5. Protection des Données Personnelles",
      content: `Jynkopay s'engage à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois locales applicables.

**Données collectées :**
• Informations d'identité (nom, prénom, date de naissance)
• Coordonnées (email, téléphone, adresse)
• Documents d'identité pour la vérification KYC
• Données de transaction

**Utilisation des données :**
• Fourniture et amélioration des services
• Vérification d'identité et conformité réglementaire
• Communication relative à votre compte
• Prévention de la fraude

Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Consultez notre Politique de Confidentialité pour plus de détails.`
    },
    {
      id: "obligations",
      icon: AlertTriangle,
      title: "6. Obligations et Responsabilités",
      content: `**Vos obligations :**
• Utiliser la Plateforme de manière légale et conforme aux présentes CGU
• Ne pas utiliser la Plateforme à des fins frauduleuses ou illicites
• Signaler immédiatement toute activité suspecte ou non autorisée
• Maintenir vos informations à jour

**Activités interdites :**
• Blanchiment d'argent ou financement du terrorisme
• Fraude, escroquerie ou usurpation d'identité
• Utilisation de la Plateforme pour des activités illégales
• Tentative de contournement des mesures de sécurité

Jynkopay se réserve le droit de suspendre ou clôturer tout compte en cas de violation.`
    },
    {
      id: "liability",
      icon: Scale,
      title: "7. Limitation de Responsabilité",
      content: `Jynkopay s'efforce d'assurer la disponibilité et la sécurité de la Plateforme, mais ne peut garantir un fonctionnement ininterrompu.

Jynkopay ne saurait être tenu responsable :
• Des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme
• Des pertes liées à un accès non autorisé à votre compte
• Des erreurs ou interruptions causées par des tiers

La responsabilité de Jynkopay est limitée au montant des frais payés par l'utilisateur au cours des 12 derniers mois.`
    },
    {
      id: "modification",
      icon: FileText,
      title: "8. Modification des CGU",
      content: `Jynkopay se réserve le droit de modifier les présentes CGU à tout moment.

Les utilisateurs seront informés de toute modification substantielle par email ou notification in-app.

La poursuite de l'utilisation de la Plateforme après modification vaut acceptation des nouvelles CGU.`
    },
    {
      id: "contact",
      icon: Users,
      title: "9. Contact et Réclamations",
      content: `Pour toute question ou réclamation concernant nos services ou les présentes CGU, vous pouvez nous contacter :

• **Email** : support@jynkopay.com
• **Téléphone** : +221 77 XXX XX XX

Nous nous engageons à traiter votre demande dans un délai de 48 heures ouvrées.

**Date de dernière mise à jour** : 26 janvier 2026`
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
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(108,63,245,0.1)] border border-[rgba(108,63,245,0.2)] mb-6">
            <Scale className="text-[#6C3FF5]" size={18} />
            <span className="text-sm text-[#6C3FF5]">Document légal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            Veuillez lire attentivement ces conditions avant d'utiliser Jynkopay
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
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(108,63,245,0.1)] transition-colors text-[#9CA3AF] hover:text-white"
              >
                <section.icon size={16} className="text-[#6C3FF5]" />
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center">
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
                      .replace(/•/g, '<span class="text-[#6C3FF5]">•</span>')
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

export default Terms;
