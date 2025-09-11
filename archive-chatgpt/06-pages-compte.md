# Pages Compte Utilisateur TechViral

## Structure des Pages Compte

### Pages Disponibles
1. **login.html** - Connexion utilisateur
2. **register.html** - Inscription nouveau compte  
3. **profile.html** - Profil et paramètres
4. **orders.html** - Historique commandes
5. **wishlist.html** - Liste de souhaits
6. **addresses.html** - Adresses de livraison
7. **payment-methods.html** - Moyens de paiement
8. **support.html** - Support client

## Page de Connexion (login.html)

### Interface de Connexion
```html
<div class="login-container">
  <div class="login-card">
    <h1>Se connecter à TechViral</h1>
    <p>Accédez à votre compte pour profiter de tous nos services</p>
    
    <form id="loginForm" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="votre@email.com" required>
      </div>
      
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" placeholder="••••••••" required>
        <button type="button" class="password-toggle">👁️</button>
      </div>
      
      <div class="form-options">
        <label class="checkbox">
          <input type="checkbox" id="remember">
          <span>Se souvenir de moi</span>
        </label>
        <a href="forgot-password.html">Mot de passe oublié ?</a>
      </div>
      
      <button type="submit" class="btn-login">Se connecter</button>
    </form>
  </div>
</div>
```

### Fonctionnalités de Connexion
- **Validation en temps réel**: Email format, mot de passe requis
- **Toggle mot de passe**: Afficher/masquer le mot de passe
- **Remember me**: Session persistante
- **Social login**: Google, Facebook, Apple
- **2FA optionnelle**: Authentication à deux facteurs

### Options de Connexion Alternatives
```html
<div class="social-login">
  <button class="btn-google">
    <img src="google-icon.svg" alt="Google">
    Continuer avec Google
  </button>
  <button class="btn-facebook">
    <img src="facebook-icon.svg" alt="Facebook">
    Continuer avec Facebook
  </button>
</div>
```

## Page d'Inscription (register.html)

### Formulaire d'Inscription
```html
<form id="registerForm" class="register-form">
  <div class="form-row">
    <div class="form-group">
      <label for="firstName">Prénom *</label>
      <input type="text" id="firstName" required>
    </div>
    <div class="form-group">
      <label for="lastName">Nom *</label>
      <input type="text" id="lastName" required>
    </div>
  </div>
  
  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" required>
    <span class="validation-status"></span>
  </div>
  
  <div class="form-group">
    <label for="phone">Téléphone</label>
    <input type="tel" id="phone">
  </div>
  
  <div class="form-group">
    <label for="password">Mot de passe *</label>
    <input type="password" id="password" required>
    <div class="password-strength">
      <div class="strength-bar"></div>
      <span class="strength-text">Faible</span>
    </div>
  </div>
  
  <div class="form-group">
    <label for="confirmPassword">Confirmer le mot de passe *</label>
    <input type="password" id="confirmPassword" required>
  </div>
  
  <div class="form-group">
    <label class="checkbox">
      <input type="checkbox" id="newsletter">
      <span>Je souhaite recevoir les offres et actualités TechViral</span>
    </label>
  </div>
  
  <div class="form-group">
    <label class="checkbox required">
      <input type="checkbox" id="terms" required>
      <span>J'accepte les <a href="/legal/terms">conditions d'utilisation</a> et la <a href="/legal/privacy">politique de confidentialité</a></span>
    </label>
  </div>
  
  <button type="submit" class="btn-register">Créer mon compte</button>
</form>
```

### Validation Avancée
- **Force du mot de passe**: Indicateur visuel en temps réel
- **Vérification email**: Uniqueness check via API
- **Validation téléphone**: Format international
- **CAPTCHA**: Protection anti-bot
- **RGPD compliance**: Consentements explicites

## Page Profil (profile.html)

### Dashboard Utilisateur
```html
<div class="profile-dashboard">
  <div class="dashboard-sidebar">
    <div class="user-avatar">
      <img src="avatar.jpg" alt="Photo de profil">
      <button class="btn-change-avatar">Changer</button>
    </div>
    <h2>Marie Dubois</h2>
    <p class="user-level">Membre Gold 🏆</p>
    
    <nav class="dashboard-nav">
      <a href="#profile" class="nav-link active">👤 Mon profil</a>
      <a href="#orders" class="nav-link">📦 Mes commandes</a>
      <a href="#wishlist" class="nav-link">❤️ Ma wishlist</a>
      <a href="#addresses" class="nav-link">📍 Mes adresses</a>
      <a href="#payment" class="nav-link">💳 Mes paiements</a>
      <a href="#loyalty" class="nav-link">🎁 Programme fidélité</a>
      <a href="#settings" class="nav-link">⚙️ Paramètres</a>
    </nav>
  </div>
  
  <div class="dashboard-content">
    <!-- Contenu dynamique selon section sélectionnée -->
  </div>
</div>
```

### Section Informations Personnelles
```html
<div class="profile-section" id="profile">
  <h3>Informations personnelles</h3>
  
  <form class="profile-form">
    <div class="form-row">
      <div class="form-group">
        <label>Prénom</label>
        <input type="text" value="Marie">
      </div>
      <div class="form-group">
        <label>Nom</label>
        <input type="text" value="Dubois">
      </div>
    </div>
    
    <div class="form-group">
      <label>Email</label>
      <input type="email" value="marie.dubois@email.com">
      <span class="status verified">✓ Vérifié</span>
    </div>
    
    <div class="form-group">
      <label>Téléphone</label>
      <input type="tel" value="+33 6 12 34 56 78">
    </div>
    
    <div class="form-group">
      <label>Date de naissance</label>
      <input type="date" value="1990-05-15">
    </div>
    
    <button type="submit" class="btn-save">Sauvegarder</button>
  </form>
</div>
```

## Page Commandes (orders.html)

### Historique des Commandes
```html
<div class="orders-section">
  <div class="orders-header">
    <h2>Mes commandes</h2>
    <div class="orders-filters">
      <select id="orderStatus">
        <option value="all">Toutes les commandes</option>
        <option value="pending">En attente</option>
        <option value="shipped">Expédiées</option>
        <option value="delivered">Livrées</option>
      </select>
      <input type="date" id="orderDate" placeholder="Date">
    </div>
  </div>
  
  <div class="orders-list">
    <div class="order-card">
      <div class="order-header">
        <div class="order-number">#TV-2025-001234</div>
        <div class="order-date">15 janvier 2025</div>
        <div class="order-status status-delivered">Livrée</div>
      </div>
      
      <div class="order-items">
        <div class="order-item">
          <img src="camera-pov.jpg" alt="Caméra POV">
          <div class="item-details">
            <h4>Caméra POV Portable HD</h4>
            <p>Quantité: 1 • Prix: 89,99 €</p>
          </div>
        </div>
      </div>
      
      <div class="order-footer">
        <div class="order-total">Total: 89,99 €</div>
        <div class="order-actions">
          <button class="btn-reorder">Commander à nouveau</button>
          <button class="btn-track">Suivi colis</button>
          <button class="btn-review">Laisser un avis</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Détails de Commande
- **Numéro de tracking**: Lien vers transporteur
- **Facture PDF**: Téléchargement
- **Status temps réel**: Suivi automatique
- **Options retour**: Interface simplifiée
- **Support**: Chat direct depuis commande

## Programme Fidélité

### Dashboard Fidélité
```html
<div class="loyalty-dashboard">
  <div class="loyalty-header">
    <h2>Programme TechViral Gold</h2>
    <div class="current-points">
      <span class="points-number">2,450</span>
      <span class="points-label">points</span>
    </div>
  </div>
  
  <div class="level-progress">
    <div class="current-level">
      <span class="level-icon">🥇</span>
      <span class="level-name">Gold</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 60%"></div>
    </div>
    <div class="next-level">
      <span class="level-icon">💎</span>
      <span class="level-name">Platinum</span>
      <span class="points-needed">+1,550 points</span>
    </div>
  </div>
  
  <div class="benefits-grid">
    <div class="benefit active">
      <span class="benefit-icon">🚚</span>
      <h4>Livraison gratuite</h4>
      <p>Sur toutes vos commandes</p>
    </div>
    <div class="benefit active">
      <span class="benefit-icon">🎯</span>
      <h4>Offres exclusives</h4>
      <p>Accès prioritaire aux promos</p>
    </div>
  </div>
</div>
```

### Récompenses Disponibles
```html
<div class="rewards-grid">
  <div class="reward-card">
    <div class="reward-discount">-10%</div>
    <h4>Réduction fidélité</h4>
    <p>Valable sur votre prochaine commande</p>
    <div class="reward-cost">500 points</div>
    <button class="btn-redeem">Échanger</button>
  </div>
  
  <div class="reward-card premium">
    <div class="reward-gift">🎁</div>
    <h4>Produit gratuit</h4>
    <p>Écouteurs sans fil premium</p>
    <div class="reward-cost">2,000 points</div>
    <button class="btn-redeem">Échanger</button>
  </div>
</div>
```

## Gestion des Adresses

### Liste des Adresses
```html
<div class="addresses-section">
  <div class="addresses-header">
    <h3>Mes adresses de livraison</h3>
    <button class="btn-add-address">+ Ajouter une adresse</button>
  </div>
  
  <div class="addresses-list">
    <div class="address-card default">
      <div class="address-badge">Principale</div>
      <div class="address-content">
        <h4>Marie Dubois</h4>
        <p>15 rue de la République<br>
           75001 Paris<br>
           France</p>
        <p>Tél: +33 6 12 34 56 78</p>
      </div>
      <div class="address-actions">
        <button class="btn-edit">Modifier</button>
        <button class="btn-delete">Supprimer</button>
      </div>
    </div>
  </div>
</div>
```

## Sécurité et Paramètres

### Paramètres de Sécurité
```html
<div class="security-settings">
  <h3>Sécurité du compte</h3>
  
  <div class="security-item">
    <div class="security-info">
      <h4>Mot de passe</h4>
      <p>Dernière modification: il y a 3 mois</p>
    </div>
    <button class="btn-change">Modifier</button>
  </div>
  
  <div class="security-item">
    <div class="security-info">
      <h4>Authentification à deux facteurs</h4>
      <p>Protection renforcée de votre compte</p>
    </div>
    <label class="toggle">
      <input type="checkbox">
      <span class="toggle-slider"></span>
    </label>
  </div>
  
  <div class="security-item">
    <div class="security-info">
      <h4>Sessions actives</h4>
      <p>Gérez vos connexions sur différents appareils</p>
    </div>
    <button class="btn-manage">Gérer</button>
  </div>
</div>
```

### Préférences de Communication
```html
<div class="communication-prefs">
  <h3>Préférences de communication</h3>
  
  <div class="pref-item">
    <label class="checkbox">
      <input type="checkbox" checked>
      <span>Offres et promotions</span>
    </label>
  </div>
  
  <div class="pref-item">
    <label class="checkbox">
      <input type="checkbox" checked>
      <span>Nouveaux produits</span>
    </label>
  </div>
  
  <div class="pref-item">
    <label class="checkbox">
      <input type="checkbox">
      <span>Conseils et astuces</span>
    </label>
  </div>
</div>
```

Ces pages de compte offrent une expérience utilisateur complète avec gestion sécurisée des données, programme de fidélité engageant et interface intuitive pour toutes les fonctionnalités e-commerce.