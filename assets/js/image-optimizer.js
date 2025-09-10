/**
 * Image Pipeline Optimizer - TechViral
 * Version "Acier" : AVIF/WebP automatique + Lazy Loading
 */
class ImageOptimizer {
    constructor() {
        this.supportedFormats = {
            avif: false,
            webp: false,
            jpeg: true
        };
        this.lazyImages = [];
        this.observer = null;
        this.placeholderSvg = this.generatePlaceholderSvg();
        
        this.detectFormatSupport();
        this.init();
    }

    /**
     * Détecte le support des formats modernes
     */
    async detectFormatSupport() {
        // Test AVIF
        try {
            const avifSupported = await this.testImageFormat('data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMgwf8D///8WfhwB8+ErK42A=');
            this.supportedFormats.avif = avifSupported;
        } catch (e) {
            this.supportedFormats.avif = false;
        }

        // Test WebP
        try {
            const webpSupported = await this.testImageFormat('data:image/webp;base64,UklGRhYAAABXRUJQVlA4TAkAAAAvAAAAAP8AAAA=');
            this.supportedFormats.webp = webpSupported;
        } catch (e) {
            this.supportedFormats.webp = false;
        }

        console.log('🖼️ Support formats:', this.supportedFormats);
    }

    /**
     * Test du support d'un format image
     * @param {string} dataUrl - Data URL de test
     * @returns {Promise<boolean>} Support du format
     */
    testImageFormat(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = dataUrl;
        });
    }

    /**
     * Initialise l'optimiseur
     */
    init() {
        this.setupLazyLoading();
        this.processExistingImages();
        console.log('⚡ Image Optimizer initialisé');
    }

    /**
     * Configure le lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
        }
    }

    /**
     * Traite les images existantes
     */
    processExistingImages() {
        const images = document.querySelectorAll('img[data-src], img[src]:not([data-optimized])');
        images.forEach(img => this.optimizeImage(img));
    }

    /**
     * Optimise une image
     * @param {HTMLElement} img - Élément image
     */
    optimizeImage(img) {
        // Skip si déjà optimisée
        if (img.hasAttribute('data-optimized')) return;

        const originalSrc = img.getAttribute('data-src') || img.src;
        
        // Générer sources multiples formats
        const sources = this.generateSourceSet(originalSrc);
        
        // Créer picture element si formats modernes supportés
        if ((this.supportedFormats.avif || this.supportedFormats.webp) && !img.closest('picture')) {
            this.wrapWithPicture(img, sources);
        }

        // Configuration lazy loading
        if (img.hasAttribute('data-src')) {
            this.setupImageLazyLoad(img);
        } else {
            // Image déjà chargée, optimiser quand même
            this.enhanceLoadedImage(img);
        }

        img.setAttribute('data-optimized', 'true');
    }

    /**
     * Génère les différentes sources d'image
     * @param {string} originalSrc - Source originale
     * @returns {Object} Sources par format
     */
    generateSourceSet(originalSrc) {
        const basePath = this.getBasePath(originalSrc);
        const filename = this.getFilename(originalSrc);
        const extension = this.getExtension(originalSrc);
        
        const sources = {};

        // AVIF (meilleure compression)
        if (this.supportedFormats.avif) {
            sources.avif = `${basePath}${filename}.avif`;
        }

        // WebP (bon support)
        if (this.supportedFormats.webp) {
            sources.webp = `${basePath}${filename}.webp`;
        }

        // Fallback original
        sources.fallback = originalSrc;

        return sources;
    }

    /**
     * Entoure l'image d'un élément picture
     * @param {HTMLElement} img - Image à entourer
     * @param {Object} sources - Sources par format
     */
    wrapWithPicture(img, sources) {
        const picture = document.createElement('picture');
        
        // Source AVIF
        if (sources.avif) {
            const sourceAvif = document.createElement('source');
            sourceAvif.type = 'image/avif';
            sourceAvif.srcset = sources.avif;
            if (img.hasAttribute('data-src')) {
                sourceAvif.setAttribute('data-srcset', sources.avif);
                sourceAvif.removeAttribute('srcset');
            }
            picture.appendChild(sourceAvif);
        }

        // Source WebP
        if (sources.webp) {
            const sourceWebp = document.createElement('source');
            sourceWebp.type = 'image/webp';
            sourceWebp.srcset = sources.webp;
            if (img.hasAttribute('data-src')) {
                sourceWebp.setAttribute('data-srcset', sources.webp);
                sourceWebp.removeAttribute('srcset');
            }
            picture.appendChild(sourceWebp);
        }

        // Insérer picture et déplacer img
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(img);
    }

    /**
     * Configure le lazy loading pour une image
     * @param {HTMLElement} img - Image à lazy loader
     */
    setupImageLazyLoad(img) {
        // Placeholder pendant chargement
        if (!img.src) {
            img.src = this.placeholderSvg;
            img.style.backgroundColor = '#f3f4f6';
        }

        // Observer pour lazy loading
        if (this.observer) {
            this.observer.observe(img);
        } else {
            // Fallback si pas d'IntersectionObserver
            this.loadImage(img);
        }
    }

    /**
     * Charge une image lazy
     * @param {HTMLElement} img - Image à charger
     */
    loadImage(img) {
        const dataSrc = img.getAttribute('data-src');
        if (!dataSrc) return;

        // Fade in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // Charger sources du picture si présent
        const picture = img.closest('picture');
        if (picture) {
            const sources = picture.querySelectorAll('source[data-srcset]');
            sources.forEach(source => {
                source.srcset = source.getAttribute('data-srcset');
                source.removeAttribute('data-srcset');
            });
        }

        // Charger image principale
        img.onload = () => {
            img.style.opacity = '1';
            img.classList.add('loaded');
        };
        
        img.onerror = () => {
            img.style.opacity = '1';
            img.classList.add('error');
            console.warn('⚠️ Erreur chargement image:', dataSrc);
        };

        img.src = dataSrc;
        img.removeAttribute('data-src');
    }

    /**
     * Améliore une image déjà chargée
     * @param {HTMLElement} img - Image chargée
     */
    enhanceLoadedImage(img) {
        // Ajouter effet de chargement progressif si pas présent
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
            };
        }

        // Ajouter lazy loading pour images below-the-fold
        const rect = img.getBoundingClientRect();
        if (rect.top > window.innerHeight && this.observer) {
            const currentSrc = img.src;
            img.setAttribute('data-src', currentSrc);
            img.src = this.placeholderSvg;
            this.observer.observe(img);
        }
    }

    /**
     * Génère un placeholder SVG
     * @returns {string} Data URL du placeholder
     */
    generatePlaceholderSvg() {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <rect x="50%" y="50%" width="40" height="40" fill="#d1d5db" transform="translate(-20,-20)"/>
            <circle cx="50%" cy="45%" r="6" fill="#9ca3af"/>
            <path d="M50% 55% L60% 70% L40% 70% Z" fill="#9ca3af"/>
        </svg>`;
        
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Utilitaires de parsing des URLs
     */
    getBasePath(url) {
        return url.substring(0, url.lastIndexOf('/') + 1);
    }

    getFilename(url) {
        const filename = url.substring(url.lastIndexOf('/') + 1);
        return filename.substring(0, filename.lastIndexOf('.'));
    }

    getExtension(url) {
        return url.substring(url.lastIndexOf('.'));
    }

    /**
     * API publique pour optimiser nouvelles images
     * @param {string} selector - Sélecteur CSS des images
     */
    optimizeNewImages(selector = 'img:not([data-optimized])') {
        const images = document.querySelectorAll(selector);
        images.forEach(img => this.optimizeImage(img));
        console.log(`✅ ${images.length} nouvelles images optimisées`);
    }

    /**
     * Précharge des images critiques
     * @param {Array} urls - URLs à précharger
     */
    preloadCriticalImages(urls = []) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
        });
        
        console.log(`🚀 ${urls.length} images critiques préchargées`);
    }

    /**
     * Statistiques d'optimisation
     * @returns {Object} Stats des optimisations
     */
    getStats() {
        const allImages = document.querySelectorAll('img');
        const optimizedImages = document.querySelectorAll('img[data-optimized]');
        const lazyImages = document.querySelectorAll('img[data-src]');
        const loadedImages = document.querySelectorAll('img.loaded');
        const pictureElements = document.querySelectorAll('picture');

        return {
            total: allImages.length,
            optimized: optimizedImages.length,
            lazy: lazyImages.length,
            loaded: loadedImages.length,
            modernFormats: pictureElements.length,
            supportedFormats: this.supportedFormats,
            optimizationRate: Math.round((optimizedImages.length / allImages.length) * 100) + '%'
        };
    }

    /**
     * Configuration automatique des images hero
     */
    optimizeHeroImages() {
        const heroImages = document.querySelectorAll('.hero img, .banner img, [class*="hero"] img');
        
        heroImages.forEach(img => {
            // Priorité haute pour images hero
            img.loading = 'eager';
            img.fetchPriority = 'high';
            
            // Précharger si pas encore visible
            if (img.hasAttribute('data-src')) {
                this.loadImage(img);
            }
            
            this.optimizeImage(img);
        });

        console.log(`🎯 ${heroImages.length} images hero optimisées`);
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.imageOptimizer = new ImageOptimizer();
    
    // Optimisation auto des images hero au chargement
    document.addEventListener('DOMContentLoaded', () => {
        window.imageOptimizer.optimizeHeroImages();
    });
    
    // Re-optimiser les images ajoutées dynamiquement
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const newImages = [];
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG') {
                            newImages.push(node);
                        } else {
                            newImages.push(...node.querySelectorAll('img'));
                        }
                    }
                });
                
                if (newImages.length > 0) {
                    setTimeout(() => {
                        newImages.forEach(img => window.imageOptimizer.optimizeImage(img));
                    }, 100);
                }
            }
        });
    });
    
    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}