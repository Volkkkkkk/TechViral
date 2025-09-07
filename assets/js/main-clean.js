/**
 * TechViral - main-clean.js (Redirection)
 * Ce fichier existe pour éviter l'erreur 404
 * Il redirige vers la vraie logique dans main.js
 */

console.log('⚠️ main-clean.js chargé - Redirection vers main.js logique');

// Si main.js n'est pas encore chargé, on attend
if (typeof window.TechViralApp === 'undefined') {
    console.log('🔄 Attente de main.js...');
    
    // Vérifier toutes les 100ms si TechViralApp est disponible
    const checkMainJS = setInterval(() => {
        if (typeof window.TechViralApp !== 'undefined') {
            console.log('✅ main.js détecté - main-clean.js terminé');
            clearInterval(checkMainJS);
        }
    }, 100);
    
    // Timeout après 5 secondes
    setTimeout(() => {
        clearInterval(checkMainJS);
        console.log('⏰ Timeout main-clean.js - main.js probablement chargé');
    }, 5000);
} else {
    console.log('✅ TechViralApp déjà disponible');
}

// Note: Ce fichier ne devrait pas exister - vérifiez vos références HTML