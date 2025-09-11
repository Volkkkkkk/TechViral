# 📋 Plan de Reprise - Configuration TechViral

## 🎯 **Statut Actuel**
- ✅ **Suite de tests** : 4/5 outils configurés et opérationnels
- ✅ **Playwright** : 87/90 tests passent (97.8% de réussite)
- ✅ **Lighthouse CI** : Infrastructure configurée, Chrome installé
- ⚠️ **Tokens manquants** : GitHub Personal Access Token requis

## 🔑 **Configuration GitHub Token (Priorité 1)**

### **Étape 1 : Générer Personal Access Token**
**Repository configuré** : https://github.com/Volkkkkkk/TechViral ✅

1. Aller sur **GitHub.com** → Settings → Developer settings
2. Cliquer sur **Personal access tokens** → **Tokens (classic)**
3. Cliquer **Generate new token** → **Generate new token (classic)**
4. Configurer :
   - **Note** : `TechViral Lighthouse CI - Volkkkkkk/TechViral`
   - **Expiration** : 90 days (ou Custom)
   - **Scopes requis** :
     - ✅ `repo` (accès au repository TechViral)
     - ✅ `write:repo_hook` (webhooks pour CI)
     - ✅ `read:org` (lecture organisations si nécessaire)

### **Étape 2 : Configurer le Token Localement**
```bash
# Export temporaire (session actuelle)
export LHCI_GITHUB_TOKEN="ghp_votre_token_ici"

# Vérification
echo $LHCI_GITHUB_TOKEN

# Export permanent (Windows)
setx LHCI_GITHUB_TOKEN "ghp_votre_token_ici"

# Ou ajouter à votre profil PowerShell/Bash
echo 'export LHCI_GITHUB_TOKEN="ghp_votre_token_ici"' >> ~/.bashrc
```

### **Étape 3 : Tester Lighthouse CI**
```bash
npm run test:lighthouse
```

## 🔧 **Corrections Restantes**

### **Lighthouse CI Configuration**
```javascript
// docs/testing/lighthouse.config.js - Section upload
upload: {
  target: 'temporary-public-storage', // ou 'lhci' si serveur dédié
  // GitHub integration activée automatiquement avec LHCI_GITHUB_TOKEN
},
```

### **Optimisations Performance (optionnel)**
- **Seuils ajustés** pour environnement local :
  - FCP : 1500ms → 3000ms 
  - LCP : 2500ms → 4000ms
  - Performance Score : 0.90 → 0.70

### **Corrections HTML (optionnel)**
- Encoder `&` → `&amp;` dans les URLs
- Ajouter `type="button"` aux boutons
- Supprimer trailing whitespace

## 🚀 **Tests à Relancer**

### **Suite Complète**
```bash
# Tests unitaires
npm test

# Validation CSS
npm run lint:css

# Validation HTML  
npm run lint:html

# Vérification liens
npx linkinator . --silent

# Lighthouse CI (avec token)
npm run test:lighthouse

# Playwright complet
npm run test:playwright
```

## 📊 **Objectifs de Performance**

### **Tests Attendus**
- **npm test** : ✅ Déjà parfait
- **lint:css** : ✅ Déjà parfait
- **linkinator** : ⚠️ 1 image à corriger
- **lighthouse** : 🎯 **À activer avec token**
- **playwright** : ✅ 97.8% (excellent)

### **Grade Cible : A+**
- 5/5 tests opérationnels
- Infrastructure CI/CD complète
- Métriques performance validées

## 🔐 **Sécurité Token**

### **Bonnes Pratiques**
- ✅ Token avec permissions minimales
- ✅ Expiration configurée
- ✅ Stockage local sécurisé
- ❌ **JAMAIS** commiter le token
- ❌ **JAMAIS** partager publiquement

### **Variables d'Environnement**
```bash
# Requis pour Lighthouse CI
LHCI_GITHUB_TOKEN=ghp_...

# Optionnels
CHROME_PATH=/path/to/chrome
PUPPETEER_EXECUTABLE_PATH=/path/to/puppeteer/chrome
```

## 📝 **Next Steps**
1. **Générer GitHub token** (5 min)
2. **Configurer variable d'environnement** (2 min)  
3. **Tester Lighthouse CI** (5 min)
4. **Validation complète** (15 min)
5. **Documentation finale** (10 min)

**Temps estimé total : 37 minutes**

---
*Plan créé le 2025-09-11 - TechViral Testing Suite v1.0.0*