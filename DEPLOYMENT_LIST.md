# 🚀 GUIDE DE DÉPLOIEMENT - SYSTÈME DE PANIER TECHVIRAL

## 📋 FICHIERS À UPLOADER SUR LE SERVEUR

### 🔥 **SOLUTION IMMÉDIATE (Upload en priorité)**

**1. Remplacer le script cart.js actuel :**
```
📄 assets/js/cart-hotfix.js → Uploader comme assets/js/cart.js
```
OU inclure le script hotfix en plus :
```
📄 assets/js/cart-hotfix.js → Nouveau fichier
```

### 📝 **MODIFICATIONS PAGES PRINCIPALES**

**2. Page d'accueil avec boutons corrigés :**
```
📄 index.html → Remplace la version actuelle
```

**3. Pages de catégories standardisées :**
```
📄 pages/categories/sante.html → Version avec classes add-to-cart
📄 pages/categories/electronique.html → Version avec navigation panier
📄 pages/categories/mode.html → Version avec classes
📄 pages/categories/maison.html → Version avec classes  
📄 pages/categories/bebe.html → Version avec classes
📄 pages/categories/lifestyle.html → Version avec classes
```

**4. Pages produits améliorées :**
```
📄 pages/products/camera-pov-gopro-hero13.html → Classes add-to-cart + navigation
📄 pages/products/bouteille-hydrogene-piurify.html → Classes + IDs corrigés
📄 pages/products/cotons-demaquillants-reutilisables.html → Classes + navigation
📄 pages/products/collier-gps-intelligent.html → Classes + IDs corrigés
```

**5. Système de panier dynamique :**
```
📄 pages/cart/index.html → Panier dynamique intégré
📄 pages/cart/checkout.html → Avec chargement données panier
📄 pages/cart/confirmation.html → Avec données de commande
```

### 🧪 **FICHIERS DE TEST (Optionnels)**
```
📄 tests/cart.test.js → Tests unitaires complets
```

---

## 🔧 **INSTRUCTIONS D'INSTALLATION**

### **OPTION 1 : Solution Immédiate (Recommandée)**

1. **Uploader le script hotfix :**
   - Prendre le fichier `assets/js/cart-hotfix.js`
   - L'uploader sur votre serveur Hostinger
   - **OPTION A :** Le renommer en `cart.js` pour remplacer l'ancien
   - **OPTION B :** Garder le nom et modifier vos pages HTML pour inclure :
   ```html
   <script src="assets/js/cart-hotfix.js"></script>
   ```

### **OPTION 2 : Déploiement Complet**

1. **Uploader TOUS les fichiers modifiés** listés ci-dessus
2. Tester chaque page une par une
3. Vérifier que les boutons fonctionnent

---

## 🧪 **TESTS À EFFECTUER APRÈS DÉPLOIEMENT**

### **Test 1 : Page d'accueil**
- ✅ Cliquer sur "Ajouter au panier" → Notification verte
- ✅ Compteur panier en haut à droite se met à jour
- ✅ Console navigateur sans erreurs

### **Test 2 : Page catégorie (ex: santé)**
- ✅ Boutons "Ajouter au panier" fonctionnent
- ✅ Navigation vers le panier fonctionne
- ✅ Synchronisation des compteurs

### **Test 3 : Page produit**
- ✅ Bouton principal d'ajout fonctionne
- ✅ Sélection de variantes/quantité
- ✅ Redirection vers panier

### **Test 4 : Page panier**
- ✅ Affichage des produits ajoutés
- ✅ Modification quantités (+/-)
- ✅ Suppression produits
- ✅ Codes promo (WELCOME10, TECH25)
- ✅ Bouton "Passer commande"

### **Test 5 : Checkout & Confirmation**
- ✅ Données panier chargées
- ✅ Formulaire de commande
- ✅ Page de confirmation avec détails

---

## 🚨 **CODES PROMO DISPONIBLES**

```
WELCOME10   → 10% de réduction
TECH25      → 25€ de réduction fixe  
FIRST50     → 50% première commande
NEWYEAR2025 → 15% Nouvel An
FREESHIP    → Livraison gratuite
```

---

## 🔍 **COMMANDES DE DEBUG**

Après déploiement, ouvrir la console navigateur (F12) et taper :

```javascript
// Voir l'état du panier
debugCart()

// Vider le panier
clearCart()

// Forcer la synchronisation
window.cartManager.updateCartBadge()
```

---

## 📞 **EN CAS DE PROBLÈME**

Si après déploiement ça ne fonctionne toujours pas :

1. **Vérifier la console** (F12) pour les erreurs JavaScript
2. **Tester avec le hotfix** en incluant le script cart-hotfix.js
3. **Vérifier les chemins** des scripts dans vos pages HTML
4. **Tester étape par étape** : d'abord la page d'accueil, puis les autres

---

## 🎉 **FONCTIONNALITÉS APRÈS DÉPLOIEMENT**

- ✅ **Panier persistant** (localStorage)
- ✅ **Synchronisation inter-onglets** 
- ✅ **5 codes promo** fonctionnels
- ✅ **Notifications visuelles**
- ✅ **Accessibilité** (clavier + screen readers)
- ✅ **Multilingue** (FR/EN/ES)
- ✅ **Analytics** intégrés
- ✅ **Workflow complet** panier → checkout → confirmation
- ✅ **Tests unitaires** disponibles
- ✅ **Performance optimisée**

---

**🔥 PRIORITÉ : Uploader au minimum le fichier `cart-hotfix.js` pour que le panier fonctionne immédiatement !**