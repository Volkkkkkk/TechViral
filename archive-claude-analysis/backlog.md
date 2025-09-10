# Backlog Priorisé TechViral - Scoring ICE

## 📊 Méthode ICE : Impact × Confidence × Ease

**Formule :** Score ICE = (Impact + Confidence + Ease) ÷ 3  
**Échelle :** 1-10 pour chaque critère  
**Seuil prioritaire :** Score ICE ≥ 7.0

---

## 🏆 Sprint 1 (1-2 jours) - Fondations SEO/Perf
*Objectif : Bases techniques solides*

| ID | Page/Zone | Problème | Solution | Impact | Conf. | Effort | ICE | Priorité |
|----|-----------|----------|----------|--------|-------|--------|-----|----------|
| **S1-01** | Navigation | Liens brisés account/, support/ | Corriger URLs relatives | 9 | 10 | 9 | **9.3** | 🔴 Critique |
| **S1-02** | Toutes pages | Console.log en production | Nettoyer logs debug | 6 | 10 | 10 | **8.7** | 🔴 Critique |
| **S1-03** | Pages catégories | Canonical URLs manquantes | Ajouter rel="canonical" | 8 | 9 | 9 | **8.7** | 🔴 Critique |
| **S1-04** | Meta descriptions | Contenu générique/répétitif | Personnaliser par page | 7 | 8 | 8 | **7.7** | 🟡 Important |
| **S1-05** | Favicon | Liens vers fichiers inexistants | Pack favicon complet | 5 | 9 | 9 | **7.7** | 🟡 Important |

**Livrable Sprint 1 :** Site sans erreurs 404, SEO fondamental opérationnel

---

## 🚀 Sprint 2 (2 jours) - Performance & Core Web Vitals  
*Objectif : Optimisation technique avancée*

| ID | Page/Zone | Problème | Solution | Impact | Conf. | Effort | ICE | Priorité |
|----|-----------|----------|----------|--------|-------|--------|-----|----------|
| **S2-01** | Bundle global | Tailwind CDN 300KB+ | Build local + PurgeCSS | 9 | 8 | 6 | **7.7** | 🔴 Critique |
| **S2-02** | CSS critique | Pas de preload CSS | `<link rel="preload">` critical CSS | 7 | 9 | 8 | **8.0** | 🟡 Important |
| **S2-03** | Images | Emojis à la place d'images | WebP/AVIF + lazy loading | 8 | 7 | 5 | **6.7** | 🟢 Souhaitable |
| **S2-04** | JavaScript | Pas de minification/compression | Minify JS + gzip | 6 | 8 | 7 | **7.0** | 🟡 Important |
| **S2-05** | Fonts | Inter non-optimisée | Font-display swap + subset | 6 | 7 | 8 | **7.0** | 🟡 Important |

**Livrable Sprint 2 :** Performance +40%, bundle -70%, LCP < 2.5s

---

## 🔍 Sprint 3 (1-2 jours) - SEO Avancé  
*Objectif : Visibilité & Rich Snippets*

| ID | Page/Zone | Problème | Solution | Impact | Conf. | Effort | ICE | Priorité |
|----|-----------|----------|----------|--------|-------|--------|-----|----------|
| **S3-01** | Pages produits | Schema.org Product manquant | JSON-LD produits complet | 8 | 8 | 6 | **7.3** | 🟡 Important |
| **S3-02** | Navigation | Breadcrumbs absents | Fil d'Ariane + Schema BreadcrumbList | 7 | 8 | 7 | **7.3** | 🟡 Important |
| **S3-03** | Site global | Sitemap.xml inexistant | Génération automatique sitemap | 6 | 9 | 8 | **7.7** | 🟡 Important |
| **S3-04** | Toutes pages | H1 non-optimisés | H1 unique + hiérarchie H2/H3 | 8 | 9 | 7 | **8.0** | 🟡 Important |
| **S3-05** | Reviews/Témoignages | Pas de Rich Snippets | Schema.org Review + Rating | 7 | 6 | 6 | **6.3** | 🟢 Souhaitable |

**Livrable Sprint 3 :** Rich Snippets actifs, navigation optimisée

---

## 🎨 Sprint 4 (2 jours) - UX & Conversion  
*Objectif : Expérience utilisateur & taux conversion*

| ID | Page/Zone | Problème | Solution | Impact | Conf. | Effort | ICE | Priorité |
|----|-----------|----------|----------|--------|-------|--------|-----|----------|
| **S4-01** | Pages catégories | Pas de filtres produits | Filtres Ajax prix/marque | 8 | 7 | 4 | **6.3** | 🟢 Souhaitable |
| **S4-02** | Fiches produits | Images produits manquantes | Photos produits réelles + gallery | 9 | 6 | 3 | **6.0** | 🟢 Souhaitable |
| **S4-03** | Panier | UX panier basique | Quick view + quantité inline | 7 | 8 | 5 | **6.7** | 🟢 Souhaitable |
| **S4-04** | Mobile | Navigation mobile lourde | Menu hamburger optimisé | 6 | 8 | 7 | **7.0** | 🟡 Important |
| **S4-05** | Checkout | Process checkout long | One-page checkout | 8 | 6 | 4 | **6.0** | 🟢 Souhaitable |

**Livrable Sprint 4 :** UX moderne, conversion +25%

---

## 📈 Sprint 5 (1 jour) - Analytics & Monitoring  
*Objectif : Mesure performance & SEO*

| ID | Page/Zone | Problème | Solution | Impact | Conf. | Effort | ICE | Priorité |
|----|-----------|----------|----------|--------|-------|--------|-----|----------|
| **S5-01** | Monitoring | Pas de tracking performance | Google Analytics 4 + Core Web Vitals | 7 | 9 | 8 | **8.0** | 🟡 Important |
| **S5-02** | SEO tracking | Pas de suivi positions | Google Search Console setup | 6 | 9 | 9 | **8.0** | 🟡 Important |
| **S5-03** | Erreurs 404 | Pas de monitoring erreurs | Dashboard erreurs + redirections | 5 | 8 | 8 | **7.0** | 🟡 Important |
| **S5-04** | A/B Testing | Pas de tests conversion | Hotjar + tests CTA/boutons | 6 | 6 | 7 | **6.3** | 🟢 Souhaitable |

**Livrable Sprint 5 :** Analytics complets, monitoring opérationnel

---

## 🎯 Résumé Priorisation

### ⚡ Urgent (Score ICE ≥ 8.5)
1. **Liens brisés** (9.3) → 15min
2. **Console logs** (8.7) → 10min  
3. **Canonical URLs** (8.7) → 30min

### 🔥 Important (Score ICE 7.0-8.4)
4. **Meta descriptions** (7.7) → 45min
5. **Favicon pack** (7.7) → 20min
6. **Tailwind build** (7.7) → 60min
7. **CSS preload** (8.0) → 15min

### ✨ Souhaitable (Score ICE 6.0-6.9)
- Améliorations UX avancées
- Images produits réelles
- Fonctionnalités e-commerce

---

## 📊 Impact Cumulé Estimé

| Sprint | Durée | SEO Impact | Perf Impact | UX Impact | ROI |
|--------|-------|------------|-------------|-----------|-----|
| **Sprint 1** | 1-2j | +70% | +20% | +80% | 🏆 Excellent |
| **Sprint 2** | 2j | +20% | +60% | +30% | 🏆 Excellent |
| **Sprint 3** | 1-2j | +40% | +10% | +25% | 🥈 Très bon |
| **Sprint 4** | 2j | +10% | +15% | +50% | 🥈 Très bon |
| **Sprint 5** | 1j | +15% | +5% | +20% | 🥉 Bon |

**Total estimé :** 7-9 jours pour transformation complète