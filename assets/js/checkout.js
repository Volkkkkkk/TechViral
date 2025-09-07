/**
 * TechViral - Checkout System
 * Système de finalisation de commande et paiement
 */

class CheckoutManager {
    constructor() {
        this.checkoutData = JSON.parse(localStorage.getItem('checkout_data')) || null;
        this.orderData = {};
        this.init();
    }

    init() {
        if (!this.checkoutData || this.checkoutData.cart.length === 0) {
            this.redirectToCart();
            return;
        }

        this.loadCheckoutData();
        this.bindEvents();
        console.log('Checkout Manager initialized 💳');
    }

    redirectToCart() {
        window.location.href = '/pages/cart/cart.html';
    }

    loadCheckoutData() {
        // Charger les données du panier dans la page checkout
        this.displayOrderSummary();
        this.populateUserData();
    }

    displayOrderSummary() {
        const summaryContainer = document.getElementById('orderSummary');
        if (!summaryContainer) return;

        const { cart, total, itemCount } = this.checkoutData;

        const summaryHTML = `
            <div class="space-y-4">
                ${cart.map(item => `
                    <div class="flex items-center space-x-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img src="${item.image || '/assets/images/placeholder.jpg'}" 
                                 alt="${item.name}" 
                                 class="w-full h-full object-cover">
                        </div>
                        <div class="flex-1">
                            <h4 class="font-medium text-gray-900 dark:text-white text-sm">${item.name}</h4>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Quantité: ${item.quantity}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                    </div>
                `).join('')}
                
                <div class="pt-4 space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Sous-total</span>
                        <span class="text-gray-900 dark:text-white">${total.toFixed(2)} €</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Livraison</span>
                        <span class="text-green-600 font-medium">Gratuite</span>
                    </div>
                    <div class="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span class="text-gray-900 dark:text-white">Total</span>
                        <span class="text-gray-900 dark:text-white">${total.toFixed(2)} €</span>
                    </div>
                </div>
            </div>
        `;

        summaryContainer.innerHTML = summaryHTML;
    }

    populateUserData() {
        // Récupérer les données utilisateur si connecté
        const userSession = JSON.parse(localStorage.getItem('user_session') || '{}');
        
        if (userSession.logged_in) {
            const emailField = document.getElementById('email');
            if (emailField) emailField.value = userSession.email || '';
            
            if (userSession.name) {
                const names = userSession.name.split(' ');
                const firstNameField = document.getElementById('firstName');
                const lastNameField = document.getElementById('lastName');
                
                if (firstNameField && names[0]) firstNameField.value = names[0];
                if (lastNameField && names[1]) lastNameField.value = names[1];
            }
        }
    }

    bindEvents() {
        // Gestion du formulaire de commande
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }

        // Boutons de paiement
        document.querySelectorAll('[data-payment-method]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const method = e.target.dataset.paymentMethod;
                this.selectPaymentMethod(method);
            });
        });

        // Bouton finaliser commande principal
        const finalizeBtn = document.getElementById('finalizeOrder');
        if (finalizeBtn) {
            finalizeBtn.addEventListener('click', () => {
                this.processOrder();
            });
        }
    }

    selectPaymentMethod(method) {
        // Marquer la méthode de paiement sélectionnée
        document.querySelectorAll('[data-payment-method]').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/20');
        });

        const selectedBtn = document.querySelector(`[data-payment-method="${method}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50', 'dark:bg-indigo-900/20');
        }

        this.orderData.paymentMethod = method;
    }

    async processOrder() {
        const submitButton = document.getElementById('finalizeOrder');
        const originalHTML = submitButton?.innerHTML || '';

        try {
            // Validation du formulaire
            if (!this.validateCheckoutForm()) {
                this.showNotification('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }

            // Loading state
            if (submitButton) {
                submitButton.innerHTML = `
                    <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Traitement en cours...
                    </div>
                `;
                submitButton.disabled = true;
            }

            // Collecter les données de la commande
            this.collectOrderData();

            // Simuler le traitement de paiement
            await this.simulatePaymentProcessing();

            // Générer numéro de commande
            const orderNumber = this.generateOrderNumber();

            // Sauvegarder la commande
            this.saveOrder(orderNumber);

            // Vider le panier
            localStorage.removeItem('techviral_cart');
            localStorage.removeItem('checkout_data');

            // Redirection vers page de confirmation
            window.location.href = `/pages/cart/confirmation.html?order=${orderNumber}`;

        } catch (error) {
            this.showNotification('Erreur lors du traitement de votre commande. Veuillez réessayer.', 'error');
            console.error('Checkout error:', error);
        } finally {
            if (submitButton) {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }
        }
    }

    validateCheckoutForm() {
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'postalCode'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                field.classList.add('border-red-500', 'focus:ring-red-500');
                isValid = false;
            } else if (field) {
                field.classList.remove('border-red-500', 'focus:ring-red-500');
            }
        });

        // Validation email
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !this.validateEmail(emailField.value)) {
            emailField.classList.add('border-red-500', 'focus:ring-red-500');
            isValid = false;
        }

        return isValid;
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    collectOrderData() {
        const formData = new FormData();
        
        // Informations client
        ['email', 'firstName', 'lastName', 'phone'].forEach(field => {
            const element = document.getElementById(field);
            if (element) formData.append(field, element.value);
        });

        // Adresse de livraison
        ['address', 'city', 'postalCode', 'country'].forEach(field => {
            const element = document.getElementById(field);
            if (element) formData.append(field, element.value);
        });

        // Convertir en objet pour stockage
        this.orderData = {
            ...this.orderData,
            customer: Object.fromEntries(formData.entries()),
            cart: this.checkoutData.cart,
            total: this.checkoutData.total,
            timestamp: Date.now()
        };
    }

    async simulatePaymentProcessing() {
        // Simuler le traitement de paiement (2-4 secondes)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 95% de succès
                if (Math.random() < 0.95) {
                    resolve({ success: true, transactionId: this.generateTransactionId() });
                } else {
                    reject(new Error('Erreur de paiement simulée'));
                }
            }, 2000 + Math.random() * 2000);
        });
    }

    generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        
        return `TV${year}${month}${day}${random}`;
    }

    generateTransactionId() {
        return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    saveOrder(orderNumber) {
        const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        
        const order = {
            orderNumber,
            ...this.orderData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        orders.push(order);
        localStorage.setItem('user_orders', JSON.stringify(orders));

        // Tracking analytics
        this.trackOrderComplete(order);
    }

    trackOrderComplete(order) {
        // Google Analytics / Custom analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: order.orderNumber,
                value: order.total,
                currency: 'EUR',
                items: order.cart.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        }

        console.log('Order completed:', order.orderNumber, order.total + '€');
    }

    showNotification(message, type = 'info') {
        // Réutiliser le système de notifications existant
        if (window.formsManager && window.formsManager.showNotification) {
            window.formsManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialiser le gestionnaire de checkout
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        window.checkoutManager = new CheckoutManager();
    }
});

console.log('Checkout system loaded ✅');