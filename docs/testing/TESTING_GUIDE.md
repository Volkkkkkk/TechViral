# 🧪 Guide des Tests - TechViral

## Vue d'Ensemble

TechViral dispose d'une suite de tests complète pour garantir la qualité et les performances en production :

- **Tests Cross-Browser** : Playwright sur 6 environnements (Desktop: Chrome, Firefox, Safari + Mobile: Chrome, Safari, iPad)
- **Tests Performance** : Lighthouse CI avec budgets enterprise
- **Tests Manuels** : Suite de validation QA

## 🚀 Installation & Configuration

### Prérequis
```bash
npm install @playwright/test @lhci/cli --save-dev
npx playwright install
```

### Configuration Environnements
- **Base URL** : `http://localhost:3000`
- **Serveur de test** : `npm run serve`
- **Timeout** : 30s par test, 5s pour les assertions

## 📋 Commandes de Test

### Tests Complets
```bash
# Suite complète Playwright (6 browsers)
npm test

# Tests performance Lighthouse
npm run test:lighthouse

# Validation manuelle QA
npm run qa:validate
```

### Tests Spécialisés
```bash
# Validation HTML
npm run lint:html

# Test compatibilité navigateurs
npm run browser:test

# Optimisation images
npm run optimize:images

# Check accessibilité
npm run check:accessibility
```

## 🎯 Budgets Performance "Acier"

### Core Web Vitals (Critiques)
- **LCP** : ≤ 2.5s (Largest Contentful Paint)
- **CLS** : ≤ 0.1 (Cumulative Layout Shift) 
- **FCP** : ≤ 1.5s (First Contentful Paint)
- **TBT** : ≤ 300ms (Total Blocking Time)

### Scores Minimums
- **Performance** : 90%
- **SEO** : 95%
- **Accessibilité** : 95%
- **Bonnes Pratiques** : 90%

### Budgets Ressources
- **Total page** : ≤ 2MB
- **JavaScript** : ≤ 500KB
- **CSS** : ≤ 150KB
- **Images** : ≤ 1MB
- **Polices** : ≤ 100KB

## 🔍 Pages Testées Automatiquement

1. **Accueil** : `http://localhost:3000/`
2. **Catégorie** : `/pages/categories/electronique.html`
3. **Produit** : `/pages/products/camera-pov-gopro-hero13.html`
4. **Panier** : `/pages/cart/cart.html`

## 📊 Rapports de Test

### Localisation des Résultats
- **HTML Report** : `test-results/html-report/`
- **JSON Results** : `test-results/results.json`
- **JUnit XML** : `test-results/junit.xml`
- **Lighthouse DB** : `./lhci-data.db`

### Analyse des Échecs
```bash
# Voir les captures d'écran d'échec
ls test-results/test-*/

# Analyser les traces d'exécution  
npx playwright show-trace test-results/trace.zip
```

## 🔧 Configuration CI/CD

### Variables d'Environnement
- `CI=true` : Active mode CI (retry automatique)
- Tests parallèles désactivés en CI
- Screenshots/vidéos uniquement sur échec

### Quality Gates Déploiement
- Tous les tests Lighthouse doivent passer
- Score performance ≥ 90%
- Aucun test cross-browser en échec
- Validation HTML/CSS sans erreur

## 🚨 Debugging & Résolution

### Tests qui Échouent
1. **Performance** : Vérifier optimisations images/CSS
2. **Cross-Browser** : Tester manuellement le navigateur concerné
3. **Accessibilité** : Corriger contrastes, alt texts, labels

### Commandes Utiles
```bash
# Tests avec interface graphique
npx playwright test --ui

# Tests en mode debug
npx playwright test --debug

# Tests sur browser spécifique
npx playwright test --project=chromium-desktop

# Lighthouse avec interface
npx lhci open
```

## 📱 Tests Mobiles

### Devices Simulés
- **Mobile Chrome** : Pixel 5
- **Mobile Safari** : iPhone 12
- **Tablet** : iPad Pro

### Métriques Mobile Critiques
- Touch targets ≥ 44px
- Viewport responsive
- Font size ≥ 16px
- Images adaptatives

---

**Suite de tests "Acier" - Enterprise Grade Quality Assurance**