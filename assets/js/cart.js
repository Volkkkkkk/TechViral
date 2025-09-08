/**
 * TechViral - Cart Management System
 * Système de panier centralisé et fonctionnel pour toutes les pages
 */

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('techviral_cart')) || [];
        this.promoCode = localStorage.getItem('techviral_promo') || null;
        this.promoDiscount = 0;
        this.analytics = this.initAnalytics();
        this.locale = this.getLocale();
        this.i18n = this.loadTranslations();
        
        // Performance optimizations
        this.updateTimeouts = new Set();
        this.debouncedSave = this.debounce(this.saveCart.bind(this), 300);
        this.debouncedUpdateBadge = this.debounce(this.updateCartBadge.bind(this), 100);
        
        this.init();
    }

    getLocale() {
        // Détecter la langue depuis localStorage, navigateur ou par défaut français
        return localStorage.getItem('techviral_locale') || 
               navigator.language.split('-')[0] || 
               'fr';
    }

    loadTranslations() {
        const translations = {
            fr: {
                // Messages généraux
                'cart_empty': 'Votre panier est vide',
                'product_added': 'ajouté au panier',
                'product_removed': 'Produit supprimé du panier',
                'cart_cleared': 'Panier vidé',
                'checkout_started': 'Redirection vers la commande',
                
                // Notifications
                'success': 'Succès !',
                'error': 'Erreur',
                'info': 'Information',
                
                // Codes promo
                'promo_applied': 'Code promo appliqué !',
                'promo_invalid': 'Code promo invalide',
                'promo_already_applied': 'Ce code promo est déjà appliqué',
                'promo_removed': 'Code promo supprimé',
                
                // Éléments interface
                'items': 'articles',
                'item': 'article',
                'cart': 'Panier',
                'total': 'Total',
                'subtotal': 'Sous-total',
                'discount': 'Réduction',
                'view_cart': 'Voir le panier avec',
                'in_cart': 'dans le panier',
                
                // Accessibilité
                'close_notification': 'Fermer la notification',
                'selected': 'sélectionnés'
            },
            en: {
                // General messages
                'cart_empty': 'Your cart is empty',
                'product_added': 'added to cart',
                'product_removed': 'Product removed from cart',
                'cart_cleared': 'Cart cleared',
                'checkout_started': 'Redirecting to checkout',
                
                // Notifications
                'success': 'Success!',
                'error': 'Error',
                'info': 'Information',
                
                // Promo codes
                'promo_applied': 'Promo code applied!',
                'promo_invalid': 'Invalid promo code',
                'promo_already_applied': 'This promo code is already applied',
                'promo_removed': 'Promo code removed',
                
                // Interface elements
                'items': 'items',
                'item': 'item',
                'cart': 'Cart',
                'total': 'Total',
                'subtotal': 'Subtotal',
                'discount': 'Discount',
                'view_cart': 'View cart with',
                'in_cart': 'in cart',
                
                // Accessibility
                'close_notification': 'Close notification',
                'selected': 'selected'
            },
            es: {
                // Mensajes generales
                'cart_empty': 'Tu carrito está vacío',
                'product_added': 'añadido al carrito',
                'product_removed': 'Producto eliminado del carrito',
                'cart_cleared': 'Carrito vaciado',
                'checkout_started': 'Redirigiendo al pago',
                
                // Notificaciones
                'success': '¡Éxito!',
                'error': 'Error',
                'info': 'Información',
                
                // Códigos promocionales
                'promo_applied': '¡Código promocional aplicado!',
                'promo_invalid': 'Código promocional inválido',
                'promo_already_applied': 'Este código promocional ya está aplicado',
                'promo_removed': 'Código promocional eliminado',
                
                // Elementos de interfaz
                'items': 'artículos',
                'item': 'artículo',
                'cart': 'Carrito',
                'total': 'Total',
                'subtotal': 'Subtotal',
                'discount': 'Descuento',
                'view_cart': 'Ver carrito con',
                'in_cart': 'en el carrito',
                
                // Accesibilidad
                'close_notification': 'Cerrar notificación',
                'selected': 'seleccionados'
            }
        };
        
        return translations[this.locale] || translations.fr;
    }

    t(key, variables = {}) {
        let translation = this.i18n[key] || key;
        
        // Remplacer les variables dans la traduction
        Object.keys(variables).forEach(varKey => {
            translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), variables[varKey]);
        });
        
        return translation;
    }

    // Debounce utility pour limiter les appels fréquents
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    initAnalytics() {
        return {
            sessionId: this.getOrCreateSessionId(),
            events: [],
            startTime: Date.now()
        };
    }

    getOrCreateSessionId() {
        let sessionId = sessionStorage.getItem('techviral_session');
        if (!sessionId) {
            sessionId = 'tv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('techviral_session', sessionId);
        }
        return sessionId;
    }

    init() {
        this.syncCartFromStorage();
        this.updateCartBadge();
        this.bindEvents();
        this.forceCartSync();
        
        // Debug en mode développement
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
            this.debugCartElements();
        }
        
        console.log('Cart Manager initialized 🛒');
        
        // Track page view
        this.trackEvent('cart_manager_initialized', {
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        });
    }

    syncCartFromStorage() {
        // Forcer la synchronisation du panier depuis localStorage
        const storedCart = localStorage.getItem('techviral_cart');
        if (storedCart) {
            try {
                this.cart = JSON.parse(storedCart);
                console.log('Cart synchronized from storage:', this.cart.length, 'items');
            } catch (e) {
                console.error('Error parsing cart from storage:', e);
                this.cart = [];
            }
        } else {
            this.cart = [];
        }
    }

    forceCartSync() {
        // Forcer la mise à jour après un petit délai pour s'assurer que le DOM est prêt
        setTimeout(() => {
            this.updateCartBadge();
        }, 100);
        
        // Double vérification après 500ms
        setTimeout(() => {
            this.updateCartBadge();
        }, 500);
    }

    bindEvents() {
        // Support clavier pour l'accessibilité
        document.addEventListener('keydown', (e) => {
            // Escape pour fermer les modales
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Enter/Space sur les éléments focusables
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }
        });

        // Événements pour tous les boutons "Ajouter au panier"
        document.addEventListener('click', (e) => {
            // ADAPTATION PRINCIPALE : Détection par texte au lieu de classe (HOTFIX INTÉGRÉ)
            const button = e.target.closest('button');
            if (button && (
                button.textContent?.includes('Ajouter au panier') ||
                button.textContent?.includes('Add to cart') ||
                button.querySelector('span')?.textContent?.includes('Ajouter au panier')
            )) {
                e.preventDefault();
                console.log('🎯 Cart button detected:', button);
                this.handleAddToCart(button);
                return;
            }
            
            // Boutons avec classe add-to-cart (original)
            if (e.target.classList.contains('add-to-cart') || 
                e.target.closest('.add-to-cart') ||
                e.target.textContent?.includes('ACHETER MAINTENANT')) {
                e.preventDefault();
                this.handleAddToCart(e.target);
            }

            // Bouton voir panier complet
            if (e.target.id === 'viewCartBtn') {
                e.preventDefault();
                window.location.href = this.getCartPageUrl();
            }

            // Bouton checkout depuis le panier overlay
            if (e.target.id === 'checkoutFromCart') {
                e.preventDefault();
                this.proceedToCheckout();
            }

            // Clic sur l'icône panier pour ouvrir le panier complet
            if (e.target.closest('#cartButton')) {
                e.preventDefault();
                window.location.href = this.getCartPageUrl();
            }
        });

        // Écouter les changements sur le panier
        window.addEventListener('cartUpdated', () => {
            this.updateCartBadge();
        });

        // Écouter les changements de localStorage (synchronisation inter-onglets)
        window.addEventListener('storage', (e) => {
            if (e.key === 'techviral_cart') {
                this.syncCartFromStorage();
                this.updateCartBadge();
                console.log('Cart synchronized from other tab/window');
            }
        });

        // Synchronisation périodique (au cas où)
        setInterval(() => {
            this.syncCartFromStorage();
            this.updateCartBadge();
        }, 5000); // Toutes les 5 secondes
    }

    handleAddToCart(button) {
        // AMÉLIORATION HOTFIX : Meilleure détection des cartes produit
        const productCard = button.closest('.product-card') || 
                           button.closest('[class*="product"]') ||
                           button.closest('.bg-white, .border, .rounded, .p-4, .p-6') ||
                           button.closest('div');
        
        if (!productCard) {
            console.warn('❌ Impossible de trouver la carte produit');
            this.addGenericProduct();
            return;
        }

        const product = this.extractProductData(productCard);
        if (product) {
            this.addToCart(product);
            this.showNotification(`${product.name} ${this.t('product_added')}`);
        }
    }

    extractProductData(element) {
        // Extraction intelligente adaptée au HTML actuel (HOTFIX INTÉGRÉ)
        console.log('🔍 Extracting data from:', element);
        
        // Chercher le nom (h3, h2, ou élément avec classe title/name)
        const nameSelectors = ['h3', 'h2', 'h1', '.title', '.name', '[class*="title"]'];
        let name = '';
        
        for (const selector of nameSelectors) {
            const nameEl = element.querySelector(selector);
            if (nameEl && nameEl.textContent.trim()) {
                name = nameEl.textContent.trim();
                break;
            }
        }

        // Chercher le prix (chercher les patterns d'euros)
        const allText = element.textContent;
        const priceMatches = allText.match(/(\d+(?:[.,]\d+)?)\s*€/g);
        let price = 99; // Prix par défaut
        
        if (priceMatches && priceMatches.length > 0) {
            // Prendre le premier prix trouvé (souvent le prix principal)
            const priceText = priceMatches[0];
            price = parseFloat(priceText.replace(',', '.').replace('€', ''));
        }

        // Si toujours pas de prix, utiliser l'ancienne méthode en backup
        if (!price || price === 99) {
            const priceText = this.findText(element, ['.price', '.prix', '[class*="price"]', '.text-primary', '.font-bold', 'span[id*="Price"]']);
            if (priceText) {
                const matches = priceText.match(/(\d+(?:[.,]\d+)?)\s*€?/);
                if (matches) {
                    price = parseFloat(matches[1].replace(',', '.'));
                }
            }
        }

        // Chercher une image
        const img = element.querySelector('img');
        const image = img ? (img.src || img.dataset.src || '📦') : '📦';

        // Générer un ID unique
        const id = this.generateProductId(name || 'produit-' + Date.now());

        const product = {
            id,
            name: name || 'Produit TechViral',
            price: price,
            image: image,
            quantity: 1,
            addedAt: Date.now()
        };
        
        console.log('✅ Product extracted:', product);
        return product;
    }

    findText(element, selectors) {
        for (const selector of selectors) {
            const found = element.querySelector(selector);
            if (found && found.textContent.trim()) {
                return found.textContent.trim();
            }
        }
        return null;
    }

    findImage(element) {
        const img = element.querySelector('img');
        if (img) {
            return img.src || img.dataset.src || '📦';
        }
        
        // Chercher un emoji ou icône dans le contenu
        const text = element.textContent;
        const emojiMatch = text.match(/[\u{1F000}-\u{1F6FF}\u{1F900}-\u{1F9FF}]/u);
        if (emojiMatch) {
            return emojiMatch[0];
        }
        
        return '📦';
    }

    generateProductId(name) {
        // Génère un ID unique basé sur le nom du produit
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 30);
    }

    addToCart(product) {
        // Vérifier si le produit existe déjà
        const existingIndex = this.cart.findIndex(item => item.id === product.id);
        
        if (existingIndex > -1) {
            // Augmenter la quantité
            this.cart[existingIndex].quantity += 1;
        } else {
            // Ajouter nouveau produit
            this.cart.push(product);
        }

        this.debouncedSave();
        this.debouncedUpdateBadge();
        
        // Track add to cart event
        this.trackEvent('add_to_cart', {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            quantity: product.quantity,
            cart_total: this.getCartTotal(),
            cart_items: this.getCartCount()
        });
        
        // Déclencher événement personnalisé
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { action: 'add', product } 
        }));
    }

    addGenericProduct() {
        const genericProducts = [
            { name: 'Produit Innovant', price: 89, emoji: '🚀' },
            { name: 'Gadget Tendance', price: 149, emoji: '⭐' },
            { name: 'Innovation 2025', price: 199, emoji: '🔥' }
        ];

        const randomProduct = genericProducts[Math.floor(Math.random() * genericProducts.length)];
        
        const product = {
            id: this.generateProductId(randomProduct.name + Date.now()),
            name: randomProduct.name,
            price: randomProduct.price,
            image: randomProduct.emoji,
            quantity: 1,
            addedAt: Date.now()
        };

        this.addToCart(product);
        this.showNotification(`${product.name} ${this.t('product_added')}`);
    }

    removeFromCart(productId) {
        const removedItem = this.cart.find(item => item.id === productId);
        this.cart = this.cart.filter(item => item.id !== productId);
        
        // Track remove from cart event
        if (removedItem) {
            this.trackEvent('remove_from_cart', {
                product_id: removedItem.id,
                product_name: removedItem.name,
                price: removedItem.price,
                quantity: removedItem.quantity,
                cart_total: this.getCartTotal(),
                cart_items: this.getCartCount()
            });
        }
        
        this.debouncedSave();
        this.debouncedUpdateBadge();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { action: 'remove', productId } 
        }));
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartBadge();
                
                window.dispatchEvent(new CustomEvent('cartUpdated', { 
                    detail: { action: 'update', productId, quantity: newQuantity } 
                }));
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.debouncedSave();
        this.debouncedUpdateBadge();
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { action: 'clear' } 
        }));
    }

    saveCart() {
        localStorage.setItem('techviral_cart', JSON.stringify(this.cart));
    }

    updateCartBadge() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Mise à jour FLEXIBLE des badges (HOTFIX INTÉGRÉ - chercher tous les éléments possibles)
        const badgeSelectors = [
            '#cartCount',
            '[id*="cartCount"]',
            '.cart-count',
            '.panier-count', 
            '.cart-badge',
            '[data-cart-count]',
            '[class*="cart"]',
            '[class*="panier"]'
        ];
        
        badgeSelectors.forEach(selector => {
            const badges = document.querySelectorAll(selector);
            badges.forEach(badge => {
                if (badge.textContent.includes('(') && badge.textContent.includes(')')) {
                    // Format "Panier (X)"
                    badge.textContent = `Panier (${totalItems})`;
                } else if (badge.tagName === 'SPAN' && badge.textContent.match(/^\d+$/)) {
                    // Badge numérique simple
                    badge.textContent = totalItems.toString();
                } else if (badge.tagName === 'SPAN' || badge.classList.contains('badge') || badge.id.includes('Count')) {
                    badge.textContent = totalItems.toString();
                } else if (badge.textContent.includes('Panier') || badge.textContent.includes('(')) {
                    badge.textContent = `Panier (${totalItems})`;
                }
                
                // Attribut d'accessibilité
                badge.setAttribute('aria-label', `${totalItems} ${totalItems !== 1 ? this.t('items') : this.t('item')} ${this.t('in_cart')}`);
            });
        });

        // Mettre à jour les éléments avec structure différente sur chaque page
        const specificElements = [
            document.querySelector('#cartCount'),
            document.querySelector('.cart-counter'),
            document.querySelector('[data-cart="count"]')
        ];
        
        specificElements.forEach(el => {
            if (el) el.textContent = totalItems.toString();
        });

        // Mettre à jour les totaux
        const totals = document.querySelectorAll('#cartTotal, .cart-total');
        totals.forEach(total => {
            total.textContent = `${totalPrice.toFixed(2)} €`;
        });

        // Animation du badge si items > 0
        const badges = document.querySelectorAll('#cartCount, .cart-counter, [data-cart="count"]');
        badges.forEach(badge => {
            if (totalItems > 0) {
                badge.classList.add('animate-pulse');
                setTimeout(() => badge.classList.remove('animate-pulse'), 1000);
            }
        });

        // Activer/désactiver les boutons checkout
        const checkoutButtons = document.querySelectorAll('#checkoutFromCart, #checkoutBtn, #finalizeOrder');
        checkoutButtons.forEach(btn => {
            if (totalItems > 0) {
                btn.disabled = false;
                btn.classList.remove('opacity-50');
            } else {
                btn.disabled = true;
                btn.classList.add('opacity-50');
            }
        });
    }

    showNotification(message, type = 'success') {
        // Supprimer les anciennes notifications
        const existing = document.querySelectorAll('.cart-notification');
        existing.forEach(n => n.remove());

        // Déterminer les couleurs selon le type
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        const icon = type === 'success' ? 'M5 13l4 4L19 7' : type === 'error' ? 'M6 18L18 6M6 6l12 12' : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
        const title = type === 'success' ? 'Succès !' : type === 'error' ? 'Erreur' : 'Information';

        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `cart-notification fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl z-50 transform translate-x-0 transition-transform duration-300`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        notification.setAttribute('aria-atomic', 'true');
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}"></path>
                </svg>
                <div>
                    <p class="font-semibold">${title}</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
                <button class="close-notification ml-4 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-${bgColor.replace('bg-', '')}" aria-label="Fermer la notification">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Bind close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            this.dismissNotification(notification);
        });

        // Animation d'entrée
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Suppression automatique
        const timeout = setTimeout(() => {
            this.dismissNotification(notification);
        }, 5000); // 5 secondes pour laisser le temps de lire

        // Stocker la référence du timeout pour pouvoir l'annuler
        notification._timeout = timeout;
    }

    dismissNotification(notification) {
        if (notification._timeout) {
            clearTimeout(notification._timeout);
        }
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    closeModals() {
        // Fermer les modales ouvertes (s'il y en a)
        const modals = document.querySelectorAll('[role="dialog"], .modal-open');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }

    trackEvent(eventName, eventData = {}) {
        const event = {
            event: eventName,
            timestamp: Date.now(),
            sessionId: this.analytics.sessionId,
            page: window.location.pathname,
            referrer: document.referrer,
            ...eventData
        };

        this.analytics.events.push(event);
        console.log('📊 Analytics:', eventName, eventData);

        // Optimisation : batch les sauvegardes d'analytics
        this.debouncedSaveAnalytics = this.debouncedSaveAnalytics || 
            this.debounce(() => {
                localStorage.setItem('techviral_analytics', JSON.stringify(this.analytics.events));
            }, 1000);
        
        this.debouncedSaveAnalytics();

        // Simuler l'envoi vers un service d'analytics (Google Analytics, etc.)
        this.sendToAnalytics(event);
    }

    // Optimisation des mises à jour DOM avec requestAnimationFrame
    scheduleUpdateBadge() {
        if (!this.badgeUpdateScheduled) {
            this.badgeUpdateScheduled = true;
            requestAnimationFrame(() => {
                this.updateCartBadge();
                this.badgeUpdateScheduled = false;
            });
        }
    }

    sendToAnalytics(event) {
        // Intégration Google Analytics 4 (exemple)
        if (typeof gtag !== 'undefined') {
            gtag('event', event.event, {
                custom_parameter_1: event.sessionId,
                custom_parameter_2: event.page,
                ...event
            });
        }

        // Intégration Facebook Pixel (exemple)
        if (typeof fbq !== 'undefined') {
            switch (event.event) {
                case 'add_to_cart':
                    fbq('track', 'AddToCart', {
                        content_name: event.product_name,
                        content_ids: [event.product_id],
                        content_type: 'product',
                        value: event.price,
                        currency: 'EUR'
                    });
                    break;
                case 'checkout_started':
                    fbq('track', 'InitiateCheckout', {
                        value: event.cart_total,
                        currency: 'EUR',
                        num_items: event.cart_items
                    });
                    break;
            }
        }

        // Custom analytics endpoint (désactivé - pas d'API backend)
        // TODO: Activer quand API analytics sera disponible
        /*
        if (window.location.hostname !== 'localhost') {
            fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }).catch(err => console.log('Analytics send failed:', err));
        }
        */
    }

    getCart() {
        return this.cart;
    }

    getCartCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getCartTotal() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return subtotal - this.promoDiscount;
    }

    getCartSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    applyPromoCode(code) {
        const promoCodes = {
            'WELCOME10': { discount: 0.10, type: 'percentage', description: '10% de réduction' },
            'TECH25': { discount: 25, type: 'fixed', description: '25€ de réduction' },
            'FIRST50': { discount: 0.50, type: 'percentage', description: '50% de réduction première commande' },
            'NEWYEAR2025': { discount: 0.15, type: 'percentage', description: '15% de réduction Nouvel An' },
            'FREESHIP': { discount: 0, type: 'shipping', description: 'Livraison gratuite' }
        };

        const upperCode = code.toUpperCase();
        const promo = promoCodes[upperCode];

        if (!promo) {
            return { success: false, message: 'Code promo invalide' };
        }

        if (this.promoCode === upperCode) {
            return { success: false, message: 'Ce code promo est déjà appliqué' };
        }

        const subtotal = this.getCartSubtotal();
        
        if (promo.type === 'percentage') {
            this.promoDiscount = subtotal * promo.discount;
        } else if (promo.type === 'fixed') {
            this.promoDiscount = Math.min(promo.discount, subtotal);
        } else if (promo.type === 'shipping') {
            this.promoDiscount = 0; // Logique pour livraison gratuite
        }

        this.promoCode = upperCode;
        localStorage.setItem('techviral_promo', upperCode);
        localStorage.setItem('techviral_promo_discount', this.promoDiscount.toString());

        console.log(`✅ Promo code ${upperCode} applied: -${this.promoDiscount.toFixed(2)}€`);
        
        // Déclencher événement personnalisé
        window.dispatchEvent(new CustomEvent('promoApplied', { 
            detail: { code: upperCode, discount: this.promoDiscount, description: promo.description } 
        }));

        return { 
            success: true, 
            message: `Code promo appliqué ! ${promo.description}`,
            discount: this.promoDiscount,
            code: upperCode
        };
    }

    removePromoCode() {
        this.promoCode = null;
        this.promoDiscount = 0;
        localStorage.removeItem('techviral_promo');
        localStorage.removeItem('techviral_promo_discount');

        window.dispatchEvent(new CustomEvent('promoRemoved'));
        
        return { success: true, message: 'Code promo supprimé' };
    }

    // Méthodes pour compatibilité avec l'ancien système
    openCart() {
        window.location.href = this.getCartPageUrl();
    }

    getCartPageUrl() {
        // Détermine l'URL correcte pour la page panier selon l'emplacement actuel
        const currentPath = window.location.pathname;
        
        if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '/index.html') {
            // Depuis la racine (index.html)
            return 'pages/cart/index.html';
        } else if (currentPath.includes('/pages/categories/')) {
            // Depuis une page de catégorie
            return '../cart/index.html';
        } else if (currentPath.includes('/pages/')) {
            // Depuis une autre page dans /pages/
            return 'cart/index.html';
        } else {
            // Par défaut, chemin absolu
            return '/pages/cart/index.html';
        }
    }

    getCheckoutPageUrl() {
        // Détermine l'URL correcte pour la page checkout selon l'emplacement actuel
        const currentPath = window.location.pathname;
        
        if (currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '/index.html') {
            // Depuis la racine (index.html)
            return 'pages/cart/checkout.html';
        } else if (currentPath.includes('/pages/categories/')) {
            // Depuis une page de catégorie
            return '../cart/checkout.html';
        } else if (currentPath.includes('/pages/')) {
            // Depuis une autre page dans /pages/
            return 'cart/checkout.html';
        } else {
            // Par défaut, chemin absolu
            return '/pages/cart/checkout.html';
        }
    }

    // Méthode pour synchroniser avec la page panier
    syncWithCartPage() {
        if (window.location.pathname.includes('cart') || window.location.pathname.includes('panier')) {
            this.renderCartPage();
        }
    }

    renderCartPage() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="text-center py-12">
                    <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Votre panier est vide</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">Découvrez nos produits innovants et ajoutez-les à votre panier</p>
                    <a href="../categories/all.html" class="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z"></path>
                        </svg>
                        Continuer les achats
                    </a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg" data-id="${item.id}">
                <div class="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
                    ${typeof item.image === 'string' && item.image.startsWith('http') ? 
                        `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-lg">` : 
                        item.image}
                </div>
                
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 dark:text-white">${item.name}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">Produit TechViral • Innovation 2025</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded-full">
                            ✓ En stock
                        </span>
                    </div>
                </div>
                
                <div class="flex items-center space-x-4">
                    <!-- Quantity Controls -->
                    <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button class="quantity-decrease px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-id="${item.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                        </button>
                        <span class="quantity-display px-4 py-2 text-gray-900 dark:text-white font-medium">${item.quantity}</span>
                        <button class="quantity-increase px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" data-id="${item.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Price -->
                    <div class="text-right">
                        <p class="text-lg font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)} €</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Prix unitaire: ${item.price.toFixed(2)} €</p>
                    </div>
                    
                    <!-- Remove Button -->
                    <button class="remove-item p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" data-id="${item.id}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Bind cart page events
        this.bindCartPageEvents();
        this.updateCartSummary();
    }

    bindCartPageEvents() {
        // Quantity buttons
        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                const item = this.cart.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                    this.renderCartPage();
                }
            });
        });

        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                const item = this.cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    this.updateQuantity(id, item.quantity - 1);
                    this.renderCartPage();
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.target.closest('.remove-item');
                const id = button.dataset.id;
                console.log('Removing item with ID:', id);
                if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                    this.removeFromCart(id);
                    this.renderCartPage();
                    this.showNotification(this.t('product_removed'), 'success');
                }
            });
        });

        // Clear cart button
        const clearBtn = document.getElementById('clearCart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
                    this.clearCart();
                    this.renderCartPage();
                }
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Add checkout buttons to cart summary
        document.querySelectorAll('[class*="checkout"], .checkout-btn, button[data-action="checkout"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.proceedToCheckout();
            });
        });

        // Bind promo code events
        const applyPromoBtn = document.getElementById('applyPromo');
        const promoCodeInput = document.getElementById('promoCode');
        
        if (applyPromoBtn && promoCodeInput) {
            applyPromoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const code = promoCodeInput.value.trim();
                if (code) {
                    this.handlePromoCode(code, promoCodeInput, applyPromoBtn);
                }
            });

            promoCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const code = promoCodeInput.value.trim();
                    if (code) {
                        this.handlePromoCode(code, promoCodeInput, applyPromoBtn);
                    }
                }
            });
        }
    }

    updateCartSummary() {
        const subtotal = this.getCartSubtotal();
        const total = this.getCartTotal();
        const itemCount = this.getCartCount();
        
        // Mettre à jour les éléments de résumé
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        const itemCountEls = document.querySelectorAll('[id*="product-count"], .item-count');

        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} €`;
        if (totalEl) totalEl.textContent = `${total.toFixed(2)} €`;
        
        itemCountEls.forEach(el => {
            el.textContent = `${itemCount} article${itemCount !== 1 ? 's' : ''}`;
        });

        // Afficher la réduction si code promo appliqué
        this.updatePromoDisplay();

        // Mettre à jour le texte du panier en haut de page
        const cartHeader = document.querySelector('.bg-white .px-6 .text-gray-600');
        if (cartHeader) {
            cartHeader.textContent = `${itemCount} article${itemCount !== 1 ? 's' : ''} sélectionné${itemCount !== 1 ? 's' : ''}`;
        }
    }

    handlePromoCode(code, inputEl, buttonEl) {
        const result = this.applyPromoCode(code);
        
        if (result.success) {
            inputEl.value = '';
            inputEl.classList.remove('border-red-500');
            inputEl.classList.add('border-green-500');
            
            this.showNotification(result.message, 'success');
            this.updateCartSummary();
            this.updateCartBadge();
        } else {
            inputEl.classList.remove('border-green-500');
            inputEl.classList.add('border-red-500');
            this.showNotification(result.message, 'error');
        }
    }

    updatePromoDisplay() {
        // Chercher l'endroit où afficher les promos dans le résumé
        const promoContainer = document.getElementById('promoDiscount') || this.createPromoDisplay();
        
        if (this.promoCode && this.promoDiscount > 0) {
            promoContainer.style.display = 'block';
            promoContainer.innerHTML = `
                <div class="flex justify-between text-green-600 dark:text-green-400">
                    <span>Code ${this.promoCode}</span>
                    <span>-${this.promoDiscount.toFixed(2)} €</span>
                </div>
            `;
        } else {
            promoContainer.style.display = 'none';
        }
    }

    createPromoDisplay() {
        // Créer un conteneur pour l'affichage des promos si il n'existe pas
        const promoContainer = document.createElement('div');
        promoContainer.id = 'promoDiscount';
        promoContainer.style.display = 'none';
        
        // Essayer de l'insérer avant le total
        const totalContainer = document.getElementById('total')?.parentElement;
        if (totalContainer) {
            totalContainer.parentElement.insertBefore(promoContainer, totalContainer);
        }
        
        return promoContainer;
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification(this.t('cart_empty'), 'error');
            return;
        }

        // Sauvegarder les données de panier pour la page checkout
        localStorage.setItem('checkout_data', JSON.stringify({
            cart: this.cart,
            total: this.getCartTotal(),
            itemCount: this.getCartCount(),
            timestamp: Date.now()
        }));

        // Redirection vers la page checkout
        window.location.href = this.getCheckoutPageUrl();
    }

    // Fonction de diagnostic pour identifier les éléments de panier
    debugCartElements() {
        console.log('🔍 Diagnostic des éléments de panier sur cette page:');
        
        const allPossibleElements = [
            '#cartCount',
            '[id*="cartCount"]', 
            '.cart-count',
            '.panier-count',
            '.cart-badge',
            '[data-cart-count]',
            '#cartTotal',
            '.cart-total'
        ];
        
        allPossibleElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`✅ Trouvé ${elements.length} élément(s) avec sélecteur: ${selector}`);
                elements.forEach((el, i) => {
                    console.log(`   - Element ${i+1}:`, el, `Texte: "${el.textContent}"`);
                });
            }
        });
        
        console.log(`📊 Panier actuel: ${this.cart.length} items`);
    }
}

// Initialiser le gestionnaire de panier globalement après DOM ready
let cartManager = null;

// Fonction d'initialisation sécurisée
function initCartManager() {
    if (!cartManager) {
        cartManager = new CartManager();
        window.cartManager = cartManager;
        console.log('🛒 Global CartManager initialized');
    }
}

// Fonction globale pour compatibility
function addToCart(productData) {
    if (!cartManager) initCartManager();
    cartManager.addToCart(productData);
}

// Initialisation immédiate si DOM déjà prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartManager);
} else {
    initCartManager();
}

// Au chargement de la page, synchroniser avec la page panier si nécessaire
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (cartManager && cartManager.syncWithCartPage) {
            cartManager.syncWithCartPage();
        }
        // Force update après DOM complet
        if (cartManager) {
            cartManager.forceCartSync();
        }
    }, 200);
});

// Fonctions globales de debug (accessibles depuis la console)
window.debugCart = function() {
    if (cartManager) {
        cartManager.debugCartElements();
    } else {
        console.log('❌ CartManager non initialisé');
    }
};

window.forceCartSync = function() {
    if (cartManager) {
        cartManager.syncCartFromStorage();
        cartManager.updateCartBadge();
        console.log('🔄 Synchronisation forcée du panier');
    } else {
        console.log('❌ CartManager non initialisé');
    }
};

window.showCartContents = function() {
    if (cartManager) {
        console.log('📦 Contenu du panier:', cartManager.cart);
        console.log('💰 Total:', cartManager.getCartTotal(), '€');
        console.log('🔢 Nombre d\'articles:', cartManager.getCartCount());
    } else {
        console.log('❌ CartManager non initialisé');
    }
};

console.log('Cart system loaded ✅');
console.log('🔧 Commandes debug disponibles: debugCart(), forceCartSync(), showCartContents()');