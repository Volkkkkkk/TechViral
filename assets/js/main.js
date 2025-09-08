/**
 * TechViral - Main JavaScript
 * Fonctionnalités e-commerce modernes et interactions avancées
 * Basé sur les meilleures pratiques 2025
 */

class TechViralApp {
    constructor() {
        // Cart géré par cart.js - pas de conflit
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        // Cart géré par cart.js - supprimé pour éviter les conflits
        this.setupProductFilters();
        this.setupSearch();
        this.setupLiveActivity();
        this.setupNewsletterForm();
        this.setupScrollAnimations();
        this.setupLazyLoading();
        this.setupPerformanceOptimizations();
        
        // Initialize theme
        this.applyTheme();
        
        console.log('TechViral App initialized ✨ (Cart handled by cart.js)');
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('darkModeToggle');
        
        themeToggle?.addEventListener('click', () => {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
            this.applyTheme();
            localStorage.setItem('theme', this.theme);
        });
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuButton?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton?.contains(e.target) && !mobileMenu?.contains(e.target)) {
                mobileMenu?.classList.add('hidden');
            }
        });
    }

    // Cart Management
    setupCart() {
        const cartButton = document.getElementById('cartButton');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        const closeCart = document.getElementById('closeCart');

        // Open cart
        cartButton?.addEventListener('click', () => {
            this.openCart();
        });

        // Close cart
        closeCart?.addEventListener('click', () => {
            this.closeCart();
        });

        cartBackdrop?.addEventListener('click', () => {
            this.closeCart();
        });

        // Setup add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart') || e.target.textContent?.includes('Ajouter au panier')) {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }
        });
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        
        cartSidebar?.classList.remove('translate-x-full');
        cartBackdrop?.classList.remove('opacity-0', 'invisible');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartBackdrop = document.getElementById('cartBackdrop');
        
        cartSidebar?.classList.add('translate-x-full');
        cartBackdrop?.classList.add('opacity-0', 'invisible');
        document.body.style.overflow = '';
    }

    addToCart(productCard) {
        const title = productCard.querySelector('h3')?.textContent || 'Produit';
        const priceText = productCard.querySelector('.text-primary')?.textContent || '0€';
        const price = parseInt(priceText.replace('€', ''));
        const image = productCard.querySelector('.aspect-square span')?.textContent || '📦';

        const product = {
            id: Date.now() + Math.random(),
            title,
            price,
            image,
            quantity: 1
        };

        this.cart.push(product);
        this.saveCart();
        this.updateCartUI();
        this.showCartNotification(title);
        
        // Animation du bouton
        const button = productCard.querySelector('button');
        button?.classList.add('animate-cart-bounce');
        setTimeout(() => {
            button?.classList.remove('animate-cart-bounce');
        }, 600);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.renderCartItems();
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.classList.toggle('animate-cart-bounce', this.cart.length > 0);
        }
        
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartTotal.textContent = `${total}€`;
        }
        
        this.renderCartItems();
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="text-center text-gray-500 dark:text-gray-400 py-12">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 10H6L5 9z"></path>
                    </svg>
                    <p>Votre panier est vide</p>
                    <button onclick="techViralApp.closeCart()" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Continuer les achats
                    </button>
                </div>
            `;
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4">
                <div class="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center text-2xl">
                    ${item.image}
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white text-sm">${item.title}</h4>
                    <p class="text-primary font-bold">${item.price}€</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="techViralApp.updateQuantity('${item.id}', -1)" 
                            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        −
                    </button>
                    <span class="w-8 text-center font-semibold">${item.quantity}</span>
                    <button onclick="techViralApp.updateQuantity('${item.id}', 1)" 
                            class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        +
                    </button>
                </div>
                <button onclick="techViralApp.removeFromCart('${item.id}')" 
                        class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id == productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    showCartNotification(productName) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-slide-up';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="font-medium">${productName} ajouté au panier</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Product Filtering
    setupProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const products = document.querySelectorAll('.product-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                products.forEach(product => {
                    const productCategories = product.dataset.category;
                    
                    if (category === 'all' || productCategories?.includes(category)) {
                        product.style.display = 'block';
                        product.classList.add('animate-slide-up');
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Search Functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;

        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Search on enter
        searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            this.showAllProducts();
            return;
        }

        const products = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        products.forEach(product => {
            const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = product.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Show search results count
        this.showSearchResults(query, visibleCount);
    }

    showAllProducts() {
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            product.style.display = 'block';
        });
    }

    showSearchResults(query, count) {
        // Remove existing results indicator
        const existingIndicator = document.querySelector('.search-results-indicator');
        existingIndicator?.remove();

        // Add new results indicator
        const indicator = document.createElement('div');
        indicator.className = 'search-results-indicator text-center py-4 text-gray-600 dark:text-gray-400';
        indicator.innerHTML = `
            <p>Résultats pour "${query}" : ${count} produit${count !== 1 ? 's' : ''} trouvé${count !== 1 ? 's' : ''}</p>
            <button onclick="techViralApp.clearSearch()" class="mt-2 text-primary hover:text-secondary transition-colors">
                Effacer la recherche
            </button>
        `;

        const productsGrid = document.getElementById('productsGrid');
        productsGrid?.parentNode.insertBefore(indicator, productsGrid);
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.showAllProducts();
        document.querySelector('.search-results-indicator')?.remove();
    }

    // Live Activity Feed
    setupLiveActivity() {
        const activities = [
            { user: 'Marie L.', product: 'Caméra POV Portable 4K', time: '2 min' },
            { user: 'Thomas B.', product: 'Drone en Mousse RC', time: '5 min' },
            { user: 'Sophie M.', product: 'Bouteille Hydrogène H₂', time: '8 min' },
            { user: 'Lucas R.', product: 'Casquette Cryothérapie', time: '12 min' },
            { user: 'Emma C.', product: 'Théière Verre à Bouton', time: '15 min' },
            { user: 'Alex D.', product: 'Mug Auto-Mélangeur', time: '18 min' }
        ];

        let currentIndex = 0;

        const updateActivity = () => {
            const activityUser = document.getElementById('activityUser');
            const activityProduct = document.getElementById('activityProduct');
            const activityTime = document.getElementById('activityTime');

            if (activityUser && activityProduct && activityTime) {
                const activity = activities[currentIndex];
                
                activityUser.textContent = `${activity.user} vient d'acheter`;
                activityProduct.textContent = activity.product;
                activityTime.textContent = `Il y a ${activity.time}`;

                currentIndex = (currentIndex + 1) % activities.length;
            }
        };

        // Update every 5 seconds
        setInterval(updateActivity, 5000);
        updateActivity(); // Initial update
    }

    // Newsletter Form
    setupNewsletterForm() {
        const newsletterForm = document.getElementById('newsletterForm');
        
        newsletterForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            // Simulate newsletter subscription
            this.subscribeNewsletter(email);
        });
    }

    subscribeNewsletter(email) {
        const form = document.getElementById('newsletterForm');
        const originalHTML = form.innerHTML;
        
        // Show loading state
        form.innerHTML = `
            <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p class="text-white">Inscription en cours...</p>
            </div>
        `;
        
        // Simulate API call
        setTimeout(() => {
            form.innerHTML = `
                <div class="text-center">
                    <svg class="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h3 class="text-2xl font-bold text-white mb-2">Inscription réussie !</h3>
                    <p class="text-gray-200">Merci ${email}, vous recevrez bientôt nos dernières innovations.</p>
                </div>
            `;
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.innerHTML = originalHTML;
                this.setupNewsletterForm(); // Rebind event
            }, 3000);
        }, 2000);
    }

    // Scroll Animations
    setupScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('.animate-on-scroll, .product-card, .scroll-fade').forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Lazy Loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Preload critical pages
        this.preloadCriticalResources();
        
        // Setup service worker if supported
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    preloadCriticalResources() {
        // Détection de la page courante pour chemins relatifs corrects
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.includes('/pages/categories/');
        const basePath = isInSubfolder ? '../../' : './';
        
        const criticalPages = [
            basePath + 'pages/categories/all.html',
            basePath + 'pages/promotions.html'
        ];

        criticalPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    registerServiceWorker() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('performance' in window && 'PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((list) => {
                const firstInput = list.getEntries()[0];
                console.log('FID:', firstInput.processingStart - firstInput.startTime);
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((list) => {
                let cls = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cls += entry.value;
                    }
                }
                console.log('CLS:', cls);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Utility Functions
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

    // Analytics and Tracking
    trackEvent(eventName, eventData = {}) {
        // Google Analytics 4 / Custom analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        console.log('Event tracked:', eventName, eventData);
    }

    trackPurchase(transactionData) {
        this.trackEvent('purchase', {
            transaction_id: transactionData.id,
            value: transactionData.total,
            currency: 'EUR',
            items: transactionData.items
        });
    }
}

// Utility Functions (Global)
function scrollToProducts() {
    document.getElementById('featured-products')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.techViralApp = new TechViralApp();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations, reduce polling, etc.
        console.log('Page hidden - reducing activity');
    } else {
        // Resume normal activity
        console.log('Page visible - resuming activity');
    }
});

// Handle online/offline states
window.addEventListener('online', () => {
    console.log('Back online');
    // Resume sync, show notification, etc.
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
    // Show offline notification, cache actions, etc.
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    // Send to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Send to error tracking service
});

// Performance measurement
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart + 'ms');
        }, 0);
    });
}