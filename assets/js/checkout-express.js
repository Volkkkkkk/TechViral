/**
 * TechViral - Checkout Express
 * Système de commande optimisé mobile en une page
 */

class ExpressCheckout {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.promoCode = null;
        this.promoDiscount = 0;
        this.deliveryMethod = 'express';
        this.paymentMethod = 'card';
        this.totals = {
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0
        };
        
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupFormHandlers();
        this.setupPromoCode();
        this.setupAutoFill();
        this.setupRealTimeValidation();
        this.calculateTotals();
        
        console.log('Express Checkout initialized');
    }

    loadCartItems() {
        const summaryContainer = document.getElementById('orderSummary');
        
        if (this.cart.length === 0) {
            summaryContainer.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">🛒</div>
                    <h3 class="text-lg font-semibold mb-2">Votre panier est vide</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">Ajoutez des produits pour continuer</p>
                    <a href="/pages/categories/all.html" class="inline-block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        Découvrir nos produits
                    </a>
                </div>
            `;
            
            // Disable form
            document.getElementById('expressCheckoutForm').style.opacity = '0.5';
            document.getElementById('expressCheckoutForm').style.pointerEvents = 'none';
            return;
        }

        summaryContainer.innerHTML = this.cart.map(item => `
            <div class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                    <span class="text-lg">${this.getProductEmoji(item.category)}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-gray-900 dark:text-white truncate">${item.name}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ${item.price}€ × ${item.quantity}
                    </p>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}€
                    </p>
                </div>
            </div>
        `).join('');
    }

    getProductEmoji(category) {
        const emojis = {
            'electronique': '📱',
            'sante': '🏥',
            'maison': '🏠',
            'mode': '👗',
            'lifestyle': '✨',
            'ecologique': '🌱',
            'animaux': '🐕',
            'bebe': '👶'
        };
        return emojis[category] || '📦';
    }

    setupFormHandlers() {
        const form = document.getElementById('expressCheckoutForm');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processOrder();
        });

        // Delivery method selection
        document.querySelectorAll('input[name="delivery"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.deliveryMethod = e.target.value;
                this.calculateTotals();
                this.updateDeliveryUI();
            });
        });

        // Payment method selection
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
                this.togglePaymentFields();
            });
        });

        // Auto-format inputs
        this.setupInputFormatting();
    }

    setupInputFormatting() {
        // Format phone number
        const phoneInput = document.getElementById('phone');
        phoneInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
            e.target.value = value;
        });

        // Format postal code
        const zipInput = document.getElementById('zipCode');
        zipInput?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
        });

        // Format card number
        const cardNumberInput = document.getElementById('cardNumber');
        cardNumberInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
            e.target.value = value.slice(0, 19);
        });

        // Format card expiry
        const cardExpiryInput = document.getElementById('cardExpiry');
        cardExpiryInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // Format CVV
        const cardCvvInput = document.getElementById('cardCvv');
        cardCvvInput?.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }

    togglePaymentFields() {
        const cardFields = document.getElementById('cardFields');
        
        if (this.paymentMethod === 'card') {
            cardFields.classList.remove('hidden');
            cardFields.querySelectorAll('input').forEach(input => {
                input.required = true;
            });
        } else {
            cardFields.classList.add('hidden');
            cardFields.querySelectorAll('input').forEach(input => {
                input.required = false;
            });
        }
    }

    setupPromoCode() {
        const applyBtn = document.getElementById('applyPromo');
        const promoInput = document.getElementById('promoCode');
        const messageEl = document.getElementById('promoMessage');

        applyBtn?.addEventListener('click', () => {
            this.applyPromoCode(promoInput.value.trim());
        });

        promoInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.applyPromoCode(promoInput.value.trim());
            }
        });

        // Clear message on input change
        promoInput?.addEventListener('input', () => {
            messageEl.classList.add('hidden');
            if (this.promoCode && promoInput.value.trim() !== this.promoCode) {
                this.removePromoCode();
            }
        });
    }

    async applyPromoCode(code) {
        if (!code) return;

        const messageEl = document.getElementById('promoMessage');
        
        try {
            // Simulate API call to validate promo code
            const isValid = await this.validatePromoCode(code);
            
            if (isValid) {
                this.promoCode = code;
                this.promoDiscount = isValid.discount;
                
                messageEl.textContent = `✅ Code "${code}" appliqué ! -${isValid.discount}€`;
                messageEl.className = 'mt-2 text-sm text-green-600 dark:text-green-400';
                messageEl.classList.remove('hidden');
                
                document.getElementById('promoDiscount').classList.remove('hidden');
                document.getElementById('promoDiscount').querySelector('span:last-child').textContent = `-${isValid.discount.toFixed(2)}€`;
                
                this.calculateTotals();
            } else {
                throw new Error('Code promotionnel invalide');
            }
        } catch (error) {
            messageEl.textContent = `❌ ${error.message}`;
            messageEl.className = 'mt-2 text-sm text-red-600 dark:text-red-400';
            messageEl.classList.remove('hidden');
        }
    }

    async validatePromoCode(code) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const validCodes = {
            'WELCOME10': { discount: 10, description: '10€ de réduction' },
            'NEWUSER': { discount: 15, description: '15€ de réduction' },
            'SAVE20': { discount: 20, description: '20€ de réduction' },
            'TECHVIRAL': { discount: 5, description: '5€ de réduction' }
        };
        
        return validCodes[code.toUpperCase()] || false;
    }

    removePromoCode() {
        this.promoCode = null;
        this.promoDiscount = 0;
        
        document.getElementById('promoDiscount').classList.add('hidden');
        this.calculateTotals();
    }

    setupAutoFill() {
        // Check if user has saved address
        const savedAddress = JSON.parse(localStorage.getItem('userAddress') || '{}');
        
        if (Object.keys(savedAddress).length > 0) {
            const fillBtn = document.createElement('button');
            fillBtn.type = 'button';
            fillBtn.className = 'text-primary text-sm hover:underline mb-4';
            fillBtn.textContent = '📍 Utiliser mon adresse sauvegardée';
            
            fillBtn.addEventListener('click', () => {
                Object.keys(savedAddress).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = savedAddress[key];
                    }
                });
            });
            
            const firstSection = document.querySelector('.checkout-section');
            firstSection?.insertBefore(fillBtn, firstSection.firstChild.nextSibling);
        }
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                // Remove error state on input
                input.classList.remove('border-red-500', 'bg-red-50');
                const errorMsg = input.parentNode.querySelector('.error-message');
                errorMsg?.remove();
            });
        });
    }

    validateField(input) {
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        input.classList.remove('border-red-500', 'bg-red-50');
        const existingError = input.parentNode.querySelector('.error-message');
        existingError?.remove();

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un email valide';
            }
        }

        // Phone validation
        if (input.id === 'phone' && input.value) {
            const phoneRegex = /^(\d{2}\s){4}\d{2}$|^\d{10}$/;
            if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro valide';
            }
        }

        // Postal code validation
        if (input.id === 'zipCode' && input.value) {
            if (!/^\d{5}$/.test(input.value)) {
                isValid = false;
                errorMessage = 'Code postal invalide (5 chiffres)';
            }
        }

        // Required field validation
        if (input.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }

        if (!isValid) {
            input.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
            
            const errorEl = document.createElement('p');
            errorEl.className = 'error-message text-red-600 dark:text-red-400 text-xs mt-1';
            errorEl.textContent = errorMessage;
            input.parentNode.appendChild(errorEl);
        }

        return isValid;
    }

    calculateTotals() {
        this.totals.subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.totals.shipping = this.deliveryMethod === 'express' ? 0 : 0; // Both free for promotion
        this.totals.discount = this.promoDiscount;
        this.totals.total = Math.max(0, this.totals.subtotal + this.totals.shipping - this.totals.discount);

        this.updateTotalsUI();
    }

    updateTotalsUI() {
        document.getElementById('subtotal').textContent = `${this.totals.subtotal.toFixed(2)}€`;
        document.getElementById('finalTotal').textContent = `${this.totals.total.toFixed(2)}€`;
        document.getElementById('totalPrice').textContent = `${this.totals.total.toFixed(2)}€`;
    }

    updateDeliveryUI() {
        // Update delivery info in UI
        const deliveryOptions = document.querySelectorAll('.delivery-option');
        deliveryOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio.checked) {
                option.classList.add('border-primary', 'bg-primary/5');
            } else {
                option.classList.remove('border-primary', 'bg-primary/5');
            }
        });
    }

    async processOrder() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        try {
            // Validate form
            const isFormValid = this.validateForm();
            if (!isFormValid) {
                throw new Error('Veuillez corriger les erreurs dans le formulaire');
            }

            // Show loading
            loadingOverlay.classList.remove('hidden');

            // Collect form data
            const orderData = this.collectFormData();
            
            // Process payment
            const paymentResult = await this.processPayment(orderData);
            
            if (paymentResult.success) {
                // Create order
                const order = await this.createOrder(orderData, paymentResult);
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Save address for future use
                this.saveUserAddress(orderData);
                
                // Redirect to success page
                window.location.href = `/pages/order-success.html?order=${order.id}`;
            } else {
                throw new Error(paymentResult.error || 'Erreur de paiement');
            }
            
        } catch (error) {
            console.error('Order processing error:', error);
            
            loadingOverlay.classList.add('hidden');
            
            // Show error message
            this.showErrorMessage(error.message);
        }
    }

    validateForm() {
        const requiredInputs = document.querySelectorAll('input[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Check terms acceptance
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            isValid = false;
            this.showErrorMessage('Vous devez accepter les conditions générales');
        }

        return isValid;
    }

    collectFormData() {
        return {
            customer: {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phone: document.getElementById('phone').value
            },
            shipping: {
                address: document.getElementById('address').value,
                zipCode: document.getElementById('zipCode').value,
                city: document.getElementById('city').value,
                method: this.deliveryMethod
            },
            payment: {
                method: this.paymentMethod,
                cardNumber: this.paymentMethod === 'card' ? document.getElementById('cardNumber')?.value : null,
                cardExpiry: this.paymentMethod === 'card' ? document.getElementById('cardExpiry')?.value : null,
                cardCvv: this.paymentMethod === 'card' ? document.getElementById('cardCvv')?.value : null
            },
            items: this.cart,
            totals: this.totals,
            promoCode: this.promoCode
        };
    }

    async processPayment(orderData) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock payment success (in real implementation, integrate with Stripe/PayPal/etc.)
        return {
            success: true,
            transactionId: `tx_${Date.now()}`,
            method: orderData.payment.method
        };
    }

    async createOrder(orderData, paymentResult) {
        // Simulate order creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const order = {
            id: `order_${Date.now()}`,
            customer: orderData.customer,
            items: orderData.items,
            shipping: orderData.shipping,
            payment: {
                method: orderData.payment.method,
                transactionId: paymentResult.transactionId,
                amount: orderData.totals.total
            },
            totals: orderData.totals,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save order locally (in real app, send to server)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        return order;
    }

    saveUserAddress(orderData) {
        const addressData = {
            firstName: orderData.customer.firstName,
            lastName: orderData.customer.lastName,
            address: orderData.shipping.address,
            zipCode: orderData.shipping.zipCode,
            city: orderData.shipping.city,
            phone: orderData.customer.phone
        };
        
        localStorage.setItem('userAddress', JSON.stringify(addressData));
    }

    showErrorMessage(message) {
        // Remove existing error messages
        document.querySelectorAll('.checkout-error').forEach(el => el.remove());
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'checkout-error bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4';
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <span class="mr-2">❌</span>
                <span>${message}</span>
            </div>
        `;
        
        const form = document.getElementById('expressCheckoutForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the checkout page
    if (document.getElementById('expressCheckoutForm')) {
        window.expressCheckout = new ExpressCheckout();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExpressCheckout;
}