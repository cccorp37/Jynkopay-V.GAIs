import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <LanguageProvider>
      <App />
      <PWAInstallPrompt />
    </LanguageProvider>
  </ThemeProvider>
);
