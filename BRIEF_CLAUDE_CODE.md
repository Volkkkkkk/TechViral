# 🎯 BRIEF CLAUDE CODE - Finalisation TechViral E-commerce

*Brief prêt-à-coller pour Claude Code - Septembre 2025*

---

## 🎯 **OBJECTIF PRINCIPAL**

Transformer TechViral en site e-commerce complet, fonctionnel, avec panier, checkout, SEO optimisé, et 12 nouveaux produits. Le site existe déjà avec une base solide mais manque les éléments critiques pour les ventes.

**URL du site :** https://antiquewhite-rabbit-562143.hostingersite.com  
**Repository :** https://github.com/Volkkkkkk/TechViral  
**Déploiement :** SSH + SCP (FTP configuré en backup)

---

## 📋 **ANALYSE EXISTANT**

### **✅ Ce qui fonctionne bien :**
- Design responsive avec Tailwind CSS
- 7 pages catégories avec produits
- Navigation claire et mode sombre
- Structure de base présente
- Système de filtres et tri fonctionnel

### **❌ Éléments critiques manquants :**
- **Panier e-commerce** (boutons "Ajouter" ne fonctionnent pas)
- **Checkout et paiement** (pas de processus d'achat)
- **Fiches produits détaillées** (pas de `/p/[slug]/`)
- **Pages légales essentielles** (FAQ, retours, à-propos)
- **SEO technique** (robots.txt bloque Googlebot !)

---

## 🚀 **TÂCHES PRIORITAIRES**

### **🔴 PRIORITÉ CRITIQUE (Blocant ventes)**

#### **1. Corriger robots.txt**
**Problème :** Bloque actuellement Googlebot
```txt
# ACTUEL (PROBLÉMATIQUE):
User-agent: Googlebot  
Disallow: /

# REMPLACER PAR:
User-agent: *
Disallow:
Sitemap: https://antiquewhite-rabbit-562143.hostingersite.com/sitemap.xml
```

#### **2. Créer système panier complet**
```
📁 /panier/ (nouvelle page)
├── Interface panier avec localStorage
├── Mini-panier en header (compteur)
├── Gestion quantités (+, -, supprimer)
├── Calcul totaux (TTC, livraison, promos)
└── Bouton "Passer commande" → checkout
```

#### **3. Intégrer checkout Stripe**
```
📁 /checkout/ (nouvelle page)  
├── Formulaire livraison/facturation
├── Récap commande avec produits panier
├── Intégration Stripe Checkout (redirect)
├── Page confirmation (/confirmation/)
└── Email confirmation automatique
```

#### **4. Template fiches produits**
```
📁 /p/[slug]/ (pages produits détaillées)
├── Galerie 4-6 images + zoom
├── Titre, prix, variantes, stock
├── Description longue + points-clés (puces)
├── FAQ courte (3-4 Q&A)
├── Avis clients (module prêt)
├── "Produits similaires" (cross-sell)
├── Bouton "Ajouter au panier" fonctionnel
└── Breadcrumb navigation
```

### **🟡 PRIORITÉ IMPORTANTE (Crédibilité)**

#### **5. Pages manquantes essentielles**
- **`/a-propos/`** - Histoire, mission, équipe (crédibilité)
- **`/faq/`** - Livraison, retours, paiement, garanties
- **`/retours/`** - Politique retours 14-30 jours
- **`/404.html`** - Page erreur avec liens utiles

#### **6. Optimisation SEO on-page**
```html
<!-- Exemple meta à uniformiser -->
<title>Produit XYZ - Description courte | TechViral</title>
<meta name="description" content="Description 140-160 caractères avec mots-clés et CTA">
<meta property="og:image" content="/assets/images/og-product-xyz.jpg">
<link rel="canonical" href="https://antiquewhite-rabbit-562143.hostingersite.com/p/produit-xyz/">
```

#### **7. Données structurées JSON-LD**
```javascript
// À ajouter sur chaque fiche produit
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nom Produit",
  "description": "Description produit",
  "image": "URL image",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "EUR"
  }
}
```

### **🟢 AMÉLIORATIONS (Polish)**

#### **8. Pack 12 nouveaux produits**
**Créer fiches complètes pour :**

1. **Caméra POV Portable** (€89) - Vidéos mains-libres, contenu vertical
2. **Mug Auto-Mélangeur USB** (€34) - Bureau/fitness, rechargeable  
3. **Bouteille Hydrogène Piurify** (€159) - Eau enrichie H2, wellness
4. **Collier Gonflable Cervical** (€29) - Soulage tensions, portable
5. **Lampe Sac à Main LED** (€19) - Détection auto, sécurité
6. **Poignée Porte Intelligente** (€119) - Verrouillage digital simple
7. **Théière Verre Bouton** (€45) - Filtre auto, rituel thé
8. **Drone Mousse RC** (€69) - Résistant, parfait débutants
9. **Tapis Mise à la Terre** (€79) - Récupération sommeil/sport
10. **Jouet Interactif Chat** (€39) - Capteur mouvement, autonome
11. **Ventilateur Poussette USB** (€25) - Été, mobilité bébé
12. **Balance Cuisine Compacte** (€32) - Rechargeable, design minimal

**Chaque produit avec :**
- 6 photos (dont 2 lifestyle)
- Description longue (150-200 mots)
- 5 points-clés bénéfices (puces)
- FAQ courte (3 Q&A)
- Prix, stock, variantes si applicable

#### **9. Optimisations performance**
- Convertir images en WebP/AVIF
- Lazy loading pour images below-fold
- Minifier CSS/JS pour production
- Preload fonts critiques
- Compression gzip/brotli

#### **10. Features confiance & marketing**
- Section réassurance (paiement sécurisé, retours gratuits)
- Pop-up newsletter avec code -10% première commande
- Badges confiance (paiements acceptés, SSL, etc.)
- Module avis clients (même si 0 au début)
- Bannière "Livraison gratuite dès 50€"

---

## 🏗️ **ARBORESCENCE FINALE CIBLE**

```
TechViral/
├── 🏠 / (Accueil optimisé)
├── 📱 /categories/ (Hub catégories existant)
├── 🔍 /c/[slug]/ (Listes par catégorie - garder existant)
├── 📦 /p/[slug]/ (Fiches produits) ❌ CRÉER
├── 🛒 /panier/ (Cart) ❌ CRÉER
├── 💳 /checkout/ (Paiement) ❌ CRÉER
├── ✅ /confirmation/ (Post-achat) ❌ CRÉER
├── ℹ️ /a-propos/ ❌ CRÉER
├── 📞 /contact/ ✅ EXISTE
├── ❓ /faq/ ❌ CRÉER
├── ⚖️ /cgv/ ✅ EXISTE (/pages/legal/terms.html)
├── 🔒 /confidentialite/ ✅ EXISTE (/pages/legal/privacy.html)
├── 🔄 /retours/ ❌ CRÉER
├── 📖 /blog/ ✅ EXISTE
├── 🗺️ /sitemap.xml ✅ EXISTE (à mettre à jour)
├── 🤖 /robots.txt ❌ CORRIGER
└── ❌ /404.html ❌ CRÉER
```

---

## ⚙️ **SPÉCIFICATIONS TECHNIQUES**

### **Stack technologique :**
- **Frontend :** HTML5, Tailwind CSS, JavaScript ES6+
- **Icons :** Heroicons ou Lucide (déjà utilisés)
- **Paiement :** Stripe Checkout (redirect, pas d'Elements)
- **Storage :** localStorage pour panier (pas de BDD)
- **Fonts :** Google Fonts (déjà chargées)

### **Configuration Stripe recommandée :**
```javascript
// Endpoint minimal côté serveur
POST /api/create-checkout-session
{
  "items": [
    {"name": "Produit", "price": 2999, "quantity": 1}
  ],
  "success_url": "https://site.com/confirmation/",
  "cancel_url": "https://site.com/panier/"
}
```

### **Structure données panier :**
```javascript
// localStorage cartItems
[
  {
    "id": "produit-slug",
    "name": "Nom Produit", 
    "price": 29.99,
    "quantity": 2,
    "image": "/assets/images/produit.jpg",
    "variant": "Noir" // si applicable
  }
]
```

### **Responsive breakpoints :**
```css
/* Mobile-first avec Tailwind */
sm: 640px   /* Tablette portrait */
md: 768px   /* Tablette paysage */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🎨 **GUIDELINES DESIGN**

### **Palette couleurs (conserver existant) :**
- **Primary :** Indigo/Blue (#3B82F6)
- **Accent :** Emerald (#10B981) 
- **Warning :** Amber (#F59E0B)
- **Error :** Red (#EF4444)
- **Dark mode :** Gray 800/900 backgrounds

### **Composants UI prioritaires :**
1. **Cards produit** (uniformiser style existant)
2. **Boutons CTA** (hover states, loading)
3. **Form inputs** (validation visuelle)
4. **Mini-panier** (dropdown header)
5. **Breadcrumbs** (navigation)
6. **Modal** (confirmation suppression panier)

### **Micro-interactions :**
- Hover cartes produit (scale 1.02)
- Loading states boutons (spinner)
- Smooth transitions (0.2s ease)
- Toast notifications (ajout panier)

---

## 🧪 **TESTS DE VALIDATION**

### **Parcours utilisateur critique :**
1. **Accueil** → Clic catégorie → **Page catégorie**
2. **Clic produit** → **Fiche produit détaillée** ❌ À CRÉER
3. **"Ajouter panier"** → **Mini-panier mis à jour** ❌ À CRÉER
4. **"Voir panier"** → **Page panier** ❌ À CRÉER
5. **"Passer commande"** → **Checkout Stripe** ❌ À CRÉER
6. **Paiement réussi** → **Page confirmation** ❌ À CRÉER

### **Tests techniques :**
- **SEO :** robots.txt accessible, sitemap valide
- **Performance :** Lighthouse score >85
- **Mobile :** Responsive sur iPhone/Android
- **Accessibilité :** Navigation clavier, alt text
- **Cross-browser :** Chrome, Firefox, Safari, Edge

### **Tests e-commerce :**
- Panier persiste lors refresh page
- Quantités calculées correctement
- Checkout Stripe redirige correctement
- Confirmation commande affiche résumé

---

## 📦 **LIVRABLES ATTENDUS**

### **Code & Assets :**
```
📁 Fichiers à créer/modifier:
├── /panier/index.html
├── /checkout/index.html  
├── /confirmation/index.html
├── /a-propos/index.html
├── /faq/index.html
├── /retours/index.html
├── /404.html
├── /p/[12-produits]/index.html (fiches détaillées)
├── /assets/js/cart.js (logique panier)
├── /assets/js/checkout.js (intégration Stripe)
├── /assets/js/product.js (fiche produit)
├── /assets/images/produits/ (images 12 produits)
├── robots.txt (corriger)
├── sitemap.xml (mettre à jour)
└── /assets/css/components.css (nouveaux composants)
```

### **Documentation :**
- **README_ECOMMERCE.md** - Guide d'utilisation
- **STRIPE_SETUP.md** - Configuration paiement  
- **PRODUCT_TEMPLATE.md** - Guide création fiche produit
- **SEO_CHECKLIST.md** - Optimisations appliquées

---

## ⚡ **DÉPLOIEMENT**

### **Méthode recommandée :**
```bash
# Via SSH + SCP (méthode qui fonctionne)
scp -P 65002 fichiers/* u531520039@147.93.93.199:domains/site/public_html/

# Ou utiliser les scripts existants:
deploy-now.bat      # Windows FTP
smart-deploy.bat    # Auto-détection méthode
```

### **Post-déploiement :**
1. Tester parcours utilisateur complet
2. Vérifier robots.txt corrigé  
3. Valider sitemap.xml mis à jour
4. Test paiement Stripe en mode test
5. Lighthouse audit performance

---

## 🎯 **CRITÈRES DE RÉUSSITE**

### **Fonctionnel :**
- [ ] Panier fonctionne (ajout, modif, suppression)
- [ ] Checkout Stripe intégré et testé
- [ ] 12 fiches produits détaillées créées
- [ ] Toutes pages manquantes créées

### **SEO/Technique :**
- [ ] robots.txt corrigé (Googlebot autorisé)
- [ ] Toutes pages ont meta description 140-160c
- [ ] Sitemap.xml à jour avec nouvelles URLs
- [ ] Score Lighthouse >85

### **Business :**
- [ ] Parcours d'achat complet fonctionnel
- [ ] Pages légales conformes (CGV, confidentialité, retours)
- [ ] FAQ couvre questions principales clients
- [ ] Site prêt pour premières ventes réelles

---

## 📞 **CONTEXT TECHNIQUE**

### **Serveur :** Hostinger  
### **Accès SSH :** u531520039@147.93.93.199:65002  
### **Accès FTP :** u531520039.ftpantiquewhite@147.93.93.199:21  
### **Repository :** GitHub (privé)

### **Assets existants à conserver :**
- Structure Tailwind CSS
- Mode sombre fonctionnel
- Navigation existante
- Système de filtres catégories
- Design responsive actuel

---

*🎯 Brief complet et actionnable - Prêt pour développement*  
*📅 Objectif : Site e-commerce 100% fonctionnel*