import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
const jynkopayIcon = "/images/jynkopay-icon.jpg";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem("pwa-prompt-dismissed");
      if (!dismissed) {
        // Show prompt after a delay
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      toast({
        title: t("pwa.installSuccess"),
        description: t("pwa.installSuccessDesc"),
      });
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("pwa-prompt-dismissed", "true");
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[380px] z-50"
        >
          <div className="glass rounded-2xl p-5 border border-primary/20 shadow-glow-primary-sm">
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <X size={18} className="text-muted-foreground" />
            </button>

            <div className="flex items-start gap-4">
              <motion.img
                src={jynkopayIcon}
                alt="Jynkopay"
                className="w-14 h-14 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
              />
              <div className="flex-1">
                <h3 className="font-display font-bold text-foreground mb-1">
                  {t("pwa.installTitle")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("pwa.installDescription")}
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleInstall} size="sm" className="flex-1">
                    <Download size={16} className="mr-2" />
                    {t("pwa.installButton")}
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    {t("pwa.notNow")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
