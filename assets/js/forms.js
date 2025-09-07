/**
 * TechViral - Enhanced Forms System
 * Système de formulaires amélioré avec validation et feedback
 */

class FormsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForms();
        this.setupAccountForms();
        this.setupGenericForms();
        console.log('Forms Manager initialized 📝');
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(contactForm);
        });

        // Validation en temps réel
        contactForm.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    setupNewsletterForms() {
        const newsletterForms = document.querySelectorAll('#newsletterForm, .newsletter-form, [id*="newsletter"]');
        
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(form);
            });
        });
    }

    setupAccountForms() {
        // Formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLoginSubmit(loginForm);
            });
        }

        // Formulaire d'inscription
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterSubmit(registerForm);
            });
        }
    }

    setupGenericForms() {
        // Tous les autres formulaires
        document.querySelectorAll('form:not(#contactForm):not(#newsletterForm):not(#loginForm):not(#registerForm)').forEach(form => {
            if (!form.dataset.enhanced) {
                form.dataset.enhanced = 'true';
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleGenericSubmit(form);
                });
            }
        });
    }

    async handleContactSubmit(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;
        
        // Validation
        if (!this.validateForm(form)) {
            this.showNotification('Veuillez corriger les erreurs avant d\'envoyer.', 'error');
            return;
        }

        try {
            // Loading state
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                </div>
            `;
            submitButton.disabled = true;

            // Simulation d'envoi (remplacer par vraie API)
            await this.simulateAPICall();

            // Succès
            this.showNotification('Message envoyé avec succès ! Nous vous répondrons sous 24h.', 'success');
            form.reset();
            this.removeAllFieldErrors(form);

            // Tracking (analytics)
            this.trackEvent('contact_form_submitted', {
                form_type: 'contact',
                timestamp: Date.now()
            });

        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
            console.error('Contact form error:', error);
        } finally {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    }

    async handleNewsletterSubmit(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;

        if (!emailInput || !this.validateEmail(emailInput.value)) {
            this.showFieldError(emailInput, 'Adresse email invalide');
            return;
        }

        try {
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Inscription...
                </div>
            `;
            submitButton.disabled = true;

            await this.simulateAPICall();

            // Remplacer le formulaire par un message de succès
            form.innerHTML = `
                <div class="text-center py-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Inscription réussie !</h3>
                    <p class="text-gray-600">Merci ${emailInput.value}, vous recevrez nos dernières nouveautés.</p>
                </div>
            `;

            this.trackEvent('newsletter_subscribed', {
                email: emailInput.value,
                source: window.location.pathname
            });

        } catch (error) {
            this.showNotification('Erreur d\'inscription. Veuillez réessayer.', 'error');
        } finally {
            if (submitButton) {
                submitButton.innerHTML = originalHTML;
                submitButton.disabled = false;
            }
        }
    }

    async handleLoginSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;

        if (!this.validateForm(form)) {
            return;
        }

        try {
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion...
                </div>
            `;
            submitButton.disabled = true;

            await this.simulateAPICall();

            // Simulation de connexion réussie
            this.showNotification('Connexion réussie ! Redirection...', 'success');
            
            // Sauvegarder session simulée
            localStorage.setItem('user_session', JSON.stringify({
                email,
                logged_in: true,
                timestamp: Date.now()
            }));

            setTimeout(() => {
                window.location.href = '/pages/account/profile.html';
            }, 1500);

        } catch (error) {
            this.showNotification('Email ou mot de passe incorrect.', 'error');
        } finally {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    }

    async handleRegisterSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalHTML = submitButton.innerHTML;

        if (!this.validateForm(form)) {
            return;
        }

        try {
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création du compte...
                </div>
            `;
            submitButton.disabled = true;

            await this.simulateAPICall(2000);

            this.showNotification('Compte créé avec succès ! Redirection...', 'success');
            
            // Sauvegarder session simulée
            localStorage.setItem('user_session', JSON.stringify({
                email: formData.get('email'),
                name: `${formData.get('firstName')} ${formData.get('lastName')}`,
                logged_in: true,
                timestamp: Date.now()
            }));

            setTimeout(() => {
                window.location.href = '/pages/account/profile.html';
            }, 1500);

        } catch (error) {
            this.showNotification('Erreur lors de la création du compte.', 'error');
        } finally {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    }

    async handleGenericSubmit(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const originalHTML = submitButton.innerHTML;

        try {
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Traitement...
                </div>
            `;
            submitButton.disabled = true;

            await this.simulateAPICall();
            this.showNotification('Formulaire envoyé avec succès !', 'success');
            
        } catch (error) {
            this.showNotification('Erreur lors de l\'envoi.', 'error');
        } finally {
            submitButton.innerHTML = originalHTML;
            submitButton.disabled = false;
        }
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Vérifications spéciales
        const passwordConfirm = form.querySelector('input[name="passwordConfirm"]');
        if (passwordConfirm) {
            const password = form.querySelector('input[name="password"]');
            if (password && passwordConfirm.value !== password.value) {
                this.showFieldError(passwordConfirm, 'Les mots de passe ne correspondent pas');
                isValid = false;
            }
        }

        const terms = form.querySelector('input[name="terms"]');
        if (terms && !terms.checked) {
            this.showFieldError(terms, 'Veuillez accepter les conditions générales');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Required field
        if (field.hasAttribute('required') && !value) {
            message = 'Ce champ est obligatoire';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value && !this.validateEmail(value)) {
            message = 'Adresse email invalide';
            isValid = false;
        }
        // Password validation
        else if (field.type === 'password' && value && value.length < 6) {
            message = 'Le mot de passe doit contenir au moins 6 caractères';
            isValid = false;
        }
        // Phone validation
        else if (field.type === 'tel' && value && !this.validatePhone(value)) {
            message = 'Numéro de téléphone invalide';
            isValid = false;
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('border-red-500', 'focus:ring-red-500');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('border-red-500', 'focus:ring-red-500');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    removeAllFieldErrors(form) {
        form.querySelectorAll('.field-error').forEach(error => error.remove());
        form.querySelectorAll('.border-red-500').forEach(field => {
            field.classList.remove('border-red-500', 'focus:ring-red-500');
        });
    }

    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 8 && cleaned.length <= 15;
    }

    showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        document.querySelectorAll('.form-notification').forEach(n => n.remove());

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const icons = {
            success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>`,
            error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                   </svg>`,
            info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>`
        };

        const notification = document.createElement('div');
        notification.className = `form-notification fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                ${icons[type]}
                <span class="font-medium">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animation d'entrée
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Suppression automatique
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, type === 'success' ? 4000 : 3000);
    }

    async simulateAPICall(delay = 1500) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler 95% de succès
                if (Math.random() < 0.95) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulation d\'erreur réseau'));
                }
            }, delay);
        });
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics 4 / Custom analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        console.log('Form event tracked:', eventName, data);
        
        // Stocker localement pour analytics
        const events = JSON.parse(localStorage.getItem('form_events') || '[]');
        events.push({
            event: eventName,
            data,
            timestamp: Date.now(),
            url: window.location.href
        });
        localStorage.setItem('form_events', JSON.stringify(events.slice(-50))); // Garder 50 derniers
    }
}

// Initialiser le gestionnaire de formulaires
document.addEventListener('DOMContentLoaded', () => {
    window.formsManager = new FormsManager();
});

console.log('Enhanced forms system loaded ✅');