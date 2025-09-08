@echo off
REM TechViral - Deploiement Complet Git + SSH
REM Git push + deploiement SSH immédiat

echo 🚀 TechViral Deploy Complet
echo ============================

REM Message de commit (par défaut si non fourni)
set "commit_msg=%~1"
if "%commit_msg%"=="" set "commit_msg=Update: modifications automatiques"

echo 📝 Message de commit: %commit_msg%
echo.

REM Git workflow
echo 📦 Git add, commit, push...
git add .
git commit -m "%commit_msg%"
git push origin master

echo.
echo 🚀 Déploiement SSH immédiat...

REM SSH Deploy
call ssh-deploy.bat

echo.
echo ✅ DEPLOIEMENT COMPLET TERMINÉ !
echo 🌐 Site: https://antiquewhite-rabbit-562143.hostingersite.com/
echo 📋 Webhook + SSH = Double sécurité déploiement
pause