/**
 * GDPR Consent Manager - TechViral
 * Version "Acier" : Conformité RGPD + GTM Integration
 */
class GDPRConsentManager {
    constructor() {
        this.cookieName = 'techviral_consent';
        this.consentData = null;
        this.bannerElement = null;
        this.settingsModal = null;
        this.gtmId = 'GTM-XXXXXXX'; // À remplacer par vrai ID
        this.isEU = false;
        
        // Catégories de cookies
        this.cookieCategories = {
            necessary: {
                name: 'Cookies Nécessaires',
                description: 'Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.',
                required: true,
                cookies: ['session', 'security', 'preferences']
            },
            functional: {
                name: 'Cookies Fonctionnels',
                description: 'Ces cookies permettent d\'améliorer les fonctionnalités du site.',
                required: false,
                cookies: ['language', 'theme', 'cart_data']
            },
            analytics: {
                name: 'Cookies Analytiques',
                description: 'Ces cookies nous aident à comprendre comment vous utilisez notre site.',
                required: false,
                cookies: ['_ga', '_gid', '_gat', 'gtm']
            },
            marketing: {
                name: 'Cookies Marketing',
                description: 'Ces cookies sont utilisés pour personnaliser les publicités.',
                required: false,
                cookies: ['facebook_pixel', 'google_ads', 'remarketing']
            }
        };
        
        this.init();
    }

    /**
     * Initialise le gestionnaire RGPD
     */
    async init() {
        await this.detectRegion();
        this.loadStoredConsent();
        
        if (this.isEU && !this.hasValidConsent()) {
            this.createConsentBanner();
            this.showBanner();
        } else {
            this.applyConsent();
        }
        
        this.setupEventListeners();
        console.log('🔒 GDPR Consent Manager initialisé');
    }

    /**
     * Détecte la région utilisateur
     */
    async detectRegion() {
        try {
            // Utiliser timezone comme indicateur EU
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const euTimezones = [
                'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid',
                'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna',
                'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Warsaw',
                'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest'
            ];
            
            this.isEU = euTimezones.some(tz => timezone.includes(tz.split('/')[1]));
            
            // Fallback avec IP géolocalisation (optionnel)
            if (!this.isEU) {
                await this.checkIPGeolocation();
            }
            
        } catch (e) {
            // Défaut sécurisé : considérer comme EU
            this.isEU = true;
            console.warn('Impossible de détecter région, application RGPD par défaut');
        }
    }

    /**
     * Vérifie géolocalisation IP (optionnel)
     */
    async checkIPGeolocation() {
        try {
            // En production, utiliser service géolocalisation
            // const response = await fetch('https://ipapi.co/json/');
            // const data = await response.json();
            // this.isEU = data.continent_code === 'EU';
            
            // Simulation pour démonstration
            this.isEU = true;
        } catch (e) {
            this.isEU = true; // Défaut sécurisé
        }
    }

    /**
     * Charge consentement stocké
     */
    loadStoredConsent() {
        try {
            const stored = localStorage.getItem(this.cookieName);
            if (stored) {
                this.consentData = JSON.parse(stored);
                
                // Vérifier validité (6 mois max)
                const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
                if (this.consentData.timestamp < sixMonthsAgo) {
                    this.consentData = null;
                    localStorage.removeItem(this.cookieName);
                }
            }
        } catch (e) {
            console.warn('Erreur chargement consentement:', e);
            this.consentData = null;
        }
    }

    /**
     * Vérifie si consentement valide
     */
    hasValidConsent() {
        return this.consentData && 
               this.consentData.version === '1.0' &&
               this.consentData.timestamp > (Date.now() - (6 * 30 * 24 * 60 * 60 * 1000));
    }

    /**
     * Crée la bannière de consentement
     */
    createConsentBanner() {
        this.bannerElement = document.createElement('div');
        this.bannerElement.id = 'gdpr-consent-banner';
        this.bannerElement.className = 'gdpr-banner fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-blue-500 shadow-2xl z-50 p-6 transform translate-y-full transition-transform duration-500';
        
        this.bannerElement.innerHTML = `
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-start gap-3">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Respect de votre vie privée
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. 
                                    Vous pouvez accepter tous les cookies ou personnaliser vos préférences.
                                </p>
                                <div class="flex flex-wrap gap-2 text-xs">
                                    <button class="gdpr-link text-blue-600 hover:underline" data-action="privacy-policy">
                                        Politique de confidentialité
                                    </button>
                                    <span class="text-gray-400">•</span>
                                    <button class="gdpr-link text-blue-600 hover:underline" data-action="cookie-policy">
                                        Politique des cookies
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                        <button class="gdpr-btn gdpr-customize px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Personnaliser
                        </button>
                        <button class="gdpr-btn gdpr-reject px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            Refuser tout
                        </button>
                        <button class="gdpr-btn gdpr-accept px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Accepter tout
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.bannerElement);
        this.createSettingsModal();
    }

    /**
     * Crée modal paramètres détaillés
     */
    createSettingsModal() {
        this.settingsModal = document.createElement('div');
        this.settingsModal.id = 'gdpr-settings-modal';
        this.settingsModal.className = 'gdpr-modal fixed inset-0 bg-black bg-opacity-50 z-50 hidden items-center justify-center p-4';
        
        this.settingsModal.innerHTML = `
            <div class="modal-content bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="modal-header p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                            Paramètres de confidentialité
                        </h2>
                        <button class="modal-close text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="modal-body p-6">
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        Gérez vos préférences de cookies. Vous pouvez activer ou désactiver différents types de cookies ci-dessous.
                    </p>
                    
                    <div class="cookie-categories space-y-6">
                        ${this.generateCategorySettings()}
                    </div>
                </div>
                
                <div class="modal-footer p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    <button class="gdpr-modal-cancel px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        Annuler
                    </button>
                    <button class="gdpr-modal-save px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Enregistrer les préférences
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.settingsModal);
    }

    /**
     * Génère paramètres par catégorie
     */
    generateCategorySettings() {
        return Object.entries(this.cookieCategories).map(([key, category]) => `
            <div class="category-setting border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            ${category.name}
                        </h3>
                        ${category.required ? 
                            '<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Obligatoire</span>' : 
                            `<label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer category-toggle" data-category="${key}" ${this.getDefaultState(key) ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>`
                        }
                    </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    ${category.description}
                </p>
                <div class="cookies-list">
                    <details class="group">
                        <summary class="text-xs text-blue-600 cursor-pointer hover:underline">
                            Voir les cookies (${category.cookies.length})
                        </summary>
                        <div class="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                            ${category.cookies.map(cookie => `
                                <div class="text-xs text-gray-500 dark:text-gray-400 py-1">
                                    ${cookie}
                                </div>
                            `).join('')}
                        </div>
                    </details>
                </div>
            </div>
        `).join('');
    }

    /**
     * État par défaut des catégories
     */
    getDefaultState(category) {
        if (this.consentData && this.consentData.categories) {
            return this.consentData.categories[category] || false;
        }
        return category === 'necessary' || category === 'functional';
    }

    /**
     * Configure event listeners
     */
    setupEventListeners() {
        // Bannière principale
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gdpr-accept')) {
                this.acceptAll();
            } else if (e.target.classList.contains('gdpr-reject')) {
                this.rejectAll();
            } else if (e.target.classList.contains('gdpr-customize')) {
                this.showSettings();
            } else if (e.target.classList.contains('gdpr-link')) {
                this.handleLinkClick(e.target.dataset.action);
            }
        });

        // Modal paramètres
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.classList.contains('gdpr-modal-cancel')) {
                this.hideSettings();
            } else if (e.target.classList.contains('gdpr-modal-save')) {
                this.saveCustomSettings();
            }
        });

        // Fermer modal en cliquant dehors
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) {
                    this.hideSettings();
                }
            });
        }

        // Bouton paramètres persistant
        this.createSettingsButton();
    }

    /**
     * Crée bouton paramètres persistant
     */
    createSettingsButton() {
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'gdpr-settings-btn';
        settingsBtn.className = 'gdpr-settings-btn fixed bottom-4 left-4 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors z-40';
        settingsBtn.title = 'Paramètres de confidentialité';
        settingsBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
        `;
        
        settingsBtn.addEventListener('click', () => this.showSettings());
        document.body.appendChild(settingsBtn);
    }

    /**
     * Actions de consentement
     */
    acceptAll() {
        const consent = {
            timestamp: Date.now(),
            version: '1.0',
            categories: {
                necessary: true,
                functional: true,
                analytics: true,
                marketing: true
            }
        };
        
        this.saveConsent(consent);
        this.hideBanner();
        this.applyConsent();
    }

    rejectAll() {
        const consent = {
            timestamp: Date.now(),
            version: '1.0',
            categories: {
                necessary: true,
                functional: false,
                analytics: false,
                marketing: false
            }
        };
        
        this.saveConsent(consent);
        this.hideBanner();
        this.applyConsent();
    }

    saveCustomSettings() {
        const categories = {};
        
        Object.keys(this.cookieCategories).forEach(category => {
            if (this.cookieCategories[category].required) {
                categories[category] = true;
            } else {
                const toggle = document.querySelector(`.category-toggle[data-category="${category}"]`);
                categories[category] = toggle ? toggle.checked : false;
            }
        });
        
        const consent = {
            timestamp: Date.now(),
            version: '1.0',
            categories: categories
        };
        
        this.saveConsent(consent);
        this.hideSettings();
        this.hideBanner();
        this.applyConsent();
    }

    /**
     * Stockage consentement
     */
    saveConsent(consent) {
        this.consentData = consent;
        
        try {
            localStorage.setItem(this.cookieName, JSON.stringify(consent));
            
            // Cookie de fallback pour server-side
            document.cookie = `${this.cookieName}=${JSON.stringify(consent)}; path=/; max-age=${6 * 30 * 24 * 60 * 60}; SameSite=Lax`;
            
        } catch (e) {
            console.warn('Impossible de sauvegarder consentement:', e);
        }
        
        // Analytics consentement
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('gdpr_consent', {
                consent_method: 'explicit',
                categories: Object.keys(consent.categories).filter(k => consent.categories[k])
            });
        }
    }

    /**
     * Application du consentement
     */
    applyConsent() {
        if (!this.consentData) return;
        
        const { categories } = this.consentData;
        
        // Analytics (GA4, GTM)
        if (categories.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Marketing
        if (categories.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        // Fonctionnel
        if (categories.functional) {
            this.enableFunctional();
        }
        
        // Mise à jour GTM
        this.updateGTMConsent();
        
        console.log('🔒 Consentement appliqué:', categories);
    }

    /**
     * Activation/désactivation par catégorie
     */
    enableAnalytics() {
        // Activer GA4
        if (window.ga4Tracker && window.ga4Tracker.measurementId) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied'
            });
        }
        
        // Réactiver tracking performance si consenti
        if (window.performanceMonitor) {
            window.performanceMonitor.enableRUMSending = true;
        }
    }

    disableAnalytics() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        // Désactiver RUM
        if (window.performanceMonitor) {
            window.performanceMonitor.enableRUMSending = false;
        }
        
        // Supprimer cookies analytics existants
        this.deleteCookies(['_ga', '_gid', '_gat']);
    }

    enableMarketing() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
    }

    disableMarketing() {
        if (window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
        
        // Supprimer cookies marketing
        this.deleteCookies(['_fbp', '_fbc', 'fr']);
    }

    enableFunctional() {
        // Autoriser localStorage étendu
        this.functionalStorageEnabled = true;
    }

    /**
     * Mise à jour consentement GTM
     */
    updateGTMConsent() {
        if (!window.dataLayer) return;
        
        window.dataLayer.push({
            'event': 'consent_update',
            'consent_data': this.consentData.categories
        });
    }

    /**
     * Suppression cookies
     */
    deleteCookies(cookieNames) {
        cookieNames.forEach(name => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        });
    }

    /**
     * Gestion affichage
     */
    showBanner() {
        if (this.bannerElement) {
            setTimeout(() => {
                this.bannerElement.classList.remove('translate-y-full');
            }, 500);
        }
    }

    hideBanner() {
        if (this.bannerElement) {
            this.bannerElement.classList.add('translate-y-full');
            setTimeout(() => {
                this.bannerElement.remove();
            }, 500);
        }
    }

    showSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('hidden');
            this.settingsModal.classList.add('flex');
        }
    }

    hideSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('hidden');
            this.settingsModal.classList.remove('flex');
        }
    }

    /**
     * Gestion liens
     */
    handleLinkClick(action) {
        switch (action) {
            case 'privacy-policy':
                window.open('/pages/legal/privacy.html', '_blank');
                break;
            case 'cookie-policy':
                window.open('/pages/legal/cookies.html', '_blank');
                break;
        }
    }

    /**
     * API publique
     */
    getConsentStatus() {
        return this.consentData;
    }

    hasConsent(category) {
        return this.consentData && this.consentData.categories && this.consentData.categories[category];
    }

    revokeConsent() {
        localStorage.removeItem(this.cookieName);
        this.consentData = null;
        location.reload();
    }

    updateConsent(categories) {
        if (this.consentData) {
            this.consentData.categories = { ...this.consentData.categories, ...categories };
            this.consentData.timestamp = Date.now();
            this.saveConsent(this.consentData);
            this.applyConsent();
        }
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.gdprConsent = new GDPRConsentManager();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GDPRConsentManager;
}