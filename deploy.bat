@echo off
REM TechViral - Script de deploiement automatique
REM Usage: deploy.bat "message de commit"

echo 🚀 TechViral Auto-Deploy
echo ========================

REM Verifier si Git est initialise
if not exist ".git" (
    echo ❌ Erreur: Depot Git non initialise
    echo Executez d'abord: git init
    pause
    exit /b 1
)

REM Message de commit (par defaut si non fourni)
set "commit_msg=%~1"
if "%commit_msg%"=="" set "commit_msg=Update: modifications automatiques"

echo 📝 Message de commit: %commit_msg%
echo.

REM Ajouter tous les fichiers
echo 📦 Ajout des fichiers modifies...
git add .

REM Verifier s'il y a des changements
git diff --cached --quiet
if %errorlevel%==0 (
    echo ℹ️ Aucun changement detecte
    pause
    exit /b 0
)

REM Afficher les fichiers qui seront commités
echo 📋 Fichiers a deployer:
git diff --cached --name-status

echo.
set /p "confirm=Confirmer le deploiement? (o/N): "
if /i not "%confirm%"=="o" (
    echo ❌ Deploiement annule
    pause
    exit /b 0
)

REM Commit
echo 💾 Commit en cours...
git commit -m "%commit_msg%"

REM Push vers le serveur (declenche auto-deploy)
echo 🚀 Push vers Hostinger...
git push origin main

if %errorlevel%==0 (
    echo ✅ Deploiement reussi!
    echo 🌐 Site mis a jour: https://antiquewhite-rabbit-562143.hostingersite.com/
) else (
    echo ❌ Erreur lors du push
    echo Verificer la connexion Git
)

echo.
pause