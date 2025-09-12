/**
 * Category Filters Manager - TechViral
 * Version "Acier" : Ajax + Canonical SEO-safe
 */
class CategoryFiltersManager {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.currentFilters = {};
        this.currentPage = 1;
        this.totalPages = 1;
        this.isLoading = false;
        this.historyEnabled = true;
        this.seoMode = true; // Mode SEO avec canonical URLs
        
        this.init();
    }

    /**
     * Initialise le gestionnaire de filtres
     */
    init() {
        this.setupFilterControls();
        this.setupUrlHandling();
        // this.setupPagination(); // TODO: Implémenter cette méthode
        this.setupSEOOptimizations();
        
        // Charger état initial depuis URL
        this.loadStateFromUrl();
        
        console.log('🔍 Category Filters Manager initialisé');
    }

    /**
     * Configure les contrôles de filtre
     */
    setupFilterControls() {
        // Filtres par catégorie
        document.addEventListener('change', (e) => {
            if (e.target.matches('.filter-checkbox, .filter-select, .filter-radio')) {
                this.handleFilterChange(e.target);
            }
        });

        // Filtres par prix
        document.addEventListener('input', (e) => {
            if (e.target.matches('.price-range-slider')) {
                this.debounce(() => this.handlePriceFilter(e.target), 500)();
            }
        });

        // Tri
        document.addEventListener('change', (e) => {
            if (e.target.matches('.sort-select')) {
                this.handleSortChange(e.target.value);
            }
        });

        // Reset filtres
        document.addEventListener('click', (e) => {
            if (e.target.matches('.reset-filters')) {
                this.resetAllFilters();
            }
        });
    }

    /**
     * Gère changement de filtre
     */
    handleFilterChange(element) {
        const filterType = element.dataset.filterType || element.name;
        const filterValue = element.type === 'checkbox' ? 
            (element.checked ? element.value : null) : 
            element.value;

        if (filterType && filterValue !== null) {
            if (element.type === 'checkbox') {
                this.toggleFilter(filterType, filterValue);
            } else {
                this.setFilter(filterType, filterValue);
            }
        }
    }

    /**
     * Toggle filtre checkbox
     */
    toggleFilter(type, value) {
        if (!this.currentFilters[type]) {
            this.currentFilters[type] = [];
        }

        const index = this.currentFilters[type].indexOf(value);
        if (index > -1) {
            this.currentFilters[type].splice(index, 1);
            if (this.currentFilters[type].length === 0) {
                delete this.currentFilters[type];
            }
        } else {
            this.currentFilters[type].push(value);
        }

        this.applyFilters();
    }

    /**
     * Définit filtre unique
     */
    setFilter(type, value) {
        if (value === '' || value === 'all') {
            delete this.currentFilters[type];
        } else {
            this.currentFilters[type] = value;
        }

        this.applyFilters();
    }

    /**
     * Gère filtre prix
     */
    handlePriceFilter(slider) {
        const minPrice = parseFloat(slider.dataset.min || 0);
        const maxPrice = parseFloat(slider.dataset.max || 1000);
        const currentValue = parseFloat(slider.value);

        this.setFilter('price_max', currentValue === maxPrice ? null : currentValue);
    }

    /**
     * Gère changement tri
     */
    handleSortChange(sortValue) {
        this.setFilter('sort', sortValue === 'default' ? null : sortValue);
    }

    /**
     * Applique les filtres
     */
    async applyFilters() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentPage = 1; // Reset pagination

        try {
            // Mise à jour URL canonical
            this.updateUrl();
            
            // Mise à jour contenu
            await this.loadFilteredContent();
            
            // Mise à jour pagination SEO
            this.updatePaginationSEO();
            
            // Analytics
            this.trackFilterEvent();
            
        } catch (error) {
            console.error('Erreur application filtres:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Charge contenu filtré
     */
    async loadFilteredContent() {
        const url = this.buildApiUrl();
        
        // Afficher loader
        this.showLoadingState();
        
        try {
            // Simulation API call (en production: vraie API)
            const data = await this.mockApiCall(url);
            
            // Mise à jour DOM
            this.updateProductsContainer(data.products);
            this.updateFiltersState(data.filters);
            this.updateResultsCount(data.total);
            
            // Mise à jour pagination
            this.totalPages = data.totalPages;
            this.updatePaginationControls();
            
        } catch (error) {
            this.showErrorState();
            throw error;
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Construction URL API
     */
    buildApiUrl() {
        const params = new URLSearchParams();
        
        // Ajouter filtres
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else {
                params.set(key, value);
            }
        });
        
        // Ajouter pagination
        if (this.currentPage > 1) {
            params.set('page', this.currentPage);
        }
        
        return `/api/products/filter?${params.toString()}`;
    }

    /**
     * Simulation API (à remplacer par vraie API)
     */
    async mockApiCall(url) {
        // Simulation délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simulation réponse API
        const mockProducts = this.generateMockProducts();
        const filteredProducts = this.filterMockProducts(mockProducts);
        
        return {
            products: filteredProducts,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / 12),
            filters: this.getAvailableFilters(mockProducts)
        };
    }

    /**
     * Génère produits mock pour démonstration
     */
    generateMockProducts() {
        const categories = ['electronique', 'ecologique', 'sante', 'maison'];
        const products = [];
        
        for (let i = 1; i <= 48; i++) {
            products.push({
                id: i,
                name: `Produit ${i}`,
                category: categories[i % categories.length],
                price: Math.floor(Math.random() * 200) + 20,
                inStock: Math.random() > 0.2,
                rating: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return products;
    }

    /**
     * Filtre produits mock
     */
    filterMockProducts(products) {
        return products.filter(product => {
            // Filtre catégorie
            if (this.currentFilters.category && 
                !this.currentFilters.category.includes(product.category)) {
                return false;
            }
            
            // Filtre prix
            if (this.currentFilters.price_max && 
                product.price > this.currentFilters.price_max) {
                return false;
            }
            
            // Filtre stock
            if (this.currentFilters.availability === 'in_stock' && !product.inStock) {
                return false;
            }
            
            return true;
        }).sort((a, b) => {
            // Tri
            switch (this.currentFilters.sort) {
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                case 'name_asc': return a.name.localeCompare(b.name);
                case 'rating_desc': return b.rating - a.rating;
                default: return 0;
            }
        });
    }

    /**
     * Met à jour container produits
     */
    updateProductsContainer(products) {
        const container = document.querySelector('.products-grid, .products-container');
        if (!container) return;

        // Animation fade out
        container.style.opacity = '0.5';
        
        setTimeout(() => {
            container.innerHTML = products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}€</p>
                    <span class="category">${product.category}</span>
                    <span class="stock ${product.inStock ? 'in-stock' : 'out-stock'}">
                        ${product.inStock ? 'En stock' : 'Rupture'}
                    </span>
                </div>
            `).join('');
            
            // Animation fade in
            container.style.opacity = '1';
            
            // Lazy load nouvelles images
            if (window.imageOptimizer) {
                window.imageOptimizer.optimizeNewImages('.product-card img');
            }
        }, 200);
    }

    /**
     * Met à jour état des filtres
     */
    updateFiltersState(availableFilters) {
        // Mettre à jour compteurs par catégorie
        Object.entries(availableFilters).forEach(([filterType, options]) => {
            options.forEach(option => {
                const checkbox = document.querySelector(`[data-filter-type="${filterType}"][value="${option.value}"]`);
                if (checkbox) {
                    const label = checkbox.closest('label');
                    const counter = label?.querySelector('.filter-count');
                    if (counter) {
                        counter.textContent = `(${option.count})`;
                    }
                }
            });
        });
    }

    /**
     * Met à jour nombre de résultats
     */
    updateResultsCount(total) {
        const countElements = document.querySelectorAll('.results-count');
        countElements.forEach(el => {
            el.textContent = `${total} produit${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`;
        });
    }

    /**
     * Gestion URL et SEO
     */
    setupUrlHandling() {
        // Gestion navigation navigateur
        window.addEventListener('popstate', (e) => {
            if (e.state) {
                this.currentFilters = e.state.filters || {};
                this.currentPage = e.state.page || 1;
                this.updateUIFromState();
                this.loadFilteredContent();
            }
        });
    }

    /**
     * Met à jour URL sans reload
     */
    updateUrl() {
        if (!this.historyEnabled) return;

        const url = this.buildSeoUrl();
        const state = {
            filters: this.currentFilters,
            page: this.currentPage
        };

        // Mise à jour URL
        if (window.location.href !== url) {
            history.pushState(state, '', url);
        }

        // Mise à jour canonical
        this.updateCanonicalUrl(url);
    }

    /**
     * Construit URL SEO-friendly
     */
    buildSeoUrl() {
        const basePath = window.location.pathname.split('?')[0];
        const params = new URLSearchParams();

        // Convertir filtres en paramètres URL
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else if (value !== null && value !== '') {
                params.set(key, value);
            }
        });

        // Pagination
        if (this.currentPage > 1) {
            params.set('page', this.currentPage);
        }

        const queryString = params.toString();
        return queryString ? `${basePath}?${queryString}` : basePath;
    }

    /**
     * Met à jour URL canonical
     */
    updateCanonicalUrl(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        
        canonical.href = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    }

    /**
     * Charge état depuis URL
     */
    loadStateFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Extraire filtres depuis URL
        this.currentFilters = {};
        this.currentPage = parseInt(urlParams.get('page')) || 1;
        
        for (const [key, value] of urlParams.entries()) {
            if (key === 'page') continue;
            
            if (this.currentFilters[key]) {
                if (!Array.isArray(this.currentFilters[key])) {
                    this.currentFilters[key] = [this.currentFilters[key]];
                }
                this.currentFilters[key].push(value);
            } else {
                this.currentFilters[key] = value;
            }
        }
        
        // Mise à jour UI
        this.updateUIFromState();
    }

    /**
     * Met à jour UI depuis état
     */
    updateUIFromState() {
        // Mise à jour checkboxes et selects
        Object.entries(this.currentFilters).forEach(([type, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    const checkbox = document.querySelector(`[data-filter-type="${type}"][value="${v}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            } else {
                const control = document.querySelector(`[data-filter-type="${type}"], [name="${type}"]`);
                if (control) {
                    if (control.type === 'checkbox') {
                        control.checked = true;
                    } else {
                        control.value = value;
                    }
                }
            }
        });
    }

    /**
     * Optimisations SEO
     */
    setupSEOOptimizations() {
        // Pagination SEO
        if (window.paginationSEO) {
            this.paginationSEO = window.paginationSEO;
        }
        
        // Meta description dynamique
        this.updateMetaDescription();
    }

    /**
     * Met à jour pagination SEO
     */
    updatePaginationSEO() {
        if (this.paginationSEO) {
            this.paginationSEO.init({
                currentPage: this.currentPage,
                totalPages: this.totalPages,
                basePathname: window.location.pathname,
                params: this.currentFilters
            });
        }
    }

    /**
     * Met à jour meta description
     */
    updateMetaDescription() {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) return;

        let description = metaDesc.getAttribute('data-base-content') || metaDesc.content;
        
        // Ajouter info filtres
        const activeFilters = Object.keys(this.currentFilters);
        if (activeFilters.length > 0) {
            description += ` Filtré par: ${activeFilters.join(', ')}.`;
        }
        
        // Ajouter pagination
        if (this.currentPage > 1) {
            description += ` Page ${this.currentPage}.`;
        }
        
        metaDesc.content = description;
    }

    /**
     * États de chargement
     */
    showLoadingState() {
        const container = document.querySelector('.products-container');
        const loader = document.querySelector('.loading-spinner');
        
        if (container) container.style.opacity = '0.6';
        if (loader) loader.style.display = 'block';
    }

    hideLoadingState() {
        const container = document.querySelector('.products-container');
        const loader = document.querySelector('.loading-spinner');
        
        if (container) container.style.opacity = '1';
        if (loader) loader.style.display = 'none';
    }

    showErrorState() {
        const container = document.querySelector('.products-container');
        if (container) {
            container.innerHTML = '<div class="error-state">Erreur lors du chargement. Veuillez réessayer.</div>';
        }
    }

    /**
     * Analytics
     */
    trackFilterEvent() {
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('filter_applied', {
                filters: Object.keys(this.currentFilters),
                filter_count: Object.keys(this.currentFilters).length,
                page: this.currentPage
            });
        }
    }

    /**
     * Reset filtres
     */
    resetAllFilters() {
        this.currentFilters = {};
        this.currentPage = 1;
        
        // Reset UI
        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.filter-select').forEach(select => select.selectedIndex = 0);
        
        this.applyFilters();
    }

    /**
     * Utilitaires
     */
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

    getAvailableFilters(products) {
        // Calculer filtres disponibles basés sur produits
        const filters = {};
        
        // Catégories
        filters.category = [...new Set(products.map(p => p.category))]
            .map(cat => ({
                value: cat,
                count: products.filter(p => p.category === cat).length
            }));
        
        return filters;
    }

    /**
     * API publique
     */
    getState() {
        return {
            filters: this.currentFilters,
            page: this.currentPage,
            totalPages: this.totalPages,
            isLoading: this.isLoading
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.categoryFilters = new CategoryFiltersManager();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CategoryFiltersManager;
}