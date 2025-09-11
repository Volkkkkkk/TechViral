# 🚀 TechViral - Déploiement Automatique

## Méthode Validée : Git → GitHub → Hostinger Webhook

### Configuration
- **Dépôt GitHub :** https://github.com/Volkkkkkk/TechViral
- **Webhook Hostinger :** https://webhooks.hostinger.com/deploy/d37a13fcd9463c803eccd17637ed3c6e
- **Site en ligne :** https://antiquewhite-rabbit-562143.hostingersite.com/

### Workflow de Déploiement
```bash
# 1. Modifier les fichiers localement
# 2. Commit et push vers GitHub
git add .
git commit -m "Description des changements"

# IMPORTANT: Le webhook Hostinger suit la branche 'main'
git push origin main

# 3. Le webhook Hostinger se déclenche automatiquement
# 4. Site synchronisé en ~10 secondes
```

### ⚠️ **Problème Résolu - Branches Git**
**Cause du problème :** Le webhook Hostinger était configuré pour la branche `main` mais nous poussions vers `master`.

**Solution appliquée :**
1. Synchronisation `master` → `main` 
2. Push vers branche `main` pour déclencher le webhook
3. Déploiement automatique maintenant fonctionnel ✅

### Avantages
✅ Automatique - pas d'intervention manuelle  
✅ Sécurisé - pas d'accès SSH/FTP exposé  
✅ Rapide - synchronisation quasi-instantanée  
✅ Historique - traçabilité complète via Git  

### Commandes Utiles
- `git status` : Vérifier les modifications
- `git log --oneline -5` : Historique des commits
- `git push origin master` : Déclencher le déploiement

---
*Méthode recommandée par Hostinger : https://support.hostinger.com/en/articles/1583296-how-to-deploy-a-website-using-git*