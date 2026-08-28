import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

export const ThemeToggle = ({ variant = "icon", className = "" }: ThemeToggleProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const themes = [
    { value: "light" as const, label: t("settings.lightMode"), icon: Sun },
    { value: "dark" as const, label: t("settings.darkMode"), icon: Moon },
    { value: "system" as const, label: t("settings.systemMode"), icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[1];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "default"}
          className={`relative ${className}`}
        >
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
          {variant === "full" && (
            <span className="ml-2">{currentTheme.label}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-border/50">
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === value ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {theme === value && (
              <motion.div
                layoutId="themeCheck"
                className="ml-auto w-2 h-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
