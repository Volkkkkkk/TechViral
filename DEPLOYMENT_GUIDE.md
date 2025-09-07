# 📖 GUIDE DÉTAILLÉ DE DÉPLOIEMENT HOSTINGER

## 🚀 **ÉTAPE 1 : SOLUTION IMMÉDIATE (5 minutes)**

### **Accéder à votre panel Hostinger**
1. Connectez-vous à [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Sélectionnez votre site `antiquewhite-rabbit-562143.hostingersite.com`
3. Cliquez sur "Gestionnaire de fichiers"

### **Upload du script hotfix**
1. **Naviguez vers** : `public_html/assets/js/`
2. **Uploadez** le fichier `cart-hotfix.js`
3. **Renommez-le** en `cart.js` (cela remplacera l'ancien)
   - OU gardez le nom et modifiez vos pages (voir Alternative ci-dessous)

### **Alternative : Inclure le script hotfix**
Si vous préférez garder l'ancien script, ajoutez dans vos pages HTML :
```html
<!-- Juste avant </body> -->
<script src="assets/js/cart-hotfix.js"></script>
```

### **Test immédiat**
1. Allez sur votre site : https://antiquewhite-rabbit-562143.hostingersite.com
2. Cliquez sur "Ajouter au panier" → Vous devriez voir une notification verte
3. Le compteur panier devrait se mettre à jour

---

## 🔧 **ÉTAPE 2 : DÉPLOIEMENT COMPLET (30 minutes)**

### **2.1 Pages principales**

**Page d'accueil :**
```
📁 public_html/
└── index.html ← Remplacer
```

**Pages de catégories :**
```
📁 public_html/pages/categories/
├── sante.html ← Remplacer
├── electronique.html ← Remplacer  
├── mode.html ← Remplacer
├── maison.html ← Remplacer
├── bebe.html ← Remplacer
└── lifestyle.html ← Remplacer
```

### **2.2 Pages produits**
```
📁 public_html/pages/products/
├── camera-pov-gopro-hero13.html ← Remplacer
├── bouteille-hydrogene-piurify.html ← Remplacer
├── cotons-demaquillants-reutilisables.html ← Remplacer
└── collier-gps-intelligent.html ← Remplacer
```

### **2.3 Système de panier**
```
📁 public_html/pages/cart/
├── index.html ← Remplacer (panier dynamique)
├── checkout.html ← Remplacer (avec données)
└── confirmation.html ← Remplacer (avec historique)
```

### **2.4 Script principal**
```
📁 public_html/assets/js/
└── cart.js ← Remplacer par la version complète
```

---

## 🧪 **ÉTAPE 3 : TESTS DE VALIDATION**

### **3.1 Test Page d'Accueil**
```
URL: https://antiquewhite-rabbit-562143.hostingersite.com

✅ Cliquer sur chaque bouton "Ajouter au panier"
✅ Vérifier notification verte "X ajouté au panier" 
✅ Compteur panier en haut à droite : passe de (0) à (1), (2), etc.
✅ Console F12 : pas d'erreurs rouges
```

### **3.2 Test Page Santé**
```
URL: https://antiquewhite-rabbit-562143.hostingersite.com/pages/categories/sante.html

✅ Tous les boutons "Ajouter au panier" fonctionnent
✅ Cliquer sur l'icône panier → redirection vers page panier
✅ Synchronisation : produits ajoutés depuis accueil apparaissent
```

### **3.3 Test Page Panier**
```
URL: https://antiquewhite-rabbit-562143.hostingersite.com/pages/cart/index.html

✅ Produits ajoutés s'affichent correctement
✅ Boutons +/- pour modifier quantités
✅ Bouton X pour supprimer (avec confirmation)
✅ Code promo WELCOME10 : -10% calculé correctement
✅ Code promo TECH25 : -25€ déduit du total
✅ Bouton "Passer commande" → redirection checkout
```

### **3.4 Test Checkout**
```
URL: https://antiquewhite-rabbit-562143.hostingersite.com/pages/cart/checkout.html

✅ Résumé commande avec produits du panier
✅ Formulaire de livraison/paiement
✅ Bouton "Finaliser commande" → redirection confirmation
```

### **3.5 Test Confirmation**
```
URL: https://antiquewhite-rabbit-562143.hostingersite.com/pages/cart/confirmation.html

✅ Détails de la commande affichés
✅ Numéro de commande généré
✅ Panier vidé automatiquement
```

---

## 🔍 **ÉTAPE 4 : DIAGNOSTIC EN CAS DE PROBLÈME**

### **4.1 Le panier ne fonctionne pas du tout**

**Vérifications :**
1. **Console F12** → Onglet "Console" → Chercher erreurs rouges
2. **Network F12** → Onglet "Network" → Vérifier si cart.js se charge (200 OK)
3. **Chemin du script** dans le HTML :
   ```html
   <script src="assets/js/cart.js"></script>
   ```

**Solutions :**
- Vérifier que le fichier existe : `public_html/assets/js/cart.js`
- Tester avec le fichier hotfix
- Vérifier les permissions (755 pour dossiers, 644 pour fichiers)

### **4.2 Les boutons ne réagissent pas**

**Test en console :**
```javascript
// Ouvrir F12 → Console, taper :
document.querySelectorAll('button')
// Vérifier si les boutons sont détectés

window.cartManager
// Doit afficher l'objet CartManager
```

**Solutions :**
- Utiliser la version hotfix qui détecte par texte
- Vérifier que les boutons contiennent "Ajouter au panier"

### **4.3 Le compteur ne se met pas à jour**

**Debug console :**
```javascript
window.cartManager.debugCart()
// Affiche l'état du panier

window.cartManager.updateCartBadge()
// Force la mise à jour
```

---

## 📞 **SUPPORT TECHNIQUE HOSTINGER**

### **Accès aux fichiers**
- **Gestionnaire de fichiers** : Via hPanel
- **FTP** : Utilisez FileZilla avec vos identifiants FTP
- **SSH** : Si activé sur votre plan

### **Permissions recommandées**
- **Dossiers** : 755 (drwxr-xr-x)
- **Fichiers HTML/JS** : 644 (-rw-r--r--)

### **Cache**
Après upload, videz le cache :
- **Ctrl+F5** sur votre navigateur
- **Cache Hostinger** : hPanel → Performance → Purger cache

---

## 🎯 **RÉSUMÉ ACTIONS CRITIQUES**

### **MINIMUM pour que ça marche :**
```
1. Uploader assets/js/cart-hotfix.js
2. Le renommer en cart.js  
3. Tester sur la page d'accueil
```

### **COMPLET pour toutes les fonctionnalités :**
```
1. Uploader tous les fichiers listés
2. Tester chaque page une par une
3. Valider le workflow complet
```

---

## ✨ **FONCTIONNALITÉS DÉPLOYÉES**

Après déploiement complet, votre site aura :

- 🛒 **Panier fonctionnel** sur toutes les pages
- 🔄 **Synchronisation temps réel** entre onglets  
- 💾 **Persistance** des données (localStorage)
- 🎁 **5 codes promo** actifs
- 📱 **Responsive** et accessible
- 🌍 **Multilingue** (FR/EN/ES)
- 📊 **Analytics** intégrés
- ✅ **Workflow e-commerce** complet

**🚀 Votre site sera prêt pour la production !**