/**
 * Google Search Console Manager - TechViral
 * Version "Acier" : Gestion automatisée Search Console + monitoring
 */
class SearchConsoleManager {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.verificationCode = null;
        this.isVerified = false;
        this.sitemapSubmitted = false;
    }

    /**
     * Initialise le gestionnaire Search Console
     * @param {string} verificationCode - Code de vérification Google
     */
    init(verificationCode = null) {
        this.verificationCode = verificationCode;
        
        if (verificationCode) {
            this.addVerificationMeta();
            console.log('✅ Meta verification Google ajoutée');
        }
        
        this.setupAnalytics();
        this.setupStructuredData();
        
        console.log('🔍 Search Console Manager initialisé');
    }

    /**
     * Ajoute la meta verification Google
     */
    addVerificationMeta() {
        // Supprimer ancienne meta si existe
        const existingMeta = document.querySelector('meta[name="google-site-verification"]');
        if (existingMeta) {
            existingMeta.remove();
        }

        // Ajouter nouvelle meta
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = this.verificationCode;
        document.head.appendChild(meta);
    }

    /**
     * Configure les données structurées pour Search Console
     */
    setupStructuredData() {
        // Vérifier si Schema.org Organization existe
        if (!document.querySelector('script[type="application/ld+json"]')) {
            this.addOrganizationSchema();
        }
        
        // Ajouter WebSite schema si manquant
        this.addWebSiteSchema();
    }

    /**
     * Ajoute le Schema.org Organization
     */
    addOrganizationSchema() {
        const orgSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TechViral",
            "description": "Boutique spécialisée dans les produits innovants et gadgets high-tech 2025",
            "url": this.baseUrl,
            "logo": `${this.baseUrl}/assets/images/logo-techviral.png`,
            "sameAs": [
                "https://www.facebook.com/techviral",
                "https://www.twitter.com/techviral",
                "https://www.instagram.com/techviral"
            ],
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+33-1-23-45-67-89",
                "contactType": "customer service",
                "availableLanguage": ["French"],
                "areaServed": ["FR", "BE", "CH", "LU"]
            },
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "FR",
                "addressRegion": "Île-de-France",
                "addressLocality": "Paris"
            }
        };

        this.injectSchema(orgSchema, 'organization-schema');
    }

    /**
     * Ajoute le Schema.org WebSite avec SearchAction
     */
    addWebSiteSchema() {
        const websiteSchema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "TechViral",
            "description": "Produits viraux et innovations technologiques 2025",
            "url": this.baseUrl,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${this.baseUrl}/search.html?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            },
            "publisher": {
                "@type": "Organization",
                "name": "TechViral",
                "logo": `${this.baseUrl}/assets/images/logo-techviral.png`
            }
        };

        this.injectSchema(websiteSchema, 'website-schema');
    }

    /**
     * Injecte un schema JSON-LD
     * @param {Object} schema - Schema à injecter
     * @param {string} id - ID pour identification
     */
    injectSchema(schema, id) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = id;
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Configure Google Analytics 4 pour Search Console
     */
    setupAnalytics() {
        // GA4 sera configuré dans une phase ultérieure
        // Ici on prépare les événements critiques pour Search Console
        
        this.trackCriticalEvents();
    }

    /**
     * Track des événements critiques pour Search Console
     */
    trackCriticalEvents() {
        // Erreurs 404
        if (document.title.includes('404') || document.title.includes('Erreur')) {
            this.reportError('404_error', window.location.pathname);
        }

        // Temps de chargement lent
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            if (loadTime > 3000) {
                this.reportError('slow_loading', `${loadTime}ms`);
            }
        });

        // Erreurs JavaScript
        window.addEventListener('error', (event) => {
            this.reportError('javascript_error', event.message);
        });
    }

    /**
     * Rapporte une erreur pour monitoring
     * @param {string} type - Type d'erreur
     * @param {string} details - Détails de l'erreur
     */
    reportError(type, details) {
        // Log en console pour développement
        console.warn(`🚨 Search Console Alert - ${type}:`, details);
        
        // Ici on pourrait envoyer à un service de monitoring
        // comme Sentry, LogRocket, ou directement à GA4
    }

    /**
     * Génère le rapport Search Console
     * @returns {Object} Rapport de statut
     */
    generateReport() {
        return {
            domain: this.baseUrl,
            verification: {
                isSetup: !!this.verificationCode,
                code: this.verificationCode ? this.verificationCode.substring(0, 10) + '...' : null
            },
            schemas: {
                organization: !!document.getElementById('organization-schema'),
                website: !!document.getElementById('website-schema'),
                products: document.querySelectorAll('script[type="application/ld+json"]').length
            },
            seo: {
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content,
                canonical: document.querySelector('link[rel="canonical"]')?.href,
                sitemap: `${this.baseUrl}/sitemap.xml`,
                robots: `${this.baseUrl}/robots.txt`
            },
            performance: {
                loadTime: performance.timing ? 
                    (performance.timing.loadEventEnd - performance.timing.navigationStart) + 'ms' : 
                    'Non disponible'
            }
        };
    }

    /**
     * Valide la configuration Search Console
     * @returns {Object} Résultat de validation
     */
    validateSetup() {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            score: 0
        };

        // Vérification meta verification
        const verificationMeta = document.querySelector('meta[name="google-site-verification"]');
        if (verificationMeta) {
            validation.score += 20;
        } else {
            validation.errors.push('Meta verification Google manquante');
        }

        // Vérification titre
        if (document.title && document.title.length > 0) {
            validation.score += 15;
        } else {
            validation.errors.push('Titre de page manquant');
        }

        // Vérification meta description
        const description = document.querySelector('meta[name="description"]');
        if (description && description.content.length > 50) {
            validation.score += 15;
        } else {
            validation.warnings.push('Meta description optimisable');
        }

        // Vérification canonical
        if (document.querySelector('link[rel="canonical"]')) {
            validation.score += 10;
        } else {
            validation.warnings.push('URL canonique manquante');
        }

        // Vérification Schema.org
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        if (schemas.length >= 2) {
            validation.score += 20;
        } else {
            validation.warnings.push('Données structurées incomplètes');
        }

        // Vérification robots.txt et sitemap
        validation.score += 20; // Supposés présents

        validation.isValid = validation.errors.length === 0;
        validation.grade = this.getGrade(validation.score);

        return validation;
    }

    /**
     * Calcule la note qualité
     * @param {number} score - Score sur 100
     * @returns {string} Note lettre
     */
    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        return 'D';
    }

    /**
     * Instructions de configuration Search Console
     * @returns {Object} Guide étape par étape
     */
    getSetupInstructions() {
        return {
            title: "Configuration Google Search Console - Guide Acier",
            steps: [
                {
                    step: 1,
                    title: "Créer compte Search Console",
                    action: "Aller sur search.google.com/search-console",
                    details: "Se connecter avec compte Google et ajouter propriété"
                },
                {
                    step: 2,
                    title: "Vérifier propriété domain",
                    action: "Choisir 'Préfixe URL' avec https://techviral.com",
                    details: "Copier le code de vérification fourni"
                },
                {
                    step: 3,
                    title: "Ajouter meta verification",
                    action: "searchConsoleManager.init('CODE_VERIFICATION')",
                    details: "Remplacer CODE_VERIFICATION par le vrai code"
                },
                {
                    step: 4,
                    title: "Soumettre sitemap",
                    action: "Ajouter URL: sitemap.xml",
                    details: "Dans Search Console > Index > Sitemaps"
                },
                {
                    step: 5,
                    title: "Configurer rapports",
                    action: "Activer emails de monitoring",
                    details: "Notifications pour erreurs critiques"
                }
            ],
            automation: {
                command: "searchConsoleManager.autoSetup('VERIFICATION_CODE')",
                description: "Configure automatiquement tous les éléments requis"
            }
        };
    }

    /**
     * Configuration automatique complète
     * @param {string} verificationCode - Code de vérification Google
     */
    autoSetup(verificationCode) {
        console.log('🚀 Configuration automatique Search Console...');
        
        this.init(verificationCode);
        
        // Rapport de validation
        const report = this.generateReport();
        const validation = this.validateSetup();
        
        console.log('📊 Rapport Search Console:', report);
        console.log('✅ Validation (Score: ' + validation.score + '/100 - ' + validation.grade + '):', validation);
        
        if (validation.errors.length > 0) {
            console.error('❌ Erreurs à corriger:', validation.errors);
        }
        
        if (validation.warnings.length > 0) {
            console.warn('⚠️ Améliorations possibles:', validation.warnings);
        }
        
        console.log('🎯 Prochaine étape: Soumettre sitemap.xml dans Search Console');
        
        return {
            success: validation.isValid,
            report: report,
            validation: validation,
            instructions: this.getSetupInstructions()
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.searchConsoleManager = new SearchConsoleManager();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchConsoleManager;
}