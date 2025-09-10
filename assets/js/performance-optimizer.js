// TechViral Performance Optimizer v1.0
// Optimisation automatique performance, WebP, CDN, Core Web Vitals

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            loadTime: 0,
            fcp: 0,
            lcp: 0,
            cls: 0,
            fid: 0
        };
        
        this.optimizations = {
            imagesOptimized: 0,
            cacheHits: 0,
            lazyLoaded: 0,
            prefetched: 0
        };

        this.cdnConfig = {
            enabled: true,
            baseUrl: 'https://cdn.techviral.com',
            fallbackUrl: '/assets'
        };

        this.init();
    }

    async init() {
        this.measureCoreWebVitals();
        this.optimizeImages();
        this.setupLazyLoading();
        this.enableResourceHints();
        this.initServiceWorkerCaching();
        this.compressResources();
        this.preloadCriticalResources();
        
        console.log('⚡ Performance Optimizer initialized');
        this.startPerformanceMonitoring();
    }

    // Core Web Vitals Measurement
    measureCoreWebVitals() {
        // First Contentful Paint (FCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                    this.reportMetric('FCP', entry.startTime);
                }
            });
        }).observe({ entryTypes: ['paint'] });

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            this.reportMetric('LCP', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                this.reportMetric('FID', this.metrics.fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.metrics.cls = clsValue;
            this.reportMetric('CLS', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // Optimisation des images avec WebP
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src], img:not([data-optimized])');
        
        images.forEach(img => {
            this.convertToWebP(img);
            this.addResponsiveImages(img);
            this.optimizations.imagesOptimized++;
        });
    }

    convertToWebP(img) {
        if (this.supportsWebP()) {
            const originalSrc = img.src || img.dataset.src;
            if (originalSrc && !originalSrc.includes('.webp')) {
                const webpSrc = this.generateWebPUrl(originalSrc);
                
                // Test si l'image WebP existe
                this.testImageUrl(webpSrc).then(exists => {
                    if (exists) {
                        if (img.dataset.src) {
                            img.dataset.src = webpSrc;
                        } else {
                            img.src = webpSrc;
                        }
                        img.setAttribute('data-optimized', 'webp');
                    }
                });
            }
        }
    }

    generateWebPUrl(originalUrl) {
        // Conversion automatique vers WebP via CDN ou service
        if (originalUrl.startsWith('/assets/images/')) {
            return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        
        // Service de conversion externe (exemple)
        return `${this.cdnConfig.baseUrl}/webp${originalUrl}`;
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    async testImageUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Lazy Loading avancé
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                    this.optimizations.lazyLoaded++;
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observer toutes les images avec data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Observer les nouveaux éléments ajoutés dynamiquement
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const images = node.querySelectorAll ? node.querySelectorAll('img[data-src]') : [];
                        images.forEach(img => imageObserver.observe(img));
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.style.filter = 'blur(5px)';
        
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = tempImg.src;
            img.style.filter = '';
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        
        tempImg.onerror = () => {
            // Fallback vers l'image originale
            img.src = img.dataset.originalSrc || src;
            img.style.filter = '';
        };
        
        tempImg.src = src;
    }

    // Resource Hints et Prefetching
    enableResourceHints() {
        // DNS Prefetch pour domaines externes
        const externalDomains = [
            '//fonts.googleapis.com',
            '//cdn.tailwindcss.com',
            '//www.google-analytics.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });

        // Preload de ressources critiques
        this.preloadCriticalResources();

        // Prefetch de pages probables
        this.prefetchLikelyPages();
    }

    preloadCriticalResources() {
        const criticalResources = [
            { href: '/assets/css/style.css', as: 'style' },
            { href: '/assets/js/main.js', as: 'script' },
            { href: '/assets/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            Object.assign(link, resource);
            document.head.appendChild(link);
        });
    }

    prefetchLikelyPages() {
        // Prefetch basé sur les liens visibles et le comportement utilisateur
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    this.prefetchPage(link.href);
                    observer.unobserve(link);
                }
            });
        }, { rootMargin: '100px' });

        // Observer les liens importants
        document.querySelectorAll('a[href^="/"]').forEach(link => {
            if (this.shouldPrefetch(link.href)) {
                observer.observe(link);
            }
        });
    }

    shouldPrefetch(url) {
        const importantPages = ['/pages/products/', '/pages/categories/', '/pages/cart/'];
        return importantPages.some(page => url.includes(page));
    }

    prefetchPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
        this.optimizations.prefetched++;
    }

    // Compression et minification dynamique
    compressResources() {
        // Compression des réponses JSON
        this.setupResponseCompression();
        
        // Minification CSS/JS dynamique (pour les resources externes)
        this.minifyDynamicResources();
    }

    setupResponseCompression() {
        // Intercepter les fetch pour ajouter compression headers
        const originalFetch = window.fetch;
        window.fetch = async (url, options = {}) => {
            if (!options.headers) options.headers = {};
            options.headers['Accept-Encoding'] = 'gzip, deflate, br';
            
            return originalFetch(url, options);
        };
    }

    // Service Worker Cache avancé
    initServiceWorkerCaching() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                // Communiquer avec le SW pour optimisations
                this.sendMessageToSW({
                    type: 'OPTIMIZE_CACHE',
                    config: {
                        imageCaching: true,
                        apiCaching: true,
                        staticCaching: true
                    }
                });
            });
        }
    }

    sendMessageToSW(message) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(message);
        }
    }

    // Monitoring et reporting
    startPerformanceMonitoring() {
        // Monitoring continu des performances
        setInterval(() => {
            this.checkPerformanceThresholds();
        }, 30000); // Toutes les 30 secondes

        // Event listener pour changements de performance
        window.addEventListener('beforeunload', () => {
            this.sendPerformanceReport();
        });
    }

    checkPerformanceThresholds() {
        const thresholds = {
            LCP: 2500, // 2.5 secondes
            FID: 100,  // 100 milliseconds  
            CLS: 0.1   // 0.1 score
        };

        Object.entries(thresholds).forEach(([metric, threshold]) => {
            if (this.metrics[metric.toLowerCase()] > threshold) {
                this.triggerOptimization(metric);
            }
        });
    }

    triggerOptimization(metric) {
        switch (metric) {
            case 'LCP':
                this.optimizeLCP();
                break;
            case 'FID':
                this.optimizeFID();
                break;
            case 'CLS':
                this.optimizeCLS();
                break;
        }
    }

    optimizeLCP() {
        // Optimisations spécifiques pour LCP
        this.preloadLCPResource();
        this.optimizeLCPImage();
    }

    optimizeFID() {
        // Optimisations pour First Input Delay
        this.deferNonCriticalJS();
        this.breakUpLongTasks();
    }

    optimizeCLS() {
        // Préventions de layout shifts
        this.addImageDimensions();
        this.reserveSpaceForAds();
    }

    // Utilitaires de reporting
    reportMetric(name, value) {
        console.log(`📊 ${name}: ${Math.round(value)}ms`);
        
        // Envoyer à analytics (exemple)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'core_web_vital', {
                metric_name: name,
                metric_value: Math.round(value),
                metric_rating: this.getMetricRating(name, value)
            });
        }
    }

    getMetricRating(metric, value) {
        const thresholds = {
            FCP: { good: 1800, poor: 3000 },
            LCP: { good: 2500, poor: 4000 },
            FID: { good: 100, poor: 300 },
            CLS: { good: 0.1, poor: 0.25 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return 'unknown';
        
        if (value <= threshold.good) return 'good';
        if (value <= threshold.poor) return 'needs-improvement';
        return 'poor';
    }

    sendPerformanceReport() {
        const report = {
            metrics: this.metrics,
            optimizations: this.optimizations,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            connection: this.getConnectionInfo()
        };

        // Envoyer le rapport via beacon API (non-bloquant)
        if ('sendBeacon' in navigator) {
            navigator.sendBeacon('/api/performance', JSON.stringify(report));
        }
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    // API publique
    getPerformanceScore() {
        const scores = {
            FCP: this.getMetricRating('FCP', this.metrics.fcp),
            LCP: this.getMetricRating('LCP', this.metrics.lcp),
            FID: this.getMetricRating('FID', this.metrics.fid),
            CLS: this.getMetricRating('CLS', this.metrics.cls)
        };

        const goodCount = Object.values(scores).filter(s => s === 'good').length;
        return Math.round((goodCount / 4) * 100);
    }

    displayPerformanceWidget() {
        const score = this.getPerformanceScore();
        const scoreColor = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-orange-500' : 'text-red-500';
        
        return `
            <div class="performance-widget bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Performance</span>
                    <span class="${scoreColor} font-bold">${score}/100</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    ${this.optimizations.imagesOptimized} images optimisées • ${this.optimizations.cacheHits} cache hits
                </div>
            </div>
        `;
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export pour utilisation externe
if (typeof module !== 'undefined') {
    module.exports = PerformanceOptimizer;
}