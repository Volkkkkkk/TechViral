/**
 * Browser Compatibility Tester - TechViral
 * Version "Acier" : Tests automatisés client-side
 */
class BrowserTester {
    constructor() {
        this.tests = [];
        this.results = {};
        this.browser = this.detectBrowser();
        this.features = {};
        this.compatibility = {};
        
        this.init();
    }

    /**
     * Initialise les tests de compatibilité
     */
    init() {
        this.setupFeatureTests();
        this.runCompatibilityTests();
        
        console.log('🧪 Browser Tester initialisé pour:', this.browser);
    }

    /**
     * Détecte le navigateur
     */
    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (ua.includes('Chrome') && !ua.includes('Edg')) {
            return {
                name: 'Chrome',
                version: this.extractVersion(ua, /Chrome\/(\d+)/),
                engine: 'Blink'
            };
        } else if (ua.includes('Firefox')) {
            return {
                name: 'Firefox',
                version: this.extractVersion(ua, /Firefox\/(\d+)/),
                engine: 'Gecko'
            };
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            return {
                name: 'Safari',
                version: this.extractVersion(ua, /Version\/(\d+)/),
                engine: 'WebKit'
            };
        } else if (ua.includes('Edg')) {
            return {
                name: 'Edge',
                version: this.extractVersion(ua, /Edg\/(\d+)/),
                engine: 'Blink'
            };
        }
        
        return { name: 'Unknown', version: '0', engine: 'Unknown' };
    }

    extractVersion(ua, regex) {
        const match = ua.match(regex);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Configure tests de fonctionnalités
     */
    setupFeatureTests() {
        this.tests = [
            // Core Web APIs
            { name: 'fetch', test: () => 'fetch' in window },
            { name: 'promises', test: () => 'Promise' in window },
            { name: 'arrow_functions', test: () => this.testArrowFunctions() },
            { name: 'async_await', test: () => this.testAsyncAwait() },
            { name: 'modules', test: () => this.testModules() },
            
            // CSS Features
            { name: 'css_grid', test: () => CSS.supports('display: grid') },
            { name: 'css_flexbox', test: () => CSS.supports('display: flex') },
            { name: 'css_custom_properties', test: () => CSS.supports('--custom: value') },
            { name: 'css_scroll_behavior', test: () => CSS.supports('scroll-behavior: smooth') },
            
            // Image Formats
            { name: 'webp_support', test: () => this.testImageFormat('webp') },
            { name: 'avif_support', test: () => this.testImageFormat('avif') },
            
            // Performance APIs
            { name: 'performance_observer', test: () => 'PerformanceObserver' in window },
            { name: 'intersection_observer', test: () => 'IntersectionObserver' in window },
            { name: 'web_vitals_support', test: () => this.testWebVitalsSupport() },
            
            // Storage
            { name: 'local_storage', test: () => this.testLocalStorage() },
            { name: 'session_storage', test: () => this.testSessionStorage() },
            { name: 'indexeddb', test: () => 'indexedDB' in window },
            
            // Network
            { name: 'service_worker', test: () => 'serviceWorker' in navigator },
            { name: 'web_workers', test: () => 'Worker' in window },
            { name: 'websockets', test: () => 'WebSocket' in window },
            
            // Media
            { name: 'geolocation', test: () => 'geolocation' in navigator },
            { name: 'notifications', test: () => 'Notification' in window },
            { name: 'clipboard_api', test: () => 'clipboard' in navigator },
            
            // TechViral Specific
            { name: 'gdpr_compliance', test: () => this.testGDPRFeatures() },
            { name: 'analytics_support', test: () => this.testAnalyticsSupport() },
            { name: 'error_monitoring', test: () => this.testErrorMonitoring() }
        ];
    }

    /**
     * Exécute tous les tests
     */
    async runCompatibilityTests() {
        console.log('🧪 Début des tests de compatibilité...');
        
        for (const test of this.tests) {
            try {
                const result = await test.test();
                this.results[test.name] = {
                    supported: Boolean(result),
                    result: result,
                    tested: Date.now()
                };
            } catch (error) {
                this.results[test.name] = {
                    supported: false,
                    error: error.message,
                    tested: Date.now()
                };
            }
        }
        
        this.generateCompatibilityReport();
        this.checkCriticalFeatures();
    }

    /**
     * Tests spécifiques
     */
    testArrowFunctions() {
        try {
            eval('(() => true)()');
            return true;
        } catch (e) {
            return false;
        }
    }

    testAsyncAwait() {
        try {
            eval('(async () => await Promise.resolve(true))()');
            return true;
        } catch (e) {
            return false;
        }
    }

    testModules() {
        const script = document.createElement('script');
        script.type = 'module';
        return script.type === 'module';
    }

    async testImageFormat(format) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            
            const testImages = {
                webp: 'data:image/webp;base64,UklGRhYAAABXRUJQVlA4TAkAAAAvAAAAAP8AAAA=',
                avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMgwf8D///8WfhwB8+ErK42A='
            };
            
            img.src = testImages[format];
        });
    }

    testWebVitalsSupport() {
        return 'PerformanceObserver' in window && 
               'PerformancePaintTiming' in window;
    }

    testLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    testSessionStorage() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    testGDPRFeatures() {
        return this.testLocalStorage() && 
               'Notification' in window &&
               'fetch' in window;
    }

    testAnalyticsSupport() {
        return 'fetch' in window &&
               'Promise' in window &&
               this.testLocalStorage();
    }

    testErrorMonitoring() {
        return 'addEventListener' in window &&
               'PerformanceObserver' in window &&
               'console' in window;
    }

    /**
     * Génère rapport de compatibilité
     */
    generateCompatibilityReport() {
        const supported = Object.values(this.results).filter(r => r.supported).length;
        const total = Object.keys(this.results).length;
        const compatibility = Math.round((supported / total) * 100);
        
        this.compatibility = {
            score: compatibility,
            supported: supported,
            total: total,
            browser: this.browser,
            timestamp: Date.now(),
            critical_features: this.getCriticalFeatures(),
            missing_features: this.getMissingFeatures(),
            recommendations: this.getRecommendations()
        };
        
        console.log(`🧪 Compatibilité: ${compatibility}% (${supported}/${total})`);
        
        // Envoyer rapport si analytics disponible
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('browser_compatibility', {
                browser_name: this.browser.name,
                browser_version: this.browser.version,
                compatibility_score: compatibility,
                missing_critical: this.compatibility.critical_features.missing.length
            });
        }
    }

    /**
     * Vérifie fonctionnalités critiques
     */
    checkCriticalFeatures() {
        const critical = [
            'fetch', 'promises', 'local_storage', 'intersection_observer',
            'css_flexbox', 'performance_observer'
        ];
        
        const missing = critical.filter(feature => !this.results[feature]?.supported);
        
        if (missing.length > 0) {
            this.showCompatibilityWarning(missing);
        }
    }

    /**
     * Affiche avertissement compatibilité
     */
    showCompatibilityWarning(missingFeatures) {
        const banner = document.createElement('div');
        banner.className = 'compatibility-warning fixed top-0 left-0 right-0 bg-yellow-500 text-black p-4 z-50';
        banner.innerHTML = `
            <div class="max-w-4xl mx-auto flex items-center justify-between">
                <div>
                    <strong>⚠️ Navigateur non optimal détecté</strong>
                    <p class="text-sm">Certaines fonctionnalités peuvent ne pas fonctionner correctement.</p>
                </div>
                <button class="compatibility-close bg-black text-yellow-500 px-4 py-2 rounded text-sm">
                    Ignorer
                </button>
            </div>
        `;
        
        banner.querySelector('.compatibility-close').addEventListener('click', () => {
            banner.remove();
        });
        
        document.body.insertBefore(banner, document.body.firstChild);
        
        console.warn('⚠️ Fonctionnalités manquantes:', missingFeatures);
    }

    /**
     * Fonctionnalités par catégorie
     */
    getCriticalFeatures() {
        const critical = [
            'fetch', 'promises', 'local_storage', 'intersection_observer',
            'css_flexbox', 'performance_observer'
        ];
        
        return {
            total: critical.length,
            supported: critical.filter(f => this.results[f]?.supported),
            missing: critical.filter(f => !this.results[f]?.supported)
        };
    }

    getMissingFeatures() {
        return Object.entries(this.results)
            .filter(([name, result]) => !result.supported)
            .map(([name, result]) => ({
                name,
                error: result.error
            }));
    }

    /**
     * Recommandations par navigateur
     */
    getRecommendations() {
        const recommendations = [];
        
        // Recommandations générales
        if (this.browser.name === 'Chrome' && this.browser.version < 90) {
            recommendations.push('Mettre à jour Chrome vers la dernière version');
        }
        
        if (this.browser.name === 'Firefox' && this.browser.version < 85) {
            recommendations.push('Mettre à jour Firefox vers la dernière version');
        }
        
        if (this.browser.name === 'Safari' && this.browser.version < 14) {
            recommendations.push('Mettre à jour Safari/iOS vers la dernière version');
        }
        
        // Recommandations basées sur fonctionnalités manquantes
        if (!this.results.webp_support?.supported) {
            recommendations.push('WebP non supporté - images JPEG utilisées');
        }
        
        if (!this.results.avif_support?.supported) {
            recommendations.push('AVIF non supporté - WebP/JPEG utilisés');
        }
        
        if (!this.results.intersection_observer?.supported) {
            recommendations.push('Lazy loading dégradé - toutes images chargées');
        }
        
        return recommendations;
    }

    /**
     * Tests de performance spécifiques
     */
    async runPerformanceTests() {
        const tests = {
            dom_content_loaded: () => this.measureDOMContentLoaded(),
            first_paint: () => this.measureFirstPaint(),
            javascript_execution: () => this.measureJSExecution(),
            css_rendering: () => this.measureCSSRendering()
        };
        
        const results = {};
        
        for (const [name, test] of Object.entries(tests)) {
            try {
                results[name] = await test();
            } catch (error) {
                results[name] = { error: error.message };
            }
        }
        
        return results;
    }

    measureDOMContentLoaded() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve(performance.now());
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    resolve(performance.now());
                });
            }
        });
    }

    measureFirstPaint() {
        const paintTiming = performance.getEntriesByType('paint');
        const firstPaint = paintTiming.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    measureJSExecution() {
        const start = performance.now();
        
        // Test calcul intensif
        let sum = 0;
        for (let i = 0; i < 100000; i++) {
            sum += Math.random();
        }
        
        return performance.now() - start;
    }

    measureCSSRendering() {
        const start = performance.now();
        
        // Créer élément avec styles complexes
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: absolute;
            top: -9999px;
            background: linear-gradient(45deg, red, blue);
            transform: rotate(45deg) scale(1.5);
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            border-radius: 50%;
            width: 100px;
            height: 100px;
        `;
        
        document.body.appendChild(testElement);
        
        // Forcer reflow
        testElement.offsetHeight;
        
        const duration = performance.now() - start;
        document.body.removeChild(testElement);
        
        return duration;
    }

    /**
     * Export rapport complet
     */
    exportReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            browser: this.browser,
            compatibility: this.compatibility,
            feature_tests: this.results,
            system_info: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth
                },
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio
                }
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `browser-compatibility-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Rapport de compatibilité exporté');
        return report;
    }

    /**
     * API publique
     */
    getCompatibilityScore() {
        return this.compatibility.score;
    }

    isFeatureSupported(feature) {
        return this.results[feature]?.supported || false;
    }

    getBrowserInfo() {
        return this.browser;
    }

    getRecommendations() {
        return this.compatibility.recommendations || [];
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.browserTester = new BrowserTester();
    
    // Export rapport automatique en développement
    if (window.location.hostname === 'localhost') {
        setTimeout(() => {
            console.log('🧪 Rapport compatibilité:', window.browserTester.exportReport());
        }, 3000);
    }
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserTester;
}