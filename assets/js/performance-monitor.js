/**
 * Performance Monitor - TechViral
 * Version "Acier" : Core Web Vitals + Real User Monitoring
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.thresholds = {
            // Core Web Vitals thresholds (good/needs improvement/poor)
            LCP: { good: 2500, poor: 4000 },
            FID: { good: 100, poor: 300 },
            CLS: { good: 0.1, poor: 0.25 },
            FCP: { good: 1800, poor: 3000 },
            TTFB: { good: 800, poor: 1800 }
        };
        this.alerts = [];
        this.isMonitoring = false;
        
        this.init();
    }

    /**
     * Initialise le monitoring
     */
    async init() {
        if (!this.isSupported()) {
            console.warn('⚠️ Performance Observer non supporté');
            return;
        }

        this.setupPerformanceObservers();
        this.setupNavigationTiming();
        this.setupResourceTiming();
        this.setupUserTiming();
        this.startRealTimeMonitoring();
        
        this.isMonitoring = true;
        console.log('📊 Performance Monitor activé');
    }

    /**
     * Vérifie support API
     */
    isSupported() {
        return 'PerformanceObserver' in window && 
               'PerformancePaintTiming' in window;
    }

    /**
     * Configure les observers Core Web Vitals
     */
    setupPerformanceObservers() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
        
        // First Contentful Paint (FCP)
        this.observeFCP();
        
        // Time to First Byte (TTFB)
        this.observeTTFB();
    }

    /**
     * Observe Largest Contentful Paint
     */
    observeLCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.LCP = {
                    value: lastEntry.startTime,
                    rating: this.getRating('LCP', lastEntry.startTime),
                    element: lastEntry.element,
                    timestamp: Date.now()
                };
                
                this.checkAlert('LCP', lastEntry.startTime);
                this.reportMetric('LCP', lastEntry.startTime);
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.warn('LCP observer non supporté:', e);
        }
    }

    /**
     * Observe First Input Delay
     */
    observeFID() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.metrics.FID = {
                        value: entry.processingStart - entry.startTime,
                        rating: this.getRating('FID', entry.processingStart - entry.startTime),
                        inputType: entry.name,
                        timestamp: Date.now()
                    };
                    
                    this.checkAlert('FID', this.metrics.FID.value);
                    this.reportMetric('FID', this.metrics.FID.value);
                });
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // Fallback avec event listeners
            this.setupFIDFallback();
        }
    }

    /**
     * Fallback FID pour anciens navigateurs
     */
    setupFIDFallback() {
        let firstInputTime = null;
        let firstInputDelay = null;

        const onFirstInput = (event) => {
            if (firstInputTime) return;
            
            firstInputTime = event.timeStamp;
            firstInputDelay = event.timeStamp - performance.now();
            
            this.metrics.FID = {
                value: firstInputDelay,
                rating: this.getRating('FID', firstInputDelay),
                inputType: event.type,
                timestamp: Date.now()
            };
            
            this.checkAlert('FID', firstInputDelay);
            this.reportMetric('FID', firstInputDelay);
            
            // Cleanup
            ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
                document.removeEventListener(type, onFirstInput, true);
            });
        };

        ['click', 'mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
            document.addEventListener(type, onFirstInput, { once: true, passive: true, capture: true });
        });
    }

    /**
     * Observe Cumulative Layout Shift
     */
    observeCLS() {
        try {
            let clsValue = 0;
            let sessionValue = 0;
            let sessionEntries = [];

            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        const firstSessionEntry = sessionEntries[0];
                        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                        if (sessionValue &&
                            entry.startTime - lastSessionEntry.startTime < 1000 &&
                            entry.startTime - firstSessionEntry.startTime < 5000) {
                            sessionValue += entry.value;
                            sessionEntries.push(entry);
                        } else {
                            sessionValue = entry.value;
                            sessionEntries = [entry];
                        }

                        if (sessionValue > clsValue) {
                            clsValue = sessionValue;
                            
                            this.metrics.CLS = {
                                value: clsValue,
                                rating: this.getRating('CLS', clsValue),
                                entries: sessionEntries.length,
                                timestamp: Date.now()
                            };
                            
                            this.checkAlert('CLS', clsValue);
                            this.reportMetric('CLS', clsValue);
                        }
                    }
                });
            });

            observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.warn('CLS observer non supporté:', e);
        }
    }

    /**
     * Observe First Contentful Paint
     */
    observeFCP() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.FCP = {
                            value: entry.startTime,
                            rating: this.getRating('FCP', entry.startTime),
                            timestamp: Date.now()
                        };
                        
                        this.checkAlert('FCP', entry.startTime);
                        this.reportMetric('FCP', entry.startTime);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['paint'] });
        } catch (e) {
            console.warn('FCP observer non supporté:', e);
        }
    }

    /**
     * Observe Time to First Byte
     */
    observeTTFB() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        const ttfb = entry.responseStart - entry.requestStart;
                        
                        this.metrics.TTFB = {
                            value: ttfb,
                            rating: this.getRating('TTFB', ttfb),
                            timestamp: Date.now()
                        };
                        
                        this.checkAlert('TTFB', ttfb);
                        this.reportMetric('TTFB', ttfb);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
        } catch (e) {
            // Fallback navigation timing
            window.addEventListener('load', () => {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    const ttfb = navTiming.responseStart - navTiming.requestStart;
                    this.metrics.TTFB = {
                        value: ttfb,
                        rating: this.getRating('TTFB', ttfb),
                        timestamp: Date.now()
                    };
                    this.reportMetric('TTFB', ttfb);
                }
            });
        }
    }

    /**
     * Configure navigation timing
     */
    setupNavigationTiming() {
        window.addEventListener('load', () => {
            const navTiming = performance.getEntriesByType('navigation')[0];
            if (!navTiming) return;

            this.metrics.navigationTiming = {
                domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
                domComplete: navTiming.domComplete - navTiming.navigationStart,
                loadComplete: navTiming.loadEventEnd - navTiming.navigationStart,
                redirectTime: navTiming.redirectEnd - navTiming.redirectStart,
                dnsTime: navTiming.domainLookupEnd - navTiming.domainLookupStart,
                connectTime: navTiming.connectEnd - navTiming.connectStart,
                responseTime: navTiming.responseEnd - navTiming.responseStart,
                timestamp: Date.now()
            };

            this.reportNavigationTiming();
        });
    }

    /**
     * Configure resource timing
     */
    setupResourceTiming() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.transferSize > 100000) { // Resources > 100KB
                        this.checkLargeResource(entry);
                    }
                    
                    if (entry.duration > 1000) { // Slow resources > 1s
                        this.checkSlowResource(entry);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        } catch (e) {
            console.warn('Resource timing observer non supporté:', e);
        }
    }

    /**
     * Configure user timing
     */
    setupUserTiming() {
        try {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'measure') {
                        this.metrics.userTiming = this.metrics.userTiming || {};
                        this.metrics.userTiming[entry.name] = {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            timestamp: Date.now()
                        };
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        } catch (e) {
            console.warn('User timing observer non supporté:', e);
        }
    }

    /**
     * Monitoring temps réel
     */
    startRealTimeMonitoring() {
        // Memory monitoring (si supporté)
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memory = {
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize,
                    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                };
                
                // Alert si memory usage > 50MB
                if (performance.memory.usedJSHeapSize > 50000000) {
                    this.addAlert('HIGH_MEMORY_USAGE', performance.memory.usedJSHeapSize);
                }
            }, 5000);
        }

        // Frame rate monitoring
        this.startFPSMonitoring();
        
        // Network monitoring
        this.startNetworkMonitoring();
    }

    /**
     * Monitoring FPS
     */
    startFPSMonitoring() {
        let frames = 0;
        let lastTime = performance.now();

        const countFrame = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                this.metrics.fps = {
                    value: fps,
                    timestamp: Date.now()
                };
                
                // Alert si FPS < 30
                if (fps < 30) {
                    this.addAlert('LOW_FPS', fps);
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrame);
        };
        
        requestAnimationFrame(countFrame);
    }

    /**
     * Monitoring réseau
     */
    startNetworkMonitoring() {
        if ('connection' in navigator) {
            const updateConnectionInfo = () => {
                this.metrics.connection = {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData,
                    timestamp: Date.now()
                };
                
                // Alert si connexion lente
                if (navigator.connection.effectiveType === 'slow-2g' || 
                    navigator.connection.effectiveType === '2g') {
                    this.addAlert('SLOW_CONNECTION', navigator.connection.effectiveType);
                }
            };
            
            updateConnectionInfo();
            navigator.connection.addEventListener('change', updateConnectionInfo);
        }
    }

    /**
     * Calcule rating (good/needs-improvement/poor)
     */
    getRating(metric, value) {
        const threshold = this.thresholds[metric];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    /**
     * Vérifie seuils d'alerte
     */
    checkAlert(metric, value) {
        const rating = this.getRating(metric, value);
        
        if (rating === 'poor') {
            this.addAlert(`POOR_${metric}`, value);
        }
    }

    /**
     * Ajoute alerte
     */
    addAlert(type, value) {
        const alert = {
            type,
            value,
            timestamp: Date.now(),
            url: window.location.href
        };
        
        this.alerts.push(alert);
        
        // Garde seulement les 50 dernières alertes
        if (this.alerts.length > 50) {
            this.alerts = this.alerts.slice(-50);
        }
        
        this.reportAlert(alert);
    }

    /**
     * Vérifie ressources lourdes
     */
    checkLargeResource(entry) {
        this.addAlert('LARGE_RESOURCE', {
            name: entry.name,
            size: entry.transferSize,
            type: this.getResourceType(entry.name)
        });
    }

    /**
     * Vérifie ressources lentes
     */
    checkSlowResource(entry) {
        this.addAlert('SLOW_RESOURCE', {
            name: entry.name,
            duration: entry.duration,
            type: this.getResourceType(entry.name)
        });
    }

    /**
     * Détermine type de ressource
     */
    getResourceType(url) {
        if (url.match(/\.(js)$/)) return 'script';
        if (url.match(/\.(css)$/)) return 'stylesheet';
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/)) return 'image';
        if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
        if (url.match(/\.(mp4|webm|ogg)$/)) return 'video';
        return 'other';
    }

    /**
     * Rapporte métrique
     */
    reportMetric(name, value) {
        // Console debug
        console.log(`📊 ${name}: ${Math.round(value)}ms (${this.getRating(name, value)})`);
        
        // Analytics (si disponible)
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('core_web_vital', {
                metric_name: name,
                metric_value: Math.round(value),
                metric_rating: this.getRating(name, value)
            });
        }
        
        // Real User Monitoring service (si configuré)
        this.sendToRUM({
            type: 'metric',
            name,
            value: Math.round(value),
            rating: this.getRating(name, value),
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
    }

    /**
     * Rapporte alerte
     */
    reportAlert(alert) {
        console.warn(`⚠️ Performance Alert: ${alert.type}`, alert.value);
        
        // Analytics
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('performance_alert', {
                alert_type: alert.type,
                alert_value: typeof alert.value === 'object' ? JSON.stringify(alert.value) : alert.value
            });
        }
        
        // Real User Monitoring
        this.sendToRUM({
            type: 'alert',
            ...alert
        });
    }

    /**
     * Rapporte navigation timing
     */
    reportNavigationTiming() {
        const timing = this.metrics.navigationTiming;
        
        Object.entries(timing).forEach(([metric, value]) => {
            if (typeof value === 'number' && metric !== 'timestamp') {
                console.log(`📊 Navigation ${metric}: ${Math.round(value)}ms`);
            }
        });
        
        this.sendToRUM({
            type: 'navigation_timing',
            ...timing,
            url: window.location.href
        });
    }

    /**
     * Envoie données à service RUM
     */
    sendToRUM(data) {
        // En production, envoyer à service monitoring
        // Exemple: DataDog, New Relic, Google Analytics, etc.
        
        if (this.isLocalhost()) {
            // Log local pour développement
            console.log('📊 RUM Data:', data);
            return;
        }
        
        // Exemple envoi fetch (à adapter selon service)
        /*
        try {
            fetch('/api/rum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                keepalive: true
            }).catch(e => console.warn('RUM send failed:', e));
        } catch (e) {
            console.warn('RUM not available:', e);
        }
        */
    }

    /**
     * Vérifie si localhost
     */
    isLocalhost() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    }

    /**
     * Génère rapport complet
     */
    generateReport() {
        return {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio
            },
            metrics: this.metrics,
            alerts: this.alerts,
            summary: this.generateSummary()
        };
    }

    /**
     * Génère résumé performance
     */
    generateSummary() {
        const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
        const summary = {};
        
        coreMetrics.forEach(metric => {
            if (this.metrics[metric]) {
                summary[metric] = {
                    value: Math.round(this.metrics[metric].value),
                    rating: this.metrics[metric].rating
                };
            }
        });
        
        // Score global (% métriques "good")
        const goodMetrics = Object.values(summary).filter(m => m.rating === 'good').length;
        const totalMetrics = Object.keys(summary).length;
        summary.overallScore = totalMetrics > 0 ? Math.round((goodMetrics / totalMetrics) * 100) : 0;
        
        return summary;
    }

    /**
     * API publique
     */
    getMetrics() {
        return this.metrics;
    }

    getAlerts() {
        return this.alerts;
    }

    getCoreWebVitals() {
        return {
            LCP: this.metrics.LCP,
            FID: this.metrics.FID,
            CLS: this.metrics.CLS
        };
    }

    isPerformanceGood() {
        const summary = this.generateSummary();
        return summary.overallScore >= 80;
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Export rapport sur demande
    window.getPerformanceReport = () => window.performanceMonitor.generateReport();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}