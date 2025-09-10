/**
 * Error Monitor Dashboard - TechViral
 * Version "Acier" : Monitoring erreurs production + alertes
 */
class ErrorMonitor {
    constructor() {
        this.errors = [];
        this.isActive = false;
        this.dashboardElement = null;
        this.maxErrors = 100;
        this.severity = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
            CRITICAL: 4
        };
        
        // Configuration alertes
        this.alertThresholds = {
            errorRate: 5,        // 5 erreurs/minute
            jsErrorRate: 3,      // 3 erreurs JS/minute
            networkErrorRate: 2  // 2 erreurs réseau/minute
        };
        
        this.errorCounts = {
            total: 0,
            javascript: 0,
            network: 0,
            console: 0,
            unhandled: 0
        };
        
        this.init();
    }

    /**
     * Initialise le monitoring d'erreurs
     */
    init() {
        this.setupErrorListeners();
        this.createErrorDashboard();
        this.startPeriodicChecks();
        
        // Afficher seulement en développement par défaut
        if (this.isDevelopment()) {
            this.show();
        }
        
        console.log('🚨 Error Monitor initialisé');
    }

    /**
     * Configure les listeners d'erreurs
     */
    setupErrorListeners() {
        // Erreurs JavaScript globales
        window.addEventListener('error', (event) => {
            this.handleJavaScriptError(event);
        });

        // Erreurs promises non gérées
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });

        // Erreurs de ressources (images, scripts, etc.)
        window.addEventListener('error', (event) => {
            if (event.target !== window && event.target.tagName) {
                this.handleResourceError(event);
            }
        }, true);

        // Hook console.error
        this.hookConsoleError();

        // Hook fetch/XHR pour erreurs réseau
        this.hookNetworkErrors();

        // Erreurs de performance critiques
        this.setupPerformanceErrorDetection();
    }

    /**
     * Gère erreurs JavaScript
     */
    handleJavaScriptError(event) {
        const error = {
            id: this.generateErrorId(),
            type: 'javascript',
            severity: this.determineSeverity(event.error),
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error ? event.error.stack : null,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now(),
            source: this.extractSourceContext(event.filename, event.lineno)
        };

        this.addError(error);
        
        // Prévenir erreurs en cascade si critique
        if (error.severity >= this.severity.HIGH) {
            this.triggerErrorRecovery(error);
        }
    }

    /**
     * Gère promises non gérées
     */
    handleUnhandledRejection(event) {
        const error = {
            id: this.generateErrorId(),
            type: 'unhandled_promise',
            severity: this.severity.HIGH,
            message: event.reason ? event.reason.toString() : 'Unhandled Promise Rejection',
            stack: event.reason && event.reason.stack ? event.reason.stack : null,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
        };

        this.addError(error);
        
        // Empêcher l'affichage console par défaut si on gère
        event.preventDefault();
    }

    /**
     * Gère erreurs de ressources
     */
    handleResourceError(event) {
        const error = {
            id: this.generateErrorId(),
            type: 'resource',
            severity: this.determineResourceSeverity(event.target),
            message: `Failed to load: ${event.target.tagName}`,
            resource: {
                tagName: event.target.tagName,
                src: event.target.src || event.target.href,
                type: event.target.type,
                id: event.target.id,
                className: event.target.className
            },
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
        };

        this.addError(error);
        
        // Fallback automatique pour ressources critiques
        this.attemptResourceFallback(event.target, error);
    }

    /**
     * Hook console.error
     */
    hookConsoleError() {
        const originalError = console.error;
        console.error = (...args) => {
            // Appeler console.error original
            originalError.apply(console, args);
            
            const error = {
                id: this.generateErrorId(),
                type: 'console',
                severity: this.severity.MEDIUM,
                message: args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' '),
                args: args,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now(),
                stack: new Error().stack
            };
            
            this.addError(error);
        };
    }

    /**
     * Hook erreurs réseau
     */
    hookNetworkErrors() {
        // Hook fetch
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch.apply(window, args);
                
                if (!response.ok) {
                    this.handleNetworkError('fetch', args[0], response.status, response.statusText);
                }
                
                return response;
            } catch (error) {
                this.handleNetworkError('fetch', args[0], null, error.message);
                throw error;
            }
        };

        // Hook XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('error', () => {
                window.errorMonitor.handleNetworkError('xhr', this._url, null, 'Network Error');
            });
            
            this.addEventListener('load', () => {
                if (this.status >= 400) {
                    window.errorMonitor.handleNetworkError('xhr', this._url, this.status, this.statusText);
                }
            });
            
            return originalSend.apply(this, args);
        };
    }

    /**
     * Gère erreurs réseau
     */
    handleNetworkError(type, url, status, message) {
        const error = {
            id: this.generateErrorId(),
            type: 'network',
            severity: this.determineNetworkSeverity(status),
            message: `${type.toUpperCase()} Error: ${message}`,
            network: {
                type: type,
                url: url,
                status: status,
                method: type === 'xhr' ? 'Unknown' : 'GET'
            },
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: Date.now()
        };

        this.addError(error);
    }

    /**
     * Détection erreurs performance
     */
    setupPerformanceErrorDetection() {
        // Erreurs mémoire
        if ('memory' in performance) {
            setInterval(() => {
                const memoryUsage = performance.memory.usedJSHeapSize;
                const memoryLimit = performance.memory.jsHeapSizeLimit;
                
                if (memoryUsage / memoryLimit > 0.9) {
                    this.addError({
                        id: this.generateErrorId(),
                        type: 'performance',
                        severity: this.severity.HIGH,
                        message: 'High memory usage detected',
                        memory: {
                            used: memoryUsage,
                            limit: memoryLimit,
                            percentage: Math.round((memoryUsage / memoryLimit) * 100)
                        },
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                        timestamp: Date.now()
                    });
                }
            }, 10000);
        }

        // Erreurs de performance Web Vitals
        if (window.performanceMonitor) {
            const originalCheckAlert = window.performanceMonitor.checkAlert;
            window.performanceMonitor.checkAlert = (metric, value) => {
                originalCheckAlert.call(window.performanceMonitor, metric, value);
                
                const rating = window.performanceMonitor.getRating(metric, value);
                if (rating === 'poor') {
                    this.addError({
                        id: this.generateErrorId(),
                        type: 'performance',
                        severity: this.severity.MEDIUM,
                        message: `Poor ${metric} performance: ${Math.round(value)}ms`,
                        performance: {
                            metric: metric,
                            value: value,
                            rating: rating
                        },
                        userAgent: navigator.userAgent,
                        url: window.location.href,
                        timestamp: Date.now()
                    });
                }
            };
        }
    }

    /**
     * Ajoute erreur au monitoring
     */
    addError(error) {
        this.errors.unshift(error);
        this.errorCounts.total++;
        this.errorCounts[error.type] = (this.errorCounts[error.type] || 0) + 1;
        
        // Limiter nombre d'erreurs stockées
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(0, this.maxErrors);
        }
        
        // Mise à jour dashboard
        if (this.isActive) {
            this.updateDashboard();
        }
        
        // Vérifier seuils d'alerte
        this.checkAlertThresholds();
        
        // Reporter erreur
        this.reportError(error);
        
        // Log critique immédiat
        if (error.severity >= this.severity.HIGH) {
            console.error('🚨 Critical Error Detected:', error);
        }
    }

    /**
     * Crée dashboard d'erreurs
     */
    createErrorDashboard() {
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.id = 'error-monitor-dashboard';
        this.dashboardElement.className = 'error-dashboard fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-red-200 dark:border-red-700 w-96 transform translate-x-full transition-transform duration-300 z-50';
        
        this.dashboardElement.innerHTML = `
            <div class="dashboard-header p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <svg class="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                        Error Monitor
                    </h3>
                    <div class="flex items-center space-x-2">
                        <span class="error-count px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">0</span>
                        <button class="error-clear text-xs text-gray-500 hover:text-gray-700" title="Clear">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                        <button class="error-close text-xs text-red-500 hover:text-red-700" title="Close">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="error-stats flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-3">
                    <span>JS: <span class="js-count">0</span></span>
                    <span>Network: <span class="network-count">0</span></span>
                    <span>Resource: <span class="resource-count">0</span></span>
                    <span>Console: <span class="console-count">0</span></span>
                </div>
            </div>
            
            <div class="dashboard-content max-h-96 overflow-y-auto">
                <div class="error-list">
                    <div class="no-errors text-center py-8 text-gray-500">
                        <svg class="w-12 h-12 mx-auto mb-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                        <p>Aucune erreur détectée</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-footer p-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-500">Dernière mise à jour: <span class="last-update">--</span></span>
                    <button class="error-export text-blue-600 hover:text-blue-800">Exporter</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.dashboardElement);
        this.setupDashboardEvents();
    }

    /**
     * Configure événements dashboard
     */
    setupDashboardEvents() {
        // Contrôles dashboard
        this.dashboardElement.querySelector('.error-close').addEventListener('click', () => this.hide());
        this.dashboardElement.querySelector('.error-clear').addEventListener('click', () => this.clearErrors());
        this.dashboardElement.querySelector('.error-export').addEventListener('click', () => this.exportErrors());
        
        // Raccourci clavier Ctrl+Shift+E
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    /**
     * Met à jour le dashboard
     */
    updateDashboard() {
        if (!this.dashboardElement) return;
        
        // Mise à jour compteurs
        this.dashboardElement.querySelector('.error-count').textContent = this.errors.length;
        this.dashboardElement.querySelector('.js-count').textContent = this.errorCounts.javascript || 0;
        this.dashboardElement.querySelector('.network-count').textContent = this.errorCounts.network || 0;
        this.dashboardElement.querySelector('.resource-count').textContent = this.errorCounts.resource || 0;
        this.dashboardElement.querySelector('.console-count').textContent = this.errorCounts.console || 0;
        this.dashboardElement.querySelector('.last-update').textContent = new Date().toLocaleTimeString();
        
        // Mise à jour liste erreurs
        this.updateErrorList();
    }

    /**
     * Met à jour liste des erreurs
     */
    updateErrorList() {
        const errorList = this.dashboardElement.querySelector('.error-list');
        const noErrors = errorList.querySelector('.no-errors');
        
        if (this.errors.length === 0) {
            if (noErrors) noErrors.style.display = 'block';
            return;
        }
        
        if (noErrors) noErrors.style.display = 'none';
        
        const recentErrors = this.errors.slice(0, 10); // 10 erreurs les plus récentes
        
        errorList.innerHTML = recentErrors.map(error => `
            <div class="error-item p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" data-error-id="${error.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="error-type px-2 py-1 text-xs font-medium rounded ${this.getTypeColor(error.type)}">
                                ${error.type}
                            </span>
                            <span class="error-severity px-2 py-1 text-xs font-medium rounded ${this.getSeverityColor(error.severity)}">
                                ${this.getSeverityText(error.severity)}
                            </span>
                        </div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate" title="${error.message}">
                            ${error.message}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            ${this.getTimeAgo(error.timestamp)}
                            ${error.filename ? ` • ${this.getFilename(error.filename)}:${error.lineno}` : ''}
                        </p>
                    </div>
                    <button class="error-details ml-2 text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Event listeners pour détails erreurs
        errorList.querySelectorAll('.error-item').forEach(item => {
            item.addEventListener('click', () => {
                const errorId = item.dataset.errorId;
                const error = this.errors.find(e => e.id === errorId);
                if (error) {
                    this.showErrorDetails(error);
                }
            });
        });
    }

    /**
     * Affiche détails d'une erreur
     */
    showErrorDetails(error) {
        const modal = document.createElement('div');
        modal.className = 'error-details-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                <div class="modal-header p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Détails de l'erreur</h2>
                        <button class="modal-close text-gray-400 hover:text-gray-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="modal-body p-6">
                    <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">${JSON.stringify(error, null, 2)}</pre>
                </div>
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    /**
     * Vérifications périodiques
     */
    startPeriodicChecks() {
        setInterval(() => {
            this.checkErrorRates();
            this.cleanOldErrors();
        }, 60000); // Chaque minute
    }

    /**
     * Vérifie taux d'erreurs
     */
    checkErrorRates() {
        const oneMinuteAgo = Date.now() - 60000;
        const recentErrors = this.errors.filter(error => error.timestamp > oneMinuteAgo);
        
        const rates = {
            total: recentErrors.length,
            javascript: recentErrors.filter(e => e.type === 'javascript').length,
            network: recentErrors.filter(e => e.type === 'network').length
        };
        
        // Alertes si seuils dépassés
        if (rates.total > this.alertThresholds.errorRate) {
            this.triggerAlert('HIGH_ERROR_RATE', `${rates.total} erreurs/minute`);
        }
        
        if (rates.javascript > this.alertThresholds.jsErrorRate) {
            this.triggerAlert('HIGH_JS_ERROR_RATE', `${rates.javascript} erreurs JS/minute`);
        }
        
        if (rates.network > this.alertThresholds.networkErrorRate) {
            this.triggerAlert('HIGH_NETWORK_ERROR_RATE', `${rates.network} erreurs réseau/minute`);
        }
    }

    /**
     * Nettoie anciennes erreurs
     */
    cleanOldErrors() {
        const oneHourAgo = Date.now() - 3600000;
        const before = this.errors.length;
        this.errors = this.errors.filter(error => error.timestamp > oneHourAgo);
        
        if (before !== this.errors.length && this.isActive) {
            this.updateDashboard();
        }
    }

    /**
     * Vérification seuils d'alerte
     */
    checkAlertThresholds() {
        // Alertes basées sur patterns
        const criticalErrors = this.errors.filter(e => e.severity >= this.severity.HIGH);
        if (criticalErrors.length >= 3) {
            this.triggerAlert('MULTIPLE_CRITICAL_ERRORS', `${criticalErrors.length} erreurs critiques`);
        }
    }

    /**
     * Déclenche alerte
     */
    triggerAlert(type, message) {
        console.error(`🚨 Error Monitor Alert - ${type}: ${message}`);
        
        // Analytics
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('error_alert', {
                alert_type: type,
                alert_message: message
            });
        }
        
        // Notification si critique
        if (type.includes('CRITICAL') && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Erreur Critique Détectée', {
                body: message,
                icon: '/assets/icons/error.png',
                tag: 'error-alert'
            });
        }
    }

    /**
     * Récupération automatique d'erreurs
     */
    triggerErrorRecovery(error) {
        console.log('🔄 Tentative de récupération automatique pour:', error.type);
        
        switch (error.type) {
            case 'javascript':
                // Recharger scripts critiques
                this.reloadCriticalScripts();
                break;
            case 'network':
                // Retry avec fallback
                this.retryFailedRequests();
                break;
            case 'resource':
                // Fallback CDN
                this.loadResourceFallbacks();
                break;
        }
    }

    /**
     * Fallback pour ressources
     */
    attemptResourceFallback(element, error) {
        if (element.tagName === 'SCRIPT' && element.src) {
            // Essayer CDN alternatif
            const fallbackSrc = element.src.replace('cdn.jsdelivr.net', 'unpkg.com');
            if (fallbackSrc !== element.src) {
                console.log('🔄 Tentative fallback script:', fallbackSrc);
                const newScript = document.createElement('script');
                newScript.src = fallbackSrc;
                element.parentNode.replaceChild(newScript, element);
            }
        }
    }

    /**
     * Détermine sévérité
     */
    determineSeverity(error) {
        if (!error) return this.severity.LOW;
        
        const message = error.message || error.toString();
        
        // Erreurs critiques
        if (message.includes('ReferenceError') || 
            message.includes('TypeError') || 
            message.includes('SyntaxError')) {
            return this.severity.HIGH;
        }
        
        // Erreurs moyennes
        if (message.includes('NetworkError') || 
            message.includes('Failed to fetch')) {
            return this.severity.MEDIUM;
        }
        
        return this.severity.LOW;
    }

    determineResourceSeverity(element) {
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'script') return this.severity.HIGH;
        if (tagName === 'link' && element.rel === 'stylesheet') return this.severity.MEDIUM;
        if (tagName === 'img') return this.severity.LOW;
        
        return this.severity.MEDIUM;
    }

    determineNetworkSeverity(status) {
        if (!status) return this.severity.HIGH; // Network error
        if (status >= 500) return this.severity.HIGH;
        if (status >= 400) return this.severity.MEDIUM;
        return this.severity.LOW;
    }

    /**
     * Utilitaires d'affichage
     */
    getTypeColor(type) {
        const colors = {
            javascript: 'bg-red-100 text-red-800',
            network: 'bg-blue-100 text-blue-800',
            resource: 'bg-yellow-100 text-yellow-800',
            console: 'bg-gray-100 text-gray-800',
            performance: 'bg-purple-100 text-purple-800',
            unhandled_promise: 'bg-orange-100 text-orange-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    }

    getSeverityColor(severity) {
        const colors = {
            [this.severity.LOW]: 'bg-green-100 text-green-800',
            [this.severity.MEDIUM]: 'bg-yellow-100 text-yellow-800',
            [this.severity.HIGH]: 'bg-orange-100 text-orange-800',
            [this.severity.CRITICAL]: 'bg-red-100 text-red-800'
        };
        return colors[severity] || 'bg-gray-100 text-gray-800';
    }

    getSeverityText(severity) {
        const texts = {
            [this.severity.LOW]: 'Low',
            [this.severity.MEDIUM]: 'Medium',
            [this.severity.HIGH]: 'High',
            [this.severity.CRITICAL]: 'Critical'
        };
        return texts[severity] || 'Unknown';
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        return `${Math.floor(minutes / 60)}h`;
    }

    getFilename(path) {
        return path ? path.split('/').pop() : '';
    }

    /**
     * Extraction contexte source
     */
    extractSourceContext(filename, lineno) {
        // En production, on pourrait récupérer le contexte via source maps
        return {
            filename: this.getFilename(filename),
            line: lineno,
            context: null // Placeholder pour contexte source
        };
    }

    /**
     * Génération ID erreur
     */
    generateErrorId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Reporter erreur
     */
    reportError(error) {
        // En production, envoyer à service monitoring (Sentry, Bugsnag, etc.)
        if (this.isDevelopment()) {
            console.log('📊 Error Reported:', error);
            return;
        }
        
        // Exemple envoi à service externe
        /*
        try {
            fetch('/api/errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(error),
                keepalive: true
            }).catch(e => console.warn('Error reporting failed:', e));
        } catch (e) {
            console.warn('Error reporting not available:', e);
        }
        */
    }

    /**
     * Contrôles dashboard
     */
    show() {
        this.isActive = true;
        this.dashboardElement.classList.remove('translate-x-full');
        this.updateDashboard();
    }

    hide() {
        this.isActive = false;
        this.dashboardElement.classList.add('translate-x-full');
    }

    toggle() {
        if (this.isActive) {
            this.hide();
        } else {
            this.show();
        }
    }

    clearErrors() {
        this.errors = [];
        this.errorCounts = {
            total: 0,
            javascript: 0,
            network: 0,
            console: 0,
            unhandled: 0
        };
        this.updateDashboard();
        console.log('🧹 Erreurs effacées');
    }

    exportErrors() {
        const data = {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            errors: this.errors,
            summary: {
                total: this.errors.length,
                bySeverity: {
                    low: this.errors.filter(e => e.severity === this.severity.LOW).length,
                    medium: this.errors.filter(e => e.severity === this.severity.MEDIUM).length,
                    high: this.errors.filter(e => e.severity === this.severity.HIGH).length,
                    critical: this.errors.filter(e => e.severity === this.severity.CRITICAL).length
                },
                byType: this.errorCounts
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Rapport d\'erreurs exporté');
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=1');
    }

    /**
     * API publique
     */
    getErrorStats() {
        return {
            total: this.errors.length,
            counts: this.errorCounts,
            recentErrors: this.errors.slice(0, 5),
            isActive: this.isActive
        };
    }

    // Méthodes de récupération (placeholders)
    reloadCriticalScripts() {
        console.log('🔄 Reloading critical scripts...');
    }

    retryFailedRequests() {
        console.log('🔄 Retrying failed requests...');
    }

    loadResourceFallbacks() {
        console.log('🔄 Loading resource fallbacks...');
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    window.errorMonitor = new ErrorMonitor();
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorMonitor;
}