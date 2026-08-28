import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "Services", href: "#features" },
  { name: "Social Boost", href: "#social-boost" },
  { name: "Cartes Virtuelles", href: "#cards" },
  { name: "Tarifs", href: "#pricing" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-background/80 backdrop-blur-2xl border-b border-border/60 shadow-lg shadow-black/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-blue-600 opacity-60 blur group-hover:opacity-100 transition duration-500" />
              <img
                src="/images/jynkopay-icon.jpg"
                alt="Jynkopay Logo"
                className="relative w-10 h-10 rounded-xl object-cover ring-2 ring-background shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-extrabold tracking-tight">
                <span className="text-foreground">Jynko</span>
                <span className="text-gradient-primary">pay</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase -mt-1">
                Next-Gen Fintech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card/60 backdrop-blur-xl border border-border/60 shadow-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions & Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary font-medium hover:bg-secondary/80 rounded-xl px-4"
            >
              <Link to="/login">Connexion</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="relative group overflow-hidden gradient-primary text-black font-semibold rounded-xl px-5 shadow-glow-cyan hover:opacity-95 transition-all duration-300"
            >
              <Link to="/signup" className="flex items-center gap-2">
                <span>Ouvrir un compte</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger & Theme toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden mt-4 pt-4 border-t border-border/60 bg-card/95 backdrop-blur-2xl rounded-2xl p-4 shadow-xl border"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/80 rounded-xl transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-3 border-t border-border flex flex-col gap-2.5 mt-2">
                  <Button variant="outline" asChild className="w-full rounded-xl py-5">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Connexion
                    </Link>
                  </Button>
                  <Button asChild className="w-full gradient-primary text-black font-semibold rounded-xl py-5 shadow-glow-cyan">
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      Créer un compte gratuit
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
