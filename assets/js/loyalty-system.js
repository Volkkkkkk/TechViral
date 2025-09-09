// TechViral Loyalty & AI Chat System v1.0
// Programme de fidélité avec chat IA intégré

class LoyaltySystem {
    constructor() {
        this.userPoints = this.loadUserPoints();
        this.levels = this.initializeLevels();
        this.rewards = this.initializeRewards();
        this.chatAI = new TechViralChatAI();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserInterface();
        this.checkMilestones();
        console.log('💎 Loyalty System initialized');
    }

    initializeLevels() {
        return [
            { name: 'Découvreur', min: 0, max: 99, multiplier: 1, color: '#94A3B8' },
            { name: 'Amateur', min: 100, max: 299, multiplier: 1.2, color: '#10B981' },
            { name: 'Passionné', min: 300, max: 599, multiplier: 1.5, color: '#3B82F6' },
            { name: 'Expert', min: 600, max: 999, multiplier: 1.8, color: '#8B5CF6' },
            { name: 'Maître Tech', min: 1000, max: Infinity, multiplier: 2.2, color: '#F59E0B' }
        ];
    }

    initializeRewards() {
        return [
            { id: 'shipping', name: 'Livraison gratuite', cost: 50, type: 'service' },
            { id: 'discount5', name: '5% de réduction', cost: 100, type: 'discount', value: 5 },
            { id: 'discount10', name: '10% de réduction', cost: 200, type: 'discount', value: 10 },
            { id: 'earlyAccess', name: 'Accès anticipé nouveautés', cost: 150, type: 'access' },
            { id: 'vipSupport', name: 'Support VIP prioritaire', cost: 300, type: 'service' },
            { id: 'discount20', name: '20% de réduction', cost: 500, type: 'discount', value: 20 },
            { id: 'exclusiveProducts', name: 'Produits exclusifs', cost: 800, type: 'access' }
        ];
    }

    // Gestion des points
    addPoints(action, amount = null) {
        const pointsEarned = amount || this.getPointsForAction(action);
        const currentLevel = this.getCurrentLevel();
        const finalPoints = Math.round(pointsEarned * currentLevel.multiplier);
        
        this.userPoints.total += finalPoints;
        this.userPoints.available += finalPoints;
        
        this.recordPointsHistory(action, finalPoints);
        this.saveUserPoints();
        this.checkLevelUp(finalPoints);
        this.showPointsNotification(action, finalPoints);
        
        return finalPoints;
    }

    getPointsForAction(action) {
        const pointsMap = {
            'account_created': 50,
            'first_purchase': 100,
            'product_review': 25,
            'product_share': 10,
            'newsletter_signup': 20,
            'purchase': 1, // 1 point per euro
            'referral': 200,
            'daily_visit': 5,
            'wishlist_add': 5,
            'social_follow': 15
        };
        return pointsMap[action] || 0;
    }

    // Échange de points
    redeemReward(rewardId) {
        const reward = this.rewards.find(r => r.id === rewardId);
        if (!reward) return false;

        if (this.userPoints.available < reward.cost) {
            this.showNotification('Points insuffisants', 'error');
            return false;
        }

        this.userPoints.available -= reward.cost;
        this.userPoints.redeemed += reward.cost;
        
        this.applyReward(reward);
        this.saveUserPoints();
        this.showNotification(`Récompense "${reward.name}" échangée !`, 'success');
        
        return true;
    }

    applyReward(reward) {
        switch (reward.type) {
            case 'discount':
                this.createDiscountCode(reward);
                break;
            case 'service':
                this.activateService(reward);
                break;
            case 'access':
                this.grantAccess(reward);
                break;
        }
    }

    createDiscountCode(reward) {
        const code = `FIDELITE${reward.value}${Date.now().toString().slice(-4)}`;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        
        const discountData = {
            code,
            discount: reward.value,
            expiry: expiry.toISOString(),
            used: false
        };
        
        const savedCodes = JSON.parse(localStorage.getItem('discountCodes') || '[]');
        savedCodes.push(discountData);
        localStorage.setItem('discountCodes', JSON.stringify(savedCodes));
        
        this.showDiscountModal(code, reward.value);
    }

    // Interface utilisateur
    displayLoyaltyWidget() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        const progressPercent = this.getLevelProgress();

        return `
            <div id="loyaltyWidget" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-lg">Programme Fidélité</h3>
                    <div class="flex items-center">
                        <span class="text-2xl mr-2">💎</span>
                        <span class="text-xl font-bold">${this.userPoints.available}</span>
                    </div>
                </div>
                
                <div class="mb-3">
                    <div class="flex justify-between text-sm mb-1">
                        <span>Niveau: ${currentLevel.name}</span>
                        ${nextLevel ? `<span>Prochain: ${nextLevel.name}</span>` : '<span>Niveau Max!</span>'}
                    </div>
                    <div class="w-full bg-white/20 rounded-full h-2">
                        <div class="bg-white h-2 rounded-full transition-all duration-500" 
                             style="width: ${progressPercent}%"></div>
                    </div>
                    ${nextLevel ? `<p class="text-xs mt-1">${nextLevel.min - this.userPoints.total} points pour le niveau suivant</p>` : ''}
                </div>
                
                <div class="flex justify-between">
                    <button onclick="loyaltySystem.openRewardsModal()" 
                            class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors">
                        🎁 Récompenses
                    </button>
                    <button onclick="loyaltySystem.chatAI.openChat()" 
                            class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors">
                        🤖 Assistant IA
                    </button>
                </div>
            </div>
        `;
    }

    // Niveaux et progression
    getCurrentLevel() {
        return this.levels.find(level => 
            this.userPoints.total >= level.min && this.userPoints.total <= level.max
        ) || this.levels[0];
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        return this.levels.find(level => level.min > currentLevel.max);
    }

    getLevelProgress() {
        const currentLevel = this.getCurrentLevel();
        if (currentLevel.max === Infinity) return 100;
        
        const progress = (this.userPoints.total - currentLevel.min) / (currentLevel.max - currentLevel.min) * 100;
        return Math.min(Math.max(progress, 0), 100);
    }

    checkLevelUp(pointsEarned) {
        const oldLevel = this.getCurrentLevel();
        const newTotal = this.userPoints.total;
        const newLevel = this.levels.find(level => 
            newTotal >= level.min && newTotal <= level.max
        );

        if (newLevel && newLevel.name !== oldLevel.name) {
            this.showLevelUpModal(newLevel);
        }
    }

    // Persistance des données
    loadUserPoints() {
        try {
            const saved = localStorage.getItem('userPoints');
            return saved ? JSON.parse(saved) : {
                total: 0,
                available: 0,
                redeemed: 0,
                history: []
            };
        } catch {
            return { total: 0, available: 0, redeemed: 0, history: [] };
        }
    }

    saveUserPoints() {
        localStorage.setItem('userPoints', JSON.stringify(this.userPoints));
        this.updateUserInterface();
    }

    recordPointsHistory(action, points) {
        this.userPoints.history.unshift({
            action,
            points,
            timestamp: Date.now(),
            level: this.getCurrentLevel().name
        });
        
        // Garder seulement les 100 dernières entrées
        if (this.userPoints.history.length > 100) {
            this.userPoints.history = this.userPoints.history.slice(0, 100);
        }
    }

    setupEventListeners() {
        // Points pour achats
        document.addEventListener('cart-purchase', (e) => {
            const amount = e.detail.total;
            this.addPoints('purchase', Math.floor(amount));
        });

        // Points pour avis
        document.addEventListener('review-submitted', () => {
            this.addPoints('product_review');
        });

        // Points pour partages
        document.addEventListener('product-shared', () => {
            this.addPoints('product_share');
        });

        // Points pour ajout wishlist
        document.addEventListener('wishlist-add', () => {
            this.addPoints('wishlist_add');
        });

        // Points visite quotidienne
        this.checkDailyVisit();
    }

    updateUserInterface() {
        const widget = document.getElementById('loyaltyWidget');
        if (widget) {
            widget.outerHTML = this.displayLoyaltyWidget();
        }
    }
}

// Chat IA TechViral
class TechViralChatAI {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.knowledgeBase = this.initializeKnowledge();
        this.responses = this.initializeResponses();
    }

    initializeKnowledge() {
        return {
            products: 'TechViral propose plus de 764 produits tech innovants',
            shipping: 'Livraison gratuite à partir de 50€, express en 24-48h',
            returns: 'Retours gratuits sous 30 jours, satisfaction garantie',
            payment: 'Paiement sécurisé: CB, PayPal, Apple Pay, Google Pay',
            loyalty: 'Programme fidélité avec points et niveaux exclusifs'
        };
    }

    initializeResponses() {
        return [
            {
                keywords: ['bonjour', 'salut', 'hello'],
                response: '👋 Salut ! Je suis TechBot, ton assistant IA TechViral. Comment puis-je t\'aider aujourd\'hui ?'
            },
            {
                keywords: ['produit', 'recherche', 'trouve'],
                response: '🔍 Je peux t\'aider à trouver le produit parfait ! Dis-moi ce que tu cherches: smartphone, accessoire, gadget...'
            },
            {
                keywords: ['livraison', 'expedition', 'delai'],
                response: '📦 Livraison gratuite dès 50€ ! Express 24-48h disponible. Besoin d\'infos sur une commande spécifique ?'
            },
            {
                keywords: ['retour', 'remboursement', 'échange'],
                response: '↩️ Retours gratuits sous 30 jours, no questions asked ! Process simple via ton compte.'
            },
            {
                keywords: ['fidélité', 'points', 'programme'],
                response: `💎 Tu as ${loyaltySystem?.userPoints?.available || 0} points ! Niveau ${loyaltySystem?.getCurrentLevel()?.name || 'Découvreur'}. Veux-tu voir les récompenses ?`
            }
        ];
    }

    openChat() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.createChatInterface();
        document.body.style.overflow = 'hidden';
    }

    closeChat() {
        const chatModal = document.getElementById('aiChatModal');
        if (chatModal) {
            chatModal.remove();
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    createChatInterface() {
        const chatHTML = `
            <div id="aiChatModal" class="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
                <div class="bg-white dark:bg-gray-800 w-full md:w-96 h-2/3 md:h-[600px] rounded-t-xl md:rounded-xl flex flex-col">
                    
                    <!-- Header -->
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center">
                            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                                🤖
                            </div>
                            <div>
                                <h3 class="font-semibold">TechBot</h3>
                                <p class="text-xs text-green-500">En ligne</p>
                            </div>
                        </div>
                        <button onclick="loyaltySystem.chatAI.closeChat()" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages -->
                    <div id="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-4">
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">🤖</div>
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                <p class="text-sm">Salut ! Je suis TechBot 🚀 Pose-moi toutes tes questions sur TechViral !</p>
                            </div>
                        </div>
                    </div>

                    <!-- Input -->
                    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex space-x-2">
                            <input 
                                id="chatInput" 
                                type="text" 
                                placeholder="Tape ton message..."
                                class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                            >
                            <button 
                                onclick="loyaltySystem.chatAI.sendMessage()" 
                                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                                Envoyer
                            </button>
                        </div>
                        
                        <!-- Quick actions -->
                        <div class="flex flex-wrap gap-2 mt-2">
                            <button onclick="loyaltySystem.chatAI.quickMessage('Mes commandes')" class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">📦 Mes commandes</button>
                            <button onclick="loyaltySystem.chatAI.quickMessage('Programme fidélité')" class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">💎 Fidélité</button>
                            <button onclick="loyaltySystem.chatAI.quickMessage('Nouveautés')" class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">✨ Nouveautés</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        
        // Focus sur l'input et gestion Enter
        const input = document.getElementById('chatInput');
        input.focus();
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    sendMessage(message = null) {
        const input = document.getElementById('chatInput');
        const userMessage = message || input?.value?.trim();
        
        if (!userMessage) return;
        
        this.addMessage(userMessage, 'user');
        if (input) input.value = '';
        
        // Simulated AI response avec délai réaliste
        setTimeout(() => {
            const response = this.generateResponse(userMessage);
            this.addMessage(response, 'bot');
        }, 500 + Math.random() * 1000);
    }

    quickMessage(message) {
        this.sendMessage(message);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const isBot = sender === 'bot';
        const messageHTML = `
            <div class="flex items-start ${isBot ? '' : 'flex-row-reverse'}">
                <div class="w-6 h-6 ${isBot ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-xs ${isBot ? 'mr-2' : 'ml-2'}">
                    ${isBot ? '🤖' : '👤'}
                </div>
                <div class="bg-${isBot ? 'gray-100 dark:bg-gray-700' : 'blue-500 text-white'} rounded-lg p-3 max-w-[80%]">
                    <p class="text-sm">${text}</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.conversationHistory.push({ text, sender, timestamp: Date.now() });
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Recherche de réponse dans la base
        const matchedResponse = this.responses.find(response => 
            response.keywords.some(keyword => message.includes(keyword))
        );

        if (matchedResponse) {
            return matchedResponse.response;
        }

        // Réponses contextuelles
        if (message.includes('prix') || message.includes('coût')) {
            return '💰 Nos prix sont très compétitifs ! Utilise les filtres pour trouver dans ton budget. Tu as des points fidélité à utiliser ?';
        }

        if (message.includes('nouveauté') || message.includes('nouveau')) {
            return '✨ On reçoit de nouveaux produits tech chaque semaine ! Consulte notre section "Nouveautés" pour les dernières innovations.';
        }

        // Réponse par défaut avec personnalité
        const defaultResponses = [
            '🤔 Intéressant ! Peux-tu me donner plus de détails ?',
            '💡 Laisse-moi t\'aider ! Peux-tu reformuler ta question ?',
            '🚀 Je suis là pour t\'aider ! Explique-moi ce dont tu as besoin.',
            '✨ Bonne question ! As-tu regardé dans notre FAQ ?'
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}

// Initialisation globale
window.loyaltySystem = new LoyaltySystem();