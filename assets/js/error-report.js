/**
 * TechViral - Error Reporting & Debug System
 * Système de détection et rapport d'erreurs pour debugging
 */

class ErrorReporter {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
        this.init();
    }

    init() {
        this.setupErrorHandlers();
        this.checkCommonIssues();
        this.generateReport();
        console.log('🔍 Error Reporter initialized');
    }

    setupErrorHandlers() {
        // Capture global JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Capture unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        // Check for 404 resources
        this.check404Resources();
    }

    logError(type, details) {
        const error = {
            type,
            details,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.errors.push(error);
        console.error(`🚨 ${type}:`, details);
    }

    logWarning(type, details) {
        const warning = {
            type,
            details,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        this.warnings.push(warning);
        console.warn(`⚠️ ${type}:`, details);
    }

    logFix(type, details) {
        const fix = {
            type,
            details,
            timestamp: new Date().toISOString()
        };
        
        this.fixes.push(fix);
        console.log(`✅ ${type}:`, details);
    }

    check404Resources() {
        // Check images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => {
                this.logError('Image 404', {
                    src: img.src,
                    alt: img.alt,
                    element: img.outerHTML.substring(0, 100)
                });
            });
        });

        // Check scripts
        document.querySelectorAll('script[src]').forEach(script => {
            script.addEventListener('error', () => {
                this.logError('Script 404', {
                    src: script.src,
                    element: script.outerHTML.substring(0, 100)
                });
            });
        });

        // Check stylesheets
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            link.addEventListener('error', () => {
                this.logError('CSS 404', {
                    href: link.href,
                    element: link.outerHTML.substring(0, 100)
                });
            });
        });
    }

    checkCommonIssues() {
        // Check for missing elements
        this.checkMissingElements();
        
        // Check cart system
        this.checkCartSystem();
        
        // Check navigation
        this.checkNavigation();
        
        // Check forms
        this.checkForms();
    }

    checkMissingElements() {
        const criticalElements = [
            '#cartCount',
            '#darkModeToggle',
            '#mobileMenuButton',
            '#searchInput',
            '.product-card'
        ];

        criticalElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                this.logWarning('Missing Element', {
                    selector,
                    description: `Required element ${selector} not found`
                });
            } else {
                this.logFix('Element Found', {
                    selector,
                    count: elements.length
                });
            }
        });
    }

    checkCartSystem() {
        setTimeout(() => {
            if (typeof window.cartManager === 'undefined') {
                this.logError('Cart System', {
                    message: 'CartManager not loaded',
                    suggestion: 'Check if cart.js is properly loaded'
                });
            } else {
                this.logFix('Cart System', 'CartManager loaded successfully');
                
                // Check cart badge
                const badge = document.querySelector('#cartCount');
                if (badge && badge.textContent === '0') {
                    this.logFix('Cart Badge', 'Cart badge found and working');
                } else if (badge) {
                    this.logWarning('Cart Badge', 'Cart badge found but may have issues');
                } else {
                    this.logError('Cart Badge', 'Cart badge element not found');
                }
            }
        }, 1000);
    }

    checkNavigation() {
        // Check mobile menu
        const mobileButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileButton && mobileMenu) {
            this.logFix('Mobile Navigation', 'Mobile menu elements found');
        } else {
            this.logWarning('Mobile Navigation', {
                button: !!mobileButton,
                menu: !!mobileMenu,
                message: 'Some mobile navigation elements missing'
            });
        }

        // Check navigation links
        const navLinks = document.querySelectorAll('nav a[href]');
        let brokenLinks = 0;
        
        navLinks.forEach(link => {
            if (link.href.includes('#') || link.href === '') {
                brokenLinks++;
            }
        });

        if (brokenLinks === 0) {
            this.logFix('Navigation Links', `All ${navLinks.length} navigation links appear valid`);
        } else {
            this.logWarning('Navigation Links', {
                total: navLinks.length,
                broken: brokenLinks,
                message: `${brokenLinks} potentially broken navigation links found`
            });
        }
    }

    checkForms() {
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
            forms.forEach((form, index) => {
                const hasSubmitHandler = form.onsubmit !== null;
                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                
                if (submitButtons.length === 0 && !hasSubmitHandler) {
                    this.logWarning('Form Issues', {
                        formIndex: index,
                        id: form.id || 'unnamed',
                        message: 'Form has no submit button or handler'
                    });
                } else {
                    this.logFix('Form Check', {
                        formIndex: index,
                        id: form.id || 'unnamed',
                        submitButtons: submitButtons.length
                    });
                }
            });
        }
    }

    generateReport() {
        setTimeout(() => {
            const report = {
                summary: {
                    errors: this.errors.length,
                    warnings: this.warnings.length,
                    fixes: this.fixes.length,
                    timestamp: new Date().toISOString(),
                    page: window.location.pathname,
                    userAgent: navigator.userAgent.substring(0, 50) + '...'
                },
                errors: this.errors,
                warnings: this.warnings,
                fixes: this.fixes,
                recommendations: this.getRecommendations()
            };

            // Store in localStorage for debugging
            localStorage.setItem('techviral_error_report', JSON.stringify(report, null, 2));
            
            // Log summary
            console.group('📊 TechViral Error Report');
            console.log('Errors:', this.errors.length);
            console.log('Warnings:', this.warnings.length);
            console.log('Fixes Applied:', this.fixes.length);
            console.log('Full report stored in localStorage as "techviral_error_report"');
            console.groupEnd();

            // Show report if errors found
            if (this.errors.length > 0 || this.warnings.length > 5) {
                this.showErrorModal(report);
            }
        }, 2000);
    }

    getRecommendations() {
        const recommendations = [];

        if (this.errors.some(e => e.type.includes('404'))) {
            recommendations.push('Fix missing resources (images, scripts, CSS files)');
        }

        if (this.errors.some(e => e.type.includes('Cart'))) {
            recommendations.push('Check cart.js loading and initialization');
        }

        if (this.warnings.some(w => w.type.includes('Navigation'))) {
            recommendations.push('Review navigation links and mobile menu functionality');
        }

        if (this.errors.length === 0 && this.warnings.length === 0) {
            recommendations.push('Site appears to be functioning properly! 🎉');
        }

        return recommendations;
    }

    showErrorModal(report) {
        // Only show in development or localhost
        if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border: 2px solid #ef4444;
            border-radius: 12px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 20px 30px rgba(0,0,0,0.3);
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #ef4444;">🚨 Issues Détectés</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <div style="background: #fee; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                <strong>Résumé:</strong><br>
                ❌ ${report.summary.errors} erreurs<br>
                ⚠️ ${report.summary.warnings} avertissements<br>
                ✅ ${report.summary.fixes} corrections appliquées
            </div>
            
            ${report.errors.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #ef4444;">Erreurs:</strong>
                    ${report.errors.map(e => `
                        <div style="background: #fef2f2; padding: 8px; margin: 5px 0; border-radius: 4px; border-left: 3px solid #ef4444;">
                            <strong>${e.type}</strong><br>
                            <small>${JSON.stringify(e.details, null, 2)}</small>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div>
                <strong>Recommandations:</strong>
                <ul style="margin: 5px 0; padding-left: 20px;">
                    ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="console.log('Full report:', ${JSON.stringify(report).replace(/"/g, '&quot;')})" 
                        style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                    Voir rapport complet
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 30000);
    }

    // Public methods for manual checks
    runDiagnostic() {
        console.clear();
        console.log('🔍 Running TechViral diagnostic...');
        this.checkCommonIssues();
        this.generateReport();
    }

    clearReports() {
        this.errors = [];
        this.warnings = [];
        this.fixes = [];
        localStorage.removeItem('techviral_error_report');
        console.log('🧹 Error reports cleared');
    }
}

// Global instance
let errorReporter;

// Initialize after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        errorReporter = new ErrorReporter();
        window.errorReporter = errorReporter;
    });
} else {
    errorReporter = new ErrorReporter();
    window.errorReporter = errorReporter;
}

// Debug functions for console
window.runDiagnostic = () => errorReporter?.runDiagnostic();
window.clearErrorReports = () => errorReporter?.clearReports();

console.log('🛠️ Error Reporter loaded. Commands: runDiagnostic(), clearErrorReports()');