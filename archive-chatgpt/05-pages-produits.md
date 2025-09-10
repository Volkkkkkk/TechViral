# Pages Produits TechViral

## Structure des Pages Produits

### URL et Organisation
- **Pattern URL**: `/pages/products/{category}/{product-slug}.html`
- **Exemple**: `/pages/products/electronique/camera-pov-portable-hd.html`
- **SEO-friendly**: Slugs descriptifs avec mots-clés

### Meta Données Produit
```html
<title>Caméra POV Portable HD 4K - TechViral</title>
<meta name="description" content="Caméra POV portable 4K avec stabilisation, WiFi intégré. Parfaite pour vlogs, sport, voyage. Livraison gratuite 48h.">
<meta name="keywords" content="caméra POV, 4K, stabilisation, WiFi, portable, vlog, sport">
```

### Schema Markup Produit
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Caméra POV Portable HD",
  "description": "Caméra haute définition portable...",
  "image": [
    "https://techviral.com/assets/images/products/camera-pov-1.jpg",
    "https://techviral.com/assets/images/products/camera-pov-2.jpg"
  ],
  "brand": {
    "@type": "Brand",
    "name": "TechViral"
  },
  "offers": {
    "@type": "Offer",
    "price": "89.99",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  }
}
```

## Layout Page Produit

### Section Hero Produit

#### 1. Galerie Images (Gauche)
- **Image principale**: 600x600px, zoom disponible
- **Miniatures**: 4-6 vues différentes
- **Vidéo produit**: Intégrée si disponible
- **Zoom hover**: Loupe avec détails agrandis
- **Carrousel**: Navigation tactile et clavier

#### 2. Informations Produit (Droite)
```html
<!-- Breadcrumb -->
Accueil › Électronique › Caméras › Caméra POV Portable HD

<!-- Titre et badges -->
<h1>Caméra POV Portable HD 4K</h1>
<div class="badges">
  <span class="badge-new">NOUVEAU</span>
  <span class="badge-promo">-30%</span>
  <span class="badge-bestseller">BESTSELLER</span>
</div>

<!-- Note et avis -->
<div class="rating">
  ⭐⭐⭐⭐⭐ 4.8/5 (124 avis)
  <a href="#reviews">Voir tous les avis</a>
</div>

<!-- Prix -->
<div class="pricing">
  <span class="price-current">89,99 €</span>
  <span class="price-original">129,99 €</span>
  <span class="savings">Économisez 40 €</span>
</div>
```

#### 3. Caractéristiques Clés
- **Points forts**: Liste à puces avec icônes
- **Spécifications**: Tableau organisé
- **Compatibilité**: Appareils supportés
- **Garantie**: Informations légales

#### 4. Actions Produit
```html
<!-- Variantes si applicable -->
<div class="variants">
  <label>Couleur:</label>
  <div class="color-options">
    <button class="color-option active" data-color="noir">Noir</button>
    <button class="color-option" data-color="blanc">Blanc</button>
  </div>
</div>

<!-- Quantité -->
<div class="quantity-selector">
  <label>Quantité:</label>
  <input type="number" value="1" min="1" max="10">
</div>

<!-- Boutons d'action -->
<div class="product-actions">
  <button class="btn-primary btn-add-to-cart" data-product-id="123">
    🛒 Ajouter au panier - 89,99 €
  </button>
  <button class="btn-secondary btn-wishlist">
    ❤️ Ajouter aux favoris
  </button>
  <button class="btn-secondary btn-share">
    📤 Partager
  </button>
</div>
```

### Section Détails Produit

#### 1. Navigation par Onglets
- **Description**: Détails complets du produit
- **Spécifications**: Tableau technique détaillé
- **Guide d'utilisation**: Instructions et conseils
- **Avis clients**: Reviews et notes
- **Questions/Réponses**: FAQ communautaire

#### 2. Description Détaillée
```markdown
## Description Complète

La caméra POV portable HD révolutionne votre façon de capturer les moments. 

### Fonctionnalités Principales
- **Qualité 4K Ultra HD**: Vidéos d'une netteté exceptionnelle
- **Stabilisation avancée**: Technologie anti-vibration intégrée
- **WiFi intégré**: Contrôle à distance via app mobile
- **Batterie longue durée**: Jusqu'à 4h d'enregistrement continu

### Utilisations Recommandées
- 🎬 **Vlogging**: Créez du contenu professionnel
- 🏃 **Sport**: Capturez l'action en mouvement
- ✈️ **Voyage**: Immortalisez vos aventures
- 👥 **Streaming**: Diffusion live en haute qualité
```

#### 3. Spécifications Techniques
```html
<table class="specs-table">
  <tr><td>Résolution vidéo</td><td>4K (3840x2160) @ 30fps</td></tr>
  <tr><td>Résolution photo</td><td>20 MP</td></tr>
  <tr><td>Objectif</td><td>Grand angle 120°</td></tr>
  <tr><td>Stabilisation</td><td>Électronique + Optique</td></tr>
  <tr><td>Connectivité</td><td>WiFi 5GHz, Bluetooth 5.0</td></tr>
  <tr><td>Stockage</td><td>MicroSD jusqu'à 256GB</td></tr>
  <tr><td>Batterie</td><td>Li-Po 1500mAh, 4h autonomie</td></tr>
  <tr><td>Dimensions</td><td>65 x 42 x 28 mm</td></tr>
  <tr><td>Poids</td><td>120g</td></tr>
  <tr><td>Étanchéité</td><td>IPX7 (résistant éclaboussures)</td></tr>
</table>
```

### Section Avis Clients

#### 1. Résumé des Notes
```html
<div class="reviews-summary">
  <div class="overall-rating">
    <span class="rating-number">4.8</span>
    <div class="stars">⭐⭐⭐⭐⭐</div>
    <span class="review-count">Basé sur 124 avis</span>
  </div>
  
  <div class="rating-breakdown">
    <div class="rating-bar">
      <span>5⭐</span>
      <div class="bar"><div class="fill" style="width: 75%"></div></div>
      <span>93</span>
    </div>
    <div class="rating-bar">
      <span>4⭐</span>
      <div class="bar"><div class="fill" style="width: 20%"></div></div>
      <span>25</span>
    </div>
    <!-- Plus de barres... -->
  </div>
</div>
```

#### 2. Avis Individuels
```html
<div class="review-item">
  <div class="reviewer-info">
    <img src="avatar.jpg" alt="Marie L." class="reviewer-avatar">
    <div>
      <strong>Marie L.</strong>
      <div class="stars">⭐⭐⭐⭐⭐</div>
      <span class="review-date">Il y a 2 jours</span>
    </div>
  </div>
  <h4>"Parfaite pour mes vlogs !"</h4>
  <p>Qualité d'image excellente, très facile à utiliser. La stabilisation fonctionne vraiment bien même en mouvement.</p>
  <div class="review-helpful">
    <button>👍 Utile (12)</button>
    <button>Signaler</button>
  </div>
</div>
```

### Sections de Conversion

#### 1. Éléments de Réassurance
```html
<div class="trust-badges">
  <div class="badge">✅ Livraison gratuite sous 48h</div>
  <div class="badge">✅ 30 jours satisfait ou remboursé</div>
  <div class="badge">✅ Garantie 2 ans constructeur</div>
  <div class="badge">✅ Paiement sécurisé SSL</div>
</div>
```

#### 2. Stock et Urgence
```html
<div class="stock-info">
  <span class="stock-level stock-medium">📦 Plus que 12 en stock</span>
  <span class="recent-orders">🔥 16 personnes ont acheté ce produit aujourd'hui</span>
</div>
```

#### 3. Avantages VIP
```html
<div class="vip-benefits">
  <h4>Avantages membres TechViral:</h4>
  <ul>
    <li>💎 Points fidélité: +90 points</li>
    <li>🚚 Livraison express gratuite</li>
    <li>🔧 Support technique prioritaire</li>
    <li>📱 App mobile exclusive</li>
  </ul>
</div>
```

### Produits Recommandés

#### 1. Cross-selling
- **Accessoires complémentaires**: Étuis, cartes SD, trépieds
- **Produits similaires**: Autres caméras de la gamme
- **Bundles**: Packs avec accessoires à prix réduit

#### 2. Upselling Intelligence
- **Version supérieure**: Modèle pro avec fonctionnalités avancées
- **Garantie étendue**: Options de protection supplémentaires
- **Services**: Installation, formation, personnalisation

### Optimisations Techniques

#### 1. Performance
- **Images optimisées**: WebP/AVIF avec fallbacks
- **Lazy loading**: Images et contenu différé
- **Cache intelligent**: Mise en cache des données produit
- **CDN**: Distribution globale des assets

#### 2. SEO
- **URL canonique**: Éviter contenu dupliqué
- **Open Graph**: Partage social optimisé
- **FAQ Schema**: Questions fréquentes structurées
- **Images alt-text**: Descriptions détaillées

#### 3. Accessibilité
- **Navigation clavier**: Tous les éléments accessibles
- **Contraste**: Textes lisibles selon WCAG
- **Screen readers**: Labels ARIA appropriés
- **Focus management**: Ordre logique de navigation

Cette structure de page produit optimise la conversion avec une présentation claire des informations, des éléments de réassurance et une expérience utilisateur fluide sur tous les appareils.