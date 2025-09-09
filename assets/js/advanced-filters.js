/**
 * TechViral - Système de Filtres Avancés
 * Filtrage intelligent multi-critères avec URL sync
 */

class AdvancedFilters {
    constructor() {
        this.filters = {
            category: [],
            priceRange: { min: 0, max: 1000 },
            brand: [],
            rating: 0,
            availability: 'all', // all, in_stock, out_of_stock
            sortBy: 'relevance', // relevance, price_low, price_high, rating, newest
            tags: [] // viral, nouveau, promo, eco
        };
        
        this.products = [];
        this.filteredProducts = [];
        this.totalProducts = 0;
        
        this.init();
    }

    init() {
        this.loadFiltersFromURL();
        this.setupFilterControls();
        this.setupPriceSlider();
        this.setupSortControls();
        this.loadProducts();
        
        // Listen for URL changes
        window.addEventListener('popstate', () => {
            this.loadFiltersFromURL();
            this.applyFilters();
        });
    }

    // Load products from current page or API
    async loadProducts() {
        try {
            // For now, extract products from current page
            const productCards = document.querySelectorAll('.product-card');
            this.products = Array.from(productCards).map(card => this.extractProductData(card));
            this.totalProducts = this.products.length;
            this.applyFilters();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    extractProductData(card) {
        const titleEl = card.querySelector('h3, .product-title');
        const priceEl = card.querySelector('.price, [class*="price"]');
        const imageEl = card.querySelector('img');
        const ratingEl = card.querySelector('.rating, [class*="rating"]');
        
        return {
            id: card.dataset.productId || Math.random().toString(36).substr(2, 9),
            title: titleEl?.textContent?.trim() || 'Produit',
            price: this.extractPrice(priceEl?.textContent || '0'),
            image: imageEl?.src || '',
            rating: this.extractRating(ratingEl),
            category: card.dataset.category || 'general',
            brand: card.dataset.brand || 'Generic',
            availability: card.dataset.availability || 'in_stock',
            tags: (card.dataset.tags || '').split(',').filter(t => t.trim()),
            element: card
        };
    }

    extractPrice(priceText) {
        const match = priceText.match(/(\d+(?:[.,]\d+)?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : 0;
    }

    extractRating(ratingEl) {
        if (!ratingEl) return 0;
        const stars = ratingEl.querySelectorAll('.star-filled, [class*="star"][class*="fill"]');
        return stars.length;
    }

    // Filter Controls Setup
    setupFilterControls() {
        // Category checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.matches('.filter-category')) {
                this.updateCategoryFilter(e.target);
            }
            if (e.target.matches('.filter-brand')) {
                this.updateBrandFilter(e.target);
            }
            if (e.target.matches('.filter-availability')) {
                this.updateAvailabilityFilter(e.target);
            }
            if (e.target.matches('.filter-rating')) {
                this.updateRatingFilter(e.target);
            }
        });

        // Clear filters button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.clear-filters')) {
                this.clearAllFilters();
            }
        });
    }

    setupPriceSlider() {
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        
        if (minPriceInput && maxPriceInput) {
            minPriceInput.addEventListener('input', () => {
                this.filters.priceRange.min = parseInt(minPriceInput.value);
                this.applyFilters();
                this.updateURL();
            });
            
            maxPriceInput.addEventListener('input', () => {
                this.filters.priceRange.max = parseInt(maxPriceInput.value);
                this.applyFilters();
                this.updateURL();
            });
        }
    }

    setupSortControls() {
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
                this.updateURL();
            });
        }
    }

    // Filter Update Methods
    updateCategoryFilter(checkbox) {
        const category = checkbox.value;
        if (checkbox.checked) {
            if (!this.filters.category.includes(category)) {
                this.filters.category.push(category);
            }
        } else {
            this.filters.category = this.filters.category.filter(c => c !== category);
        }
        this.applyFilters();
        this.updateURL();
    }

    updateBrandFilter(checkbox) {
        const brand = checkbox.value;
        if (checkbox.checked) {
            if (!this.filters.brand.includes(brand)) {
                this.filters.brand.push(brand);
            }
        } else {
            this.filters.brand = this.filters.brand.filter(b => b !== brand);
        }
        this.applyFilters();
        this.updateURL();
    }

    updateAvailabilityFilter(radio) {
        this.filters.availability = radio.value;
        this.applyFilters();
        this.updateURL();
    }

    updateRatingFilter(select) {
        this.filters.rating = parseInt(select.value);
        this.applyFilters();
        this.updateURL();
    }

    // Apply all active filters
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            return this.passesAllFilters(product);
        });

        this.sortProducts();
        this.displayProducts();
        this.updateFilterStats();
    }

    passesAllFilters(product) {
        // Category filter
        if (this.filters.category.length > 0) {
            if (!this.filters.category.includes(product.category)) {
                return false;
            }
        }

        // Price range filter
        if (product.price < this.filters.priceRange.min || 
            product.price > this.filters.priceRange.max) {
            return false;
        }

        // Brand filter
        if (this.filters.brand.length > 0) {
            if (!this.filters.brand.includes(product.brand)) {
                return false;
            }
        }

        // Rating filter
        if (product.rating < this.filters.rating) {
            return false;
        }

        // Availability filter
        if (this.filters.availability !== 'all') {
            if (product.availability !== this.filters.availability) {
                return false;
            }
        }

        return true;
    }

    sortProducts() {
        switch (this.filters.sortBy) {
            case 'price_low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // Assume newer products have higher IDs or use date if available
                this.filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
                break;
            default:
                // Keep original order for relevance
                break;
        }
    }

    displayProducts() {
        const productsContainer = document.querySelector('.products-grid, .product-list');
        if (!productsContainer) return;

        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
        });

        // Show filtered products
        this.filteredProducts.forEach((product, index) => {
            product.element.style.display = 'block';
            product.element.style.order = index;
            
            // Add animation
            product.element.style.opacity = '0';
            setTimeout(() => {
                product.element.style.opacity = '1';
            }, index * 50);
        });

        // Update no results message
        this.updateNoResultsMessage();
    }

    updateNoResultsMessage() {
        let noResultsEl = document.querySelector('.no-results-message');
        
        if (this.filteredProducts.length === 0) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.className = 'no-results-message col-span-full text-center py-12';
                noResultsEl.innerHTML = `
                    <div class="max-w-md mx-auto">
                        <div class="text-6xl mb-4">🔍</div>
                        <h3 class="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                        <p class="text-gray-600 dark:text-gray-400 mb-4">
                            Essayez d'ajuster vos filtres pour voir plus de résultats
                        </p>
                        <button class="clear-filters bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                            Effacer les filtres
                        </button>
                    </div>
                `;
                
                const productsContainer = document.querySelector('.products-grid, .product-list');
                if (productsContainer) {
                    productsContainer.appendChild(noResultsEl);
                }
            }
            noResultsEl.style.display = 'block';
        } else if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    }

    updateFilterStats() {
        const statsEl = document.querySelector('.filter-stats');
        if (statsEl) {
            statsEl.textContent = `${this.filteredProducts.length} sur ${this.totalProducts} produits`;
        }

        // Update active filter badges
        this.updateActiveFilterBadges();
    }

    updateActiveFilterBadges() {
        const badgesContainer = document.querySelector('.active-filters');
        if (!badgesContainer) return;

        badgesContainer.innerHTML = '';

        // Category badges
        this.filters.category.forEach(category => {
            this.addFilterBadge(badgesContainer, 'category', category, category);
        });

        // Brand badges
        this.filters.brand.forEach(brand => {
            this.addFilterBadge(badgesContainer, 'brand', brand, brand);
        });

        // Price range badge
        if (this.filters.priceRange.min > 0 || this.filters.priceRange.max < 1000) {
            const label = `${this.filters.priceRange.min}€ - ${this.filters.priceRange.max}€`;
            this.addFilterBadge(badgesContainer, 'price', 'price', label);
        }

        // Rating badge
        if (this.filters.rating > 0) {
            const label = `${this.filters.rating}+ étoiles`;
            this.addFilterBadge(badgesContainer, 'rating', this.filters.rating, label);
        }
    }

    addFilterBadge(container, type, value, label) {
        const badge = document.createElement('span');
        badge.className = 'inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm';
        badge.innerHTML = `
            ${label}
            <button class="remove-filter text-primary/60 hover:text-primary" data-type="${type}" data-value="${value}">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                </svg>
            </button>
        `;
        
        badge.querySelector('.remove-filter').addEventListener('click', () => {
            this.removeFilter(type, value);
        });
        
        container.appendChild(badge);
    }

    removeFilter(type, value) {
        switch (type) {
            case 'category':
                this.filters.category = this.filters.category.filter(c => c !== value);
                break;
            case 'brand':
                this.filters.brand = this.filters.brand.filter(b => b !== value);
                break;
            case 'price':
                this.filters.priceRange = { min: 0, max: 1000 };
                break;
            case 'rating':
                this.filters.rating = 0;
                break;
        }
        
        this.applyFilters();
        this.updateURL();
        this.syncFormControls();
    }

    clearAllFilters() {
        this.filters = {
            category: [],
            priceRange: { min: 0, max: 1000 },
            brand: [],
            rating: 0,
            availability: 'all',
            sortBy: 'relevance',
            tags: []
        };
        
        this.applyFilters();
        this.updateURL();
        this.syncFormControls();
    }

    syncFormControls() {
        // Sync checkboxes
        document.querySelectorAll('.filter-category').forEach(cb => {
            cb.checked = this.filters.category.includes(cb.value);
        });
        
        document.querySelectorAll('.filter-brand').forEach(cb => {
            cb.checked = this.filters.brand.includes(cb.value);
        });
        
        // Sync price inputs
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        if (minPriceInput) minPriceInput.value = this.filters.priceRange.min;
        if (maxPriceInput) maxPriceInput.value = this.filters.priceRange.max;
        
        // Sync sort select
        const sortSelect = document.getElementById('sortBy');
        if (sortSelect) sortSelect.value = this.filters.sortBy;
    }

    // URL Management
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.filters.category.length) {
            params.set('categories', this.filters.category.join(','));
        }
        if (this.filters.brand.length) {
            params.set('brands', this.filters.brand.join(','));
        }
        if (this.filters.priceRange.min > 0 || this.filters.priceRange.max < 1000) {
            params.set('price', `${this.filters.priceRange.min}-${this.filters.priceRange.max}`);
        }
        if (this.filters.rating > 0) {
            params.set('rating', this.filters.rating);
        }
        if (this.filters.availability !== 'all') {
            params.set('availability', this.filters.availability);
        }
        if (this.filters.sortBy !== 'relevance') {
            params.set('sort', this.filters.sortBy);
        }
        
        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        history.replaceState(null, '', newURL);
    }

    loadFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Reset filters
        this.filters = {
            category: [],
            priceRange: { min: 0, max: 1000 },
            brand: [],
            rating: 0,
            availability: 'all',
            sortBy: 'relevance',
            tags: []
        };
        
        // Load from URL
        if (params.has('categories')) {
            this.filters.category = params.get('categories').split(',');
        }
        if (params.has('brands')) {
            this.filters.brand = params.get('brands').split(',');
        }
        if (params.has('price')) {
            const [min, max] = params.get('price').split('-').map(Number);
            this.filters.priceRange = { min: min || 0, max: max || 1000 };
        }
        if (params.has('rating')) {
            this.filters.rating = parseInt(params.get('rating'));
        }
        if (params.has('availability')) {
            this.filters.availability = params.get('availability');
        }
        if (params.has('sort')) {
            this.filters.sortBy = params.get('sort');
        }
        
        this.syncFormControls();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.product-card')) {
        window.advancedFilters = new AdvancedFilters();
    }
});