#!/bin/bash
# TechViral SFTP Deploy Script (Linux/Mac/WSL)
# Déploiement sécurisé vers Hostinger via SFTP

set -e

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================"
echo "   TECHVIRAL - DEPLOIEMENT SFTP"
echo "========================================"
echo -e "${NC}"

# Configuration SFTP Hostinger (Mise à jour avec vraies infos)
FTP_HOST="147.93.93.199"
FTP_USER="u531520039"
FTP_PORT="21"
REMOTE_DIR="/home/u531520039/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html"

echo -e "${YELLOW}[INFO]${NC} Connexion au serveur SFTP Hostinger..."
echo -e "${YELLOW}[INFO]${NC} Host: $FTP_HOST"
echo -e "${YELLOW}[INFO]${NC} User: $FTP_USER"
echo -e "${YELLOW}[INFO]${NC} Directory: $REMOTE_DIR"
echo ""

# Vérifier si les fichiers existent
if [ ! -f "manifest.json" ]; then
    echo -e "${RED}[ERROR]${NC} manifest.json non trouvé!"
    exit 1
fi

if [ ! -f "sw-advanced.js" ]; then
    echo -e "${RED}[ERROR]${NC} sw-advanced.js non trouvé!"
    exit 1
fi

if [ ! -d "assets/js" ]; then
    echo -e "${RED}[ERROR]${NC} Dossier assets/js non trouvé!"
    exit 1
fi

echo -e "${GREEN}[SUCCESS]${NC} Tous les fichiers requis sont présents"

# Créer le batch de commandes SFTP
cat > sftp_commands.txt << EOF
cd $REMOTE_DIR
put manifest.json
put sw-advanced.js
put index.html

cd assets/js
lcd assets/js
mput *.js

cd ../../components
lcd ../../components  
mput *.html

cd ../pages
lcd ../pages
put checkout-express.html

quit
EOF

echo -e "${YELLOW}[INFO]${NC} Début du transfert SFTP..."
echo ""

# Demander le mot de passe de manière sécurisée
echo -e "${BLUE}[INPUT]${NC} Entrez votre mot de passe FTP Hostinger:"
read -s FTP_PASS
echo ""

# Exécuter le transfert SFTP
if command -v lftp >/dev/null 2>&1; then
    echo -e "${YELLOW}[INFO]${NC} Utilisation de lftp pour le transfert..."
    lftp -u "$FTP_USER,$FTP_PASS" "ftp://$FTP_HOST" << EOF
cd $REMOTE_DIR
mirror -R --verbose --delete-first assets/js assets/js
mirror -R --verbose --delete-first components components  
mirror -R --verbose --delete-first pages pages
put manifest.json
put sw-advanced.js
put index.html
quit
EOF
else
    echo -e "${YELLOW}[INFO]${NC} Utilisation de sftp standard..."
    export SSHPASS="$FTP_PASS"
    if command -v sshpass >/dev/null 2>&1; then
        sshpass -e sftp -P "$FTP_PORT" "$FTP_USER@$FTP_HOST" < sftp_commands.txt
    else
        echo -e "${YELLOW}[WARNING]${NC} sshpass non installé, utilisation interactive..."
        sftp -P "$FTP_PORT" "$FTP_USER@$FTP_HOST" < sftp_commands.txt
    fi
fi

# Nettoyer
rm -f sftp_commands.txt

echo ""
echo -e "${GREEN}[SUCCESS]${NC} Déploiement SFTP terminé!"
echo ""
echo -e "${BLUE}[INFO]${NC} Site disponible: https://antiquewhite-rabbit-562143.hostingersite.com"
echo ""

# Statistiques de déploiement
echo -e "${YELLOW}[STATS]${NC} Fichiers déployés:"
echo "  ✅ manifest.json (PWA)"  
echo "  ✅ sw-advanced.js (Service Worker)"
echo "  ✅ assets/js/*.js (Scripts)"
echo "  ✅ components/*.html (Composants)"
echo "  ✅ pages/checkout-express.html (Checkout)"
echo ""

echo -e "${GREEN}Déploiement terminé avec succès!${NC}"