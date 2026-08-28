import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LanguageSelectorProps {
  variant?: "icon" | "full";
  className?: string;
}

const languages = [
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
];

export const LanguageSelector = ({ variant = "icon", className = "" }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "default"}
          className={`relative ${className}`}
        >
          <motion.span
            key={language}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-lg"
          >
            {currentLang.flag}
          </motion.span>
          {variant === "full" && (
            <span className="ml-2">{currentLang.label}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-border/50 min-w-[140px]">
        {languages.map(({ code, label, flag }) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === code ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <span className="text-lg">{flag}</span>
            <span>{label}</span>
            {language === code && (
              <motion.div
                layoutId="langCheck"
                className="ml-auto w-2 h-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
