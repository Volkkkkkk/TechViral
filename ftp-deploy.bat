@echo off
REM TechViral - FTP Auto-Deploy Script
REM Upload automatique vers Hostinger FTP

echo 🚀 TechViral FTP Auto-Deploy
echo ============================

REM Configuration FTP (à personnaliser)
set FTP_HOST=147.93.93.199
set FTP_USER=TON_USERNAME
set FTP_PASS=TON_PASSWORD
set REMOTE_DIR=/public_html

echo 📡 Connexion FTP vers %FTP_HOST%...

REM Créer fichier de commandes FTP
echo open %FTP_HOST% > ftp_commands.txt
echo %FTP_USER% >> ftp_commands.txt
echo %FTP_PASS% >> ftp_commands.txt
echo binary >> ftp_commands.txt
echo cd %REMOTE_DIR% >> ftp_commands.txt

REM Upload des fichiers principaux
echo put index.html >> ftp_commands.txt
echo put sw.js >> ftp_commands.txt
echo put .htaccess >> ftp_commands.txt

REM Upload dossier assets
echo mkdir assets >> ftp_commands.txt
echo cd assets >> ftp_commands.txt
echo lcd assets >> ftp_commands.txt
echo mput *.* >> ftp_commands.txt
echo cd .. >> ftp_commands.txt
echo lcd .. >> ftp_commands.txt

REM Upload dossier pages
echo mkdir pages >> ftp_commands.txt
echo cd pages >> ftp_commands.txt
echo lcd pages >> ftp_commands.txt
echo mput *.html >> ftp_commands.txt

echo quit >> ftp_commands.txt

REM Exécuter FTP
ftp -s:ftp_commands.txt

REM Nettoyer
del ftp_commands.txt

echo ✅ Upload FTP terminé!
echo 🌐 Site: https://antiquewhite-rabbit-562143.hostingersite.com/
pause