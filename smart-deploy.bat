@echo off
:: TechViral Smart Deploy - Choisit automatiquement la meilleure méthode
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    TECHVIRAL - DEPLOIEMENT INTELLIGENT
echo ==========================================
echo.

:: Configuration
set FTP_HOST=147.93.93.199
set SSH_HOST=147.93.93.199
set SSH_PORT=65002
set SSH_USER=u531520039

echo [INFO] Detection de la meilleure methode de deploiement...
echo.

:: Test 1: Vérifier si on a accès SSH
echo [TEST] Test connexion SSH...
timeout /t 1 >nul
ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "echo 'SSH OK'" 2>nul | find "SSH OK" >nul
if !errorlevel! == 0 (
    set SSH_AVAILABLE=true
    echo ✅ SSH disponible
) else (
    set SSH_AVAILABLE=false
    echo ❌ SSH non disponible
)

:: Test 2: Vérifier si on a accès FTP
echo [TEST] Test serveur FTP...
ping -n 1 %FTP_HOST% >nul 2>&1
if !errorlevel! == 0 (
    set FTP_AVAILABLE=true
    echo ✅ FTP serveur accessible
) else (
    set FTP_AVAILABLE=false
    echo ❌ FTP serveur inaccessible
)

:: Test 3: Vérifier si on a les outils nécessaires
echo [TEST] Verification des outils...

where git >nul 2>&1
if !errorlevel! == 0 (
    set GIT_AVAILABLE=true
    echo ✅ Git disponible
) else (
    set GIT_AVAILABLE=false
    echo ❌ Git non disponible
)

where ssh >nul 2>&1
if !errorlevel! == 0 (
    set SSH_TOOL=true
    echo ✅ SSH client disponible
) else (
    set SSH_TOOL=false  
    echo ❌ SSH client non disponible
)

echo.
echo ==========================================
echo CHOIX DE LA METHODE DE DEPLOIEMENT
echo ==========================================
echo.

:: Logique de sélection
if "%SSH_AVAILABLE%"=="true" if "%GIT_AVAILABLE%"=="true" (
    echo 🏆 METHODE SELECTIONNEE: SSH + Git
    echo [INFO] Meilleure option disponible - securisee et complete
    echo.
    goto :deploy_ssh_git
)

if "%FTP_AVAILABLE%"=="true" (
    echo 🏆 METHODE SELECTIONNEE: FTP Direct  
    echo [INFO] Option de fallback - simple et efficace
    echo.
    goto :deploy_ftp
)

echo ❌ AUCUNE METHODE DISPONIBLE
echo [ERROR] Impossible de deployer - verifiez votre connexion
goto :end

:deploy_ssh_git
echo ==========================================
echo DEPLOIEMENT SSH + GIT
echo ==========================================
echo.

echo [INFO] Connexion SSH et synchronisation Git...
echo.

ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST% "cd domains/antiquewhite-rabbit-562143.hostingersite.com/public_html && git pull origin master && echo 'Deploiement SSH+Git complete'"

if !errorlevel! == 0 (
    echo ✅ Deploiement SSH+Git reussi!
) else (
    echo ❌ Echec deploiement SSH+Git
    echo [INFO] Tentative de fallback vers FTP...
    goto :deploy_ftp
)

goto :success

:deploy_ftp
echo ==========================================  
echo DEPLOIEMENT FTP DIRECT
echo ==========================================
echo.

echo [INFO] Veuillez entrer votre mot de passe FTP Hostinger:
set /p FTP_PASS=Mot de passe FTP: 

if "%FTP_PASS%"=="" (
    echo [ERROR] Mot de passe requis pour FTP
    goto :end
)

echo.
echo [INFO] Creation des commandes FTP...

:: Créer script FTP
echo open %FTP_HOST% > ftp_smart_deploy.txt
echo user %SSH_USER% %FTP_PASS% >> ftp_smart_deploy.txt
echo binary >> ftp_smart_deploy.txt
echo cd /home/u531520039/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html >> ftp_smart_deploy.txt
echo lcd %~dp0 >> ftp_smart_deploy.txt

:: Upload fichiers critiques
echo put manifest.json >> ftp_smart_deploy.txt
echo put sw-advanced.js >> ftp_smart_deploy.txt

:: Upload JS files
echo cd assets/js >> ftp_smart_deploy.txt
echo lcd assets\js >> ftp_smart_deploy.txt
echo mput *.js >> ftp_smart_deploy.txt

:: Upload components
echo cd ../../components >> ftp_smart_deploy.txt
echo lcd ..\..\components >> ftp_smart_deploy.txt  
echo mput *.html >> ftp_smart_deploy.txt

echo quit >> ftp_smart_deploy.txt

echo [INFO] Execution des commandes FTP...
ftp -s:ftp_smart_deploy.txt

:: Nettoyer
del ftp_smart_deploy.txt

if !errorlevel! == 0 (
    echo ✅ Deploiement FTP reussi!
) else (
    echo ❌ Echec deploiement FTP
    goto :end
)

goto :success

:success
echo.
echo ==========================================
echo DEPLOIEMENT TERMINE AVEC SUCCES!
echo ==========================================
echo.

echo ✅ Site mis à jour: https://antiquewhite-rabbit-562143.hostingersite.com
echo.

echo [INFO] Fichiers deployes:
echo   📱 manifest.json (PWA)
echo   ⚙️  sw-advanced.js (Service Worker)  
echo   🤖 ai-recommendations.js (IA)
echo   💎 loyalty-system.js (Fidelite)
echo   ⚡ performance-optimizer.js (Performance)
echo   🧩 components/*.html (Composants)
echo.

echo [INFO] Nouvelles fonctionnalites disponibles:
echo   🔍 Recherche intelligente avec IA
echo   🎁 Programme de fidelite avec points
echo   📊 Optimisation performance automatique  
echo   🛒 Checkout express mobile
echo   🎨 Galerie produit 360°
echo.

goto :end

:end
echo.
echo ==========================================
echo [INFO] Pour la prochaine fois:
echo   - SSH+Git: Plus secure, historique complet
echo   - FTP: Plus simple, pas de configuration SSH
echo   - Test: Lancez test-connections.bat pour diagnostics
echo ==========================================
echo.

echo Appuyez sur une touche pour fermer...
pause >nul