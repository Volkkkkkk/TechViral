/**
 * Core Web Vitals Dashboard - TechViral
 * Version "Acier" : Monitoring + Alertes temps réel
 */
class VitalsDashboard {
    constructor() {
        this.isActive = false;
        this.vitalsHistory = [];
        this.alertThresholds = {
            LCP: { warning: 2500, critical: 4000 },
            FID: { warning: 100, critical: 300 },
            CLS: { warning: 0.1, critical: 0.25 },
            FCP: { warning: 1800, critical: 3000 },
            TTFB: { warning: 800, critical: 1800 }
        };
        this.alertQueue = [];
        this.dashboardElement = null;
        
        this.init();
    }

    /**
     * Initialise le dashboard
     */
    init() {
        this.createDashboard();
        this.setupEventListeners();
        this.startDataCollection();
        
        // Afficher seulement en développement par défaut
        if (this.isDevelopment()) {
            this.show();
        }
        
        console.log('📊 Vitals Dashboard initialisé');
    }

    /**
     * Crée l'interface dashboard
     */
    createDashboard() {
        this.dashboardElement = document.createElement('div');
        this.dashboardElement.id = 'vitals-dashboard';
        this.dashboardElement.className = 'vitals-dashboard fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 z-50 w-80 transform translate-x-full transition-transform duration-300';
        
        this.dashboardElement.innerHTML = `
            <div class="dashboard-header flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                    Core Web Vitals
                </h3>
                <div class="dashboard-controls flex items-center space-x-2">
                    <button class="vitals-refresh text-xs text-blue-600 hover:text-blue-800" title="Actualiser">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                    </button>
                    <button class="vitals-minimize text-xs text-gray-500 hover:text-gray-700" title="Réduire">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                    </button>
                    <button class="vitals-close text-xs text-red-500 hover:text-red-700" title="Fermer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="vitals-metrics space-y-2">
                    <!-- Métriques seront injectées ici -->
                </div>
                
                <div class="vitals-alerts mt-3 max-h-20 overflow-y-auto">
                    <!-- Alertes seront injectées ici -->
                </div>
                
                <div class="vitals-summary mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                    <div class="flex justify-between">
                        <span>Score global:</span>
                        <span class="vitals-score font-bold">--</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Page:</span>
                        <span class="vitals-page-type">--</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.dashboardElement);
    }

    /**
     * Configure les event listeners
     */
    setupEventListeners() {
        // Contrôles dashboard
        this.dashboardElement.querySelector('.vitals-close').addEventListener('click', () => this.hide());
        this.dashboardElement.querySelector('.vitals-minimize').addEventListener('click', () => this.toggle());
        this.dashboardElement.querySelector('.vitals-refresh').addEventListener('click', () => this.refresh());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+V pour toggle dashboard
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyV') {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Écouter données performance monitor
        if (window.performanceMonitor) {
            this.connectToMonitor();
        }
    }

    /**
     * Connecte au Performance Monitor
     */
    connectToMonitor() {
        // Polling des métriques
        setInterval(() => {
            if (this.isActive) {
                this.updateMetrics();
            }
        }, 1000);
        
        // Hook sur nouvelles métriques
        const originalReportMetric = window.performanceMonitor.reportMetric;
        window.performanceMonitor.reportMetric = (name, value) => {
            originalReportMetric.call(window.performanceMonitor, name, value);
            this.onNewMetric(name, value);
        };
    }

    /**
     * Démarre collecte données
     */
    startDataCollection() {
        this.collectInitialData();
        
        // Collecte périodique
        setInterval(() => {
            this.collectVitalsSnapshot();
        }, 5000);
    }

    /**
     * Collecte données initiales
     */
    collectInitialData() {
        if (!window.performanceMonitor) return;
        
        const metrics = window.performanceMonitor.getMetrics();
        Object.entries(metrics).forEach(([name, data]) => {
            if (['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].includes(name)) {
                this.onNewMetric(name, data.value);
            }
        });
    }

    /**
     * Nouvelle métrique reçue
     */
    onNewMetric(name, value) {
        if (!this.isActive) return;
        
        // Ajouter à l'historique
        this.vitalsHistory.push({
            metric: name,
            value: value,
            timestamp: Date.now(),
            url: window.location.href
        });
        
        // Garder seulement les 100 dernières mesures
        if (this.vitalsHistory.length > 100) {
            this.vitalsHistory = this.vitalsHistory.slice(-100);
        }
        
        // Vérifier alertes
        this.checkAlert(name, value);
        
        // Mettre à jour affichage
        this.updateDisplay();
    }

    /**
     * Vérifie alertes
     */
    checkAlert(metric, value) {
        const thresholds = this.alertThresholds[metric];
        if (!thresholds) return;
        
        let alertLevel = null;
        let alertMessage = '';
        
        if (value >= thresholds.critical) {
            alertLevel = 'critical';
            alertMessage = `${metric} critique: ${Math.round(value)}${this.getUnit(metric)}`;
        } else if (value >= thresholds.warning) {
            alertLevel = 'warning';
            alertMessage = `${metric} élevé: ${Math.round(value)}${this.getUnit(metric)}`;
        }
        
        if (alertLevel) {
            this.addAlert(alertLevel, alertMessage);
            this.sendAlert(metric, value, alertLevel);
        }
    }

    /**
     * Ajoute alerte au dashboard
     */
    addAlert(level, message) {
        const alert = {
            level,
            message,
            timestamp: Date.now()
        };
        
        this.alertQueue.push(alert);
        
        // Garder seulement les 10 dernières alertes
        if (this.alertQueue.length > 10) {
            this.alertQueue = this.alertQueue.slice(-10);
        }
        
        this.updateAlertsDisplay();
    }

    /**
     * Envoie alerte (notifications, analytics, etc.)
     */
    sendAlert(metric, value, level) {
        // Analytics
        if (window.ga4Tracker) {
            window.ga4Tracker.trackCustomEvent('performance_alert', {
                metric: metric,
                value: Math.round(value),
                level: level,
                page_type: this.getPageType()
            });
        }
        
        // Console
        const emoji = level === 'critical' ? '🚨' : '⚠️';
        console.warn(`${emoji} Core Web Vital Alert: ${metric} ${Math.round(value)}${this.getUnit(metric)} (${level})`);
        
        // Notification browser si supportée et autorisée
        this.showBrowserNotification(metric, value, level);
    }

    /**
     * Affiche notification navigateur
     */
    showBrowserNotification(metric, value, level) {
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return;
        }
        
        if (level === 'critical') {
            new Notification('Performance Critique', {
                body: `${metric}: ${Math.round(value)}${this.getUnit(metric)} sur ${this.getPageType()}`,
                icon: '/assets/icons/warning.png',
                tag: 'performance-alert'
            });
        }
    }

    /**
     * Met à jour métriques affichées
     */
    updateMetrics() {
        if (!window.performanceMonitor) return;
        
        const metrics = window.performanceMonitor.getMetrics();
        const vitalsContainer = this.dashboardElement.querySelector('.vitals-metrics');
        
        const coreVitals = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
        
        vitalsContainer.innerHTML = coreVitals.map(metric => {
            const data = metrics[metric];
            if (!data) return '';
            
            const value = Math.round(data.value);
            const rating = data.rating;
            const colorClass = this.getRatingColor(rating);
            const unit = this.getUnit(metric);
            
            return `
                <div class="vital-metric flex justify-between items-center">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">${metric}:</span>
                    <span class="text-xs font-bold ${colorClass}">${value}${unit}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Met à jour affichage complet
     */
    updateDisplay() {
        this.updateMetrics();
        this.updateSummary();
        this.updateAlertsDisplay();
    }

    /**
     * Met à jour résumé
     */
    updateSummary() {
        if (!window.performanceMonitor) return;
        
        const summary = window.performanceMonitor.generateSummary();
        
        const scoreElement = this.dashboardElement.querySelector('.vitals-score');
        const pageTypeElement = this.dashboardElement.querySelector('.vitals-page-type');
        
        if (scoreElement) {
            scoreElement.textContent = `${summary.overallScore}%`;
            scoreElement.className = `vitals-score font-bold ${this.getScoreColor(summary.overallScore)}`;
        }
        
        if (pageTypeElement) {
            pageTypeElement.textContent = this.getPageType();
        }
    }

    /**
     * Met à jour affichage alertes
     */
    updateAlertsDisplay() {
        const alertsContainer = this.dashboardElement.querySelector('.vitals-alerts');
        
        if (this.alertQueue.length === 0) {
            alertsContainer.innerHTML = '<div class="text-xs text-gray-500">Aucune alerte</div>';
            return;
        }
        
        alertsContainer.innerHTML = this.alertQueue.slice(-5).reverse().map(alert => {
            const timeAgo = this.getTimeAgo(alert.timestamp);
            const colorClass = alert.level === 'critical' ? 'text-red-600' : 'text-yellow-600';
            
            return `
                <div class="alert-item text-xs ${colorClass} mb-1">
                    <span class="font-medium">${alert.message}</span>
                    <span class="text-gray-500 ml-2">${timeAgo}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Collecte snapshot des vitals
     */
    collectVitalsSnapshot() {
        if (!window.performanceMonitor || !this.isActive) return;
        
        const metrics = window.performanceMonitor.getMetrics();
        const snapshot = {
            timestamp: Date.now(),
            url: window.location.href,
            pageType: this.getPageType(),
            vitals: {}
        };
        
        ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].forEach(metric => {
            if (metrics[metric]) {
                snapshot.vitals[metric] = {
                    value: metrics[metric].value,
                    rating: metrics[metric].rating
                };
            }
        });
        
        // Stocker localement pour historique
        this.storeSnapshot(snapshot);
    }

    /**
     * Stocke snapshot
     */
    storeSnapshot(snapshot) {
        try {
            const key = 'vitals_snapshots';
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            
            stored.push(snapshot);
            
            // Garder seulement les 50 derniers snapshots
            if (stored.length > 50) {
                stored.splice(0, stored.length - 50);
            }
            
            localStorage.setItem(key, JSON.stringify(stored));
        } catch (e) {
            console.warn('Impossible de stocker snapshot vitals:', e);
        }
    }

    /**
     * Utilitaires d'affichage
     */
    getRatingColor(rating) {
        switch (rating) {
            case 'good': return 'text-green-600';
            case 'needs-improvement': return 'text-yellow-600';
            case 'poor': return 'text-red-600';
            default: return 'text-gray-600';
        }
    }

    getScoreColor(score) {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    }

    getUnit(metric) {
        switch (metric) {
            case 'CLS': return '';
            case 'LCP':
            case 'FID':
            case 'FCP':
            case 'TTFB': return 'ms';
            default: return '';
        }
    }

    getPageType() {
        const path = window.location.pathname;
        if (path.includes('/products/')) return 'Product';
        if (path.includes('/categories/')) return 'Category';
        if (path.includes('/cart')) return 'Cart';
        if (path === '/' || path === '/index.html') return 'Home';
        return 'Other';
    }

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        return `${Math.floor(minutes / 60)}h`;
    }

    /**
     * Contrôles dashboard
     */
    show() {
        this.isActive = true;
        this.dashboardElement.classList.remove('translate-x-full');
        this.refresh();
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

    refresh() {
        this.updateDisplay();
        console.log('📊 Vitals Dashboard actualisé');
    }

    /**
     * Vérifie si environnement développement
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=1');
    }

    /**
     * Export données
     */
    exportData() {
        const data = {
            timestamp: Date.now(),
            url: window.location.href,
            vitalsHistory: this.vitalsHistory,
            alertQueue: this.alertQueue,
            currentMetrics: window.performanceMonitor ? window.performanceMonitor.getMetrics() : {},
            summary: window.performanceMonitor ? window.performanceMonitor.generateSummary() : {}
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `vitals-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Données vitals exportées');
    }

    /**
     * API publique
     */
    getStats() {
        return {
            isActive: this.isActive,
            metricsCount: this.vitalsHistory.length,
            alertsCount: this.alertQueue.length,
            recentAlerts: this.alertQueue.slice(-5)
        };
    }
}

// Instance globale
if (typeof window !== 'undefined') {
    // Attendre que Performance Monitor soit prêt
    if (window.performanceMonitor) {
        window.vitalsDashboard = new VitalsDashboard();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.vitalsDashboard = new VitalsDashboard();
            }, 1000);
        });
    }

    // Demander permission notifications si en développement
    if (window.location.hostname === 'localhost' && 'Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VitalsDashboard;
}