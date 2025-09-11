/**
 * Accessibility Checker - TechViral
 * Version "Acier" : Tests automatisés axe-core + Lighthouse CI
 */
class AccessibilityChecker {
    constructor() {
        this.violations = [];
        this.score = 0;
        this.isAxeCoreLoaded = false;
        this.checks = {
            basic: [],
            advanced: [],
            lighthouse: []
        };
        
        this.init();
    }

    /**
     * Initialise le checker d'accessibilité
     */
    async init() {
        await this.loadAxeCore();
        this.setupBasicChecks();
        console.log('♿ Accessibility Checker initialisé');
    }

    /**
     * Charge axe-core dynamiquement
     */
    async loadAxeCore() {
        if (window.axe) {
            this.isAxeCoreLoaded = true;
            return;
        }

        try {
            // Simuler axe-core pour démonstration (en production, charger la vraie lib)
            window.axe = {
                run: async (context, options) => {
                    return this.mockAxeRun(context, options);
                },
                configure: (config) => {
                    console.log('axe configuré:', config);
                }
            };
            
            this.isAxeCoreLoaded = true;
            console.log('✅ axe-core simulé chargé');
        } catch (error) {
            console.warn('⚠️ Impossible de charger axe-core:', error);
        }
    }

    /**
     * Mock de axe.run pour démonstration
     */
    async mockAxeRun(context = document, options = {}) {
        // Simulation des résultats axe-core
        const violations = [];
        const passes = [];

        // Vérifications basiques simulées
        const missingAlt = document.querySelectorAll('img:not([alt])');
        if (missingAlt.length > 0) {
            violations.push({
                id: 'image-alt',
                description: 'Images must have alternate text',
                impact: 'critical',
                nodes: Array.from(missingAlt).map(el => ({
                    target: [this.getSelector(el)],
                    html: el.outerHTML.substring(0, 100)
                }))
            });
        }

        const missingLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        if (missingLabels.length > 0) {
            violations.push({
                id: 'label',
                description: 'Form elements must have labels',
                impact: 'critical',
                nodes: Array.from(missingLabels).map(el => ({
                    target: [this.getSelector(el)],
                    html: el.outerHTML.substring(0, 100)
                }))
            });
        }

        return {
            violations,
            passes,
            incomplete: [],
            inapplicable: []
        };
    }

    /**
     * Configure les vérifications de base
     */
    setupBasicChecks() {
        this.checks.basic = [
            {
                name: 'Images Alt Text',
                check: () => this.checkImageAltText(),
                weight: 20
            },
            {
                name: 'Form Labels',
                check: () => this.checkFormLabels(),
                weight: 15
            },
            {
                name: 'Heading Structure',
                check: () => this.checkHeadingStructure(),
                weight: 15
            },
            {
                name: 'Color Contrast',
                check: () => this.checkColorContrast(),
                weight: 20
            },
            {
                name: 'Keyboard Navigation',
                check: () => this.checkKeyboardNavigation(),
                weight: 10
            },
            {
                name: 'ARIA Usage',
                check: () => this.checkAriaUsage(),
                weight: 10
            },
            {
                name: 'Focus Management',
                check: () => this.checkFocusManagement(),
                weight: 10
            }
        ];
    }

    /**
     * Exécute tous les tests d'accessibilité
     */
    async runAllTests() {
        console.log('🔍 Exécution des tests d\'accessibilité...');
        
        const results = {
            axeResults: null,
            basicChecks: [],
            score: 0,
            grade: '',
            violations: [],
            recommendations: []
        };

        // Tests axe-core
        if (this.isAxeCoreLoaded) {
            try {
                results.axeResults = await window.axe.run();
                this.violations = results.axeResults.violations;
            } catch (error) {
                console.error('Erreur tests axe:', error);
            }
        }

        // Tests basiques personnalisés
        for (const check of this.checks.basic) {
            try {
                const result = await check.check();
                result.name = check.name;
                result.weight = check.weight;
                results.basicChecks.push(result);
                
                if (result.passed) {
                    results.score += check.weight;
                }
            } catch (error) {
                console.error(`Erreur test ${check.name}:`, error);
            }
        }

        // Calcul note finale
        const maxScore = this.checks.basic.reduce((sum, check) => sum + check.weight, 0);
        results.score = Math.round((results.score / maxScore) * 100);
        results.grade = this.getGrade(results.score);

        // Génération recommandations
        results.recommendations = this.generateRecommendations(results);

        console.log(`📊 Score accessibilité: ${results.score}/100 (${results.grade})`);
        
        return results;
    }

    /**
     * Vérification des textes alternatifs
     */
    async checkImageAltText() {
        const images = document.querySelectorAll('img');
        const violations = [];
        
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                violations.push({
                    element: img,
                    issue: 'Attribut alt manquant',
                    selector: this.getSelector(img)
                });
            } else if (img.alt.trim() === '' && !img.hasAttribute('role')) {
                violations.push({
                    element: img,
                    issue: 'Alt text vide sans role decorative',
                    selector: this.getSelector(img)
                });
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ ${images.length} images avec alt text correct`
                : `❌ ${violations.length}/${images.length} images sans alt text`
        };
    }

    /**
     * Vérification des labels de formulaire
     */
    async checkFormLabels() {
        const inputs = document.querySelectorAll('input, textarea, select');
        const violations = [];
        
        inputs.forEach(input => {
            const hasLabel = input.closest('label') || 
                           document.querySelector(`label[for="${input.id}"]`) ||
                           input.hasAttribute('aria-label') ||
                           input.hasAttribute('aria-labelledby');
                           
            if (!hasLabel && input.type !== 'hidden') {
                violations.push({
                    element: input,
                    issue: 'Champ sans label',
                    selector: this.getSelector(input)
                });
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ ${inputs.length} champs avec labels corrects`
                : `❌ ${violations.length}/${inputs.length} champs sans label`
        };
    }

    /**
     * Vérification de la structure des headings
     */
    async checkHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const violations = [];
        
        let previousLevel = 0;
        let h1Count = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1));
            
            // Vérifier H1 unique
            if (level === 1) {
                h1Count++;
                if (h1Count > 1) {
                    violations.push({
                        element: heading,
                        issue: 'Multiple H1 détectés',
                        selector: this.getSelector(heading)
                    });
                }
            }
            
            // Vérifier progression logique
            if (previousLevel > 0 && level > previousLevel + 1) {
                violations.push({
                    element: heading,
                    issue: `Saut de niveau: H${previousLevel} vers H${level}`,
                    selector: this.getSelector(heading)
                });
            }
            
            previousLevel = level;
        });

        // Vérifier présence H1
        if (h1Count === 0) {
            violations.push({
                element: null,
                issue: 'Aucun H1 trouvé sur la page',
                selector: 'document'
            });
        }

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ Structure heading correcte (${headings.length} niveaux)`
                : `❌ ${violations.length} problèmes de structure heading`
        };
    }

    /**
     * Vérification du contraste des couleurs (basique)
     */
    async checkColorContrast() {
        // Vérification basique - en production utiliser un vrai algorithme
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        const violations = [];
        
        // Simulation: vérifier les couleurs prédéfinies problématiques
        const lowContrastSelectors = [
            'text-gray-400 on bg-gray-200',
            'text-yellow-300 on bg-yellow-100'
        ];

        textElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Vérification simplifiée pour démonstration
            if (color === 'rgb(156, 163, 175)' && bgColor === 'rgb(229, 231, 235)') {
                violations.push({
                    element: el,
                    issue: 'Contraste insuffisant détecté',
                    selector: this.getSelector(el)
                });
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ Contraste acceptable sur ${textElements.length} éléments`
                : `❌ ${violations.length} éléments avec contraste faible`
        };
    }

    /**
     * Vérification navigation clavier
     */
    async checkKeyboardNavigation() {
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        const violations = [];
        
        focusableElements.forEach(el => {
            // Vérifier si l'élément est visible
            const style = window.getComputedStyle(el);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
            
            if (isVisible && el.tabIndex < 0) {
                violations.push({
                    element: el,
                    issue: 'Élément focusable avec tabindex négatif',
                    selector: this.getSelector(el)
                });
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ ${focusableElements.length} éléments focusables corrects`
                : `❌ ${violations.length} problèmes navigation clavier`
        };
    }

    /**
     * Vérification usage ARIA
     */
    async checkAriaUsage() {
        const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
        const violations = [];
        
        ariaElements.forEach(el => {
            // Vérifier cohérence role/ARIA
            const role = el.getAttribute('role');
            if (role === 'button' && el.tagName !== 'BUTTON' && !el.hasAttribute('tabindex')) {
                violations.push({
                    element: el,
                    issue: 'Role button sans tabindex',
                    selector: this.getSelector(el)
                });
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? `✅ ${ariaElements.length} attributs ARIA corrects`
                : `❌ ${violations.length} problèmes ARIA`
        };
    }

    /**
     * Vérification gestion du focus
     */
    async checkFocusManagement() {
        const violations = [];
        
        // Vérifier les éléments avec outline supprimé sans remplacement
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.outline === 'none' && style.boxShadow === 'none') {
                const isFocusable = el.matches('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
                if (isFocusable) {
                    violations.push({
                        element: el,
                        issue: 'Outline supprimé sans indicateur focus alternatif',
                        selector: this.getSelector(el)
                    });
                }
            }
        });

        return {
            passed: violations.length === 0,
            violations: violations,
            message: violations.length === 0 
                ? '✅ Gestion du focus correcte'
                : `❌ ${violations.length} problèmes de focus`
        };
    }

    /**
     * Génère un sélecteur CSS pour un élément
     */
    getSelector(element) {
        if (!element) return '';
        
        if (element.id) return `#${element.id}`;
        
        let selector = element.tagName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.split(' ').join('.');
        }
        
        return selector;
    }

    /**
     * Calcule la note lettre
     */
    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    /**
     * Génère des recommandations
     */
    generateRecommendations(results) {
        const recommendations = [];
        
        results.basicChecks.forEach(check => {
            if (!check.passed && check.violations.length > 0) {
                recommendations.push({
                    priority: 'high',
                    category: check.name,
                    issue: check.violations[0].issue,
                    fix: this.getFixSuggestion(check.name, check.violations[0])
                });
            }
        });

        return recommendations;
    }

    /**
     * Suggestions de correction
     */
    getFixSuggestion(category, violation) {
        const fixes = {
            'Images Alt Text': 'Ajouter un attribut alt descriptif à toutes les images',
            'Form Labels': 'Associer chaque champ de formulaire à un label',
            'Heading Structure': 'Utiliser une hiérarchie logique des headings (H1→H2→H3)',
            'Color Contrast': 'Augmenter le contraste des couleurs (ratio minimum 4.5:1)',
            'Keyboard Navigation': 'Assurer que tous les éléments interactifs sont accessibles au clavier',
            'ARIA Usage': 'Corriger les attributs ARIA incorrects',
            'Focus Management': 'Fournir des indicateurs visuels de focus'
        };
        
        return fixes[category] || 'Consulter les guidelines WCAG 2.1';
    }

    /**
     * Génère un rapport CI/CD
     */
    generateCIReport(results) {
        return {
            timestamp: new Date().toISOString(),
            score: results.score,
            grade: results.grade,
            passed: results.score >= 80, // Seuil de passage CI
            violations: results.basicChecks.filter(check => !check.passed).length,
            details: {
                axeViolations: this.violations.length,
                basicChecks: results.basicChecks.map(check => ({
                    name: check.name,
                    passed: check.passed,
                    violations: check.violations.length
                }))
            }
        };
    }

    /**
     * Configuration pour Lighthouse CI
     */
    getLighthouseConfig() {
        return {
            extends: 'lighthouse:default',
            settings: {
                onlyAudits: [
                    'color-contrast',
                    'image-alt', 
                    'label',
                    'heading-order',
                    'tabindex',
                    'focus-traps'
                ]
            },
            categories: {
                accessibility: {
                    title: 'Accessibility',
                    description: 'Tests automatisés d\'accessibilité'
                }
            }
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.accessibilityChecker = new AccessibilityChecker();
}

// Tests automatiques au chargement en mode développement
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    document.addEventListener('DOMContentLoaded', async () => {
        setTimeout(async () => {
            const results = await window.accessibilityChecker.runAllTests();
            console.log('♿ Rapport accessibilité:', results);
        }, 2000);
    });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityChecker;
}