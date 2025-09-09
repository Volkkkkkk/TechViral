@echo off
REM TechViral - SSH Auto-Deploy Script
REM Deploiement direct via SSH vers Hostinger

echo 🚀 TechViral SSH Auto-Deploy
echo =============================

REM Configuration SSH
set SSH_HOST=147.93.93.199
set SSH_PORT=65002
set SSH_USER=u531520039
set REMOTE_PATH=/home/u531520039/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html

echo 📡 Connexion SSH vers %SSH_USER%@%SSH_HOST%:%SSH_PORT%...

REM Créer archive des fichiers
echo 📦 Création de l'archive...
tar -czf site.tar.gz index.html sw.js .htaccess assets pages

REM Upload via SCP
echo 📤 Upload des fichiers...
scp -P %SSH_PORT% site.tar.gz %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/

REM Décompression sur le serveur
echo 🔄 Décompression sur le serveur...
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cd domains/antiquewhite-rabbit-562143.hostingersite.com/public_html && tar -xzf site.tar.gz && rm site.tar.gz"

REM Nettoyer local
rm site.tar.gz

echo ✅ Déploiement SSH terminé !
echo 🌐 Site: https://antiquewhite-rabbit-562143.hostingersite.com/
pause