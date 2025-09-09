// TechViral AI Recommendations Engine v1.0
// Système de recommandation intelligent basé sur comportement utilisateur

class AIRecommendationEngine {
    constructor() {
        this.userBehavior = this.loadUserBehavior();
        this.productData = new Map();
        this.recommendations = new Map();
        this.initialized = false;
        
        this.init();
    }

    async init() {
        await this.loadProductData();
        this.trackUserBehavior();
        this.startRecommendationEngine();
        this.initialized = true;
        console.log('🤖 AI Recommendations Engine initialized');
    }

    // Chargement des données produits avec enrichissement IA
    async loadProductData() {
        try {
            const response = await fetch('/data/products.json');
            const products = await response.json();
            
            products.forEach(product => {
                this.productData.set(product.id, {
                    ...product,
                    aiScore: this.calculateAIScore(product),
                    categories: this.extractCategories(product),
                    features: this.extractFeatures(product),
                    sentiment: this.analyzeSentiment(product)
                });
            });
        } catch (error) {
            console.error('Error loading product data:', error);
        }
    }

    // Calcul du score IA pour chaque produit
    calculateAIScore(product) {
        const factors = {
            popularity: product.views || 0,
            rating: product.rating || 0,
            reviews: product.reviews?.length || 0,
            price: this.getPriceScore(product.price),
            availability: product.stock > 0 ? 1 : 0.1
        };

        const weights = {
            popularity: 0.3,
            rating: 0.25,
            reviews: 0.2,
            price: 0.15,
            availability: 0.1
        };

        return Object.entries(factors).reduce((score, [key, value]) => {
            return score + (value * weights[key]);
        }, 0);
    }

    // Suivi comportement utilisateur
    trackUserBehavior() {
        // Vues de produits
        document.addEventListener('product-view', (e) => {
            this.recordBehavior('view', e.detail.productId);
        });

        // Ajouts au panier
        document.addEventListener('cart-add', (e) => {
            this.recordBehavior('cart_add', e.detail.productId, 3);
        });

        // Favoris
        document.addEventListener('wishlist-add', (e) => {
            this.recordBehavior('wishlist', e.detail.productId, 2);
        });

        // Temps passé sur produit
        this.trackTimeOnProduct();
    }

    recordBehavior(action, productId, weight = 1) {
        const timestamp = Date.now();
        const sessionId = this.getSessionId();

        if (!this.userBehavior[sessionId]) {
            this.userBehavior[sessionId] = [];
        }

        this.userBehavior[sessionId].push({
            action,
            productId,
            weight,
            timestamp
        });

        this.saveUserBehavior();
        this.updateRecommendations(productId, action, weight);
    }

    // Génération des recommandations personnalisées
    async generatePersonalizedRecommendations(userId = 'anonymous') {
        const userHistory = this.getUserHistory(userId);
        const preferences = this.extractPreferences(userHistory);
        
        const recommendations = [];

        // 1. Recommandations basées sur l'historique
        const similarProducts = this.findSimilarProducts(preferences);
        recommendations.push(...similarProducts.slice(0, 5));

        // 2. Trending products dans les catégories d'intérêt
        const trendingInCategories = this.getTrendingInCategories(preferences.categories);
        recommendations.push(...trendingInCategories.slice(0, 3));

        // 3. Nouveautés correspondant au profil
        const newProducts = this.getMatchingNewProducts(preferences);
        recommendations.push(...newProducts.slice(0, 2));

        return this.rankRecommendations(recommendations);
    }

    // Analyse des préférences utilisateur
    extractPreferences(userHistory) {
        const preferences = {
            categories: new Map(),
            priceRange: { min: 0, max: 1000 },
            brands: new Map(),
            features: new Map()
        };

        userHistory.forEach(action => {
            const product = this.productData.get(action.productId);
            if (!product) return;

            // Catégories préférées
            product.categories?.forEach(cat => {
                const current = preferences.categories.get(cat) || 0;
                preferences.categories.set(cat, current + action.weight);
            });

            // Gamme de prix
            if (product.price) {
                preferences.priceRange.min = Math.min(preferences.priceRange.min, product.price * 0.8);
                preferences.priceRange.max = Math.max(preferences.priceRange.max, product.price * 1.2);
            }

            // Marques
            if (product.brand) {
                const current = preferences.brands.get(product.brand) || 0;
                preferences.brands.set(product.brand, current + action.weight);
            }
        });

        return preferences;
    }

    // Recommandations par filtrage collaboratif
    getCollaborativeRecommendations(productId) {
        const usersWhoViewed = this.getUsersWhoViewedProduct(productId);
        const recommendationMap = new Map();

        usersWhoViewed.forEach(userId => {
            const userProducts = this.getUserProducts(userId);
            userProducts.forEach(otherProductId => {
                if (otherProductId !== productId) {
                    const current = recommendationMap.get(otherProductId) || 0;
                    recommendationMap.set(otherProductId, current + 1);
                }
            });
        });

        return Array.from(recommendationMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([productId]) => this.productData.get(productId));
    }

    // Recommandations temps réel
    generateRealTimeRecommendations(currentProductId) {
        const currentProduct = this.productData.get(currentProductId);
        if (!currentProduct) return [];

        const recommendations = [];

        // Produits similaires (même catégorie, prix similaire)
        const similarByCategory = this.findProductsByCategory(
            currentProduct.categories, 
            currentProductId
        );
        
        // Produits souvent achetés ensemble
        const frequentlyBought = this.getFrequentlyBoughtTogether(currentProductId);
        
        // Alternatives dans la même gamme de prix
        const priceAlternatives = this.getPriceAlternatives(currentProduct);

        recommendations.push(
            ...similarByCategory.slice(0, 4),
            ...frequentlyBought.slice(0, 3),
            ...priceAlternatives.slice(0, 3)
        );

        return this.removeDuplicates(recommendations).slice(0, 8);
    }

    // Interface de recommandations dans l'UI
    displayRecommendations(containerId, recommendations, title = 'Recommandé pour vous') {
        const container = document.getElementById(containerId);
        if (!container || !recommendations.length) return;

        container.innerHTML = `
            <div class="recommendations-section">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <span class="mr-2">🤖</span>
                    ${title}
                </h3>
                <div class="recommendations-grid grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${recommendations.map(product => this.createProductCard(product)).join('')}
                </div>
            </div>
        `;

        this.bindRecommendationEvents(container);
    }

    createProductCard(product) {
        return `
            <div class="product-card bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3" 
                 data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" 
                     class="w-full h-32 object-cover rounded-md mb-2">
                <h4 class="font-medium text-sm mb-1 line-clamp-2">${product.name}</h4>
                <p class="text-primary font-bold text-lg">${product.price}€</p>
                <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center">
                        <span class="text-yellow-400">★</span>
                        <span class="text-sm ml-1">${product.rating || 4.5}</span>
                    </div>
                    <button class="add-to-cart-btn bg-primary text-white px-2 py-1 rounded text-xs hover:bg-primary-dark transition-colors">
                        Ajouter
                    </button>
                </div>
            </div>
        `;
    }

    // Analyse de sentiment des avis
    analyzeSentiment(product) {
        if (!product.reviews) return 0.5;

        const positiveWords = ['excellent', 'parfait', 'super', 'génial', 'recommande'];
        const negativeWords = ['mauvais', 'décevant', 'problème', 'cassé', 'défaut'];

        let sentiment = 0;
        let totalWords = 0;

        product.reviews.forEach(review => {
            const words = review.comment?.toLowerCase().split(' ') || [];
            words.forEach(word => {
                if (positiveWords.includes(word)) {
                    sentiment += 1;
                    totalWords += 1;
                } else if (negativeWords.includes(word)) {
                    sentiment -= 1;
                    totalWords += 1;
                }
            });
        });

        return totalWords > 0 ? (sentiment / totalWords + 1) / 2 : 0.5;
    }

    // Utilitaires
    loadUserBehavior() {
        try {
            return JSON.parse(localStorage.getItem('userBehavior') || '{}');
        } catch {
            return {};
        }
    }

    saveUserBehavior() {
        localStorage.setItem('userBehavior', JSON.stringify(this.userBehavior));
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    removeDuplicates(products) {
        const seen = new Set();
        return products.filter(product => {
            if (seen.has(product.id)) return false;
            seen.add(product.id);
            return true;
        });
    }

    // API publique
    async getRecommendationsFor(productId) {
        if (!this.initialized) await this.init();
        return this.generateRealTimeRecommendations(productId);
    }

    async getPersonalRecommendations() {
        if (!this.initialized) await this.init();
        return this.generatePersonalizedRecommendations();
    }
}

// Instance globale
window.aiRecommendations = new AIRecommendationEngine();

// Export pour utilisation externe
if (typeof module !== 'undefined') {
    module.exports = AIRecommendationEngine;
}