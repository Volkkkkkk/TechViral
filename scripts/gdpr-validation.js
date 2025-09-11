/**
 * GDPR Consent Validation - TechViral
 * Version "Acier" : Validation blocage GTM/GA4 pré-consentement
 */

const fs = require('fs');
const path = require('path');

class GDPRValidation {
    constructor() {
        this.issues = [];
        this.validations = [];
        this.gtmBlocked = false;
        this.ga4Blocked = false;
        this.cookieCategories = ['necessary', 'functional', 'analytics', 'marketing'];
    }

    /**
     * Validation complète RGPD
     */
    async runFullValidation() {
        console.log('🔒 RGPD Compliance - Validation complète...\n');
        
        try {
            // 1. Vérifier blocage GTM par défaut
            this.validateGTMBlocking();
            
            // 2. Vérifier blocage GA4 par défaut 
            this.validateGA4Blocking();
            
            // 3. Vérifier bannière consentement
            this.validateConsentBanner();
            
            // 4. Vérifier gestion cookies
            this.validateCookieManagement();
            
            // 5. Vérifier détection EU
            this.validateEUDetection();
            
            // 6. Générer script de blocage renforcé
            this.generateEnhancedBlocking();
            
            // 7. Créer guide compliance
            this.generateComplianceGuide();
            
            const report = this.generateReport();
            console.log('\n✅ Validation RGPD terminée');
            return report;
            
        } catch (error) {
            console.error('❌ Erreur validation RGPD:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Valider blocage GTM
     */
    validateGTMBlocking() {
        console.log('📊 Validation blocage GTM...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            this.issues.push({
                severity: 'HIGH',
                category: 'GTM_BLOCKING',
                message: 'index.html non trouvé pour validation GTM'
            });
            return;
        }
        
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        
        // Vérifier absence de GTM direct
        const hasDirectGTM = htmlContent.includes('googletagmanager.com/gtm.js');
        const hasGTMScript = htmlContent.includes('GTM-');
        
        if (hasDirectGTM || hasGTMScript) {
            this.issues.push({
                severity: 'CRITICAL',
                category: 'GTM_BLOCKING',
                message: 'GTM chargé directement - VIOLATION RGPD',
                details: 'GTM doit être bloqué jusqu\'au consentement'
            });
            console.log('  ❌ GTM chargé directement - CRITIQUE');
        } else {
            console.log('  ✅ GTM non chargé par défaut');
            this.gtmBlocked = true;
        }
        
        // Vérifier si script de blocage existe
        const hasConsentManager = htmlContent.includes('gdpr-consent.js') || 
                                 htmlContent.includes('GDPRConsentManager');
        
        if (!hasConsentManager) {
            this.issues.push({
                severity: 'HIGH',
                category: 'GTM_BLOCKING',
                message: 'Script gestionnaire consentement manquant'
            });
            console.log('  ⚠️ Gestionnaire consentement non trouvé');
        } else {
            console.log('  ✅ Gestionnaire consentement présent');
        }
    }

    /**
     * Valider blocage GA4
     */
    validateGA4Blocking() {
        console.log('\n📈 Validation blocage GA4...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        
        // Vérifier absence de GA4 direct
        const hasDirectGA4 = htmlContent.includes('gtag/js?id=G-');
        const hasGtagConfig = htmlContent.includes('gtag(\'config\'');
        
        if (hasDirectGA4 || hasGtagConfig) {
            this.issues.push({
                severity: 'CRITICAL',
                category: 'GA4_BLOCKING',
                message: 'GA4 chargé directement - VIOLATION RGPD',
                details: 'GA4 doit être bloqué jusqu\'au consentement analytics'
            });
            console.log('  ❌ GA4 chargé directement - CRITIQUE');
        } else {
            console.log('  ✅ GA4 non chargé par défaut');
            this.ga4Blocked = true;
        }
        
        // Vérifier dataLayer protection
        const hasDataLayerInit = htmlContent.includes('dataLayer = dataLayer');
        
        if (hasDataLayerInit) {
            console.log('  ⚠️ dataLayer initialisé - vérifier protection');
        } else {
            console.log('  ✅ dataLayer non initialisé par défaut');
        }
    }

    /**
     * Valider bannière consentement
     */
    validateConsentBanner() {
        console.log('\n🍪 Validation bannière consentement...');
        
        const gdprPath = path.join(__dirname, '..', 'assets', 'js', 'gdpr-consent.js');
        
        if (!fs.existsSync(gdprPath)) {
            this.issues.push({
                severity: 'CRITICAL',
                category: 'CONSENT_BANNER',
                message: 'Script RGPD manquant'
            });
            console.log('  ❌ gdpr-consent.js manquant');
            return;
        }
        
        const gdprContent = fs.readFileSync(gdprPath, 'utf8');
        
        // Vérifications critiques
        const hasEUDetection = gdprContent.includes('detectRegion') || 
                              gdprContent.includes('timezone');
        const hasCookieCategories = gdprContent.includes('cookieCategories');
        const hasConsentBanner = gdprContent.includes('createConsentBanner');
        const hasGranularConsent = gdprContent.includes('necessary') && 
                                  gdprContent.includes('analytics') &&
                                  gdprContent.includes('marketing');
        
        this.validations.push({
            name: 'EU Detection',
            passed: hasEUDetection,
            required: true
        });
        
        this.validations.push({
            name: 'Cookie Categories',
            passed: hasCookieCategories,
            required: true
        });
        
        this.validations.push({
            name: 'Consent Banner',
            passed: hasConsentBanner,
            required: true
        });
        
        this.validations.push({
            name: 'Granular Consent',
            passed: hasGranularConsent,
            required: true
        });
        
        if (hasEUDetection && hasCookieCategories && hasConsentBanner && hasGranularConsent) {
            console.log('  ✅ Bannière consentement complète');
        } else {
            console.log('  ⚠️ Bannière consentement incomplète');
            this.issues.push({
                severity: 'MEDIUM',
                category: 'CONSENT_BANNER',
                message: 'Fonctionnalités bannière manquantes'
            });
        }
    }

    /**
     * Valider gestion cookies
     */
    validateCookieManagement() {
        console.log('\n🍪 Validation gestion cookies...');
        
        const gdprPath = path.join(__dirname, '..', 'assets', 'js', 'gdpr-consent.js');
        const gdprContent = fs.readFileSync(gdprPath, 'utf8');
        
        // Vérifier suppression cookies
        const hasCookieDeletion = gdprContent.includes('deleteCookies') ||
                                 gdprContent.includes('document.cookie');
        
        // Vérifier stockage consentement
        const hasConsentStorage = gdprContent.includes('localStorage') &&
                                 gdprContent.includes('consent');
        
        // Vérifier expiration consentement
        const hasConsentExpiry = gdprContent.includes('6 * 30 * 24') || // 6 mois
                                gdprContent.includes('timestamp');
        
        console.log(`  ${hasCookieDeletion ? '✅' : '❌'} Suppression cookies`);
        console.log(`  ${hasConsentStorage ? '✅' : '❌'} Stockage consentement`);
        console.log(`  ${hasConsentExpiry ? '✅' : '❌'} Expiration consentement`);
        
        if (!hasCookieDeletion || !hasConsentStorage || !hasConsentExpiry) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'COOKIE_MANAGEMENT',
                message: 'Gestion cookies incomplète'
            });
        }
    }

    /**
     * Valider détection EU
     */
    validateEUDetection() {
        console.log('\n🌍 Validation détection EU...');
        
        const gdprPath = path.join(__dirname, '..', 'assets', 'js', 'gdpr-consent.js');
        const gdprContent = fs.readFileSync(gdprPath, 'utf8');
        
        // Vérifier méthodes de détection
        const hasTimezoneDetection = gdprContent.includes('Intl.DateTimeFormat') ||
                                    gdprContent.includes('timezone');
        const hasEUTimezones = gdprContent.includes('Europe/');
        const hasDefaultEU = gdprContent.includes('this.isEU = true');
        
        console.log(`  ${hasTimezoneDetection ? '✅' : '❌'} Détection timezone`);
        console.log(`  ${hasEUTimezones ? '✅' : '❌'} Liste timezones EU`);
        console.log(`  ${hasDefaultEU ? '✅' : '❌'} Défaut sécurisé EU`);
        
        if (!hasTimezoneDetection) {
            this.issues.push({
                severity: 'LOW',
                category: 'EU_DETECTION',
                message: 'Détection EU basique - améliorer précision'
            });
        }
    }

    /**
     * Générer script de blocage renforcé
     */
    generateEnhancedBlocking() {
        console.log('\n🛡️ Génération script blocage renforcé...');
        
        const blockingScript = `/**
 * RGPD Blocking Script - TechViral
 * Version "Acier" : Blocage strict pré-consentement
 */

// PHASE 1: Blocage immédiat GTM/GA4
(function() {
    'use strict';
    
    // Bloquer GTM
    Object.defineProperty(window, 'dataLayer', {
        get: function() {
            if (!window._gdprConsent?.analytics) {
                console.warn('🔒 GTM bloqué - Consentement analytics requis');
                return [];
            }
            return window._dataLayerReal || [];
        },
        set: function(value) {
            if (!window._gdprConsent?.analytics) {
                console.warn('🔒 GTM bloqué - dataLayer ignoré');
                return;
            }
            window._dataLayerReal = value;
        }
    });
    
    // Bloquer gtag
    window.gtag = function() {
        if (!window._gdprConsent?.analytics) {
            console.warn('🔒 GA4 bloqué - Consentement analytics requis');
            return;
        }
        if (window._gtagReal) {
            return window._gtagReal.apply(this, arguments);
        }
    };
    
    // Bloquer Facebook Pixel
    window.fbq = function() {
        if (!window._gdprConsent?.marketing) {
            console.warn('🔒 Facebook Pixel bloqué - Consentement marketing requis');
            return;
        }
        if (window._fbqReal) {
            return window._fbqReal.apply(this, arguments);
        }
    };
    
    // Protection localStorage/sessionStorage
    const originalLocalStorage = window.localStorage;
    const originalSessionStorage = window.sessionStorage;
    
    function createStorageProxy(storage, category) {
        return new Proxy(storage, {
            get: function(target, prop) {
                if (typeof prop === 'string' && prop.startsWith('_ga')) {
                    if (!window._gdprConsent?.analytics) {
                        console.warn('🔒 Analytics storage bloqué');
                        return undefined;
                    }
                }
                return target[prop];
            },
            set: function(target, prop, value) {
                if (typeof prop === 'string' && prop.startsWith('_ga')) {
                    if (!window._gdprConsent?.analytics) {
                        console.warn('🔒 Analytics storage bloqué');
                        return true;
                    }
                }
                target[prop] = value;
                return true;
            }
        });
    }
    
    // Activer protection storage
    if (!window._gdprConsent) {
        window.localStorage = createStorageProxy(originalLocalStorage, 'analytics');
        window.sessionStorage = createStorageProxy(originalSessionStorage, 'analytics');
    }
    
    console.log('🛡️ RGPD Protection activée');
})();

// PHASE 2: Fonctions de déblocage
window.enableGDPRTracking = function(categories) {
    window._gdprConsent = categories;
    
    if (categories.analytics) {
        // Débloquer GTM/GA4
        if (window._dataLayerReal) {
            window.dataLayer = window._dataLayerReal;
        }
        
        // Charger GA4 si consenti
        if (window._ga4Config) {
            loadGA4(window._ga4Config);
        }
        
        // Charger GTM si consenti  
        if (window._gtmId) {
            loadGTM(window._gtmId);
        }
        
        console.log('✅ Analytics tracking activé');
    }
    
    if (categories.marketing) {
        // Débloquer Facebook Pixel
        if (window._fbPixelId) {
            loadFacebookPixel(window._fbPixelId);
        }
        
        console.log('✅ Marketing tracking activé');
    }
};

// Fonctions de chargement conditionnel
function loadGA4(measurementId) {
    const script = document.createElement('script');
    script.async = true;
    script.src = \`https://www.googletagmanager.com/gtag/js?id=\${measurementId}\`;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    window._gtagReal = function() { dataLayer.push(arguments); };
    window.gtag = window._gtagReal;
    
    gtag('js', new Date());
    gtag('config', measurementId, {
        anonymize_ip: true,
        cookie_flags: 'secure;samesite=strict'
    });
}

function loadGTM(gtmId) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',gtmId);
}

function loadFacebookPixel(pixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    window._fbqReal = window.fbq;
    fbq('init', pixelId);
    fbq('track', 'PageView');
}

// Configuration par défaut (à personnaliser)
window._ga4Config = 'G-XXXXXXXXXX'; // Remplacer par vrai ID
window._gtmId = 'GTM-XXXXXXX';      // Remplacer par vrai ID  
window._fbPixelId = 'XXXXXXXXXX';   // Remplacer par vrai ID`;

        const blockingPath = path.join(__dirname, '..', 'assets', 'js', 'gdpr-blocking.js');
        fs.writeFileSync(blockingPath, blockingScript);
        
        console.log('  ✅ Script de blocage créé: gdpr-blocking.js');
        console.log('  ⚠️ À intégrer AVANT tous autres scripts de tracking');
    }

    /**
     * Générer guide compliance
     */
    generateComplianceGuide() {
        const guide = `# 🔒 RGPD Compliance Guide - TechViral
## Version "Acier" - Conformité Enterprise

### ✅ VALIDATION BLOCAGE PRÉ-CONSENTEMENT

#### 1. INTÉGRATION SCRIPT BLOCAGE
\`\`\`html
<!-- IMPORTANT: Intégrer EN PREMIER dans <head> -->
<script src="assets/js/gdpr-blocking.js"></script>

<!-- APRÈS le script de blocage -->
<script src="assets/js/gdpr-consent.js"></script>

<!-- NE PAS intégrer directement: -->
<!-- ❌ <script src="https://www.googletagmanager.com/gtm.js?id=GTM-XXX"></script> -->
<!-- ❌ <script src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script> -->
\`\`\`

#### 2. CONFIGURATION IDs TRACKING
\`\`\`javascript
// Dans gdpr-blocking.js
window._ga4Config = 'G-VOTRE-ID-GA4';
window._gtmId = 'GTM-VOTRE-ID';
window._fbPixelId = 'VOTRE-PIXEL-ID';
\`\`\`

#### 3. TEST BLOCAGE MANUEL
\`\`\`javascript
// Console navigateur AVANT consentement:
console.log(window.dataLayer); // Doit être [] vide
window.gtag('event', 'test'); // Doit afficher warning bloqué

// APRÈS consentement analytics:
window.enableGDPRTracking({analytics: true, marketing: false});
console.log(window.dataLayer); // Doit être fonctionnel
\`\`\`

### ✅ VALIDATION BANNIÈRE CONSENTEMENT

#### 1. DÉTECTION EU AUTOMATIQUE
\`\`\`javascript
// Vérifier dans gdpr-consent.js:
async detectRegion() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const euTimezones = ['Europe/Paris', 'Europe/Berlin', ...];
    this.isEU = euTimezones.some(tz => timezone.includes(tz.split('/')[1]));
}
\`\`\`

#### 2. CATÉGORIES CONSENTEMENT GRANULAIRE
- ✅ **Nécessaires**: Toujours activés (session, sécurité)
- 🔄 **Fonctionnels**: Optionnels (préférences, panier)
- 📊 **Analytics**: Optionnels (GA4, GTM, performance)
- 📢 **Marketing**: Optionnels (Facebook Pixel, remarketing)

#### 3. STOCKAGE & EXPIRATION
- Consentement stocké: **localStorage**
- Durée validité: **6 mois maximum**
- Re-consent automatique après expiration

### ✅ VALIDATION COOKIES & TRACKING

#### 1. SUPPRESSION AUTOMATIQUE
\`\`\`javascript
// Si consentement retiré:
deleteCookies(['_ga', '_gid', '_gat', '_gtm*', '_fbp', '_fbc']);
\`\`\`

#### 2. CHARGEMENT CONDITIONNEL
\`\`\`javascript
// Scripts chargés UNIQUEMENT après consentement:
if (consent.analytics) {
    loadGA4(gaId);
    loadGTM(gtmId);
}
if (consent.marketing) {
    loadFacebookPixel(fbId);
}
\`\`\`

### 🧪 CHECKLIST VALIDATION GO-LIVE

#### Tests Critiques Pré-Déploiement:
- [ ] **GTM bloqué par défaut** (pas de requête gtm.js)
- [ ] **GA4 bloqué par défaut** (pas de requête gtag.js)  
- [ ] **Bannière s'affiche** (utilisateurs EU)
- [ ] **Consentement granulaire** (4 catégories)
- [ ] **Blocage effectif** (aucun tracking sans consent)
- [ ] **Déblocage fonctionnel** (tracking après consent)
- [ ] **Suppression cookies** (retrait consentement)
- [ ] **Stockage persistant** (consent survit refresh)

#### Outils de Test:
- **Network Tab**: Aucune requête tracking pré-consent
- **Console**: Warnings de blocage affichés
- **Application Tab**: Cookies analytics absents
- **GDPR Checker**: cookiebot.com/en/gdpr-checker

### 📋 CONFORMITÉ LÉGALE

#### Article 7 RGPD - Conditions du Consentement:
- ✅ **Libre**: Utilisateur peut refuser sans conséquence
- ✅ **Spécifique**: Granularité par finalité (analytics/marketing)
- ✅ **Éclairé**: Description claire de chaque catégorie
- ✅ **Univoque**: Action positive requise (pas pré-coché)

#### Article 21 RGPD - Droit d'Opposition:
- ✅ **Retrait facile**: Bouton paramètres accessible
- ✅ **Effet immédiat**: Arrêt tracking + suppression cookies
- ✅ **Conservation**: Durée 6 mois max puis re-consent

### 🔧 TROUBLESHOOTING

#### Problème: GTM se charge malgré blocage
- **Solution**: Vérifier ordre scripts (blocage EN PREMIER)
- **Test**: Network tab ne doit montrer aucune requête gtm.js

#### Problème: Bannière ne s'affiche pas
- **Solution**: Vérifier détection EU (forcer this.isEU = true)
- **Test**: Console doit afficher "GDPR banner créé"

#### Problème: Consentement ne persiste pas
- **Solution**: Vérifier localStorage autorisé
- **Test**: Application > Storage > Local Storage

### 🎯 ACTIONS POST-DÉPLOIEMENT

1. **Monitoring 48h**: Surveiller erreurs console
2. **Test multi-navigateurs**: Chrome, Firefox, Safari, Edge
3. **Validation externe**: cookiebot.com GDPR checker
4. **Documentation légale**: Mettre à jour politique cookies
5. **Formation équipe**: Procédures support utilisateur

---

**⚠️ ATTENTION**: Ce guide constitue une base technique. 
Consultez un juriste pour validation légale complète.`;

        const guidePath = path.join(__dirname, '..', 'gdpr-compliance-guide.md');
        fs.writeFileSync(guidePath, guide);
        
        console.log('  ✅ Guide compliance créé: gdpr-compliance-guide.md');
    }

    /**
     * Générer rapport final
     */
    generateReport() {
        const criticalIssues = this.issues.filter(i => i.severity === 'CRITICAL').length;
        const highIssues = this.issues.filter(i => i.severity === 'HIGH').length;
        const compliance = criticalIssues === 0 && highIssues === 0;
        
        const report = {
            timestamp: new Date().toISOString(),
            compliance: compliance,
            gtmBlocked: this.gtmBlocked,
            ga4Blocked: this.ga4Blocked,
            issues: this.issues,
            validations: this.validations,
            summary: {
                criticalIssues,
                highIssues,
                totalIssues: this.issues.length,
                complianceStatus: compliance ? 'CONFORME' : 'NON-CONFORME'
            },
            recommendations: this.generateRecommendations()
        };
        
        // Sauvegarder rapport
        const reportPath = path.join(__dirname, '..', 'reports', `gdpr-validation-${Date.now()}.json`);
        
        try {
            const reportsDir = path.dirname(reportPath);
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder le rapport:', error.message);
        }
        
        return report;
    }

    /**
     * Générer recommandations
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (!this.gtmBlocked) {
            recommendations.push({
                priority: 'CRITICAL',
                action: 'Bloquer chargement GTM direct',
                description: 'Intégrer gdpr-blocking.js AVANT tout script tracking'
            });
        }
        
        if (!this.ga4Blocked) {
            recommendations.push({
                priority: 'CRITICAL', 
                action: 'Bloquer chargement GA4 direct',
                description: 'Supprimer scripts gtag.js du HTML'
            });
        }
        
        const criticalIssues = this.issues.filter(i => i.severity === 'CRITICAL');
        if (criticalIssues.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                action: 'Corriger violations RGPD critiques',
                description: `${criticalIssues.length} problèmes bloquants détectés`
            });
        }
        
        return recommendations;
    }
}

// Export pour usage CLI
if (require.main === module) {
    const validator = new GDPRValidation();
    
    validator.runFullValidation()
        .then(result => {
            if (result.compliance) {
                console.log('\n🎉 RGPD CONFORME!');
                console.log('✅ GTM/GA4 correctement bloqués');
                console.log('📋 Guide: gdpr-compliance-guide.md');
            } else {
                console.log('\n⚠️ PROBLÈMES RGPD DÉTECTÉS');
                console.log(`❌ ${result.summary.criticalIssues} problèmes critiques`);
                console.log(`⚠️ ${result.summary.highIssues} problèmes importants`);
            }
            
            process.exit(result.compliance ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Erreur validation RGPD:', error.message);
            process.exit(1);
        });
}

module.exports = GDPRValidation;