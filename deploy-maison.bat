@echo off
REM Déploiement alternatif pour page maison
REM Script de contournement pour problème SSH

echo 🏠 Déploiement Page Maison TechViral
echo ===================================

REM Solution 1: Copie locale pour test
echo 📋 1. Copie de sauvegarde locale...
copy /Y "pages\categories\maison.html" "backup\maison-deployed-%date:~6,4%%date:~3,2%%date:~0,2%.html"

REM Solution 2: Vérification intégrité
echo 🔍 2. Vérification du fichier...
if exist "pages\categories\maison.html" (
    echo ✅ Fichier maison.html trouvé
    for %%A in ("pages\categories\maison.html") do echo 📊 Taille: %%~zA octets
) else (
    echo ❌ Fichier maison.html manquant
    pause
    exit /b 1
)

REM Solution 3: Git status
echo 📝 3. Statut Git...
git status --porcelain pages/categories/maison.html

echo.
echo 💡 SOLUTIONS DE DÉPLOIEMENT DISPONIBLES:
echo.
echo A) FTP Manuel - Configurer credentials dans ftp-deploy.bat
echo B) Interface Web - Uploader via cPanel/FileManager
echo C) SSH Alternatif - Tenter différents ports
echo D) Git Deploy - Si webhook configuré
echo.
echo 📄 Fichier prêt: pages\categories\maison.html
echo 🌐 URL cible: https://antiquewhite-rabbit-562143.hostingersite.com/pages/categories/maison.html
echo.
pause