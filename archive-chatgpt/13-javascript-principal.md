# Scripts JavaScript TechViral

## Architecture JavaScript Modulaire

### Fichiers Principaux
1. **main.js** - Core application et fonctionnalités générales
2. **cart.js** - Système de panier centralisé
3. **smart-search.js** - Recherche intelligente avec autocomplétion
4. **product-gallery.js** - Galeries et visualisation produits
5. **checkout.js / checkout-express.js** - Processus de commande
6. **advanced-filters.js** - Filtrage avancé des produits
7. **ai-recommendations.js** - Système de recommandations IA
8. **loyalty-system.js** - Programme de fidélité client
9. **performance-optimizer.js** - Optimisations performance
10. **forms.js** - Gestion des formulaires

## main.js - Application Core

### Classe TechViralApp
```javascript
class TechViralApp {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupProductFilters();
        this.setupSearch();
        this.setupLiveActivity();
        this.setupNewsletterForm();
        this.setupScrollAnimations();
        this.setupLazyLoading();
        this.setupPerformanceOptimizations();
        this.applyTheme();
    }
}
```

### Fonctionnalités Principales

#### 1. Gestion des Thèmes
- Toggle mode sombre/clair automatique
- Persistance dans localStorage
- Transition smooth entre modes
- Auto-détection préférence système

#### 2. Menu Mobile Responsive
- Toggle hamburger menu
- Click outside pour fermer
- Animation slide avec transitions CSS
- Navigation adaptive selon breakpoints

#### 3. Animations et Interactions
- **Scroll Animations**: Intersection Observer API
- **Lazy Loading**: Images et contenu différé  
- **Live Activity**: Notifications temps réel
- **Newsletter**: Validation et soumission AJAX

## cart.js - Système de Panier

### Classe CartManager
```javascript
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('techviral_cart')) || [];
        this.promoCode = localStorage.getItem('techviral_promo') || null;
        this.analytics = this.initAnalytics();
        this.locale = this.getLocale();
        this.init();
    }
}
```

### Fonctionnalités Panier

#### 1. Gestion Multilingue
```javascript
loadTranslations() {
    const translations = {
        fr: {
            'cart_empty': 'Votre panier est vide',
            'product_added': 'ajouté au panier',
            'promo_applied': 'Code promo appliqué !',
            // ...plus de traductions
        },
        en: { /* Traductions anglaises */ }
    };
    return translations[this.locale];
}
```

#### 2. Analytics et Tracking
- Événements e-commerce
- Suivi ajouts/suppressions
- Données pour recommandations
- Performance metrics

#### 3. Codes Promotionnels
- Validation côté client
- Application automatique
- Gestion des expirrations
- Interface utilisateur responsive

#### 4. Persistance et Performance
- **Debouncing**: Éviter trop de sauvegardes
- **Cache intelligent**: Réduction des calculs
- **Optimisations mémoire**: Nettoyage automatique

## smart-search.js - Recherche Intelligente

### Classe SmartSearch
```javascript
class SmartSearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.popularSearches = [
            'iPhone 15', 'AirPods Pro', 'Apple Watch',
            'drone', 'caméra 4K', 'écouteurs'
        ];
        this.searchCache = new Map();
        this.init();
    }
}
```

### Fonctionnalités Recherche

#### 1. Autocomplétion Intelligente
- Suggestions populaires
- Historique personnalisé
- Cache des résultats
- Debouncing pour performance

#### 2. Recherche Vocale
- API Web Speech Recognition
- Feedback visuel pendant recording
- Gestion des erreurs gracieuse
- Support multi-navigateurs

#### 3. Raccourcis Clavier
- **Ctrl+K / Cmd+K**: Ouverture recherche
- **Échap**: Fermeture suggestions
- **↑↓**: Navigation dans résultats
- **Entrée**: Sélection/recherche

#### 4. Analytics de Recherche
- Termes populaires
- Taux de conversion
- Suggestions améliorées
- A/B testing des résultats

## Système de Recommandations IA

### Classe AIRecommendations
```javascript
class AIRecommendations {
    constructor() {
        this.userProfile = this.loadUserProfile();
        this.viewHistory = JSON.parse(localStorage.getItem('viewHistory')) || [];
        this.recommendations = new Map();
        this.init();
    }
}
```

### Algorithmes de Recommandation

#### 1. Filtrage Collaboratif
- Analyse comportements similaires
- Recommandations cross-category
- Machine learning côté client
- Mise à jour temps réel

#### 2. Analyse Contextuelle
- Heure/saison
- Météo et localisation
- Événements spéciaux
- Tendances sociales

#### 3. Personnalisation Avancée
- Préférences implicites
- Score de pertinence
- Diversification des résultats
- Anti-biais algorithms

## Performance et Optimisations

### Classe PerformanceOptimizer
```javascript
class PerformanceOptimizer {
    constructor() {
        this.metrics = new Map();
        this.observers = new Map();
        this.thresholds = {
            lcp: 2500,      // Largest Contentful Paint
            fid: 100,       // First Input Delay
            cls: 0.1        // Cumulative Layout Shift
        };
        this.init();
    }
}
```

### Optimisations Techniques

#### 1. Core Web Vitals
- **LCP Monitoring**: Largest Contentful Paint
- **FID Tracking**: First Input Delay
- **CLS Prevention**: Cumulative Layout Shift
- **Reporting automatique**: Analytics intégré

#### 2. Resource Management
- **Code Splitting**: Chargement par chunks
- **Tree Shaking**: Élimination code mort
- **Asset Compression**: Images WebP/AVIF
- **Caching Strategy**: Service Workers

#### 3. Memory Management
- **Garbage Collection**: Nettoyage automatique
- **Event Listeners**: Cleanup on destroy
- **DOM Optimization**: Virtual scrolling
- **Bundle Size**: Monitoring et alerts

## Système de Fidélité

### Programme de Points
```javascript
class LoyaltySystem {
    constructor() {
        this.userPoints = parseInt(localStorage.getItem('loyaltyPoints')) || 0;
        this.level = this.calculateUserLevel();
        this.rewards = this.loadAvailableRewards();
        this.init();
    }
}
```

### Gamification Features

#### 1. Niveaux Utilisateur
- **Bronze**: 0-999 points
- **Argent**: 1000-4999 points  
- **Or**: 5000-9999 points
- **Platinum**: 10000+ points

#### 2. Actions Récompensées
- Achat: 1 point = 1€ dépensé
- Avis produit: 50 points
- Parrainage: 200 points
- Partage social: 25 points

#### 3. Récompenses Disponibles
- **Réductions**: 5%, 10%, 15%
- **Livraison gratuite**: Upgrades
- **Accès prioritaire**: Nouveautés
- **Cadeaux exclusifs**: Produits premium

## API et Intégrations

### Services Externes
```javascript
// Analytics tracking
gtag('event', 'purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'EUR',
    items: cartItems
});

// Payment processing
stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: billingDetails
});

// Inventory management
await fetch('/api/inventory/check', {
    method: 'POST',
    body: JSON.stringify({ productIds })
});
```

### Architecture Event-Driven
```javascript
// Event system pour communication inter-modules
class EventBus {
    constructor() {
        this.events = {};
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
}
```

Cette architecture JavaScript moderne offre une expérience utilisateur fluide avec des fonctionnalités e-commerce avancées, des performances optimisées et une maintenance simplifiée grâce à la modularité du code.