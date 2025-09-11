/**
 * QA Validator - TechViral
 * Version "Acier" : Validation pre-production enterprise
 */
class QAValidator {
    constructor() {
        this.validations = [];
        this.results = {};
        this.criticalIssues = [];
        this.warnings = [];
        this.score = 0;
        this.isRunning = false;
        
        this.thresholds = {
            performance: 90,
            accessibility: 95,
            seo: 95,
            security: 100,
            compatibility: 85
        };
        
        this.init();
    }

    /**
     * Initialise le validateur QA
     */
    init() {
        this.setupValidations();
        console.log('✅ QA Validator initialisé');
    }

    /**
     * Configure les validations
     */
    setupValidations() {
        this.validations = [
            // Performance
            { category: 'performance', name: 'Core Web Vitals', test: () => this.validateCoreWebVitals() },
            { category: 'performance', name: 'Bundle Size', test: () => this.validateBundleSize() },
            { category: 'performance', name: 'Image Optimization', test: () => this.validateImageOptimization() },
            { category: 'performance', name: 'Lazy Loading', test: () => this.validateLazyLoading() },
            
            // SEO
            { category: 'seo', name: 'Meta Tags', test: () => this.validateMetaTags() },
            { category: 'seo', name: 'Structured Data', test: () => this.validateStructuredData() },
            { category: 'seo', name: 'Sitemap', test: () => this.validateSitemap() },
            { category: 'seo', name: 'Canonical URLs', test: () => this.validateCanonical() },
            { category: 'seo', name: 'Breadcrumbs', test: () => this.validateBreadcrumbs() },
            
            // Accessibilité
            { category: 'accessibility', name: 'Alt Text', test: () => this.validateAltText() },
            { category: 'accessibility', name: 'Heading Structure', test: () => this.validateHeadingStructure() },
            { category: 'accessibility', name: 'Color Contrast', test: () => this.validateColorContrast() },
            { category: 'accessibility', name: 'Keyboard Navigation', test: () => this.validateKeyboardNav() },
            
            // Sécurité
            { category: 'security', name: 'HTTPS', test: () => this.validateHTTPS() },
            { category: 'security', name: 'GDPR Compliance', test: () => this.validateGDPR() },
            { category: 'security', name: 'Content Security', test: () => this.validateContentSecurity() },
            
            // Compatibilité
            { category: 'compatibility', name: 'Browser Support', test: () => this.validateBrowserSupport() },
            { category: 'compatibility', name: 'Mobile Compatibility', test: () => this.validateMobileCompatibility() },
            { category: 'compatibility', name: 'Feature Detection', test: () => this.validateFeatureDetection() },
            
            // Fonctionnel
            { category: 'functional', name: 'Navigation', test: () => this.validateNavigation() },
            { category: 'functional', name: 'Forms', test: () => this.validateForms() },
            { category: 'functional', name: 'E-commerce', test: () => this.validateEcommerce() },
            { category: 'functional', name: 'Analytics', test: () => this.validateAnalytics() }
        ];
    }

    /**
     * Exécute toutes les validations
     */
    async runFullValidation() {
        if (this.isRunning) {
            console.warn('⚠️ Validation déjà en cours');
            return;
        }

        this.isRunning = true;
        this.results = {};
        this.criticalIssues = [];
        this.warnings = [];
        
        console.log('🔍 Début validation QA complète...');
        
        for (const validation of this.validations) {
            try {
                console.log(`🧪 Test: ${validation.name}`);
                const result = await validation.test();
                
                this.results[validation.name] = {
                    category: validation.category,
                    passed: result.passed,
                    score: result.score || 0,
                    issues: result.issues || [],
                    warnings: result.warnings || [],
                    details: result.details || {},
                    timestamp: Date.now()
                };
                
                // Collecter issues critiques
                if (!result.passed || result.score < 50) {
                    this.criticalIssues.push({
                        test: validation.name,
                        category: validation.category,
                        issues: result.issues || []
                    });
                }
                
                // Collecter warnings
                if (result.warnings && result.warnings.length > 0) {
                    this.warnings.push(...result.warnings.map(w => ({
                        test: validation.name,
                        warning: w
                    })));
                }
                
            } catch (error) {
                console.error(`❌ Erreur test ${validation.name}:`, error);
                this.results[validation.name] = {
                    category: validation.category,
                    passed: false,
                    error: error.message,
                    timestamp: Date.now()
                };
            }
        }
        
        this.calculateOverallScore();
        this.generateReport();
        this.isRunning = false;
        
        console.log(`✅ Validation terminée - Score: ${this.score}/100`);
        return this.getValidationSummary();
    }

    /**
     * Validations Performance
     */
    async validateCoreWebVitals() {
        const vitals = window.performanceMonitor ? window.performanceMonitor.getCoreWebVitals() : {};
        const issues = [];
        let score = 100;
        
        // LCP
        if (vitals.LCP && vitals.LCP.value > 2500) {
            issues.push(`LCP trop élevé: ${Math.round(vitals.LCP.value)}ms (seuil: 2500ms)`);
            score -= 20;
        }
        
        // FID
        if (vitals.FID && vitals.FID.value > 100) {
            issues.push(`FID trop élevé: ${Math.round(vitals.FID.value)}ms (seuil: 100ms)`);
            score -= 20;
        }
        
        // CLS
        if (vitals.CLS && vitals.CLS.value > 0.1) {
            issues.push(`CLS trop élevé: ${vitals.CLS.value.toFixed(3)} (seuil: 0.1)`);
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: vitals
        };
    }

    validateBundleSize() {
        const resources = performance.getEntriesByType('resource');
        const jsSize = resources.filter(r => r.name.includes('.js')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
        const cssSize = resources.filter(r => r.name.includes('.css')).reduce((sum, r) => sum + (r.transferSize || 0), 0);
        
        const issues = [];
        let score = 100;
        
        if (jsSize > 500000) { // 500KB
            issues.push(`Bundle JS trop lourd: ${Math.round(jsSize/1024)}KB (seuil: 500KB)`);
            score -= 30;
        }
        
        if (cssSize > 150000) { // 150KB
            issues.push(`Bundle CSS trop lourd: ${Math.round(cssSize/1024)}KB (seuil: 150KB)`);
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { jsSize, cssSize }
        };
    }

    validateImageOptimization() {
        const images = document.querySelectorAll('img');
        const issues = [];
        const warnings = [];
        let score = 100;
        
        images.forEach((img, index) => {
            if (!img.alt && !img.hasAttribute('role')) {
                issues.push(`Image ${index + 1} sans alt text`);
                score -= 5;
            }
            
            if (!img.loading && img.getBoundingClientRect().top > window.innerHeight) {
                warnings.push(`Image ${index + 1} pourrait bénéficier du lazy loading`);
            }
            
            if (img.src && !img.src.includes('.webp') && !img.src.includes('.avif')) {
                warnings.push(`Image ${index + 1} pourrait utiliser un format moderne (WebP/AVIF)`);
            }
        });
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            warnings,
            details: { totalImages: images.length }
        };
    }

    validateLazyLoading() {
        const images = document.querySelectorAll('img');
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        
        const coverage = images.length > 0 ? (lazyImages.length / images.length) * 100 : 100;
        const issues = [];
        
        if (coverage < 50) {
            issues.push(`Couverture lazy loading insuffisante: ${Math.round(coverage)}%`);
        }
        
        return {
            passed: coverage >= 50,
            score: Math.round(coverage),
            issues,
            details: { totalImages: images.length, lazyImages: lazyImages.length, coverage }
        };
    }

    /**
     * Validations SEO
     */
    validateMetaTags() {
        const issues = [];
        let score = 100;
        
        // Title
        const title = document.querySelector('title');
        if (!title || title.textContent.length < 30) {
            issues.push('Title manquant ou trop court (< 30 caractères)');
            score -= 20;
        } else if (title.textContent.length > 60) {
            issues.push('Title trop long (> 60 caractères)');
            score -= 10;
        }
        
        // Meta description
        const description = document.querySelector('meta[name="description"]');
        if (!description || description.content.length < 120) {
            issues.push('Meta description manquante ou trop courte (< 120 caractères)');
            score -= 20;
        } else if (description.content.length > 160) {
            issues.push('Meta description trop longue (> 160 caractères)');
            score -= 10;
        }
        
        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        
        if (!ogTitle || !ogDescription || !ogImage) {
            issues.push('Meta tags Open Graph incomplets');
            score -= 15;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: {
                titleLength: title ? title.textContent.length : 0,
                descriptionLength: description ? description.content.length : 0,
                hasOG: !!(ogTitle && ogDescription && ogImage)
            }
        };
    }

    validateStructuredData() {
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        const issues = [];
        let score = 100;
        
        if (schemas.length === 0) {
            issues.push('Aucune donnée structurée détectée');
            score -= 30;
        } else {
            schemas.forEach((schema, index) => {
                try {
                    JSON.parse(schema.textContent);
                } catch (e) {
                    issues.push(`Schema ${index + 1} invalide: ${e.message}`);
                    score -= 20;
                }
            });
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { schemaCount: schemas.length }
        };
    }

    validateSitemap() {
        // Vérifier présence dans robots.txt ou meta
        const issues = [];
        let score = 100;
        
        // Simulation - en production, vérifier via fetch
        const hasSitemap = document.querySelector('link[rel="sitemap"]') || 
                          window.sitemapGenerator;
        
        if (!hasSitemap) {
            issues.push('Sitemap non détecté');
            score -= 50;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasSitemap }
        };
    }

    validateCanonical() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const issues = [];
        let score = 100;
        
        if (!canonical) {
            issues.push('URL canonique manquante');
            score -= 40;
        } else if (canonical.href !== window.location.href) {
            // OK si c'est intentionnel (pagination, etc.)
            score = 90;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { canonicalUrl: canonical ? canonical.href : null }
        };
    }

    validateBreadcrumbs() {
        const breadcrumbs = document.querySelector('[data-breadcrumb], nav[aria-label*="breadcrumb"], nav[aria-label*="fil"]');
        const breadcrumbSchema = document.querySelector('script[type="application/ld+json"]');
        
        const issues = [];
        let score = 100;
        
        if (!breadcrumbs) {
            issues.push('Breadcrumbs manquants');
            score -= 30;
        }
        
        // Vérifier Schema.org BreadcrumbList
        let hasBreadcrumbSchema = false;
        if (breadcrumbSchema) {
            try {
                const data = JSON.parse(breadcrumbSchema.textContent);
                hasBreadcrumbSchema = data['@type'] === 'BreadcrumbList';
            } catch (e) {}
        }
        
        if (!hasBreadcrumbSchema) {
            issues.push('Schema BreadcrumbList manquant');
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasBreadcrumbs: !!breadcrumbs, hasSchema: hasBreadcrumbSchema }
        };
    }

    /**
     * Validations Accessibilité
     */
    validateAltText() {
        const images = document.querySelectorAll('img');
        const issues = [];
        let score = 100;
        
        images.forEach((img, index) => {
            if (!img.alt && !img.hasAttribute('role')) {
                issues.push(`Image ${index + 1} sans alt text`);
                score -= Math.min(10, 100 / images.length);
            }
        });
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { totalImages: images.length, missingAlt: issues.length }
        };
    }

    validateHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues = [];
        let score = 100;
        
        const h1Count = document.querySelectorAll('h1').length;
        if (h1Count === 0) {
            issues.push('Aucun H1 trouvé');
            score -= 30;
        } else if (h1Count > 1) {
            issues.push(`Multiple H1 détectés (${h1Count})`);
            score -= 20;
        }
        
        // Vérifier progression logique
        let previousLevel = 0;
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            if (previousLevel > 0 && level > previousLevel + 1) {
                issues.push(`Saut de niveau détecté: H${previousLevel} → H${level}`);
                score -= 10;
            }
            previousLevel = level;
        });
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { totalHeadings: headings.length, h1Count }
        };
    }

    validateColorContrast() {
        // Test simplifié - en production utiliser un vrai algorithme de contraste
        const issues = [];
        let score = 100;
        
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        let lowContrastCount = 0;
        
        textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Test simplifié pour couleurs grises
            if (color.includes('rgb(156, 163, 175)') && bgColor.includes('rgb(229, 231, 235)')) {
                lowContrastCount++;
            }
        });
        
        if (lowContrastCount > 0) {
            issues.push(`${lowContrastCount} éléments avec contraste potentiellement faible`);
            score -= Math.min(30, lowContrastCount * 5);
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { totalElements: textElements.length, lowContrastCount }
        };
    }

    validateKeyboardNav() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const issues = [];
        let score = 100;
        
        focusableElements.forEach((el, index) => {
            if (el.tabIndex < 0) {
                issues.push(`Élément ${index + 1} non accessible au clavier`);
                score -= 5;
            }
        });
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { focusableElements: focusableElements.length }
        };
    }

    /**
     * Validations Sécurité
     */
    validateHTTPS() {
        const isHTTPS = window.location.protocol === 'https:';
        
        return {
            passed: isHTTPS,
            score: isHTTPS ? 100 : 0,
            issues: isHTTPS ? [] : ['Site non sécurisé (HTTP)'],
            details: { protocol: window.location.protocol }
        };
    }

    validateGDPR() {
        const hasConsent = window.gdprConsent && window.gdprConsent.getConsentStatus();
        const hasBanner = document.querySelector('[id*="gdpr"], [class*="consent"]');
        
        const issues = [];
        let score = 100;
        
        if (!hasConsent && !hasBanner) {
            issues.push('Système de consentement RGPD non détecté');
            score -= 50;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasConsent: !!hasConsent, hasBanner: !!hasBanner }
        };
    }

    validateContentSecurity() {
        // Vérifier CSP, inline scripts, etc.
        const inlineScripts = document.querySelectorAll('script:not([src])');
        const issues = [];
        let score = 100;
        
        if (inlineScripts.length > 5) {
            issues.push(`Trop de scripts inline (${inlineScripts.length})`);
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { inlineScripts: inlineScripts.length }
        };
    }

    /**
     * Validations Compatibilité
     */
    validateBrowserSupport() {
        const browserTester = window.browserTester;
        let score = 100;
        const issues = [];
        
        if (browserTester) {
            score = browserTester.getCompatibilityScore();
            const recommendations = browserTester.getRecommendations();
            
            if (score < 85) {
                issues.push(`Compatibilité navigateur faible: ${score}%`);
            }
            
            return {
                passed: score >= 85,
                score: score,
                issues,
                warnings: recommendations,
                details: { compatibilityScore: score }
            };
        }
        
        return {
            passed: false,
            score: 0,
            issues: ['Browser Tester non disponible'],
            details: {}
        };
    }

    validateMobileCompatibility() {
        const viewport = document.querySelector('meta[name="viewport"]');
        const issues = [];
        let score = 100;
        
        if (!viewport) {
            issues.push('Meta viewport manquant');
            score -= 40;
        }
        
        // Vérifier responsive
        const isMobileOptimized = window.innerWidth < 768 || 
                                 window.mobileNav ||
                                 document.querySelector('.mobile-menu');
        
        if (!isMobileOptimized) {
            issues.push('Optimisation mobile non détectée');
            score -= 30;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasViewport: !!viewport, isMobileOptimized }
        };
    }

    validateFeatureDetection() {
        const hasFeatureDetection = window.browserTester || 
                                   document.querySelector('script[src*="modernizr"]');
        
        return {
            passed: !!hasFeatureDetection,
            score: hasFeatureDetection ? 100 : 60,
            issues: hasFeatureDetection ? [] : ['Détection de fonctionnalités manquante'],
            details: { hasFeatureDetection: !!hasFeatureDetection }
        };
    }

    /**
     * Validations Fonctionnelles
     */
    validateNavigation() {
        const nav = document.querySelector('nav');
        const links = document.querySelectorAll('nav a');
        const issues = [];
        let score = 100;
        
        if (!nav) {
            issues.push('Navigation principale manquante');
            score -= 40;
        }
        
        if (links.length < 3) {
            issues.push('Navigation insuffisante (< 3 liens)');
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasNav: !!nav, linkCount: links.length }
        };
    }

    validateForms() {
        const forms = document.querySelectorAll('form');
        const issues = [];
        let score = 100;
        
        forms.forEach((form, index) => {
            const inputs = form.querySelectorAll('input, textarea, select');
            const unlabeledInputs = Array.from(inputs).filter(input => {
                return !input.closest('label') && 
                       !document.querySelector(`label[for="${input.id}"]`) &&
                       !input.hasAttribute('aria-label');
            });
            
            if (unlabeledInputs.length > 0) {
                issues.push(`Formulaire ${index + 1}: ${unlabeledInputs.length} champs sans label`);
                score -= 15;
            }
        });
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { formCount: forms.length }
        };
    }

    validateEcommerce() {
        const productCards = document.querySelectorAll('[data-product-id], .product-card');
        const addToCartButtons = document.querySelectorAll('[data-action="add-to-cart"], .add-to-cart');
        
        const issues = [];
        let score = 100;
        
        if (productCards.length === 0) {
            issues.push('Aucun produit détecté');
            score -= 30;
        }
        
        if (addToCartButtons.length === 0) {
            issues.push('Boutons "Ajouter au panier" manquants');
            score -= 20;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { productCount: productCards.length, cartButtons: addToCartButtons.length }
        };
    }

    validateAnalytics() {
        const hasGA4 = window.ga4Tracker || window.gtag;
        const hasGTM = window.dataLayer;
        
        const issues = [];
        let score = 100;
        
        if (!hasGA4 && !hasGTM) {
            issues.push('Analytics non configuré');
            score -= 40;
        }
        
        return {
            passed: issues.length === 0,
            score: Math.max(0, score),
            issues,
            details: { hasGA4: !!hasGA4, hasGTM: !!hasGTM }
        };
    }

    /**
     * Calcul score global
     */
    calculateOverallScore() {
        const categories = {};
        const weights = {
            performance: 0.25,
            seo: 0.25,
            accessibility: 0.20,
            security: 0.15,
            compatibility: 0.10,
            functional: 0.05
        };
        
        // Grouper par catégorie
        Object.values(this.results).forEach(result => {
            if (!categories[result.category]) {
                categories[result.category] = [];
            }
            categories[result.category].push(result.score || 0);
        });
        
        // Calculer moyenne par catégorie
        const categoryScores = {};
        Object.entries(categories).forEach(([category, scores]) => {
            categoryScores[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });
        
        // Score pondéré
        this.score = Object.entries(categoryScores).reduce((total, [category, score]) => {
            const weight = weights[category] || 0.05;
            return total + (score * weight);
        }, 0);
        
        this.score = Math.round(this.score);
    }

    /**
     * Génère rapport
     */
    generateReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            overallScore: this.score,
            grade: this.getGrade(this.score),
            criticalIssues: this.criticalIssues.length,
            warnings: this.warnings.length,
            categories: this.getCategoryBreakdown(),
            readyForProduction: this.isReadyForProduction(),
            results: this.results,
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Rapport QA généré:', report);
        return report;
    }

    getCategoryBreakdown() {
        const categories = {};
        
        Object.values(this.results).forEach(result => {
            if (!categories[result.category]) {
                categories[result.category] = {
                    tests: 0,
                    passed: 0,
                    averageScore: 0,
                    scores: []
                };
            }
            
            categories[result.category].tests++;
            if (result.passed) categories[result.category].passed++;
            categories[result.category].scores.push(result.score || 0);
        });
        
        // Calculer moyennes
        Object.values(categories).forEach(category => {
            category.averageScore = Math.round(
                category.scores.reduce((sum, score) => sum + score, 0) / category.scores.length
            );
            category.passRate = Math.round((category.passed / category.tests) * 100);
        });
        
        return categories;
    }

    isReadyForProduction() {
        return this.score >= 85 && this.criticalIssues.length === 0;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.score < 85) {
            recommendations.push('Score global insuffisant pour production (< 85%)');
        }
        
        if (this.criticalIssues.length > 0) {
            recommendations.push(`Corriger ${this.criticalIssues.length} problème(s) critique(s)`);
        }
        
        // Recommandations par catégorie
        const categories = this.getCategoryBreakdown();
        Object.entries(categories).forEach(([category, data]) => {
            if (data.averageScore < this.thresholds[category]) {
                recommendations.push(`Améliorer ${category}: ${data.averageScore}% (seuil: ${this.thresholds[category]}%)`);
            }
        });
        
        return recommendations;
    }

    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B';
        if (score >= 75) return 'C';
        if (score >= 65) return 'D';
        return 'F';
    }

    /**
     * Export rapport
     */
    exportReport() {
        const report = this.generateReport();
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `qa-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Rapport QA exporté');
        return report;
    }

    /**
     * API publique
     */
    getValidationSummary() {
        return {
            score: this.score,
            grade: this.getGrade(this.score),
            criticalIssues: this.criticalIssues.length,
            warnings: this.warnings.length,
            readyForProduction: this.isReadyForProduction(),
            categories: this.getCategoryBreakdown()
        };
    }

    async quickValidation() {
        // Version rapide avec tests essentiels seulement
        const essentialTests = this.validations.filter(v => 
            ['Core Web Vitals', 'Meta Tags', 'HTTPS', 'Alt Text'].includes(v.name)
        );
        
        for (const test of essentialTests) {
            const result = await test.test();
            this.results[test.name] = {
                category: test.category,
                passed: result.passed,
                score: result.score || 0
            };
        }
        
        this.calculateOverallScore();
        return this.getValidationSummary();
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.qaValidator = new QAValidator();
    
    // Raccourci Ctrl+Shift+Q pour validation rapide
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyQ') {
            e.preventDefault();
            window.qaValidator.runFullValidation();
        }
    });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QAValidator;
}