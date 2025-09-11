# Système de Panier et Checkout TechViral

## Architecture du Panier

### LocalStorage et Persistance
```javascript
// Structure des données panier
const cart = {
  items: [
    {
      id: 'prod_123',
      name: 'Caméra POV Portable HD',
      price: 89.99,
      originalPrice: 129.99,
      quantity: 2,
      image: '/assets/images/products/camera-pov.jpg',
      category: 'electronique',
      variant: { color: 'noir' },
      added_at: '2025-01-15T10:30:00Z'
    }
  ],
  subtotal: 179.98,
  discount: 36.00,
  shipping: 0.00,
  total: 143.98,
  promoCode: 'NEWUSER30',
  updated_at: '2025-01-15T10:31:15Z'
};
```

### Fonctionnalités de Base
- **Ajout produits**: Depuis pages catégories et produits
- **Modification quantités**: Validation stock en temps réel
- **Suppression items**: Avec confirmation
- **Sauvegarde automatique**: Sync localStorage
- **Récupération session**: Restauration au retour

## Interface Panier (Sidebar)

### Panier Slide-out
```html
<div id="cartSidebar" class="cart-sidebar hidden">
  <div class="cart-header">
    <h3>Mon Panier</h3>
    <button id="closeCart" class="btn-close">×</button>
  </div>
  
  <div class="cart-content">
    <div class="cart-items" id="cartItems">
      <!-- Items générés dynamiquement -->
      <div class="cart-item">
        <img src="camera-pov.jpg" alt="Caméra POV">
        <div class="item-details">
          <h4>Caméra POV Portable HD</h4>
          <p class="item-variant">Couleur: Noir</p>
          <div class="item-pricing">
            <span class="current-price">89,99 €</span>
            <span class="original-price">129,99 €</span>
          </div>
        </div>
        <div class="item-actions">
          <div class="quantity-controls">
            <button class="qty-decrease">−</button>
            <span class="qty-value">2</span>
            <button class="qty-increase">+</button>
          </div>
          <button class="btn-remove">🗑️</button>
        </div>
      </div>
    </div>
    
    <div class="cart-summary">
      <div class="summary-line">
        <span>Sous-total (2 articles)</span>
        <span>179,98 €</span>
      </div>
      <div class="summary-line discount">
        <span>Réduction (NEWUSER30)</span>
        <span>-36,00 €</span>
      </div>
      <div class="summary-line shipping">
        <span>Livraison</span>
        <span class="free">Gratuite</span>
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span>143,98 €</span>
      </div>
    </div>
  </div>
  
  <div class="cart-footer">
    <a href="/pages/cart/cart.html" class="btn-view-cart">
      Voir le panier complet
    </a>
    <a href="/pages/cart/checkout.html" class="btn-checkout">
      Finaliser la commande
    </a>
  </div>
</div>
```

### Badge Panier Header
```html
<button id="cartButton" class="cart-button">
  <svg class="cart-icon">...</svg>
  <span id="cartCount" class="cart-badge">2</span>
  <span id="cartTotal" class="cart-total">143,98 €</span>
</button>
```

## Page Panier Complète (/pages/cart/cart.html)

### Layout Principal
```html
<div class="cart-page-container">
  <div class="cart-main">
    <div class="cart-header">
      <h1>Mon Panier (2 articles)</h1>
      <button class="btn-clear-cart">Vider le panier</button>
    </div>
    
    <div class="cart-table">
      <div class="cart-table-header">
        <span>Produit</span>
        <span>Prix unitaire</span>
        <span>Quantité</span>
        <span>Total</span>
        <span>Actions</span>
      </div>
      
      <div class="cart-table-body">
        <div class="cart-row">
          <div class="product-info">
            <img src="camera-pov.jpg" alt="Caméra POV">
            <div class="product-details">
              <h3>Caméra POV Portable HD</h3>
              <p>Couleur: Noir • SKU: CAM-POV-001</p>
              <div class="product-badges">
                <span class="badge-promo">-30%</span>
                <span class="badge-stock">En stock</span>
              </div>
            </div>
          </div>
          
          <div class="unit-price">
            <span class="current-price">89,99 €</span>
            <span class="original-price">129,99 €</span>
          </div>
          
          <div class="quantity-controls">
            <button class="qty-btn qty-decrease">−</button>
            <input type="number" value="2" min="1" max="10">
            <button class="qty-btn qty-increase">+</button>
          </div>
          
          <div class="line-total">179,98 €</div>
          
          <div class="actions">
            <button class="btn-save-later">💾</button>
            <button class="btn-remove">🗑️</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section codes promo -->
    <div class="promo-section">
      <h3>Code promotionnel</h3>
      <div class="promo-input">
        <input type="text" placeholder="Entrez votre code promo">
        <button class="btn-apply-promo">Appliquer</button>
      </div>
      <div class="applied-promos">
        <div class="promo-applied">
          <span>NEWUSER30 (-30%)</span>
          <button class="btn-remove-promo">×</button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cart-sidebar-summary">
    <div class="summary-card">
      <h3>Récapitulatif</h3>
      
      <div class="summary-details">
        <div class="summary-line">
          <span>Sous-total (2 articles)</span>
          <span>179,98 €</span>
        </div>
        <div class="summary-line discount">
          <span>Réduction</span>
          <span>-36,00 €</span>
        </div>
        <div class="summary-line">
          <span>Livraison</span>
          <span class="free">Gratuite</span>
        </div>
        <div class="summary-line tax">
          <span>TVA (20%)</span>
          <span>23,99 €</span>
        </div>
      </div>
      
      <div class="summary-total">
        <span>Total TTC</span>
        <span>143,98 €</span>
      </div>
      
      <div class="checkout-actions">
        <button class="btn-checkout-express">
          🚀 Checkout Express
        </button>
        <button class="btn-checkout-standard">
          Finaliser la commande
        </button>
      </div>
      
      <div class="security-badges">
        <img src="ssl-secure.svg" alt="SSL Secure">
        <img src="visa-mastercard.svg" alt="Visa Mastercard">
        <img src="paypal.svg" alt="PayPal">
      </div>
    </div>
  </div>
</div>
```

## Checkout Standard (/pages/cart/checkout.html)

### Processus en Étapes
```html
<div class="checkout-container">
  <div class="checkout-progress">
    <div class="progress-step active">1. Livraison</div>
    <div class="progress-step">2. Paiement</div>
    <div class="progress-step">3. Confirmation</div>
  </div>
  
  <div class="checkout-main">
    <!-- Étape 1: Informations de livraison -->
    <div class="checkout-step" id="shipping-step">
      <h2>Informations de livraison</h2>
      
      <div class="address-selection">
        <h3>Choisir une adresse</h3>
        <div class="address-options">
          <div class="address-card selected">
            <input type="radio" name="address" value="existing-1" checked>
            <div class="address-info">
              <h4>Marie Dubois</h4>
              <p>15 rue de la République<br>75001 Paris</p>
            </div>
            <button class="btn-edit-address">Modifier</button>
          </div>
          
          <div class="address-card new">
            <input type="radio" name="address" value="new">
            <div class="address-info">
              <h4>+ Nouvelle adresse</h4>
              <p>Ajouter une nouvelle adresse de livraison</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="shipping-options">
        <h3>Mode de livraison</h3>
        <div class="shipping-methods">
          <div class="shipping-method selected">
            <input type="radio" name="shipping" value="standard" checked>
            <div class="method-info">
              <h4>Livraison standard</h4>
              <p>3-5 jours ouvrés</p>
            </div>
            <span class="method-price free">Gratuit</span>
          </div>
          
          <div class="shipping-method">
            <input type="radio" name="shipping" value="express">
            <div class="method-info">
              <h4>Livraison express</h4>
              <p>24-48h</p>
            </div>
            <span class="method-price">9,99 €</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Étape 2: Paiement -->
    <div class="checkout-step hidden" id="payment-step">
      <h2>Informations de paiement</h2>
      
      <div class="payment-methods">
        <div class="payment-method selected">
          <input type="radio" name="payment" value="card" checked>
          <span class="method-label">💳 Carte bancaire</span>
          <div class="card-logos">
            <img src="visa.svg" alt="Visa">
            <img src="mastercard.svg" alt="Mastercard">
          </div>
        </div>
        
        <div class="payment-method">
          <input type="radio" name="payment" value="paypal">
          <span class="method-label">💰 PayPal</span>
        </div>
      </div>
      
      <div class="card-form" id="card-form">
        <div class="form-row">
          <div class="form-group">
            <label>Numéro de carte</label>
            <div id="card-number-element"></div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Date d'expiration</label>
            <div id="card-expiry-element"></div>
          </div>
          <div class="form-group">
            <label>Code CVC</label>
            <div id="card-cvc-element"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Nom sur la carte</label>
          <input type="text" placeholder="Marie Dubois">
        </div>
      </div>
    </div>
  </div>
  
  <div class="checkout-sidebar">
    <div class="order-summary">
      <h3>Votre commande</h3>
      
      <div class="order-items">
        <div class="order-item">
          <img src="camera-pov.jpg" alt="Caméra POV">
          <div class="item-details">
            <h4>Caméra POV Portable HD</h4>
            <p>Quantité: 2</p>
          </div>
          <span class="item-total">179,98 €</span>
        </div>
      </div>
      
      <div class="order-totals">
        <div class="total-line">
          <span>Sous-total</span>
          <span>179,98 €</span>
        </div>
        <div class="total-line discount">
          <span>Réduction</span>
          <span>-36,00 €</span>
        </div>
        <div class="total-line">
          <span>Livraison</span>
          <span>Gratuite</span>
        </div>
        <div class="total-line final">
          <span>Total</span>
          <span>143,98 €</span>
        </div>
      </div>
      
      <button class="btn-place-order" disabled>
        Finaliser la commande
      </button>
    </div>
  </div>
</div>
```

## Checkout Express

### Interface Simplifiée
```html
<div class="express-checkout">
  <h1>Checkout Express</h1>
  <p>Commande en moins de 60 secondes</p>
  
  <div class="express-buttons">
    <button class="btn-apple-pay">
      <img src="apple-pay.svg"> Apple Pay
    </button>
    <button class="btn-google-pay">
      <img src="google-pay.svg"> Google Pay
    </button>
    <button class="btn-paypal-express">
      <img src="paypal.svg"> PayPal Express
    </button>
  </div>
  
  <div class="express-form">
    <div class="form-group">
      <label>Email de confirmation</label>
      <input type="email" placeholder="votre@email.com">
    </div>
    
    <div class="express-summary">
      <div class="summary-item">
        <span>2 articles</span>
        <span>143,98 €</span>
      </div>
      <div class="summary-shipping">
        <span>Livraison à votre adresse habituelle</span>
        <span>Gratuite</span>
      </div>
    </div>
    
    <button class="btn-express-order">
      Confirmer commande express
    </button>
  </div>
</div>
```

## Page Confirmation (/pages/cart/confirmation.html)

### Confirmation de Commande
```html
<div class="confirmation-page">
  <div class="confirmation-hero">
    <div class="success-icon">✅</div>
    <h1>Commande confirmée !</h1>
    <p>Merci Marie, votre commande a été enregistrée avec succès.</p>
  </div>
  
  <div class="order-details">
    <div class="order-info">
      <h2>Commande #TV-2025-001234</h2>
      <div class="order-meta">
        <span>Date: 15 janvier 2025</span>
        <span>Email: marie.dubois@email.com</span>
      </div>
    </div>
    
    <div class="delivery-info">
      <h3>Livraison</h3>
      <p>📍 15 rue de la République, 75001 Paris</p>
      <p>🚚 Livraison standard (3-5 jours)</p>
      <p>📧 Vous recevrez un email de suivi</p>
    </div>
    
    <div class="next-steps">
      <h3>Prochaines étapes</h3>
      <ul>
        <li>✅ Commande confirmée</li>
        <li>⏳ Préparation en cours (24-48h)</li>
        <li>📦 Expédition</li>
        <li>🚚 Livraison</li>
      </ul>
    </div>
  </div>
  
  <div class="confirmation-actions">
    <a href="/pages/account/orders.html" class="btn-track-order">
      Suivre ma commande
    </a>
    <a href="/" class="btn-continue-shopping">
      Continuer mes achats
    </a>
    <button class="btn-download-invoice">
      Télécharger la facture
    </button>
  </div>
</div>
```

## Fonctionnalités Avancées

### 1. Gestion Stock Temps Réel
```javascript
// Vérification stock avant ajout
async function checkStockAvailability(productId, quantity) {
  const response = await fetch('/api/inventory/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity })
  });
  return response.json();
}
```

### 2. Calcul Frais de Port Dynamique
```javascript
// Calcul basé sur poids, destination, mode
function calculateShipping(items, address, method) {
  const weight = items.reduce((total, item) => total + item.weight * item.quantity, 0);
  const distance = getDistanceFromWarehouse(address);
  return shippingRates[method].calculate(weight, distance);
}
```

### 3. Codes Promo et Réductions
```javascript
// Validation et application codes promo
const promoCodes = {
  'NEWUSER30': { type: 'percentage', value: 30, minOrder: 50 },
  'SHIP5': { type: 'shipping', value: 5 },
  'LOYAL10': { type: 'fixed', value: 10, userLevel: 'gold' }
};
```

### 4. Abandon Cart Recovery
- **Email automatiques**: 24h, 72h, 7 jours après abandon
- **Codes promo incitatifs**: Réductions pour finaliser
- **Push notifications**: Si PWA installée
- **Retargeting ads**: Pixels de suivi intégrés

Ce système de panier et checkout offre une expérience fluide avec options express et standard, gestion complète des promotions et fonctionnalités avancées pour optimiser la conversion.