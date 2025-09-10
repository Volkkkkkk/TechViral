/**
 * Pagination SEO Manager - TechViral
 * Version "Acier" : rel=prev/next + canonical rules
 */
class PaginationSEOManager {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.currentPage = 1;
        this.totalPages = 1;
        this.basePathname = '';
        this.urlParams = new URLSearchParams();
    }

    /**
     * Initialise la pagination SEO
     * @param {Object} config - Configuration pagination
     */
    init(config = {}) {
        this.currentPage = config.currentPage || this.getPageFromUrl();
        this.totalPages = config.totalPages || 1;
        this.basePathname = config.basePathname || window.location.pathname;
        this.urlParams = new URLSearchParams(config.params || window.location.search);
        
        this.updatePaginationMeta();
        this.updateCanonicalUrl();
        
        console.log(`✅ Pagination SEO initialisée: page ${this.currentPage}/${this.totalPages}`);
    }

    /**
     * Récupère le numéro de page depuis l'URL
     * @returns {number} Numéro de page
     */
    getPageFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        return Math.max(1, page);
    }

    /**
     * Met à jour les meta tags de pagination
     */
    updatePaginationMeta() {
        // Supprimer les balises existantes
        this.removePaginationMeta();

        // Page précédente (rel=prev)
        if (this.currentPage > 1) {
            this.addPrevLink();
        }

        // Page suivante (rel=next) 
        if (this.currentPage < this.totalPages) {
            this.addNextLink();
        }
    }

    /**
     * Supprime les meta tags de pagination existants
     */
    removePaginationMeta() {
        const selectors = [
            'link[rel="prev"]',
            'link[rel="next"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => link.remove());
        });
    }

    /**
     * Ajoute le lien vers la page précédente
     */
    addPrevLink() {
        const prevPage = this.currentPage - 1;
        const prevUrl = this.buildPageUrl(prevPage);
        
        const link = document.createElement('link');
        link.rel = 'prev';
        link.href = prevUrl;
        document.head.appendChild(link);
    }

    /**
     * Ajoute le lien vers la page suivante
     */
    addNextLink() {
        const nextPage = this.currentPage + 1;
        const nextUrl = this.buildPageUrl(nextPage);
        
        const link = document.createElement('link');
        link.rel = 'next';
        link.href = nextUrl;
        document.head.appendChild(link);
    }

    /**
     * Construit l'URL d'une page
     * @param {number} pageNumber - Numéro de page
     * @returns {string} URL complète
     */
    buildPageUrl(pageNumber) {
        const params = new URLSearchParams(this.urlParams);
        
        if (pageNumber === 1) {
            // Page 1 : supprimer le paramètre page
            params.delete('page');
        } else {
            // Autres pages : définir le paramètre page
            params.set('page', pageNumber.toString());
        }
        
        const queryString = params.toString();
        const url = `${this.baseUrl}${this.basePathname}${queryString ? '?' + queryString : ''}`;
        
        return url;
    }

    /**
     * Met à jour l'URL canonique
     */
    updateCanonicalUrl() {
        let canonicalUrl;
        
        if (this.currentPage === 1) {
            // Page 1 : URL canonique sans paramètre page
            const params = new URLSearchParams(this.urlParams);
            params.delete('page');
            const queryString = params.toString();
            canonicalUrl = `${this.baseUrl}${this.basePathname}${queryString ? '?' + queryString : ''}`;
        } else {
            // Autres pages : URL canonique avec page
            canonicalUrl = this.buildPageUrl(this.currentPage);
        }

        this.updateCanonical(canonicalUrl);
    }

    /**
     * Met à jour la balise canonical
     * @param {string} url - URL canonique
     */
    updateCanonical(url) {
        let canonical = document.querySelector('link[rel=\"canonical\"]');
        
        if (canonical) {
            canonical.href = url;
        } else {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = url;
            document.head.appendChild(canonical);
        }
    }

    /**
     * Génère la pagination HTML avec SEO
     * @param {Object} config - Configuration d'affichage
     * @returns {string} HTML de pagination
     */
    generatePaginationHTML(config = {}) {
        const {
            container = 'nav',
            containerClass = 'pagination-nav flex justify-center items-center space-x-2 mt-8',
            prevText = '← Précédent',
            nextText = 'Suivant →',
            maxVisible = 5
        } = config;

        if (this.totalPages <= 1) return '';

        let html = `<${container} class=\"${containerClass}\" aria-label=\"Navigation pagination\">`;
        
        // Bouton précédent
        if (this.currentPage > 1) {
            const prevUrl = this.buildPageUrl(this.currentPage - 1);
            html += `<a href=\"${prevUrl}\" class=\"px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-primary hover:text-white transition-colors\" rel=\"prev\">${prevText}</a>`;
        }

        // Numéros de pages
        const startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        const endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

        // Page 1 si pas visible
        if (startPage > 1) {
            const page1Url = this.buildPageUrl(1);
            html += `<a href=\"${page1Url}\" class=\"px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-primary hover:text-white transition-colors\">1</a>`;
            if (startPage > 2) {
                html += `<span class=\"px-2 text-gray-500\">...</span>`;
            }
        }

        // Pages visibles
        for (let i = startPage; i <= endPage; i++) {
            const pageUrl = this.buildPageUrl(i);
            const isActive = i === this.currentPage;
            const activeClass = isActive 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white';
            
            html += `<a href=\"${pageUrl}\" class=\"px-3 py-2 ${activeClass} rounded transition-colors\" ${isActive ? 'aria-current=\"page\"' : ''}>${i}</a>`;
        }

        // Dernière page si pas visible
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                html += `<span class=\"px-2 text-gray-500\">...</span>`;
            }
            const lastPageUrl = this.buildPageUrl(this.totalPages);
            html += `<a href=\"${lastPageUrl}\" class=\"px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-primary hover:text-white transition-colors\">${this.totalPages}</a>`;
        }

        // Bouton suivant
        if (this.currentPage < this.totalPages) {
            const nextUrl = this.buildPageUrl(this.currentPage + 1);
            html += `<a href=\"${nextUrl}\" class=\"px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-primary hover:text-white transition-colors\" rel=\"next\">${nextText}</a>`;
        }

        html += `</${container}>`;
        return html;
    }

    /**
     * Met à jour le titre de la page pour les pages > 1
     * @param {string} baseTitle - Titre de base
     */
    updatePageTitle(baseTitle) {
        if (this.currentPage > 1) {
            document.title = `${baseTitle} - Page ${this.currentPage} sur ${this.totalPages}`;
        } else {
            document.title = baseTitle;
        }
    }

    /**
     * Met à jour la meta description pour les pages > 1
     * @param {string} baseDescription - Description de base
     */
    updatePageDescription(baseDescription) {
        let metaDescription = document.querySelector('meta[name=\"description\"]');
        
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }

        if (this.currentPage > 1) {
            metaDescription.content = `${baseDescription} Page ${this.currentPage} sur ${this.totalPages}.`;
        } else {
            metaDescription.content = baseDescription;
        }
    }

    /**
     * Configuration pour filtres avec pagination
     * @param {Object} filters - Filtres actifs
     */
    setFilters(filters = {}) {
        // Réinitialiser les paramètres URL
        this.urlParams = new URLSearchParams();
        
        // Ajouter les filtres
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '') {
                this.urlParams.set(key, value);
            }
        });
        
        // Réinitialiser à la page 1
        this.currentPage = 1;
        this.updatePaginationMeta();
        this.updateCanonicalUrl();
    }

    /**
     * Templates pour différents types de contenu
     */
    getTemplates() {
        return {
            // Template liste produits
            products: (category, currentPage, totalPages) => ({
                baseTitle: `${category} - Produits Innovants | TechViral`,
                baseDescription: `Découvrez notre sélection ${category.toLowerCase()} : gadgets high-tech, innovations 2025, livraison gratuite.`,
                basePathname: `/pages/categories/${category.toLowerCase()}.html`,
                currentPage: currentPage,
                totalPages: totalPages
            }),

            // Template recherche
            search: (query, currentPage, totalPages) => ({
                baseTitle: `Recherche "${query}" | TechViral`,
                baseDescription: `Résultats de recherche pour "${query}" : produits innovants et gadgets high-tech.`,
                basePathname: '/search.html',
                params: { q: query },
                currentPage: currentPage,
                totalPages: totalPages
            }),

            // Template blog
            blog: (currentPage, totalPages) => ({
                baseTitle: 'Blog Tech & Innovations | TechViral',
                baseDescription: 'Articles sur les dernières innovations technologiques, tests produits et tendances 2025.',
                basePathname: '/pages/blog.html',
                currentPage: currentPage,
                totalPages: totalPages
            })
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.paginationSEO = new PaginationSEOManager();
}

// Auto-initialisation si paramètres détectés
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('page')) {
            // Attendre que les données de pagination soient définies
            setTimeout(() => {
                if (typeof window.paginationConfig !== 'undefined') {
                    window.paginationSEO.init(window.paginationConfig);
                }
            }, 100);
        }
    });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaginationSEOManager;
}