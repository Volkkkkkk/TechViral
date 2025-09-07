/**
 * TechViral - Search System
 * Système de recherche intelligent pour tous les produits
 */

class SearchManager {
    constructor() {
        this.products = [
            // Produits de l'accueil
            { name: 'Caméra POV Portable 4K', category: 'electronique', price: 89, page: 'index.html', description: 'Ultra-légère étanche 4K 60fps' },
            { name: 'Drone en Mousse RC', category: 'electronique', price: 149, page: 'index.html', description: 'Ultra-léger sécurisé parfait pour débuter' },
            { name: 'Bouteille Hydrogène H₂', category: 'sante', price: 199, page: 'index.html', description: 'Antioxydant portable rechargeable' },
            { name: 'Casquette Cryothérapie', category: 'sante', price: 69, page: 'index.html', description: 'Anti-migraine soulagement naturel réutilisable' },
            { name: 'Théière Verre à Bouton', category: 'lifestyle', price: 45, page: 'index.html', description: 'Théière borosilicate avec filtre intégré' },
            { name: 'Mug Auto-Mélangeur', category: 'lifestyle', price: 39, page: 'index.html', description: 'Mélangeur automatique portable inox' },

            // Produits Santé
            { name: 'Sérum Bakuchiol Anti-Âge', category: 'sante', price: 89, page: 'pages/categories/sante.html', description: 'Sérum anti-âge naturel bakuchiol' },
            { name: 'Compléments ADHD Focus', category: 'sante', price: 149, page: 'pages/categories/sante.html', description: 'Nootropiques concentration ADHD' },
            { name: 'Séparateurs Orteils YogaMedic', category: 'sante', price: 25, page: 'pages/categories/sante.html', description: 'Correcteurs posture pieds yoga' },
            { name: 'Chocolat Champignons Adaptogènes', category: 'sante', price: 79, page: 'pages/categories/sante.html', description: 'Chocolat fonctionnel champignons adaptogènes' },

            // Produits Écologiques
            { name: 'Cotons Démaquillants Réutilisables', category: 'ecologique', price: 25, page: 'pages/categories/ecologique.html', description: 'Cotons lavables bambou écologiques' },
            { name: 'Gourde Isotherme Inox', category: 'ecologique', price: 35, page: 'pages/categories/ecologique.html', description: 'Bouteille inox isolation thermique' },
            { name: 'Set Ustensiles Bambou', category: 'ecologique', price: 28, page: 'pages/categories/ecologique.html', description: 'Kit ustensiles bambou portable' },
            { name: 'Savon Solide Bio', category: 'ecologique', price: 23, page: 'pages/categories/ecologique.html', description: 'Savon artisanal bio zéro déchet' },

            // Produits Électronique
            { name: 'Enceintes Bluetooth Portable', category: 'electronique', price: 79, page: 'pages/categories/electronique.html', description: 'Enceinte Bluetooth son stéréo' },
            { name: 'Montre Intelligente Pro', category: 'electronique', price: 199, page: 'pages/categories/electronique.html', description: 'Smartwatch santé GPS fitness' },
            { name: 'Casque Gaming RGB', category: 'electronique', price: 89, page: 'pages/categories/electronique.html', description: 'Casque gaming RGB surround 7.1' },
            { name: 'Chargeur Rapide 65W', category: 'electronique', price: 45, page: 'pages/categories/electronique.html', description: 'Chargeur USB-C rapide universel' },

            // Produits Animaux
            { name: 'Collier GPS Intelligent', category: 'animaux', price: 90, page: 'pages/categories/animaux.html', description: 'Collier GPS tracker chien chat' },
            { name: 'Arbre à Chat Intelligent', category: 'animaux', price: 189, page: 'pages/categories/animaux.html', description: 'Arbre chat connecté jouets intégrés' },
            { name: 'Fontaine Eau Connectée', category: 'animaux', price: 69, page: 'pages/categories/animaux.html', description: 'Fontaine eau filtrée connectée' },
            { name: 'Brosse Anti-Poils Électrique', category: 'animaux', price: 59, page: 'pages/categories/animaux.html', description: 'Brosse électrique anti-poils massage' },

            // Produits Lifestyle
            { name: 'Lampe Connectée Minimaliste', category: 'lifestyle', price: 129, page: 'pages/categories/lifestyle.html', description: 'Lampe design connectée 16M couleurs' },
            { name: 'Miroir Intelligent Touch', category: 'lifestyle', price: 349, page: 'pages/categories/lifestyle.html', description: 'Miroir tactile météo actualités LED' },
            { name: 'Diffuseur Arômes Premium', category: 'lifestyle', price: 89, page: 'pages/categories/lifestyle.html', description: 'Diffuseur design japonais ultrasons' },
            { name: 'Cadre Photo 4K Premium', category: 'lifestyle', price: 259, page: 'pages/categories/lifestyle.html', description: 'Cadre photo numérique 4K partage' }
        ];

        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.init();
    }

    init() {
        this.bindSearchEvents();
        console.log('Search Manager initialized 🔍');
    }

    bindSearchEvents() {
        // Événements pour toutes les barres de recherche
        document.addEventListener('DOMContentLoaded', () => {
            const searchInputs = document.querySelectorAll('#searchInput, .search-input, [placeholder*="rechercher"], [placeholder*="Rechercher"]');
            
            searchInputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    this.handleSearch(e.target.value);
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.performSearch(e.target.value);
                    }
                });

                // Autocomplete au focus
                input.addEventListener('focus', () => {
                    this.showSearchSuggestions(input);
                });
            });

            // Boutons de recherche
            const searchButtons = document.querySelectorAll('.search-btn, [aria-label*="search"], [aria-label*="Search"]');
            searchButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const input = btn.parentElement.querySelector('input') || 
                                 btn.previousElementSibling || 
                                 document.querySelector('#searchInput');
                    if (input) {
                        this.performSearch(input.value);
                    }
                });
            });
        });
    }

    handleSearch(query) {
        if (!query || query.length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchProducts(query);
        this.showSearchResults(results, query);
    }

    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        return this.products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }).sort((a, b) => {
            // Priorité : nom exact > nom contient > description contient
            const aNameExact = a.name.toLowerCase() === searchTerm;
            const bNameExact = b.name.toLowerCase() === searchTerm;
            if (aNameExact && !bNameExact) return -1;
            if (!aNameExact && bNameExact) return 1;

            const aNameIncludes = a.name.toLowerCase().includes(searchTerm);
            const bNameIncludes = b.name.toLowerCase().includes(searchTerm);
            if (aNameIncludes && !bNameIncludes) return -1;
            if (!aNameIncludes && bNameIncludes) return 1;

            return 0;
        }).slice(0, 8); // Limite à 8 résultats
    }

    showSearchResults(results, query) {
        this.removeExistingResults();

        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        const resultsContainer = this.createResultsContainer();
        const resultsHTML = this.generateResultsHTML(results, query);
        resultsContainer.innerHTML = resultsHTML;

        document.body.appendChild(resultsContainer);
        this.bindResultEvents(resultsContainer);
    }

    createResultsContainer() {
        const container = document.createElement('div');
        container.id = 'searchResults';
        container.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-600 max-h-96 overflow-y-auto';
        return container;
    }

    generateResultsHTML(results, query) {
        const header = `
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="font-semibold text-gray-800 dark:text-white">
                    ${results.length} résultat${results.length > 1 ? 's' : ''} pour "${query}"
                </h3>
                <button class="close-search p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        const resultItems = results.map(product => `
            <div class="search-item p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 cursor-pointer transition-colors" 
                 data-page="${product.page}" data-product="${product.name}">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span class="text-white text-lg">${this.getCategoryIcon(product.category)}</span>
                    </div>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-800 dark:text-white">${this.highlightQuery(product.name, query)}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300">${this.highlightQuery(product.description, query)}</p>
                        <div class="flex items-center mt-1 space-x-2">
                            <span class="text-sm font-bold text-blue-600">${product.price}€</span>
                            <span class="text-xs bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full">${this.getCategoryName(product.category)}</span>
                        </div>
                    </div>
                    <div class="flex items-center text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `).join('');

        return header + '<div class="py-2">' + resultItems + '</div>';
    }

    showNoResults(query) {
        const container = this.createResultsContainer();
        container.innerHTML = `
            <div class="p-6 text-center">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Aucun résultat trouvé</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">Aucun produit ne correspond à "${query}"</p>
                <div class="space-y-2">
                    <p class="text-sm text-gray-500">Suggestions :</p>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <button class="suggestion-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors" data-query="caméra">caméra</button>
                        <button class="suggestion-btn px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors" data-query="santé">santé</button>
                        <button class="suggestion-btn px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors" data-query="connecté">connecté</button>
                        <button class="suggestion-btn px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors" data-query="écologique">écologique</button>
                    </div>
                </div>
                <button class="close-search mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Fermer
                </button>
            </div>
        `;
        document.body.appendChild(container);
        this.bindResultEvents(container);
    }

    bindResultEvents(container) {
        // Fermer les résultats
        container.querySelector('.close-search').addEventListener('click', () => {
            this.hideSearchResults();
        });

        // Clic sur un résultat
        container.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                const product = item.dataset.product;
                this.addToSearchHistory(product);
                
                if (page === window.location.pathname.split('/').pop() || page === 'index.html' && window.location.pathname === '/') {
                    // Même page - highlight le produit
                    this.highlightProduct(product);
                } else {
                    // Autre page - naviguer
                    window.location.href = page;
                }
                
                this.hideSearchResults();
            });
        });

        // Suggestions
        container.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                const searchInput = document.querySelector('#searchInput');
                if (searchInput) {
                    searchInput.value = query;
                    this.handleSearch(query);
                }
            });
        });

        // Fermer en cliquant à l'extérieur
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target) && !e.target.closest('.search-input, #searchInput')) {
                    this.hideSearchResults();
                }
            }, { once: true });
        }, 100);
    }

    highlightProduct(productName) {
        // Chercher le produit sur la page actuelle et le mettre en évidence
        const productCards = document.querySelectorAll('.product-card, .bg-white');
        productCards.forEach(card => {
            const title = card.querySelector('h3, h2, h1');
            if (title && title.textContent.includes(productName)) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50');
                setTimeout(() => {
                    card.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50');
                }, 3000);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        this.addToSearchHistory(query);
        
        // Si pas de résultats exacts, rediriger vers page de catégorie
        const results = this.searchProducts(query);
        if (results.length === 0) {
            this.showNoResults(query);
        } else {
            // Rediriger vers la page du premier résultat
            const firstResult = results[0];
            if (firstResult.page !== window.location.pathname.split('/').pop()) {
                window.location.href = firstResult.page + '?search=' + encodeURIComponent(query);
            }
        }
    }

    showSearchSuggestions(input) {
        if (this.searchHistory.length === 0) return;

        const suggestions = this.searchHistory.slice(-5).reverse();
        // Créer un dropdown avec l'historique
        this.createSuggestionsDropdown(input, suggestions);
    }

    createSuggestionsDropdown(input, suggestions) {
        const existing = document.querySelector('.search-suggestions');
        if (existing) existing.remove();

        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-b-lg shadow-lg z-50 mt-1';
        
        dropdown.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300">${suggestion}</span>
                </div>
            </div>
        `).join('');

        const inputParent = input.parentElement;
        if (inputParent.style.position !== 'relative') {
            inputParent.style.position = 'relative';
        }
        inputParent.appendChild(dropdown);

        // Bind events
        dropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const query = item.textContent.trim();
                input.value = query;
                this.handleSearch(query);
                dropdown.remove();
            });
        });

        // Supprimer au clic extérieur
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target !== input) {
                    dropdown.remove();
                }
            }, { once: true });
        }, 100);
    }

    removeExistingResults() {
        const existing = document.querySelector('#searchResults');
        if (existing) existing.remove();
    }

    hideSearchResults() {
        this.removeExistingResults();
    }

    addToSearchHistory(query) {
        const cleanQuery = query.trim();
        if (!cleanQuery || this.searchHistory.includes(cleanQuery)) return;

        this.searchHistory.unshift(cleanQuery);
        this.searchHistory = this.searchHistory.slice(0, 10); // Garder seulement 10
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    getCategoryIcon(category) {
        const icons = {
            'electronique': '📱',
            'sante': '💊',
            'ecologique': '🌿',
            'animaux': '🐾',
            'lifestyle': '✨'
        };
        return icons[category] || '🔍';
    }

    getCategoryName(category) {
        const names = {
            'electronique': 'Électronique',
            'sante': 'Santé',
            'ecologique': 'Écologique',
            'animaux': 'Animaux',
            'lifestyle': 'Lifestyle'
        };
        return names[category] || 'Produit';
    }

    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1">$1</mark>');
    }
}

// Initialiser le gestionnaire de recherche globalement
window.searchManager = new SearchManager();

console.log('Search system loaded ✅');