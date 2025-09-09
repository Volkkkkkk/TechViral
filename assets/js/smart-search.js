/**
 * TechViral - Recherche Intelligente avec Autocomplétion
 * Recherche avancée avec suggestions, historique, et filtrage en temps réel
 */

class SmartSearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.popularSearches = [
            'iPhone 15', 'AirPods Pro', 'Apple Watch', 'Samsung Galaxy',
            'drone', 'caméra 4K', 'écouteurs', 'montre connectée',
            'casque VR', 'enceinte bluetooth', 'chargeur sans fil'
        ];
        this.searchCache = new Map();
        this.debounceTimeout = null;
        this.currentResults = [];
        
        this.init();
    }

    init() {
        this.setupSearchInputs();
        this.setupVoiceSearch();
        this.setupKeyboardShortcuts();
        this.loadSearchSuggestions();
    }

    setupSearchInputs() {
        // Global search input
        const globalSearchInput = document.getElementById('globalSearchInput');
        if (globalSearchInput) {
            this.setupSearchInput(globalSearchInput, 'globalSearchSuggestions');
        }

        // Page-specific search inputs
        const pageSearchInputs = document.querySelectorAll('.page-search-input');
        pageSearchInputs.forEach(input => {
            this.setupSearchInput(input, input.dataset.suggestionsId || 'searchSuggestions');
        });
    }

    setupSearchInput(input, suggestionsId) {
        const suggestionsContainer = document.getElementById(suggestionsId);
        
        // Input events
        input.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.handleSearchInput(e.target.value, suggestionsContainer);
            }, 300);
        });

        input.addEventListener('focus', () => {
            this.showSearchSuggestions(suggestionsContainer, input.value);
        });

        input.addEventListener('blur', (e) => {
            setTimeout(() => {
                this.hideSearchSuggestions(suggestionsContainer);
            }, 200);
        });

        // Enter key to search
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(input.value);
            }
            
            // Arrow key navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateSuggestions(suggestionsContainer, e.key === 'ArrowDown' ? 'down' : 'up');
            }
        });
    }

    async handleSearchInput(query, suggestionsContainer) {
        if (query.length < 2) {
            this.showDefaultSuggestions(suggestionsContainer);
            return;
        }

        // Check cache first
        if (this.searchCache.has(query)) {
            const cachedResults = this.searchCache.get(query);
            this.displaySearchSuggestions(suggestionsContainer, cachedResults, query);
            return;
        }

        try {
            const results = await this.fetchSearchSuggestions(query);
            
            // Cache results
            this.searchCache.set(query, results);
            
            this.displaySearchSuggestions(suggestionsContainer, results, query);
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            this.showErrorSuggestions(suggestionsContainer);
        }
    }

    async fetchSearchSuggestions(query) {
        // Simulate API call - in real app, this would call your search API
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = {
                    products: this.mockProductSearch(query),
                    categories: this.mockCategorySearch(query),
                    brands: this.mockBrandSearch(query),
                    suggestions: this.generateSmartSuggestions(query)
                };
                resolve(mockResults);
            }, 100);
        });
    }

    mockProductSearch(query) {
        const mockProducts = [
            { id: 1, name: 'iPhone 15 Pro Max', price: 1299, category: 'Électronique', image: '/assets/images/iphone15.jpg' },
            { id: 2, name: 'AirPods Pro 2', price: 299, category: 'Audio', image: '/assets/images/airpods.jpg' },
            { id: 3, name: 'Apple Watch Ultra 2', price: 899, category: 'Wearables', image: '/assets/images/watch.jpg' },
            { id: 4, name: 'Samsung Galaxy S24', price: 999, category: 'Électronique', image: '/assets/images/samsung.jpg' },
            { id: 5, name: 'Drone DJI Mini 4 Pro', price: 759, category: 'Drones', image: '/assets/images/drone.jpg' }
        ];

        return mockProducts.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
    }

    mockCategorySearch(query) {
        const categories = [
            { name: 'Électronique & Gadgets', count: 156, slug: 'electronique' },
            { name: 'Santé & Bien-être', count: 124, slug: 'sante' },
            { name: 'Maison & Décoration', count: 112, slug: 'maison' },
            { name: 'Mode & Accessoires', count: 68, slug: 'mode' }
        ];

        return categories.filter(cat => 
            cat.name.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 2);
    }

    mockBrandSearch(query) {
        const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Xiaomi', 'Garmin', 'JBL', 'Bose'];
        
        return brands.filter(brand => 
            brand.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 3);
    }

    generateSmartSuggestions(query) {
        const suggestions = [];
        
        // Auto-completion based on popular searches
        this.popularSearches.forEach(search => {
            if (search.toLowerCase().includes(query.toLowerCase()) && search !== query) {
                suggestions.push(search);
            }
        });

        // Related terms
        const relatedTerms = {
            'iphone': ['iphone 15', 'iphone pro', 'iphone case', 'iphone charger'],
            'drone': ['drone camera', 'drone fpv', 'drone mini', 'drone professional'],
            'watch': ['smart watch', 'apple watch', 'fitness watch', 'luxury watch']
        };

        Object.keys(relatedTerms).forEach(key => {
            if (query.toLowerCase().includes(key)) {
                suggestions.push(...relatedTerms[key]);
            }
        });

        return [...new Set(suggestions)].slice(0, 4);
    }

    displaySearchSuggestions(container, results, query) {
        if (!container) return;

        container.innerHTML = '';
        container.classList.remove('hidden');

        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'search-results-container';

        // Products section
        if (results.products && results.products.length > 0) {
            const productsSection = this.createProductsSection(results.products, query);
            suggestionsList.appendChild(productsSection);
        }

        // Categories section
        if (results.categories && results.categories.length > 0) {
            const categoriesSection = this.createCategoriesSection(results.categories);
            suggestionsList.appendChild(categoriesSection);
        }

        // Suggestions section
        if (results.suggestions && results.suggestions.length > 0) {
            const suggestionsSection = this.createSuggestionsSection(results.suggestions);
            suggestionsList.appendChild(suggestionsSection);
        }

        // Quick actions
        const quickActions = this.createQuickActions(query);
        suggestionsList.appendChild(quickActions);

        container.appendChild(suggestionsList);
    }

    createProductsSection(products, query) {
        const section = document.createElement('div');
        section.className = 'search-section';
        
        section.innerHTML = `
            <div class="search-section-header">
                <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    📦 Produits (${products.length})
                </h4>
            </div>
            <div class="space-y-2">
                ${products.map(product => `
                    <div class="search-product-item flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors" 
                         data-product-id="${product.id}">
                        <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                            <span class="text-xs">📱</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                ${this.highlightQuery(product.name, query)}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                ${product.category} • ${product.price}€
                            </div>
                        </div>
                        <div class="ml-2">
                            <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers
        section.querySelectorAll('.search-product-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                this.selectProduct(productId);
            });
        });

        return section;
    }

    createCategoriesSection(categories) {
        const section = document.createElement('div');
        section.className = 'search-section border-t border-gray-200 dark:border-gray-600 pt-3 mt-3';
        
        section.innerHTML = `
            <div class="search-section-header">
                <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    📂 Catégories
                </h4>
            </div>
            <div class="space-y-1">
                ${categories.map(category => `
                    <div class="search-category-item flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                         data-category="${category.slug}">
                        <span class="text-sm text-gray-700 dark:text-gray-300">${category.name}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">
                            ${category.count}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers
        section.querySelectorAll('.search-category-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.dataset.category;
                this.navigateToCategory(category);
            });
        });

        return section;
    }

    createSuggestionsSection(suggestions) {
        const section = document.createElement('div');
        section.className = 'search-section border-t border-gray-200 dark:border-gray-600 pt-3 mt-3';
        
        section.innerHTML = `
            <div class="search-section-header">
                <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    💡 Suggestions
                </h4>
            </div>
            <div class="flex flex-wrap gap-2">
                ${suggestions.map(suggestion => `
                    <span class="search-suggestion-tag px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        ${suggestion}
                    </span>
                `).join('')}
            </div>
        `;

        // Add click handlers
        section.querySelectorAll('.search-suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.performSearch(tag.textContent.trim());
            });
        });

        return section;
    }

    createQuickActions(query) {
        const section = document.createElement('div');
        section.className = 'search-section border-t border-gray-200 dark:border-gray-600 pt-3 mt-3';
        
        section.innerHTML = `
            <div class="flex items-center justify-between">
                <button class="search-all-btn flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                        data-query="${query}">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                    </svg>
                    Rechercher "${query}"
                </button>
                
                <div class="flex items-center space-x-2">
                    <button class="voice-search-btn p-1 text-gray-400 hover:text-primary transition-colors" title="Recherche vocale">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z"/>
                            <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z"/>
                        </svg>
                    </button>
                    
                    <button class="clear-search-btn p-1 text-gray-400 hover:text-red-500 transition-colors" title="Effacer">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add click handlers
        const searchAllBtn = section.querySelector('.search-all-btn');
        searchAllBtn?.addEventListener('click', () => {
            this.performSearch(query);
        });

        const voiceSearchBtn = section.querySelector('.voice-search-btn');
        voiceSearchBtn?.addEventListener('click', () => {
            this.startVoiceSearch();
        });

        const clearSearchBtn = section.querySelector('.clear-search-btn');
        clearSearchBtn?.addEventListener('click', () => {
            this.clearSearch();
        });

        return section;
    }

    highlightQuery(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
    }

    showDefaultSuggestions(container) {
        if (!container) return;

        const defaultSuggestions = {
            popular: this.popularSearches.slice(0, 4),
            history: this.searchHistory.slice(0, 3),
            trending: ['🔥 iPhone 15', '⚡ Drone 4K', '🎧 AirPods Pro', '⌚ Apple Watch']
        };

        container.innerHTML = `
            <div class="p-4">
                ${this.searchHistory.length > 0 ? `
                    <div class="mb-4">
                        <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            🕒 Recherches récentes
                        </h4>
                        <div class="flex flex-wrap gap-2">
                            ${defaultSuggestions.history.map(term => `
                                <span class="search-history-item px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors group">
                                    ${term}
                                    <button class="ml-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700">×</button>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="mb-4">
                    <h4 class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        🔥 Tendances
                    </h4>
                    <div class="flex flex-wrap gap-2">
                        ${defaultSuggestions.trending.map(term => `
                            <span class="trending-search px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-sm text-red-700 dark:text-red-300 rounded-full cursor-pointer hover:from-red-200 hover:to-pink-200 transition-colors">
                                ${term}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.classList.remove('hidden');

        // Add event listeners
        container.querySelectorAll('.search-history-item, .trending-search').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') {
                    // Remove from history
                    const term = item.textContent.replace('×', '').trim();
                    this.removeFromHistory(term);
                    item.remove();
                } else {
                    const term = item.textContent.replace('×', '').trim();
                    this.performSearch(term);
                }
            });
        });
    }

    showSearchSuggestions(container, query = '') {
        if (query.length >= 2) {
            this.handleSearchInput(query, container);
        } else {
            this.showDefaultSuggestions(container);
        }
    }

    hideSearchSuggestions(container) {
        if (container) {
            container.classList.add('hidden');
        }
    }

    navigateSuggestions(container, direction) {
        // Implementation for keyboard navigation through suggestions
        const items = container.querySelectorAll('[data-selectable]');
        let currentIndex = -1;
        
        items.forEach((item, index) => {
            if (item.classList.contains('selected')) {
                currentIndex = index;
            }
            item.classList.remove('selected');
        });

        if (direction === 'down') {
            currentIndex = (currentIndex + 1) % items.length;
        } else {
            currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        }

        if (items[currentIndex]) {
            items[currentIndex].classList.add('selected');
            items[currentIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    setupVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.log('Voice search not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'fr-FR';

        this.recognition.onresult = (event) => {
            const query = event.results[0][0].transcript;
            this.performSearch(query);
        };

        this.recognition.onerror = (event) => {
            console.error('Voice search error:', event.error);
        };
    }

    startVoiceSearch() {
        if (this.recognition) {
            this.recognition.start();
            
            // Visual feedback
            document.querySelectorAll('.voice-search-btn').forEach(btn => {
                btn.classList.add('text-red-500', 'animate-pulse');
                btn.title = 'Écoute en cours...';
            });

            this.recognition.onend = () => {
                document.querySelectorAll('.voice-search-btn').forEach(btn => {
                    btn.classList.remove('text-red-500', 'animate-pulse');
                    btn.title = 'Recherche vocale';
                });
            };
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearchInput');
                if (searchInput) {
                    searchInput.focus();
                    // Show global search if hidden
                    const globalSearch = document.getElementById('globalSearch');
                    if (globalSearch?.classList.contains('hidden')) {
                        globalSearch.classList.remove('hidden');
                    }
                }
            }

            // Escape to close search
            if (e.key === 'Escape') {
                this.clearSearch();
            }
        });
    }

    performSearch(query) {
        if (!query || query.trim() === '') return;

        // Add to search history
        this.addToHistory(query.trim());

        // Hide suggestions
        document.querySelectorAll('[id*="suggestions"]').forEach(container => {
            container.classList.add('hidden');
        });

        // Update search input
        const searchInputs = document.querySelectorAll('#globalSearchInput, .page-search-input');
        searchInputs.forEach(input => {
            input.value = query;
        });

        // Perform actual search
        if (window.advancedFilters) {
            // Use filters system if available
            window.advancedFilters.searchQuery = query;
            window.advancedFilters.applyFilters();
        } else {
            // Fallback: redirect to search results page
            window.location.href = `/pages/search.html?q=${encodeURIComponent(query)}`;
        }

        // Analytics
        this.trackSearch(query);
    }

    selectProduct(productId) {
        window.location.href = `/pages/products/product-${productId}.html`;
    }

    navigateToCategory(categorySlug) {
        window.location.href = `/pages/categories/${categorySlug}.html`;
    }

    clearSearch() {
        const searchInputs = document.querySelectorAll('#globalSearchInput, .page-search-input');
        searchInputs.forEach(input => {
            input.value = '';
        });

        document.querySelectorAll('[id*="suggestions"]').forEach(container => {
            container.classList.add('hidden');
        });

        // Hide global search bar
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.classList.add('hidden');
        }
    }

    addToHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(term => term !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(term => term !== query);
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    trackSearch(query) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: query
            });
        }
        
        console.log('Search performed:', query);
    }

    loadSearchSuggestions() {
        // Load popular searches from API or cache
        // This would typically fetch from your backend
        console.log('Smart search initialized with', this.popularSearches.length, 'popular searches');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smartSearch = new SmartSearch();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartSearch;
}