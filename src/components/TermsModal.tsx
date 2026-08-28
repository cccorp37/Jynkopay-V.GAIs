import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Shield, 
  FileText, 
  Check, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  type: "signup" | "kyc";
}

export const TermsModal = ({ isOpen, onClose, onAccept, type }: TermsModalProps) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedKyc, setAcceptedKyc] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("terms");

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop > 100) {
      setHasScrolled(true);
    }
  };

  const canAccept = type === "kyc" 
    ? acceptedTerms && acceptedPrivacy && acceptedKyc
    : acceptedTerms && acceptedPrivacy;

  const handleAccept = () => {
    if (canAccept) {
      onAccept();
    }
  };

  const termsContent = `
En utilisant Jynkopay, vous acceptez les conditions suivantes :

1. SERVICES PROPOSÉS
Jynkopay propose des services de portefeuille électronique, transfert d'argent, cartes virtuelles et outils marketing.

2. ÉLIGIBILITÉ
Vous devez être âgé(e) d'au moins 18 ans et fournir des informations exactes lors de l'inscription.

3. UTILISATION RESPONSABLE
Vous vous engagez à ne pas utiliser la plateforme pour des activités frauduleuses, illicites ou contraires aux présentes conditions.

4. LIMITATION DE RESPONSABILITÉ
Jynkopay ne saurait être tenu responsable des dommages résultant de l'utilisation ou de l'impossibilité d'utiliser la plateforme.

5. MODIFICATION DES CONDITIONS
Jynkopay se réserve le droit de modifier ces conditions. Les utilisateurs seront informés des changements substantiels.
  `.trim();

  const privacyContent = `
COLLECTE ET UTILISATION DES DONNÉES

1. DONNÉES COLLECTÉES
• Informations d'identité (nom, email, téléphone)
• Documents de vérification (pièce d'identité, selfie)
• Historique des transactions

2. UTILISATION
• Fourniture et amélioration des services
• Vérification d'identité et conformité réglementaire
• Prévention de la fraude

3. PROTECTION
Vos données sont chiffrées et stockées de manière sécurisée conformément au RGPD.

4. VOS DROITS
Vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
  `.trim();

  const kycContent = `
CONSENTEMENT AU TRAITEMENT DES DOCUMENTS D'IDENTITÉ

1. DOCUMENTS REQUIS
• Pièce d'identité valide (CNI, passeport)
• Photo de type selfie pour vérification

2. FINALITÉ
Vos documents sont collectés uniquement pour la vérification de votre identité conformément aux réglementations anti-blanchiment (LCB-FT).

3. CONSERVATION
Vos documents sont conservés pendant 5 ans après la fin de la relation commerciale, conformément aux obligations légales.

4. SÉCURITÉ
Tous les documents sont chiffrés et stockés sur des serveurs sécurisés. Seul le personnel autorisé y a accès.
  `.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg glass rounded-2xl border border-[rgba(45,51,82,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(45,51,82,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3FF5] to-[#00E5FF] flex items-center justify-center">
                    {type === "kyc" ? (
                      <Shield className="text-white" size={20} />
                    ) : (
                      <FileText className="text-white" size={20} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-display font-bold text-white">
                      {type === "kyc" ? "Consentement KYC" : "Conditions d'utilisation"}
                    </h2>
                    <p className="text-xs text-[#9CA3AF]">
                      {type === "kyc" 
                        ? "Avant de soumettre vos documents" 
                        : "Avant de créer votre compte"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <X className="text-[#9CA3AF]" size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[40vh] sm:h-[50vh]" onScrollCapture={handleScroll}>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Terms Section */}
                <div className="border border-[rgba(45,51,82,0.5)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "terms" ? null : "terms")}
                    className="w-full p-4 flex items-center justify-between bg-[rgba(21,25,50,0.5)] hover:bg-[rgba(21,25,50,0.8)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-[#6C3FF5]" size={18} />
                      <span className="font-medium text-white">Conditions Générales d'Utilisation</span>
                    </div>
                    {expandedSection === "terms" ? (
                      <ChevronUp className="text-[#9CA3AF]" size={18} />
                    ) : (
                      <ChevronDown className="text-[#9CA3AF]" size={18} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "terms" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-[rgba(10,14,39,0.5)] text-sm text-[#D1D5DB] whitespace-pre-line">
                          {termsContent}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Privacy Section */}
                <div className="border border-[rgba(45,51,82,0.5)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "privacy" ? null : "privacy")}
                    className="w-full p-4 flex items-center justify-between bg-[rgba(21,25,50,0.5)] hover:bg-[rgba(21,25,50,0.8)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="text-[#00C896]" size={18} />
                      <span className="font-medium text-white">Politique de Confidentialité</span>
                    </div>
                    {expandedSection === "privacy" ? (
                      <ChevronUp className="text-[#9CA3AF]" size={18} />
                    ) : (
                      <ChevronDown className="text-[#9CA3AF]" size={18} />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "privacy" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-[rgba(10,14,39,0.5)] text-sm text-[#D1D5DB] whitespace-pre-line">
                          {privacyContent}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* KYC Consent Section (only for KYC type) */}
                {type === "kyc" && (
                  <div className="border border-[rgba(45,51,82,0.5)] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === "kyc" ? null : "kyc")}
                      className="w-full p-4 flex items-center justify-between bg-[rgba(21,25,50,0.5)] hover:bg-[rgba(21,25,50,0.8)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="text-[#FFB84D]" size={18} />
                        <span className="font-medium text-white">Consentement KYC</span>
                      </div>
                      {expandedSection === "kyc" ? (
                        <ChevronUp className="text-[#9CA3AF]" size={18} />
                      ) : (
                        <ChevronDown className="text-[#9CA3AF]" size={18} />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedSection === "kyc" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-[rgba(10,14,39,0.5)] text-sm text-[#D1D5DB] whitespace-pre-line">
                            {kycContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors">
                      J'ai lu et j'accepte les <strong className="text-[#6C3FF5]">Conditions Générales d'Utilisation</strong>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={acceptedPrivacy}
                      onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors">
                      J'ai lu et j'accepte la <strong className="text-[#00C896]">Politique de Confidentialité</strong>
                    </span>
                  </label>

                  {type === "kyc" && (
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <Checkbox
                        checked={acceptedKyc}
                        onCheckedChange={(checked) => setAcceptedKyc(checked === true)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-[#D1D5DB] group-hover:text-white transition-colors">
                        Je consens au <strong className="text-[#FFB84D]">traitement de mes documents d'identité</strong> pour la vérification KYC
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[rgba(45,51,82,0.5)] flex flex-col sm:flex-row gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                variant="gold"
                className="flex-1"
                disabled={!canAccept}
                onClick={handleAccept}
              >
                <Check size={18} className="mr-2" />
                Accepter et continuer
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
