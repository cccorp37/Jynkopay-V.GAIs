import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const footerLinks = {
  product: {
    title: "Produit",
    links: [
      { name: "Wallet Digital", href: "#" },
      { name: "Cartes Virtuelles", href: "#" },
      { name: "E-commerce", href: "#" },
      { name: "Marketing", href: "#" },
      { name: "CRM", href: "#" },
      { name: "API", href: "#" },
    ],
  },
  company: {
    title: "Entreprise",
    links: [
      { name: "À propos", href: "#about" },
      { name: "Carrières", href: "#" },
      { name: "Partenaires", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Presse", href: "#" },
    ],
  },
  resources: {
    title: "Ressources",
    links: [
      { name: "Centre d'aide", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Tutoriels", href: "#" },
      { name: "Webinaires", href: "#" },
      { name: "Statut système", href: "#" },
    ],
  },
  legal: {
    title: "Légal",
    links: [
      { name: "Conditions d'utilisation", href: "#" },
      { name: "Politique de confidentialité", href: "#" },
      { name: "Politique cookies", href: "#" },
      { name: "Mentions légales", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container px-4 lg:px-8 py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/images/jynkopay-icon.jpg" 
                alt="Jynkopay Logo" 
                className="w-11 h-11 rounded-xl shadow-lg"
              />
              <span className="text-2xl font-display font-bold tracking-tight">
                <span className="text-foreground">Jynko</span>
                <span className="text-gradient-primary">Pay</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              La fintech tout-en-un qui propulse les entrepreneurs africains vers le succès digital.
            </p>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Jynkopay. Tous droits réservés.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
