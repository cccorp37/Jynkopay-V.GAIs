
# Plan d'implémentation - Icône, PWA, Thème et Internationalisation

## Contexte

L'utilisateur demande 4 modifications importantes pour l'application JYNKOPAY :
1. Intégrer la nouvelle icône fournie partout dans l'application
2. Rendre l'application responsive et PWA (installable depuis le navigateur)
3. Ajouter le mode clair/sombre avec un sélecteur dans les paramètres et les pages d'authentification
4. Implémenter le choix de langue (français/anglais)

---

## Partie 1 : Nouvelle icône JYNKOPAY

### Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `public/images/jynkopay-icon.png` | Copier la nouvelle icône |
| `src/assets/jynkopay-icon.png` | Copier pour les imports React |
| `index.html` | Mettre à jour les références |
| `vite.config.ts` | Mettre à jour le manifest PWA |
| `src/components/landing/Navbar.tsx` | Remplacer le logo |
| `src/components/landing/Footer.tsx` | Remplacer le logo |
| `src/components/dashboard/DashboardLayout.tsx` | Remplacer le logo |
| `src/pages/Login.tsx` | Remplacer le logo |
| `src/pages/Signup.tsx` | Remplacer le logo |
| `src/pages/ForgotPassword.tsx` | Remplacer le logo |

### Détails techniques

- Copier l'image uploadée vers `public/images/jynkopay-icon.png` et `src/assets/jynkopay-icon.png`
- Mettre à jour toutes les références d'image dans les composants
- Générer des versions de différentes tailles pour le PWA (192x192, 512x512)
- Mettre à jour le favicon, les icônes Apple Touch et les métadonnées Open Graph

---

## Partie 2 : PWA et Responsive

### État actuel

Le projet dispose déjà de :
- `vite-plugin-pwa` installé et configuré dans `vite.config.ts`
- Balises meta PWA dans `index.html`
- Configuration du manifest avec icônes et thème

### Améliorations à apporter

| Fichier | Modification |
|---------|-------------|
| `vite.config.ts` | Améliorer la configuration PWA avec les nouvelles icônes |
| `index.html` | Compléter les balises meta pour iOS et Android |
| `src/components/PWAInstallPrompt.tsx` | Créer un composant d'invitation à l'installation |

### Fonctionnalités PWA à améliorer

- Ajouter un bouton d'installation dans la navbar mobile
- Créer un prompt d'installation élégant
- S'assurer que le service worker est bien configuré
- Améliorer le cache offline

---

## Partie 3 : Thème Clair/Sombre

### Architecture

Le projet utilise déjà les variables CSS pour le thème sombre (`.dark`) défini dans `src/index.css`. Les variables pour le mode clair (`:root`) sont également présentes.

### Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `src/contexts/ThemeContext.tsx` | Créer le contexte de thème |
| `src/components/ThemeToggle.tsx` | Créer le sélecteur de thème |
| `src/main.tsx` | Intégrer le ThemeProvider |
| `src/pages/dashboard/Settings.tsx` | Ajouter le sélecteur de thème fonctionnel |
| `src/pages/Login.tsx` | Ajouter le toggle de thème |
| `src/pages/Signup.tsx` | Ajouter le toggle de thème |
| `src/pages/ForgotPassword.tsx` | Ajouter le toggle de thème |

### Fonctionnement

- Utiliser `localStorage` pour persister le choix du thème
- Appliquer la classe `.dark` sur `document.documentElement`
- Respecter la préférence système par défaut (`prefers-color-scheme`)
- Proposer 3 options : Clair, Sombre, Système

---

## Partie 4 : Internationalisation (i18n)

### Architecture

Créer un système de traduction complet avec :
- Contexte React pour la gestion de la langue
- Fichiers JSON pour les traductions
- Hook `useTranslation` pour l'utilisation dans les composants

### Fichiers à créer

| Fichier | Description |
|---------|-------------|
| `src/contexts/LanguageContext.tsx` | Contexte et Provider pour la langue |
| `src/locales/fr.json` | Traductions françaises |
| `src/locales/en.json` | Traductions anglaises |
| `src/hooks/useTranslation.ts` | Hook pour accéder aux traductions |
| `src/components/LanguageSelector.tsx` | Sélecteur de langue |

### Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `src/main.tsx` | Ajouter le LanguageProvider |
| `src/pages/dashboard/Settings.tsx` | Ajouter le sélecteur de langue fonctionnel |
| `src/pages/Login.tsx` | Ajouter le sélecteur de langue |
| `src/pages/Signup.tsx` | Ajouter le sélecteur de langue |
| Tous les composants avec du texte | Remplacer le texte en dur par les clés de traduction |

### Structure des traductions

```text
src/locales/
├── fr.json (langue par défaut)
└── en.json
```

Les traductions couvriront :
- Navigation et menu
- Pages d'authentification
- Dashboard et paramètres
- Messages d'erreur et notifications
- Boutons et labels

---

## Ordre d'exécution

1. **Icône** : Copier la nouvelle icône et mettre à jour toutes les références
2. **PWA** : Améliorer la configuration et ajouter le prompt d'installation
3. **Thème** : Créer le contexte et les composants de toggle
4. **i18n** : Créer le système de traduction et les fichiers de langue
5. **Intégration** : Mettre à jour les pages d'authentification avec thème et langue
6. **Paramètres** : Rendre les sélecteurs fonctionnels dans la page Settings

---

## Composants à créer

### 1. ThemeContext

```text
Fonctionnalités :
- État : 'light' | 'dark' | 'system'
- Détection de la préférence système
- Persistance dans localStorage
- Application de la classe sur le DOM
```

### 2. LanguageContext

```text
Fonctionnalités :
- État : 'fr' | 'en'
- Chargement des fichiers de traduction
- Hook useTranslation avec fonction t()
- Persistance dans localStorage
```

### 3. ThemeToggle

```text
Design :
- Icône soleil/lune animée
- Dropdown avec 3 options (Clair, Sombre, Système)
- Style glassmorphism cohérent avec le design
```

### 4. LanguageSelector

```text
Design :
- Dropdown avec drapeaux (FR/EN)
- Animation fluide
- Intégration dans la navbar et les pages auth
```

### 5. PWAInstallPrompt

```text
Design :
- Modal élégant avec le nouveau logo
- Bouton d'installation
- Détection automatique de la disponibilité
```

---

## Liste des fichiers de traduction à couvrir

### Pages prioritaires

1. **Login** : Tous les labels, boutons, messages
2. **Signup** : Formulaire complet, validations
3. **ForgotPassword** : Titre, instructions, confirmations
4. **Settings** : Tous les onglets et options
5. **Dashboard** : Menu latéral, header

### Clés de traduction principales

```text
common.save, common.cancel, common.loading...
auth.login, auth.signup, auth.forgot_password...
settings.profile, settings.security, settings.language...
dashboard.wallet, dashboard.cards, dashboard.store...
```

---

## Résumé des livrables

| # | Fonctionnalité | Fichiers principaux |
|---|----------------|---------------------|
| 1 | Nouvelle icône | 10+ fichiers modifiés |
| 2 | PWA amélioré | vite.config.ts, PWAInstallPrompt.tsx |
| 3 | Thème clair/sombre | ThemeContext.tsx, ThemeToggle.tsx |
| 4 | Internationalisation | LanguageContext.tsx, fr.json, en.json |

L'implémentation respectera le design system existant (glassmorphism, couleurs officielles, animations framer-motion) et sera entièrement responsive.
