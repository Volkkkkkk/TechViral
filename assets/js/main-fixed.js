/**
 * TechViral - Main JavaScript (FIXED VERSION)
 * Fonctionnalités e-commerce modernes et interactions avancées
 * Version corrigée - Sans conflits avec cart.js
 */

class TechViralApp {
    constructor() {
        // Cart est maintenant géré exclusivement par cart.js
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        // Cart entièrement géré par cart.js - pas d'initialisation ici
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

    // Theme Management - Simplifié pour éviter les conflits
    setupThemeToggle() {
        const themeToggle = document.getElementById('darkModeToggle');
        
        // Vérifier si le dark mode n'est pas déjà géré ailleurs
        if (themeToggle && !themeToggle.hasAttribute('data-initialized')) {
            themeToggle.setAttribute('data-initialized', 'true');
            
            themeToggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                this.applyTheme();
                localStorage.setItem('theme', this.theme);
            });
        }
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
        
        if (!mobileMenuButton || !mobileMenu) return;
        
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Product Filters
    setupProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productsGrid = document.getElementById('productsGrid');
        
        if (!filterButtons.length || !productsGrid) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                const products = productsGrid.querySelectorAll('.product-card');
                products.forEach(product => {
                    if (category === 'all' || product.dataset.category?.includes(category)) {
                        product.style.display = '';
                        setTimeout(() => product.classList.add('animate-slide-up'), 50);
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput) return;

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length >= 2) {
                console.log(`Searching for: ${query}`);
                // Redirect to search results page ou filtrer les produits
                const products = document.querySelectorAll('.product-card');
                products?.forEach(product => {
                    const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
                    const description = product.querySelector('p')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(query) || description.includes(query)) {
                        product.style.display = '';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
        };

        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        searchBtn?.addEventListener('click', performSearch);
    }

    // Live Activity Feed
    setupLiveActivity() {
        const activities = [
            { user: 'Marie L.', product: 'Caméra POV Portable 4K', time: 'Il y a 2 min' },
            { user: 'Thomas B.', product: 'Drone en Mousse RC', time: 'Il y a 5 min' },
            { user: 'Sophie M.', product: 'Bouteille Hydrogène H₂', time: 'Il y a 8 min' },
            { user: 'Lucas R.', product: 'Casquette Cryothérapie', time: 'Il y a 12 min' },
            { user: 'Emma D.', product: 'Théière Verre à Bouton', time: 'Il y a 15 min' },
            { user: 'Antoine C.', product: 'Mug Auto-Mélangeur', time: 'Il y a 18 min' }
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
                activityTime.textContent = activity.time;
                
                currentIndex = (currentIndex + 1) % activities.length;
                
                // Animation
                const container = document.getElementById('liveActivity');
                container?.classList.remove('animate-slide-up');
                void container?.offsetWidth; // Force reflow
                container?.classList.add('animate-slide-up');
            }
        };

        // Update every 5 seconds
        setInterval(updateActivity, 5000);
    }

    // Newsletter Form
    setupNewsletterForm() {
        const form = document.getElementById('newsletterForm');
        
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]')?.value;
            
            if (email) {
                // Simuler l'envoi
                console.log(`Newsletter subscription: ${email}`);
                
                // Show success message
                const button = form.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                button.textContent = '✓ Inscrit !';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    form.reset();
                }, 3000);
            }
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.product-card, .metric, .panel').forEach(el => {
            observer.observe(el);
        });
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('fade-in');
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
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Handle scroll-based actions
                const scrolled = window.scrollY > 100;
                document.body.classList.toggle('scrolled', scrolled);
            });
        }, { passive: true });

        // Preload critical resources
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = 'assets/css/tailwind.min.css';
        document.head.appendChild(preloadLink);
    }
}

// Helper function pour scroll to products
window.scrollToProducts = function() {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.techViralApp = new TechViralApp();
    });
} else {
    window.techViralApp = new TechViralApp();
}