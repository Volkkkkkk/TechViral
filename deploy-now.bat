@echo off
:: TechViral - Déploiement immédiat avec identifiants complets
:: PRÊT À UTILISER - Pas de configuration nécessaire

echo.
echo ==========================================
echo    TECHVIRAL - DEPLOIEMENT IMMEDIAT
echo ==========================================
echo.

:: Configuration FTP Hostinger complète
set FTP_HOST=147.93.93.199
set FTP_USER=u531520039
set FTP_PASS=Monogath789$
set FTP_DIR=/home/u531520039/domains/antiquewhite-rabbit-562143.hostingersite.com/public_html

echo [INFO] Connexion au serveur FTP Hostinger...
echo [INFO] Host: %FTP_HOST%
echo [INFO] User: %FTP_USER% 
echo [INFO] Directory: %FTP_DIR%
echo.

:: Vérifier que les fichiers existent
if not exist "manifest.json" (
    echo [ERROR] manifest.json non trouvé !
    pause
    exit /b 1
)

if not exist "sw-advanced.js" (
    echo [ERROR] sw-advanced.js non trouvé !
    pause
    exit /b 1
)

if not exist "assets\js\ai-recommendations.js" (
    echo [ERROR] assets\js\ai-recommendations.js non trouvé !
    pause
    exit /b 1
)

echo [SUCCESS] Tous les fichiers requis sont présents
echo.

:: Créer le script FTP
echo [INFO] Préparation des commandes FTP...

echo open %FTP_HOST% > ftp_deploy_now.txt
echo user %FTP_USER% %FTP_PASS% >> ftp_deploy_now.txt
echo binary >> ftp_deploy_now.txt
echo cd %FTP_DIR% >> ftp_deploy_now.txt
echo lcd %~dp0 >> ftp_deploy_now.txt

:: Upload fichiers racine
echo [INFO] Upload fichiers racine (PWA, Service Worker)...
echo put manifest.json >> ftp_deploy_now.txt
echo put sw-advanced.js >> ftp_deploy_now.txt

:: Upload JavaScript files
echo [INFO] Upload scripts JavaScript (IA, Fidélité, Performance)...
echo cd assets/js >> ftp_deploy_now.txt
echo lcd assets\js >> ftp_deploy_now.txt
echo put ai-recommendations.js >> ftp_deploy_now.txt
echo put loyalty-system.js >> ftp_deploy_now.txt
echo put performance-optimizer.js >> ftp_deploy_now.txt
echo put advanced-filters.js >> ftp_deploy_now.txt
echo put smart-search.js >> ftp_deploy_now.txt
echo put checkout-express.js >> ftp_deploy_now.txt
echo put product-gallery.js >> ftp_deploy_now.txt

:: Upload composants HTML
echo [INFO] Upload composants HTML...
echo cd ../../components >> ftp_deploy_now.txt
echo lcd ..\..\components >> ftp_deploy_now.txt
echo put advanced-filters.html >> ftp_deploy_now.txt
echo put enhanced-navigation.html >> ftp_deploy_now.txt
echo put product-comparison.html >> ftp_deploy_now.txt
echo put product-gallery.html >> ftp_deploy_now.txt

:: Upload pages
echo [INFO] Upload pages checkout...
echo cd ../pages >> ftp_deploy_now.txt
echo lcd ..\pages >> ftp_deploy_now.txt
echo put checkout-express.html >> ftp_deploy_now.txt

echo quit >> ftp_deploy_now.txt

echo.
echo ==========================================
echo DEBUT DU TRANSFERT FTP
echo ==========================================
echo.

:: Exécuter le déploiement FTP
ftp -i -s:ftp_deploy_now.txt

:: Nettoyer
del ftp_deploy_now.txt

echo.
echo ==========================================
echo DEPLOIEMENT TERMINE !
echo ==========================================
echo.

echo ✅ Site mis à jour: https://antiquewhite-rabbit-562143.hostingersite.com
echo.

echo [INFO] Fichiers déployés avec succès:
echo   📱 manifest.json - Configuration PWA
echo   ⚙️  sw-advanced.js - Service Worker avancé
echo   🤖 ai-recommendations.js - IA de recommandations
echo   💎 loyalty-system.js - Programme fidélité + TechBot  
echo   ⚡ performance-optimizer.js - Optimisation performance
echo   🔍 advanced-filters.js - Filtres avancés
echo   🎯 smart-search.js - Recherche intelligente
echo   🛒 checkout-express.js - Checkout express
echo   🎨 product-gallery.js - Galerie 360°
echo   🧩 4x components HTML - Navigation, filtres, galerie, comparateur
echo   📄 checkout-express.html - Page checkout mobile
echo.

echo [INFO] Nouvelles fonctionnalités maintenant actives:
echo   🔥 Système de recommandations IA personnalisées
echo   🎁 Programme de fidélité avec points et récompenses
echo   💬 TechBot - Assistant IA conversationnel
echo   📊 Monitoring performance temps réel (Core Web Vitals)
echo   🖼️  Conversion automatique WebP et lazy loading
echo   🔍 Recherche vocale et autocomplétion intelligente
echo   🛒 Checkout express optimisé mobile
echo   🎨 Galerie produit 360° avec zoom et plein écran
echo   📱 PWA complète avec notifications push
echo.

echo ==========================================
echo TESTS RECOMMANDES:
echo.
echo 1. Accédez à: https://antiquewhite-rabbit-562143.hostingersite.com
echo 2. Testez l'ajout au panier sur plusieurs produits
echo 3. Vérifiez le widget fidélité (en haut à droite)
echo 4. Testez le chat IA (bouton 🤖 dans le widget fidélité)
echo 5. Essayez la recherche intelligente (barre de recherche)
echo 6. Testez les filtres avancés sur les pages catégories
echo 7. Vérifiez les performances (F12 > Lighthouse > Performance)
echo ==========================================
echo.

echo 🚀 TechViral est maintenant une plateforme e-commerce enterprise !
echo.

echo Appuyez sur une touche pour fermer...
pause >nul