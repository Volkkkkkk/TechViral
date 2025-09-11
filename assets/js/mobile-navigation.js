/**
 * Mobile Navigation Optimizer - TechViral
 * Version "Acier" : UX mobile premium + touch optimizations
 */
class MobileNavigationOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.touchSupport = 'ontouchstart' in window;
        this.menuOpen = false;
        this.scrollPosition = 0;
        this.swipeThreshold = 50;
        this.tapThreshold = 300;
        
        this.init();
    }

    /**
     * Initialise l'optimiseur mobile
     */
    init() {
        if (this.isMobile || this.isTablet) {
            this.setupMobileNavigation();
            this.setupTouchGestures();
            this.setupViewportOptimizations();
            this.setupPerformanceOptimizations();
            console.log('📱 Navigation mobile optimisée');
        }
        
        this.setupResponsiveImages();
        this.setupAccessibilityEnhancements();
    }

    /**
     * Détecte si l'appareil est mobile
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    /**
     * Détecte si l'appareil est une tablette
     */
    detectTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent) ||
               (window.innerWidth > 768 && window.innerWidth <= 1024);
    }

    /**
     * Configure la navigation mobile
     */
    setupMobileNavigation() {
        this.createMobileMenu();
        this.setupMenuToggle();
        this.setupMobileSearch();
        this.setupStickyHeader();
    }

    /**
     * Crée le menu mobile optimisé
     */
    createMobileMenu() {
        const nav = document.querySelector('nav');
        if (!nav) return;

        // Hamburger button avec animation
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-menu-toggle md:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center';
        hamburger.setAttribute('aria-label', 'Menu de navigation');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <svg class="hamburger-icon w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path class="line-1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16"></path>
                <path class="line-2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16"></path>
                <path class="line-3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 18h16"></path>
            </svg>
        `;

        // Menu overlay fullscreen
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu-overlay fixed inset-0 z-40 bg-white dark:bg-gray-900 transform translate-x-full transition-transform duration-300 ease-out md:hidden';
        mobileMenu.innerHTML = `
            <div class="flex flex-col h-full pt-20 px-6">
                <div class="mobile-menu-content flex-1 overflow-y-auto">
                    <!-- Navigation links seront ajoutés ici -->
                </div>
                <div class="mobile-menu-footer py-6 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-center space-x-4">
                        <button class="theme-toggle px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            🌙 Mode sombre
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insérer les éléments
        document.body.appendChild(hamburger);
        document.body.appendChild(mobileMenu);

        // Copier navigation existante
        this.populateMobileMenu(mobileMenu);
    }

    /**
     * Peuple le menu mobile avec les liens existants
     */
    populateMobileMenu(mobileMenu) {
        const desktopNav = document.querySelector('nav ul, nav .nav-links');
        if (!desktopNav) return;

        const menuContent = mobileMenu.querySelector('.mobile-menu-content');
        const mobileNavList = document.createElement('ul');
        mobileNavList.className = 'space-y-4';

        // Copier les liens avec optimisations mobile
        const links = desktopNav.querySelectorAll('a');
        links.forEach(link => {
            const li = document.createElement('li');
            const mobileLink = document.createElement('a');
            
            mobileLink.href = link.href;
            mobileLink.textContent = link.textContent;
            mobileLink.className = 'block py-4 px-6 text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors';
            
            // Touch optimizations
            mobileLink.style.minHeight = '44px'; // Apple touch target size
            mobileLink.addEventListener('touchstart', this.handleTouchFeedback);
            
            li.appendChild(mobileLink);
            mobileNavList.appendChild(li);
        });

        menuContent.appendChild(mobileNavList);
    }

    /**
     * Configure le toggle du menu
     */
    setupMenuToggle() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (!toggle || !overlay) return;

        toggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Fermer en cliquant sur l'overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeMobileMenu();
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Toggle menu mobile
     */
    toggleMobileMenu() {
        if (this.menuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Ouvre le menu mobile
     */
    openMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const hamburgerIcon = toggle.querySelector('.hamburger-icon');
        
        this.menuOpen = true;
        this.scrollPosition = window.pageYOffset;
        
        // Animations
        overlay.classList.remove('translate-x-full');
        toggle.setAttribute('aria-expanded', 'true');
        
        // Transformer hamburger en X
        hamburgerIcon.style.transform = 'rotate(90deg)';
        hamburgerIcon.querySelector('.line-1').setAttribute('d', 'M6 18L18 6');
        hamburgerIcon.querySelector('.line-2').style.opacity = '0';
        hamburgerIcon.querySelector('.line-3').setAttribute('d', 'M6 6l12 12');
        
        // Bloquer scroll body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
    }

    /**
     * Ferme le menu mobile
     */
    closeMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const hamburgerIcon = toggle.querySelector('.hamburger-icon');
        
        this.menuOpen = false;
        
        // Animations
        overlay.classList.add('translate-x-full');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Restaurer hamburger
        hamburgerIcon.style.transform = 'rotate(0deg)';
        hamburgerIcon.querySelector('.line-1').setAttribute('d', 'M4 6h16');
        hamburgerIcon.querySelector('.line-2').style.opacity = '1';
        hamburgerIcon.querySelector('.line-3').setAttribute('d', 'M4 18h16');
        
        // Restaurer scroll body
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollPosition);
    }

    /**
     * Configure la recherche mobile
     */
    setupMobileSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'mobile-search-container md:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-900 shadow-lg transform -translate-y-full transition-transform duration-300';
        searchContainer.innerHTML = `
            <div class="p-4">
                <div class="relative">
                    <input type="search" placeholder="Rechercher des produits..." 
                           class="mobile-search-input w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <button class="mobile-search-close absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(searchContainer);
        
        // Events recherche mobile
        const searchInput = searchContainer.querySelector('.mobile-search-input');
        const closeBtn = searchContainer.querySelector('.mobile-search-close');
        
        closeBtn.addEventListener('click', () => {
            searchContainer.classList.add('-translate-y-full');
        });
        
        // Auto-focus et clavier virtuel
        searchInput.addEventListener('focus', () => {
            if (this.isMobile) {
                setTimeout(() => window.scrollTo(0, 0), 300);
            }
        });
    }

    /**
     * Configure header sticky optimisé
     */
    setupStickyHeader() {
        const header = document.querySelector('header, nav');
        if (!header) return;

        let lastScrollY = window.pageYOffset;
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                if (scrollY > lastScrollY) {
                    // Scroll down - hide header
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scroll up - show header
                    header.style.transform = 'translateY(0)';
                    header.classList.add('backdrop-blur-md', 'bg-white/90', 'dark:bg-gray-900/90');
                }
            } else {
                header.style.transform = 'translateY(0)';
                header.classList.remove('backdrop-blur-md', 'bg-white/90', 'dark:bg-gray-900/90');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Configure les gestes tactiles
     */
    setupTouchGestures() {
        if (!this.touchSupport) return;

        let startX = 0;
        let startY = 0;
        let startTime = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Swipe right pour ouvrir menu (edge)
            if (startX < 20 && deltaX > this.swipeThreshold && Math.abs(deltaY) < 100 && deltaTime < 500) {
                if (!this.menuOpen) {
                    this.openMobileMenu();
                }
            }
            
            // Swipe left pour fermer menu
            if (this.menuOpen && deltaX < -this.swipeThreshold && Math.abs(deltaY) < 100 && deltaTime < 500) {
                this.closeMobileMenu();
            }
        }, { passive: true });
    }

    /**
     * Optimisations viewport mobile
     */
    setupViewportOptimizations() {
        // Prévenir zoom sur focus input
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport && this.isMobile) {
            metaViewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
        }

        // Ajuster hauteur viewport mobile (iOS Safari)
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 500);
        });
    }

    /**
     * Optimisations performance mobile
     */
    setupPerformanceOptimizations() {
        // Passive event listeners
        const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
        passiveEvents.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
        });

        // Reduce motion pour économie batterie
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }

        // Optimiser scroll performance
        if ('CSS' in window && 'supports' in window.CSS) {
            if (CSS.supports('scroll-behavior: smooth')) {
                document.documentElement.style.scrollBehavior = 'smooth';
            }
        }
    }

    /**
     * Images responsive pour mobile
     */
    setupResponsiveImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Lazy loading natif si supporté
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Aspect ratio preservation
            if (!img.style.aspectRatio && img.width && img.height) {
                img.style.aspectRatio = `${img.width} / ${img.height}`;
            }
        });
    }

    /**
     * Améliorations accessibilité mobile
     */
    setupAccessibilityEnhancements() {
        // Augmenter tailles de touch targets
        const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
        
        interactiveElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
                el.style.minHeight = '44px';
                el.style.minWidth = '44px';
                el.style.display = 'inline-flex';
                el.style.alignItems = 'center';
                el.style.justifyContent = 'center';
            }
        });

        // Skip links pour navigation clavier
        this.addSkipLinks();
    }

    /**
     * Ajoute liens de navigation rapide
     */
    addSkipLinks() {
        const skipNav = document.createElement('a');
        skipNav.href = '#main-content';
        skipNav.textContent = 'Aller au contenu principal';
        skipNav.className = 'skip-link sr-only focus:not-sr-only fixed top-4 left-4 z-50 bg-primary text-white px-4 py-2 rounded';
        skipNav.style.transform = 'translateY(-100%)';
        skipNav.addEventListener('focus', () => {
            skipNav.style.transform = 'translateY(0)';
        });
        skipNav.addEventListener('blur', () => {
            skipNav.style.transform = 'translateY(-100%)';
        });

        document.body.insertBefore(skipNav, document.body.firstChild);
    }

    /**
     * Feedback tactile
     */
    handleTouchFeedback(e) {
        const element = e.currentTarget;
        element.style.transform = 'scale(0.98)';
        element.style.opacity = '0.8';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.opacity = '';
        }, 150);
    }

    /**
     * Statistiques mobile
     */
    getStats() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            touchSupport: this.touchSupport,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                vh: getComputedStyle(document.documentElement).getPropertyValue('--vh')
            },
            menuOpen: this.menuOpen,
            optimizations: {
                stickyHeader: !!document.querySelector('header[style*="transform"]'),
                mobileMenu: !!document.querySelector('.mobile-menu-overlay'),
                touchTargets: document.querySelectorAll('[style*="min-height: 44px"]').length
            }
        };
    }

    /**
     * API publique pour tests
     */
    toggleSearchBar() {
        const searchContainer = document.querySelector('.mobile-search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('-translate-y-full');
            if (!searchContainer.classList.contains('-translate-y-full')) {
                searchContainer.querySelector('input').focus();
            }
        }
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.mobileNav = new MobileNavigationOptimizer();

    // Debug mobile en développement
    if (window.location.hostname === 'localhost') {
        console.log('📱 Mobile Navigation Stats:', window.mobileNav.getStats());
    }
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigationOptimizer;
}