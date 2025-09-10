/**
 * Google Analytics 4 E-commerce Tracker - TechViral
 * Version "Acier" : Events standards + Enhanced E-commerce
 */
class GA4EcommerceTracker {
    constructor() {
        this.gtag = null;
        this.measurementId = 'G-XXXXXXXXXX'; // À remplacer par vrai ID
        this.debugMode = window.location.hostname === 'localhost';
        this.currency = 'EUR';
        this.events = [];
        
        this.init();
    }

    /**
     * Initialise GA4 avec Enhanced E-commerce
     */
    async init() {
        await this.loadGA4();
        this.setupEcommerceTracking();
        this.setupPageTracking();
        this.setupUserEngagement();
        
        console.log('📊 GA4 E-commerce tracker initialisé');
    }

    /**
     * Charge Google Analytics 4
     */
    async loadGA4() {
        // Chargement script GA4
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Configuration gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };

        this.gtag = window.gtag;
        this.gtag('js', new Date());
        this.gtag('config', this.measurementId, {
            debug_mode: this.debugMode,
            send_page_view: false, // Gestion manuelle
            currency: this.currency,
            custom_map: {
                'custom_parameter_1': 'product_category',
                'custom_parameter_2': 'user_type'
            }
        });
    }

    /**
     * Configure le tracking e-commerce
     */
    setupEcommerceTracking() {
        this.trackProductViews();
        this.trackAddToCart();
        this.trackRemoveFromCart();
        this.trackPurchase();
        this.trackSearches();
    }

    /**
     * Track vues produit automatique
     */
    trackProductViews() {
        // Détecter pages produit
        if (window.location.pathname.includes('/products/')) {
            const productData = this.extractProductData();
            if (productData) {
                this.trackEvent('view_item', {
                    currency: this.currency,
                    value: productData.price,
                    items: [{
                        item_id: productData.sku,
                        item_name: productData.name,
                        category: productData.category,
                        price: productData.price,
                        quantity: 1
                    }]
                });
            }
        }

        // Track vues liste produits
        const productCards = document.querySelectorAll('[data-product-id]');
        if (productCards.length > 0) {
            const items = Array.from(productCards).map(card => ({
                item_id: card.dataset.productId,
                item_name: card.dataset.productName || 'Produit',
                category: card.dataset.productCategory || 'Non catégorisé',
                price: parseFloat(card.dataset.productPrice) || 0,
                index: Array.from(productCards).indexOf(card)
            }));

            this.trackEvent('view_item_list', {
                item_list_name: this.getListName(),
                items: items
            });
        }
    }

    /**
     * Track ajout panier
     */
    trackAddToCart() {
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('[data-action="add-to-cart"], .add-to-cart');
            if (addToCartBtn) {
                const productData = this.getProductDataFromElement(addToCartBtn);
                if (productData) {
                    this.trackEvent('add_to_cart', {
                        currency: this.currency,
                        value: productData.price * productData.quantity,
                        items: [{
                            item_id: productData.sku,
                            item_name: productData.name,
                            category: productData.category,
                            price: productData.price,
                            quantity: productData.quantity
                        }]
                    });
                }
            }
        });
    }

    /**
     * Track suppression panier
     */
    trackRemoveFromCart() {
        document.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('[data-action="remove-from-cart"], .remove-from-cart');
            if (removeBtn) {
                const productData = this.getProductDataFromElement(removeBtn);
                if (productData) {
                    this.trackEvent('remove_from_cart', {
                        currency: this.currency,
                        value: productData.price * productData.quantity,
                        items: [{
                            item_id: productData.sku,
                            item_name: productData.name,
                            category: productData.category,
                            price: productData.price,
                            quantity: productData.quantity
                        }]
                    });
                }
            }
        });
    }

    /**
     * Track achats/commandes
     */
    trackPurchase() {
        // Détecter page confirmation commande
        if (window.location.pathname.includes('/confirmation') || 
            window.location.search.includes('order_success=1')) {
            
            const orderData = this.extractOrderData();
            if (orderData) {
                this.trackEvent('purchase', {
                    transaction_id: orderData.orderId,
                    value: orderData.total,
                    currency: this.currency,
                    tax: orderData.tax || 0,
                    shipping: orderData.shipping || 0,
                    items: orderData.items
                });
            }
        }
    }

    /**
     * Track recherches
     */
    trackSearches() {
        const searchForms = document.querySelectorAll('form[role="search"], .search-form');
        searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                const searchInput = form.querySelector('input[type="search"], input[name*="search"], input[name*="q"]');
                if (searchInput && searchInput.value.trim()) {
                    this.trackEvent('search', {
                        search_term: searchInput.value.trim(),
                        search_results: this.countSearchResults()
                    });
                }
            });
        });
    }

    /**
     * Configuration tracking page
     */
    setupPageTracking() {
        // Page view avec données enrichies
        this.trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_type: this.getPageType(),
            content_group1: this.getContentGroup(),
            user_type: this.getUserType()
        });

        // Scroll tracking
        this.setupScrollTracking();
        
        // Time on page
        this.setupTimeTracking();
    }

    /**
     * Tracking engagement utilisateur
     */
    setupUserEngagement() {
        // Clics CTA principaux
        document.addEventListener('click', (e) => {
            const cta = e.target.closest('.cta-button, [data-cta]');
            if (cta) {
                this.trackEvent('cta_click', {
                    cta_name: cta.textContent.trim() || cta.dataset.cta,
                    cta_location: this.getElementLocation(cta)
                });
            }
        });

        // Newsletter signup
        const newsletterForms = document.querySelectorAll('.newsletter-form, [data-newsletter]');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', () => {
                this.trackEvent('newsletter_signup', {
                    method: 'email',
                    location: this.getElementLocation(form)
                });
            });
        });

        // Social shares
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('[data-share]');
            if (shareBtn) {
                this.trackEvent('share', {
                    method: shareBtn.dataset.share,
                    content_type: 'product',
                    item_id: this.getCurrentProductId()
                });
            }
        });

        // Video engagement
        this.setupVideoTracking();
    }

    /**
     * Tracking scroll profondeur
     */
    setupScrollTracking() {
        const scrollThresholds = [25, 50, 75, 90];
        const tracked = new Set();

        window.addEventListener('scroll', this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            scrollThresholds.forEach(threshold => {
                if (scrollPercent >= threshold && !tracked.has(threshold)) {
                    tracked.add(threshold);
                    this.trackEvent('scroll', {
                        percent_scrolled: threshold
                    });
                }
            });
        }, 1000));
    }

    /**
     * Tracking temps sur page
     */
    setupTimeTracking() {
        const timeThresholds = [10, 30, 60, 120, 300]; // secondes
        const tracked = new Set();
        const startTime = Date.now();

        setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            timeThresholds.forEach(threshold => {
                if (timeSpent >= threshold && !tracked.has(threshold)) {
                    tracked.add(threshold);
                    this.trackEvent('timing_complete', {
                        name: 'time_on_page',
                        value: threshold
                    });
                }
            });
        }, 5000);
    }

    /**
     * Tracking vidéos
     */
    setupVideoTracking() {
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        
        videos.forEach(video => {
            if (video.tagName === 'VIDEO') {
                video.addEventListener('play', () => {
                    this.trackEvent('video_start', {
                        video_title: video.title || 'Video',
                        video_url: video.src,
                        video_duration: video.duration
                    });
                });

                video.addEventListener('ended', () => {
                    this.trackEvent('video_complete', {
                        video_title: video.title || 'Video',
                        video_url: video.src
                    });
                });
            }
        });
    }

    /**
     * Extrait données produit de la page
     */
    extractProductData() {
        // Essayer d'extraire depuis window.productData
        if (window.productData) {
            return {
                sku: window.productData.sku,
                name: window.productData.name,
                category: window.productData.category,
                price: window.productData.price
            };
        }

        // Fallback extraction DOM
        const title = document.querySelector('h1')?.textContent?.trim();
        const priceEl = document.querySelector('[data-price], .price')?.textContent;
        const price = priceEl ? parseFloat(priceEl.replace(/[^\d.,]/g, '').replace(',', '.')) : 0;

        return title ? {
            sku: this.generateSkuFromUrl(),
            name: title,
            category: this.getCategoryFromPath(),
            price: price
        } : null;
    }

    /**
     * Extrait données commande
     */
    extractOrderData() {
        // Rechercher données commande
        const orderIdEl = document.querySelector('[data-order-id]');
        const totalEl = document.querySelector('[data-order-total], .order-total');
        
        if (!orderIdEl || !totalEl) return null;

        return {
            orderId: orderIdEl.dataset.orderId || orderIdEl.textContent.trim(),
            total: parseFloat(totalEl.dataset.orderTotal || totalEl.textContent.replace(/[^\d.,]/g, '').replace(',', '.')),
            items: this.extractOrderItems()
        };
    }

    /**
     * Extrait items de commande
     */
    extractOrderItems() {
        const itemElements = document.querySelectorAll('[data-order-item]');
        return Array.from(itemElements).map(item => ({
            item_id: item.dataset.productId,
            item_name: item.dataset.productName,
            category: item.dataset.productCategory,
            price: parseFloat(item.dataset.productPrice || 0),
            quantity: parseInt(item.dataset.quantity || 1)
        }));
    }

    /**
     * Obtient données produit depuis élément DOM
     */
    getProductDataFromElement(element) {
        const container = element.closest('[data-product-id]') || element.closest('.product-card');
        if (!container) return null;

        return {
            sku: container.dataset.productId,
            name: container.dataset.productName || container.querySelector('h3, .product-name')?.textContent?.trim(),
            category: container.dataset.productCategory || 'Non catégorisé',
            price: parseFloat(container.dataset.productPrice || 0),
            quantity: parseInt(container.querySelector('[data-quantity]')?.value || 1)
        };
    }

    /**
     * Utilitaires d'extraction de données
     */
    getPageType() {
        const path = window.location.pathname;
        if (path.includes('/products/')) return 'product';
        if (path.includes('/categories/')) return 'category';
        if (path.includes('/cart')) return 'cart';
        if (path.includes('/checkout')) return 'checkout';
        if (path === '/' || path === '/index.html') return 'home';
        return 'other';
    }

    getContentGroup() {
        const path = window.location.pathname;
        if (path.includes('/categories/')) {
            return path.split('/categories/')[1]?.split('.')[0] || 'unknown';
        }
        return this.getPageType();
    }

    getUserType() {
        // Logique de détection type utilisateur
        return localStorage.getItem('user_type') || 'new_visitor';
    }

    getListName() {
        const path = window.location.pathname;
        if (path.includes('/categories/')) {
            return `Category: ${path.split('/categories/')[1]?.split('.')[0]}`;
        }
        if (path === '/' || path === '/index.html') {
            return 'Homepage Products';
        }
        return 'Product List';
    }

    getCurrentProductId() {
        return window.productData?.sku || this.generateSkuFromUrl();
    }

    generateSkuFromUrl() {
        return window.location.pathname.split('/').pop()?.replace('.html', '') || 'unknown';
    }

    getCategoryFromPath() {
        const path = window.location.pathname;
        if (path.includes('/categories/')) {
            return path.split('/categories/')[1]?.split('.')[0] || 'Non catégorisé';
        }
        return 'Non catégorisé';
    }

    countSearchResults() {
        const results = document.querySelectorAll('.search-result, [data-search-result]');
        return results.length;
    }

    getElementLocation(element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (rect.top + scrollTop < window.innerHeight) return 'above_fold';
        if (rect.top + scrollTop < window.innerHeight * 2) return 'below_fold';
        return 'deep_scroll';
    }

    /**
     * Track événement principal
     */
    trackEvent(eventName, parameters = {}) {
        if (!this.gtag) {
            console.warn('GA4 non initialisé');
            return;
        }

        // Enrichir avec données contextuelles
        const enrichedParams = {
            ...parameters,
            page_type: this.getPageType(),
            timestamp: Date.now(),
            session_id: this.getSessionId()
        };

        this.gtag('event', eventName, enrichedParams);
        
        // Log debug
        if (this.debugMode) {
            console.log('📊 GA4 Event:', eventName, enrichedParams);
        }

        // Stocker pour reporting
        this.events.push({
            name: eventName,
            parameters: enrichedParams,
            timestamp: Date.now()
        });
    }

    /**
     * Obtient ID session
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('ga_session_id');
        if (!sessionId) {
            sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('ga_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * Throttle function pour performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * API publique pour tracking manuel
     */
    trackCustomEvent(eventName, parameters) {
        this.trackEvent(eventName, parameters);
    }

    trackConversion(conversionName, value = null) {
        this.trackEvent('conversion', {
            conversion_name: conversionName,
            value: value,
            currency: this.currency
        });
    }

    /**
     * Statistiques tracking
     */
    getStats() {
        return {
            eventsTracked: this.events.length,
            sessionId: this.getSessionId(),
            measurementId: this.measurementId,
            debugMode: this.debugMode,
            recentEvents: this.events.slice(-10)
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.ga4Tracker = new GA4EcommerceTracker();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GA4EcommerceTracker;
}