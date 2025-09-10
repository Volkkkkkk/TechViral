@echo off
:: TechViral FTP Deploy Script
:: Déploiement direct vers Hostinger via FTP

echo.
echo ========================================
echo    TECHVIRAL - DEPLOIEMENT FTP
echo ========================================
echo.

:: Configuration FTP Hostinger (Mise à jour avec vraies infos)
set FTP_HOST=147.93.93.199
set FTP_USER=u531520039
set FTP_PASS=VOTRE_MOT_DE_PASSE_FTP
set FTP_DIR=/home/u531520039/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html

echo [INFO] Connexion au serveur FTP Hostinger...
echo [INFO] Host: %FTP_HOST%
echo [INFO] User: %FTP_USER%
echo [INFO] Directory: %FTP_DIR%
echo.

:: Créer le script FTP temporaire
echo open %FTP_HOST% > ftp_commands.txt
echo user %FTP_USER% %FTP_PASS% >> ftp_commands.txt
echo binary >> ftp_commands.txt
echo cd %FTP_DIR% >> ftp_commands.txt
echo.
echo lcd %~dp0 >> ftp_commands.txt

:: Upload des fichiers critiques
echo put manifest.json >> ftp_commands.txt
echo put sw-advanced.js >> ftp_commands.txt
echo put index.html >> ftp_commands.txt

:: Upload dossier assets/js
echo cd assets/js >> ftp_commands.txt
echo lcd assets\js >> ftp_commands.txt
echo mput *.js >> ftp_commands.txt

:: Upload dossier components
echo cd ../../components >> ftp_commands.txt
echo lcd ..\..\components >> ftp_commands.txt
echo mput *.html >> ftp_commands.txt

:: Upload dossier pages
echo cd ../pages >> ftp_commands.txt
echo lcd ..\pages >> ftp_commands.txt
echo put checkout-express.html >> ftp_commands.txt

:: Fermer connexion
echo quit >> ftp_commands.txt

echo [INFO] Debut du transfert FTP...
echo.

:: Exécuter les commandes FTP
ftp -s:ftp_commands.txt

:: Nettoyer
del ftp_commands.txt

echo.
echo [SUCCESS] Deploiement FTP termine!
echo.
echo Site disponible: https://antiquewhite-rabbit-562143.hostingersite.com
echo.

:: Attendre avant fermeture
echo Appuyez sur une touche pour fermer...
pause >nul