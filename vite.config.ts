import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: "all",
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "images/jynkopay-icon.jpg", "robots.txt"],
      manifest: {
        name: "Jynkopay - Fintech Africaine",
        short_name: "Jynkopay",
        description: "Wallet digital, cartes virtuelles, e-commerce et outils marketing réunis dans une plateforme unique.",
        theme_color: "#00D2FF",
        background_color: "#0A0E27",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        id: "/",
        lang: "fr",
        dir: "ltr",
        icons: [
          { src: "/images/jynkopay-icon.jpg", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/images/jynkopay-icon.jpg", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/images/jynkopay-icon.jpg", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/images/jynkopay-icon.jpg", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        categories: ["finance", "business", "productivity"],
        prefer_related_applications: false,
        shortcuts: [
          { name: "Wallet", short_name: "Wallet", description: "Accéder au wallet", url: "/dashboard/wallet", icons: [{ src: "/images/jynkopay-icon.jpg", sizes: "192x192" }] },
          { name: "Cartes", short_name: "Cartes", description: "Gérer les cartes virtuelles", url: "/dashboard/cards", icons: [{ src: "/images/jynkopay-icon.jpg", sizes: "192x192" }] },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "gstatic-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }, cacheableResponse: { statuses: [0, 200] } },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
