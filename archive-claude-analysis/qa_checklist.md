# QA Checklist TechViral - Validation Déploiement

## ✅ Checklist Pré-Production

### 🔧 Fixes Critiques (Avant mise en ligne)

#### Navigation & Liens
- [ ] Tous les liens navigation header fonctionnels
- [ ] Liens footer corrigés (pages/account/, pages/support/, pages/legal/)
- [ ] Aucun lien 404 détecté dans navigation principale
- [ ] Menu mobile opérationnel sur iOS/Android
- [ ] Breadcrumbs (si implémentés) fonctionnels

#### SEO Fondamental  
- [ ] Canonical URLs présents sur toutes les pages catégories
- [ ] Meta descriptions uniques et optimisées (140-160 chars)
- [ ] H1 unique par page, structure H2/H3 cohérente
- [ ] Titles optimisés (50-60 caractères)
- [ ] Schema.org Store validé (validator Google)

#### Performance
- [ ] Console.log de développement supprimés
- [ ] Favicon pack complet disponible (SVG/ICO/PNG)
- [ ] CSS critique préchargé
- [ ] Fonts Inter avec font-display: swap
- [ ] Tailwind build local actif (si implémenté)

---

## 🧪 Tests Fonctionnels

### Desktop (Chrome, Firefox, Safari)
- [ ] Page d'accueil charge < 3s
- [ ] Navigation catégories fluide
- [ ] Dark mode toggle opérationnel
- [ ] Formulaire newsletter fonctionne
- [ ] Panier add/remove sans erreurs
- [ ] Search bar responsive

### Mobile (iPhone, Android)
- [ ] Menu hamburger accessible
- [ ] Cards produits touchables
- [ ] Formulaires utilisables tactile
- [ ] Performance acceptable (<5s)
- [ ] Orientation portrait/paysage OK

### Accessibilité WCAG AA
- [ ] Contrastes ≥ 4.5:1 texte normal
- [ ] Navigation clavier complète (Tab)
- [ ] Focus visible sur éléments interactifs
- [ ] ARIA labels sur boutons icon-only
- [ ] Alt texts sur images (quand ajoutées)

---

## 🔍 Validation Technique

### HTML/CSS/JS
- [ ] HTML validé W3C (warnings acceptables)
- [ ] CSS sans erreurs critiques
- [ ] JavaScript sans erreurs console
- [ ] Responsive breakpoints fonctionnels
- [ ] Print stylesheet basique

### SEO Avancé
- [ ] Robots.txt présent et correcte
- [ ] Sitemap XML généré (si implémenté)
- [ ] Open Graph tags complets
- [ ] Twitter Cards configurées
- [ ] JSON-LD Schema.org valide

### Performance Web Vitals
- [ ] LCP < 2.5s (First Contentful Paint)
- [ ] FID < 100ms (First Input Delay) 
- [ ] CLS < 0.1 (Cumulative Layout Shift)
- [ ] Bundle JS < 200KB gzippé
- [ ] Images optimisées WebP/AVIF (si ajoutées)

---

## 🚀 Tests Cross-Browser

### Support Navigateurs
| Navigateur | Version | Desktop | Mobile | Status |
|------------|---------|---------|---------|--------|
| Chrome | 115+ | ☐ | ☐ | |
| Firefox | 110+ | ☐ | ☐ | |
| Safari | 16+ | ☐ | ☐ | |
| Edge | 115+ | ☐ | - | |

### Fonctionnalités Critiques
- [ ] Dark mode toutes plateformes
- [ ] CSS Grid/Flexbox rendu correct
- [ ] Animations/transitions fluides
- [ ] Touch events mobile
- [ ] Hover states desktop uniquement

---

## 📊 Métriques Pré/Post Déploiement

### Avant Fixes
- **Bundle Size :** ~300KB (Tailwind CDN)
- **Erreurs 404 :** 8+ liens brisés
- **Console Errors :** 5+ logs debug
- **Canonical :** 0/9 pages catégories
- **Meta Descriptions :** 3/28 uniques

### Après Fixes (Cibles)
- [ ] **Bundle Size :** <100KB (build local)
- [ ] **Erreurs 404 :** 0 liens brisés
- [ ] **Console Errors :** 0 logs production
- [ ] **Canonical :** 28/28 pages avec canonical
- [ ] **Meta Descriptions :** 28/28 uniques

---

## ⚠️ Checklist Rollback

### Si problèmes critiques détectés
- [ ] Backup files disponibles
- [ ] Procédure rollback testée
- [ ] DNS/Hosting access confirmed
- [ ] Index.html de secours préparé

### Procédure d'urgence
1. **Identifier** scope du problème (page spécifique/global)
2. **Isoler** changements récents via git log
3. **Reverter** commit problématique
4. **Tester** version rollback
5. **Communiquer** status aux stakeholders

---

## 🎯 Validation Finale

### Checklist Go/No-Go
- [ ] **Navigation :** Tous liens fonctionnels
- [ ] **SEO :** Meta/canonical/schema OK  
- [ ] **Performance :** <3s desktop, <5s mobile
- [ ] **Accessibilité :** WCAG AA essentiel
- [ ] **Cross-browser :** Chrome/Firefox/Safari OK
- [ ] **Mobile :** iOS/Android utilisables
- [ ] **Monitoring :** Analytics/erreurs configurés

### Sign-off Required
- [ ] **Dev Lead :** Code review & technical validation
- [ ] **SEO :** Metadata & structure approved
- [ ] **UX :** User flows & accessibility verified
- [ ] **PM :** Business requirements met

**Date validation :** ___________  
**Approuvé par :** ___________  
**Déployé le :** ___________