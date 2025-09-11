@echo off
:: Script de test des connexions Hostinger
:: Teste FTP, SSH, et connectivité générale

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo    TECHVIRAL - TEST CONNEXIONS HOSTINGER
echo ==========================================
echo.

:: Configuration
set FTP_HOST=147.93.93.199
set SSH_HOST=147.93.93.199
set SSH_PORT=65002
set SSH_USER=u531520039
set WEBSITE=https://antiquewhite-rabbit-562143.hostingersite.com

echo [INFO] Configuration:
echo   - FTP Host: %FTP_HOST%
echo   - SSH Host: %SSH_HOST%:%SSH_PORT%
echo   - Website: %WEBSITE%
echo.

:: Test 1: Ping général
echo ==========================================
echo TEST 1: CONNECTIVITE RESEAU
echo ==========================================
echo.

echo [TEST] Ping vers serveur SSH...
ping -n 3 %SSH_HOST% >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ SSH Host accessible
) else (
    echo ❌ SSH Host inaccessible
)

echo.
echo [TEST] Ping vers serveur FTP...
ping -n 3 %FTP_HOST% >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ FTP Host accessible
) else (
    echo ❌ FTP Host inaccessible
)

:: Test 2: Port SSH
echo.
echo ==========================================
echo TEST 2: PORT SSH (65002)
echo ==========================================
echo.

echo [TEST] Test port SSH 65002...
telnet %SSH_HOST% %SSH_PORT% <nul >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Port SSH 65002 ouvert
) else (
    echo ❌ Port SSH 65002 fermé ou inaccessible
)

:: Test 3: Port FTP
echo.
echo ==========================================
echo TEST 3: PORT FTP (21)
echo ==========================================
echo.

echo [TEST] Test port FTP 21...
telnet %FTP_HOST% 21 <nul >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Port FTP 21 ouvert
) else (
    echo ❌ Port FTP 21 fermé ou inaccessible
)

:: Test 4: Site web
echo.
echo ==========================================
echo TEST 4: SITE WEB
echo ==========================================
echo.

echo [TEST] Accès au site web...
curl -s --connect-timeout 10 %WEBSITE% >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ Site web accessible
) else (
    echo ❌ Site web inaccessible
)

:: Test 5: DNS Resolution
echo.
echo ==========================================
echo TEST 5: RESOLUTION DNS
echo ==========================================
echo.

echo [TEST] Résolution DNS FTP...
nslookup %FTP_HOST% >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ DNS FTP résolu
) else (
    echo ❌ DNS FTP non résolu
)

echo.
echo [TEST] Résolution DNS SSH...
nslookup %SSH_HOST% >nul 2>&1
if !errorlevel! == 0 (
    echo ✅ DNS SSH résolu  
) else (
    echo ❌ DNS SSH non résolu
)

:: Test 6: FTP Connection Test
echo.
echo ==========================================
echo TEST 6: CONNEXION FTP INTERACTIVE
echo ==========================================
echo.

echo [TEST] Test connexion FTP basique...
echo [INFO] Vous pouvez tester manuellement avec:
echo.
echo ^> ftp %FTP_HOST%
echo ^> user u531520039
echo ^> [entrer votre mot de passe]
echo ^> ls
echo ^> quit
echo.

:: Test 7: SSH Connection Test
echo.
echo ==========================================
echo TEST 7: CONNEXION SSH INTERACTIVE  
echo ==========================================
echo.

echo [TEST] Test connexion SSH...
echo [INFO] Vous pouvez tester manuellement avec:
echo.
echo ^> ssh -p %SSH_PORT% %SSH_USER%@%SSH_HOST%
echo.

:: Résumé et recommandations
echo.
echo ==========================================
echo RESUME ET RECOMMANDATIONS
echo ==========================================
echo.

echo [RECOMMANDATIONS] Selon les résultats:
echo.
echo ✅ Si tout est vert:
echo    ^> Utilisez n'importe quelle méthode de déploiement
echo    ^> Webhook GitHub (si repo public) ou FTP direct
echo.
echo ⚠️  Si SSH OK mais FTP KO:
echo    ^> Utilisez uniquement SSH + Git
echo    ^> Command: ssh -p 65002 u531520039@147.93.93.199
echo.
echo ⚠️  Si FTP OK mais SSH KO:
echo    ^> Utilisez scripts FTP (ftp-deploy.bat ou sftp-deploy.sh)
echo    ^> Ou FileZilla pour interface graphique
echo.
echo ❌ Si tout est rouge:
echo    ^> Vérifiez votre connexion internet
echo    ^> Vérifiez firewall/antivirus
echo    ^> Contactez support Hostinger
echo.

echo [PROCHAINES ETAPES]:
echo   1. Testez une connexion manuelle (FTP ou SSH)
echo   2. Récupérez vos identifiants dans hPanel
echo   3. Lancez le script de déploiement approprié
echo.

echo ==========================================
echo Test terminé - Vérifiez les résultats ci-dessus
echo ==========================================
echo.
pause