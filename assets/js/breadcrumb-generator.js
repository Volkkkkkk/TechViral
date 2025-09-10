/**
 * Breadcrumb Navigation Generator - TechViral
 * Version "Acier" : Schema.org + navigation sémantique
 */
class BreadcrumbGenerator {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.siteName = 'TechViral';
    }

    /**
     * Génère breadcrumb navigation complet avec Schema.org
     * @param {Array} breadcrumbData - Données des niveaux de navigation
     */
    generateBreadcrumb(breadcrumbData) {
        if (!breadcrumbData || breadcrumbData.length === 0) {
            console.warn('BreadcrumbGenerator: Données manquantes');
            return;
        }

        this.removeBreadcrumb();
        this.createBreadcrumbHTML(breadcrumbData);
        this.injectBreadcrumbSchema(breadcrumbData);
    }

    /**
     * Supprime breadcrumb existant
     */
    removeBreadcrumb() {
        const existingBreadcrumb = document.querySelector('[data-breadcrumb]');
        if (existingBreadcrumb) {
            existingBreadcrumb.remove();
        }

        // Supprimer ancien schema breadcrumb
        const existingSchema = document.querySelector('script[data-breadcrumb-schema]');
        if (existingSchema) {
            existingSchema.remove();
        }
    }

    /**
     * Crée le HTML du breadcrumb
     * @param {Array} breadcrumbData - Données des niveaux
     */
    createBreadcrumbHTML(breadcrumbData) {
        const breadcrumbContainer = document.createElement('nav');
        breadcrumbContainer.setAttribute('aria-label', 'Fil d\'Ariane');
        breadcrumbContainer.setAttribute('data-breadcrumb', 'true');
        breadcrumbContainer.className = 'breadcrumb-navigation bg-gray-50 dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-800';

        const containerDiv = document.createElement('div');
        containerDiv.className = 'container mx-auto px-4';

        const olElement = document.createElement('ol');
        olElement.className = 'flex items-center space-x-2 text-sm';
        olElement.setAttribute('itemscope', '');
        olElement.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');

        breadcrumbData.forEach((item, index) => {
            const liElement = document.createElement('li');
            liElement.className = 'flex items-center';
            liElement.setAttribute('itemprop', 'itemListElement');
            liElement.setAttribute('itemscope', '');
            liElement.setAttribute('itemtype', 'https://schema.org/ListItem');

            const isLast = index === breadcrumbData.length - 1;

            if (isLast) {
                // Dernier élément (page courante) - span sans lien
                const spanElement = document.createElement('span');
                spanElement.className = 'text-gray-500 dark:text-gray-400 font-medium';
                spanElement.setAttribute('itemprop', 'name');
                spanElement.textContent = item.name;
                liElement.appendChild(spanElement);

                const metaUrl = document.createElement('meta');
                metaUrl.setAttribute('itemprop', 'item');
                metaUrl.setAttribute('content', item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`);
                liElement.appendChild(metaUrl);
            } else {
                // Éléments précédents - liens cliquables
                const linkElement = document.createElement('a');
                linkElement.href = item.url;
                linkElement.className = 'text-primary hover:text-secondary transition-colors font-medium';
                linkElement.setAttribute('itemprop', 'item');
                linkElement.textContent = item.name;

                const spanName = document.createElement('span');
                spanName.setAttribute('itemprop', 'name');
                spanName.textContent = item.name;
                linkElement.appendChild(spanName);

                liElement.appendChild(linkElement);

                // Séparateur
                const separator = document.createElement('svg');
                separator.className = 'w-4 h-4 text-gray-400 dark:text-gray-600 mx-2';
                separator.setAttribute('fill', 'currentColor');
                separator.setAttribute('viewBox', '0 0 20 20');
                separator.innerHTML = '<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>';
                
                liElement.appendChild(separator);
            }

            // Position dans la liste
            const metaPosition = document.createElement('meta');
            metaPosition.setAttribute('itemprop', 'position');
            metaPosition.setAttribute('content', (index + 1).toString());
            liElement.appendChild(metaPosition);

            olElement.appendChild(liElement);
        });

        containerDiv.appendChild(olElement);
        breadcrumbContainer.appendChild(containerDiv);

        // Insérer après le header
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentElement('afterend', breadcrumbContainer);
        } else {
            document.body.insertBefore(breadcrumbContainer, document.body.firstChild);
        }
    }

    /**
     * Injecte le Schema.org BreadcrumbList
     * @param {Array} breadcrumbData - Données des niveaux
     */
    injectBreadcrumbSchema(breadcrumbData) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbData.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-breadcrumb-schema', 'true');
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Auto-génération basée sur l'URL courante
     */
    autoGenerate() {
        const path = window.location.pathname;
        const breadcrumbData = this.generateFromPath(path);
        
        if (breadcrumbData.length > 1) {
            this.generateBreadcrumb(breadcrumbData);
            console.log('✅ Breadcrumb généré automatiquement:', breadcrumbData.length, 'niveaux');
        }
    }

    /**
     * Génère breadcrumb à partir du chemin URL
     * @param {string} path - Chemin URL
     * @returns {Array} Données breadcrumb
     */
    generateFromPath(path) {
        const segments = path.split('/').filter(segment => segment !== '');
        const breadcrumb = [{ name: 'Accueil', url: '/' }];

        // Mapping des segments vers noms lisibles
        const segmentMapping = {
            'pages': null, // Skip ce segment
            'categories': 'Catégories',
            'products': 'Produits',
            'electronique': 'Électronique',
            'ecologique': 'Écologique', 
            'sante': 'Santé',
            'maison': 'Maison',
            'bebe': 'Bébé',
            'mode': 'Mode & Accessoires',
            'lifestyle': 'Lifestyle',
            'animaux': 'Animaux',
            'cart': 'Panier',
            'checkout': 'Commande',
            'account': 'Mon Compte',
            'support': 'Support',
            'legal': 'Mentions Légales',
            'contact': 'Contact'
        };

        let currentPath = '';
        segments.forEach(segment => {
            currentPath += `/${segment}`;
            
            if (segmentMapping[segment] !== null) {
                const displayName = segmentMapping[segment] || this.formatSegment(segment);
                breadcrumb.push({
                    name: displayName,
                    url: currentPath + (segment !== segments[segments.length - 1] ? '/' : '')
                });
            }
        });

        return breadcrumb;
    }

    /**
     * Formate un segment URL en nom lisible
     * @param {string} segment - Segment URL
     * @returns {string} Nom formaté
     */
    formatSegment(segment) {
        return segment
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace('.html', '');
    }

    /**
     * Templates pré-configurés
     */
    getTemplates() {
        return {
            // Template catégorie
            category: (categoryName) => [
                { name: 'Accueil', url: '/' },
                { name: 'Catégories', url: '/pages/categories/' },
                { name: categoryName, url: `/pages/categories/${categoryName.toLowerCase()}.html` }
            ],

            // Template produit
            product: (productName, categoryName) => [
                { name: 'Accueil', url: '/' },
                { name: 'Catégories', url: '/pages/categories/' },
                { name: categoryName, url: `/pages/categories/${categoryName.toLowerCase()}.html` },
                { name: productName, url: window.location.pathname }
            ],

            // Template panier
            cart: () => [
                { name: 'Accueil', url: '/' },
                { name: 'Mon Panier', url: '/pages/cart/cart.html' }
            ],

            // Template compte
            account: (pageName) => [
                { name: 'Accueil', url: '/' },
                { name: 'Mon Compte', url: '/pages/account/' },
                { name: pageName, url: window.location.pathname }
            ]
        };
    }
}

// Instance globale
window.breadcrumbGenerator = new BreadcrumbGenerator();

// Auto-génération au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si breadcrumb manuel défini
    if (typeof window.breadcrumbData === 'undefined') {
        window.breadcrumbGenerator.autoGenerate();
    } else {
        window.breadcrumbGenerator.generateBreadcrumb(window.breadcrumbData);
    }
});

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BreadcrumbGenerator;
}