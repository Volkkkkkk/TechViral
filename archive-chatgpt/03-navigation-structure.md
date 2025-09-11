# Structure de Navigation TechViral

## Navigation Principale

### Header Navigation
**Position**: Sticky header avec backdrop-blur
**Style**: Fond blanc/sombre avec ombre légère

### Logo et Branding
```
Logo: "TV" dans un carré dégradé
Nom: "TechViral"
Tagline: "Innovations 2025"
```

## Menu Desktop

### Liens Principaux
1. **🏠 Accueil** (`/`)
2. **📂 Catégories** (Mega Menu)
3. **🔥 Promos** (`/pages/promotions.html`) - Rouge avec badge
4. **📝 Blog** (`/pages/blog.html`)
5. **📞 Contact** (`/pages/contact.html`)

### Mega Menu Catégories
**Structure en 4 colonnes**:

#### Colonne 1: 📱 Électronique (156 produits)
- 📱 Smartphones
- 🎧 Audio
- 📷 Caméras
- 🎮 Gaming
- 🚁 Drones

#### Colonne 2: 🏥 Santé & Bien-être (124 produits)
- 💪 Fitness
- 🧘 Bien-être
- ⚕️ Médical
- 💅 Beauté
- 💊 Suppléments

#### Colonne 3: 🏠 Maison & Déco (112 produits)
- 🏡 Maison connectée
- 🍳 Cuisine
- 🪑 Mobilier
- 💡 Éclairage
- 📦 Organisation

#### Colonne 4: ✨ Autres
- 👗 Mode & Accessoires
- 🐕 Animaux
- 👶 Bébé & Enfant
- 🌱 Écologique
- 🎨 Lifestyle

### Section Promotionnelle (bas du mega menu)
```
🔥 -30% Nouveautés    🚚 Livraison 48h    [Voir tout →]
```

## Actions Utilisateur (Desktop)

### Barre d'Actions
Position: Droite du header

1. **🔍 Recherche**
   - Toggle pour barre de recherche globale
   - Suggestions populaires (iPhone 15, AirPods Pro, Apple Watch)

2. **❤️ Wishlist**
   - Compteur de produits favoris
   - Badge rouge si articles présents

3. **🛒 Panier**
   - Compteur d'articles
   - Badge avec couleur primaire
   - Lien vers `/pages/cart/cart.html`

4. **🌙 Mode Sombre**
   - Toggle soleil/lune
   - Transition smooth entre thèmes

5. **👤 Compte Utilisateur**
   - Dropdown avec options:
     - Se connecter (`/pages/account/login.html`)
     - S'inscrire (`/pages/account/register.html`)
     - Mon profil (`/pages/account/profile.html`)
     - Mes commandes (`/pages/account/orders.html`)
     - Support (`/pages/support`)

## Menu Mobile

### Boutons d'Action Mobile
- 🔍 Recherche mobile
- 🛒 Panier (avec compteur)
- 🍔 Menu hamburger

### Menu Overlay
**Style**: Slide-in depuis la droite
**Contenu**:
- 🏠 Accueil
- 📂 Toutes les catégories
- 🔥 Promotions
- 📝 Blog
- 📞 Contact
- Séparateur
- Se connecter
- S'inscrire

## Recherche Globale

### Barre de Recherche
- **Activation**: Click sur icône recherche
- **Style**: Slide down animation
- **Placeholder**: "Rechercher des produits..."
- **Position**: Pleine largeur sous le header

### Suggestions de Recherche
**Suggestions Populaires**:
- iPhone 15
- AirPods Pro
- Apple Watch

**Comportement**:
- Apparition au focus
- Click pour sélection
- Disparition au blur (avec délai)

## Structure d'URLs

### Pages Principales
```
/ (accueil)
/pages/categories/all.html (toutes catégories)
/pages/promotions.html
/pages/blog.html
/pages/contact.html
```

### Catégories avec Filtres
```
/pages/categories/electronique.html?sub=smartphones
/pages/categories/sante.html?sub=fitness
/pages/categories/maison.html?sub=smart-home
```

### Compte Utilisateur
```
/pages/account/login.html
/pages/account/register.html
/pages/account/profile.html
/pages/account/orders.html
```

### E-commerce
```
/pages/cart/cart.html
/pages/cart/checkout.html
/pages/cart/confirmation.html
```

## Animations et Interactions

### Transitions
- **Hover Effects**: Couleur primaire avec background subtil
- **Mega Menu**: Fade-in + scale avec cubic-bezier
- **Mobile Menu**: Slide-in transform avec backdrop
- **Recherche**: Slide down avec opacity

### États Actifs
- **Page Courante**: Auto-détection avec classe `.active`
- **Hover**: Transform + ombre pour suggestions
- **Focus**: Ring primaire pour accessibilité

### Compteurs Dynamiques
- **Panier**: Mise à jour temps réel
- **Wishlist**: Badge conditionnel
- **Produits**: Affichage par catégorie

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (menu hamburger)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (full navigation)

### Adaptations Mobile
- Logo condensé
- Menu simplifié
- Actions essentielles (recherche, panier, menu)
- Overlay full-screen pour navigation

Cette navigation offre une expérience utilisateur moderne avec un accès rapide à toutes les fonctionnalités du site e-commerce.