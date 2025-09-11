/**
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
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
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
window._fbPixelId = 'XXXXXXXXXX';   // Remplacer par vrai ID