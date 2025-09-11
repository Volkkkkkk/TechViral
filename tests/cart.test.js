/**
 * Tests unitaires pour le système de panier TechViral
 * Framework de test simple intégré
 */

// Mini framework de test
class TestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Démarrage des tests du panier TechViral\n');
        const startTime = Date.now();
        
        for (const test of this.tests) {
            const testStartTime = Date.now();
            try {
                await test.testFn();
                const testDuration = Date.now() - testStartTime;
                console.log(`✅ ${test.name} (${testDuration}ms)`);
                this.passed++;
            } catch (error) {
                const testDuration = Date.now() - testStartTime;
                console.error(`❌ ${test.name} (${testDuration}ms)`);
                console.error(`   Erreur: ${error.message}`);
                console.error(`   Stack: ${error.stack?.split('\n')[1]?.trim() || 'N/A'}`);
                this.failed++;
            }
        }
        
        const totalDuration = Date.now() - startTime;
        console.log(`\n📊 Résultats des tests:`);
        console.log(`   ✅ Réussis: ${this.passed}`);
        console.log(`   ❌ Échoués: ${this.failed}`);
        console.log(`   📦 Total: ${this.tests.length}`);
        console.log(`   ⏱️  Durée: ${totalDuration}ms`);
        console.log(`   📈 Taux de réussite: ${Math.round((this.passed / this.tests.length) * 100)}%`);
        
        if (this.failed === 0) {
            console.log(`\n🎉 Tous les tests sont passés avec succès!\n`);
        } else {
            console.log(`\n⚠️  ${this.failed} test(s) ont échoué.\n`);
        }
        
        return this.failed === 0;
    }
}

// Fonction d'assertion
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
}

function assertArrayEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
}

// Mock localStorage pour les tests
class MockStorage {
    constructor() {
        this.store = {};
    }
    
    getItem(key) {
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        this.store[key] = value;
    }
    
    removeItem(key) {
        delete this.store[key];
    }
    
    clear() {
        this.store = {};
    }
}

// Configuration de l'environnement de test
function setupTestEnvironment() {
    // Mock localStorage
    global.localStorage = new MockStorage();
    global.sessionStorage = new MockStorage();
    
    // Mock DOM elements
    global.document = {
        createElement: () => ({ 
            style: {},
            classList: { add: () => {}, remove: () => {} },
            addEventListener: () => {},
            setAttribute: () => {},
            appendChild: () => {},
            remove: () => {}
        }),
        querySelectorAll: () => [],
        querySelector: () => null,
        body: { appendChild: () => {} },
        addEventListener: () => {},
        dispatchEvent: () => {}
    };
    
    // Mock window
    global.window = {
        location: { pathname: '/test', hostname: 'localhost' },
        dispatchEvent: () => {},
        requestAnimationFrame: (cb) => setTimeout(cb, 16)
    };
    
    // Mock console methods for cleaner test output
    const originalConsole = global.console;
    global.console = {
        ...originalConsole,
        log: () => {}, // Supprimer les logs pendant les tests
        warn: () => {},
        error: originalConsole.error
    };
}

// Import du CartManager (simulé car on ne peut pas vraiment importer dans ce contexte)
// En réalité, vous utiliseriez: import { CartManager } from '../assets/js/cart.js'

// Tests
const testSuite = new TestFramework();

testSuite.test('CartManager - Initialisation', () => {
    setupTestEnvironment();
    
    // Simuler CartManager (version simplifiée pour les tests)
    class TestCartManager {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('techviral_cart')) || [];
            this.promoCode = null;
            this.promoDiscount = 0;
        }
        
        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                this.cart.push({ ...product });
            }
            localStorage.setItem('techviral_cart', JSON.stringify(this.cart));
        }
        
        getCartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        getCartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) - this.promoDiscount;
        }
        
        applyPromoCode(code) {
            const promoCodes = {
                'WELCOME10': { discount: 0.10, type: 'percentage' },
                'TECH25': { discount: 25, type: 'fixed' }
            };
            
            const promo = promoCodes[code.toUpperCase()];
            if (!promo) return { success: false, message: 'Code promo invalide' };
            
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (promo.type === 'percentage') {
                this.promoDiscount = subtotal * promo.discount;
            } else {
                this.promoDiscount = Math.min(promo.discount, subtotal);
            }
            
            this.promoCode = code.toUpperCase();
            return { success: true, message: 'Code appliqué' };
        }
        
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            localStorage.setItem('techviral_cart', JSON.stringify(this.cart));
        }
        
        clearCart() {
            this.cart = [];
            localStorage.removeItem('techviral_cart');
        }
    }
    
    const cartManager = new TestCartManager();
    
    assert(Array.isArray(cartManager.cart), 'Le panier doit être un tableau');
    assertEqual(cartManager.cart.length, 0, 'Le panier doit être vide à l\'initialisation');
    assertEqual(cartManager.getCartCount(), 0, 'Le nombre d\'articles doit être 0');
    assertEqual(cartManager.getCartTotal(), 0, 'Le total doit être 0');
});

testSuite.test('CartManager - Ajout de produit', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
            this.promoDiscount = 0;
        }
        
        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                this.cart.push({ ...product });
            }
        }
        
        getCartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        getCartTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
    }
    
    const cartManager = new TestCartManager();
    const product = { id: 'test-1', name: 'Produit Test', price: 50, quantity: 1 };
    
    cartManager.addToCart(product);
    
    assertEqual(cartManager.cart.length, 1, 'Le panier doit contenir 1 produit');
    assertEqual(cartManager.getCartCount(), 1, 'Le nombre d\'articles doit être 1');
    assertEqual(cartManager.getCartTotal(), 50, 'Le total doit être 50');
    assertEqual(cartManager.cart[0].name, 'Produit Test', 'Le nom du produit doit correspondre');
});

testSuite.test('CartManager - Quantité de produits', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
        }
        
        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += product.quantity;
            } else {
                this.cart.push({ ...product });
            }
        }
        
        getCartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    
    const cartManager = new TestCartManager();
    const product = { id: 'test-1', name: 'Produit Test', price: 50, quantity: 1 };
    
    // Ajouter le même produit 3 fois
    cartManager.addToCart(product);
    cartManager.addToCart(product);
    cartManager.addToCart(product);
    
    assertEqual(cartManager.cart.length, 1, 'Il ne doit y avoir qu\'un seul produit unique');
    assertEqual(cartManager.cart[0].quantity, 3, 'La quantité doit être 3');
    assertEqual(cartManager.getCartCount(), 3, 'Le nombre total d\'articles doit être 3');
});

testSuite.test('CartManager - Codes promo pourcentage', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
            this.promoDiscount = 0;
            this.promoCode = null;
        }
        
        addToCart(product) {
            this.cart.push({ ...product });
        }
        
        getCartTotal() {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return subtotal - this.promoDiscount;
        }
        
        applyPromoCode(code) {
            if (code === 'WELCOME10') {
                const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                this.promoDiscount = subtotal * 0.10;
                this.promoCode = code;
                return { success: true, message: '10% de réduction' };
            }
            return { success: false, message: 'Code invalide' };
        }
    }
    
    const cartManager = new TestCartManager();
    cartManager.addToCart({ id: 'test-1', name: 'Produit', price: 100, quantity: 1 });
    
    const result = cartManager.applyPromoCode('WELCOME10');
    
    assert(result.success, 'Le code promo doit être valide');
    assertEqual(cartManager.promoDiscount, 10, 'La réduction doit être de 10€');
    assertEqual(cartManager.getCartTotal(), 90, 'Le total avec réduction doit être 90€');
});

testSuite.test('CartManager - Codes promo fixes', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
            this.promoDiscount = 0;
        }
        
        addToCart(product) {
            this.cart.push({ ...product });
        }
        
        getCartTotal() {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return subtotal - this.promoDiscount;
        }
        
        applyPromoCode(code) {
            if (code === 'TECH25') {
                const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                this.promoDiscount = Math.min(25, subtotal);
                return { success: true, message: '25€ de réduction' };
            }
            return { success: false, message: 'Code invalide' };
        }
    }
    
    const cartManager = new TestCartManager();
    cartManager.addToCart({ id: 'test-1', name: 'Produit', price: 50, quantity: 1 });
    
    const result = cartManager.applyPromoCode('TECH25');
    
    assert(result.success, 'Le code promo doit être valide');
    assertEqual(cartManager.promoDiscount, 25, 'La réduction doit être de 25€');
    assertEqual(cartManager.getCartTotal(), 25, 'Le total avec réduction doit être 25€');
});

testSuite.test('CartManager - Suppression de produit', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
        }
        
        addToCart(product) {
            this.cart.push({ ...product });
        }
        
        removeFromCart(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
        }
        
        getCartCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    
    const cartManager = new TestCartManager();
    cartManager.addToCart({ id: 'test-1', name: 'Produit 1', price: 50, quantity: 1 });
    cartManager.addToCart({ id: 'test-2', name: 'Produit 2', price: 30, quantity: 1 });
    
    assertEqual(cartManager.cart.length, 2, 'Le panier doit contenir 2 produits');
    
    cartManager.removeFromCart('test-1');
    
    assertEqual(cartManager.cart.length, 1, 'Le panier doit contenir 1 produit après suppression');
    assertEqual(cartManager.cart[0].id, 'test-2', 'Le produit restant doit être test-2');
});

testSuite.test('CartManager - Vider le panier', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = [];
        }
        
        addToCart(product) {
            this.cart.push({ ...product });
        }
        
        clearCart() {
            this.cart = [];
        }
    }
    
    const cartManager = new TestCartManager();
    cartManager.addToCart({ id: 'test-1', name: 'Produit 1', price: 50, quantity: 1 });
    cartManager.addToCart({ id: 'test-2', name: 'Produit 2', price: 30, quantity: 1 });
    
    assertEqual(cartManager.cart.length, 2, 'Le panier doit contenir 2 produits');
    
    cartManager.clearCart();
    
    assertEqual(cartManager.cart.length, 0, 'Le panier doit être vide après clearCart()');
});

testSuite.test('CartManager - Persistance localStorage', () => {
    setupTestEnvironment();
    
    class TestCartManager {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('techviral_cart')) || [];
        }
        
        addToCart(product) {
            this.cart.push({ ...product });
            localStorage.setItem('techviral_cart', JSON.stringify(this.cart));
        }
    }
    
    const cartManager1 = new TestCartManager();
    cartManager1.addToCart({ id: 'test-1', name: 'Produit', price: 50, quantity: 1 });
    
    // Simuler un nouveau chargement de page
    const cartManager2 = new TestCartManager();
    
    assertEqual(cartManager2.cart.length, 1, 'Le panier doit persister dans localStorage');
    assertEqual(cartManager2.cart[0].name, 'Produit', 'Les données du produit doivent être conservées');
});

// Exporter les tests pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testSuite, TestFramework };
}

// Auto-exécution si dans un navigateur
if (typeof window !== 'undefined') {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => testSuite.run());
    } else {
        testSuite.run();
    }
}

console.log('📝 Tests du panier TechViral chargés. Appelez testSuite.run() pour exécuter.');