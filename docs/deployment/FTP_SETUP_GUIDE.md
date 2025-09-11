# 🔧 Guide Configuration FTP Hostinger

## 🎯 Récupérer vos identifiants FTP

### **Étape 1 : Accéder à hPanel**
1. Connectez-vous à [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Sélectionnez votre site `antiquewhite-rabbit-562143.hostingersite.com`

### **Étape 2 : Trouver les identifiants FTP**
1. Dans le menu de gauche → **Fichiers** → **Gestionnaire de fichiers**
2. OU directement → **Comptes FTP** 
3. Vous verrez :
   ```
   📋 Détails FTP:
   ├── 🌐 Serveur FTP: ftpupload.net (ou files.000webhost.com)
   ├── 👤 Nom d'utilisateur: u531520039  
   ├── 🔒 Mot de passe: [Cliquer pour voir/créer]
   ├── 📁 Répertoire racine: /domains/antiquewhite-rabbit-562143.hostingersite.com/public_html
   └── 🔌 Port: 21 (FTP) ou 22 (SFTP)
   ```

### **Étape 3 : Créer/Récupérer mot de passe**
- Si mot de passe oublié → **"Changer mot de passe"**
- Utilisez un mot de passe fort
- **⚠️ NOTEZ-LE IMMÉDIATEMENT**

---

## 🚀 Options de Déploiement

### **Option 1 : FTP Standard (Windows)**
```bash
# Utiliser ftp-deploy.bat
1. Ouvrir ftp-deploy.bat dans un éditeur
2. Remplacer VOTRE_MOT_DE_PASSE_FTP par le vrai
3. Double-cliquer pour exécuter
```

### **Option 2 : SFTP Sécurisé (Linux/Mac/WSL)**
```bash
# Utiliser sftp-deploy.sh  
chmod +x sftp-deploy.sh
./sftp-deploy.sh
# Il demandera le mot de passe de manière sécurisée
```

### **Option 3 : FileZilla (Interface graphique)**
```
Serveur: ftpupload.net
Utilisateur: u531520039
Mot de passe: [votre_mot_de_passe]
Port: 21
```

### **Option 4 : Git + SSH (Actuel)**
```bash
# Méthode utilisée actuellement
ssh -p 65002 u531520039@147.93.93.199
# Puis git pull dans le répertoire
```

---

## ⚖️ Comparaison des Méthodes

| Méthode | ✅ Avantages | ❌ Inconvénients | 🎯 Usage |
|---------|-------------|------------------|----------|
| **Webhook GitHub** | • Automatique<br>• Rapide<br>• Pas de MDP | • Repository PUBLIC uniquement<br>• Dépend de GitHub | Production si repo public |
| **FTP Direct** | • Fonctionne avec repo privé<br>• Control total<br>• Pas de SSH | • Moins sécurisé<br>• Pas d'historique Git | Développement rapide |
| **SFTP** | • Sécurisé<br>• Fonctionne partout | • Plus complexe<br>• Besoin tools | Production sécurisée |
| **SSH + Git** | • Sécurisé<br>• Historique Git<br>• Control total | • Besoin accès SSH<br>• Plus complexe | Développement pro |
| **FileZilla GUI** | • Simple<br>• Interface graphique<br>• Drag & drop | • Manuel<br>• Pas d'automation | Upload occasionnel |

---

## 🎯 Recommandations par Cas d'Usage

### **🏠 Développement Local → Hostinger**
```bash
Recommandé: FTP Direct (ftp-deploy.bat)
Pourquoi: Simple, rapide, pas de configuration SSH
```

### **👥 Équipe avec Repository Privé**  
```bash
Recommandé: SFTP (sftp-deploy.sh)
Pourquoi: Sécurisé, scriptable, pas de limites repo
```

### **🚀 Production avec Repository Public**
```bash
Recommandé: Webhook GitHub (DEPLOY.md)
Pourquoi: Automatique, traçable, pas d'intervention manuelle
```

### **🔧 Maintenance/Hotfix Urgents**
```bash
Recommandé: FileZilla + SSH combo
Pourquoi: Interface graphique + console pour diagnostics
```

---

## 🧪 Tester la Connexion

### **Test FTP Simple**
```cmd
# Windows Command Prompt
ftp ftpupload.net
> user u531520039
> [entrer_mot_de_passe]
> ls
> quit
```

### **Test SFTP**
```bash
# Linux/Mac/WSL
sftp u531520039@ftpupload.net
> ls
> quit
```

### **Test avec telnet**
```bash
telnet ftpupload.net 21
# Doit afficher: 220 FTP Server ready
```

---

## 🔒 Sécurité FTP

### **Bonnes Pratiques**
- ✅ Utilisez SFTP (port 22) plutôt que FTP (port 21) quand possible
- ✅ Mot de passe fort et unique pour FTP  
- ✅ Ne jamais laisser le mot de passe en dur dans scripts publics
- ✅ Utilisez variables d'environnement pour credentials
- ✅ Limitez les IP autorisées si possible dans hPanel

### **Variables d'Environnement (Recommandé)**
```bash
# .env file (à ne pas committer!)
HOSTINGER_FTP_HOST=ftpupload.net
HOSTINGER_FTP_USER=u531520039  
HOSTINGER_FTP_PASS=votre_mot_de_passe_secure
HOSTINGER_FTP_DIR=/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html
```

---

## 🚨 Troubleshooting

### **"Connection refused"**
- Vérifiez le serveur FTP dans hPanel (peut changer)
- Testez avec telnet: `telnet ftpupload.net 21`
- Vérifiez firewall/antivirus

### **"Authentication failed"**  
- Mot de passe incorrect → Récréez dans hPanel
- Username incorrect → Vérifiez dans "Comptes FTP"
- Compte FTP suspendu → Contactez support Hostinger

### **"Directory not found"**
- Chemin incorrect → Utilisez exact path depuis hPanel
- Permissions insuffisantes → Vérifiez droits compte FTP

### **Transfert lent**
- Utilisez mode binaire: `binary` en FTP
- Connexion multiple si supportée
- Vérifiez bande passante locale

---

## 📞 Support

**Hostinger :** https://support.hostinger.com  
**Documentation FTP :** https://support.hostinger.com/en/articles/1583227  
**FileZilla :** https://filezilla-project.org/

---

*📝 Dernière mise à jour: $(date)*