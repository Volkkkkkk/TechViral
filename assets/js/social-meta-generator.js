/**
 * Social Meta Generator - TechViral
 * Version "Acier" : Open Graph + Twitter Cards automatiques
 */
class SocialMetaGenerator {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.siteName = 'TechViral';
        this.defaultImage = '/assets/images/og-default-1200x630.jpg';
    }

    /**
     * Génère les meta tags Open Graph et Twitter Card
     * @param {Object} pageData - Données de la page
     */
    generateSocialMetas(pageData) {
        // Validation des données requises
        if (!pageData.title || !pageData.description) {
            console.error('SocialMeta: title et description requis');
            return;
        }

        this.removeExistingMetas();
        this.addOpenGraphMetas(pageData);
        this.addTwitterCardMetas(pageData);
    }

    /**
     * Supprime les meta tags sociaux existants
     */
    removeExistingMetas() {
        const selectors = [
            'meta[property^="og:"]',
            'meta[name^="twitter:"]'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(meta => meta.remove());
        });
    }

    /**
     * Ajoute les meta tags Open Graph
     * @param {Object} pageData - Données de la page
     */
    addOpenGraphMetas(pageData) {
        const ogMetas = {
            'og:title': pageData.title,
            'og:description': pageData.description,
            'og:type': pageData.type || 'website',
            'og:url': `${this.baseUrl}${pageData.path || window.location.pathname}`,
            'og:site_name': this.siteName,
            'og:locale': 'fr_FR'
        };

        // Image avec dimensions
        if (pageData.image) {
            ogMetas['og:image'] = pageData.image.startsWith('http') 
                ? pageData.image 
                : `${this.baseUrl}${pageData.image}`;
            ogMetas['og:image:width'] = pageData.imageWidth || '1200';
            ogMetas['og:image:height'] = pageData.imageHeight || '630';
            ogMetas['og:image:alt'] = pageData.imageAlt || pageData.title;
        } else {
            ogMetas['og:image'] = `${this.baseUrl}${this.defaultImage}`;
            ogMetas['og:image:width'] = '1200';
            ogMetas['og:image:height'] = '630';
            ogMetas['og:image:alt'] = `${pageData.title} - ${this.siteName}`;
        }

        // Meta tags spécifiques aux produits
        if (pageData.type === 'product' && pageData.product) {
            ogMetas['og:price:amount'] = pageData.product.price;
            ogMetas['og:price:currency'] = pageData.product.currency || 'EUR';
            if (pageData.product.availability) {
                ogMetas['og:availability'] = pageData.product.availability;
            }
        }

        // Créer et ajouter les meta tags
        Object.entries(ogMetas).forEach(([property, content]) => {
            if (content) {
                const meta = document.createElement('meta');
                meta.setAttribute('property', property);
                meta.setAttribute('content', content);
                document.head.appendChild(meta);
            }
        });
    }

    /**
     * Ajoute les meta tags Twitter Card
     * @param {Object} pageData - Données de la page
     */
    addTwitterCardMetas(pageData) {
        const twitterMetas = {
            'twitter:card': 'summary_large_image',
            'twitter:site': pageData.twitterSite || '@TechViral',
            'twitter:creator': pageData.twitterCreator || '@TechViral',
            'twitter:title': pageData.title,
            'twitter:description': pageData.description
        };

        // Image Twitter
        if (pageData.image) {
            twitterMetas['twitter:image'] = pageData.image.startsWith('http') 
                ? pageData.image 
                : `${this.baseUrl}${pageData.image}`;
        } else {
            twitterMetas['twitter:image'] = `${this.baseUrl}${this.defaultImage}`;
        }

        // Créer et ajouter les meta tags Twitter
        Object.entries(twitterMetas).forEach(([name, content]) => {
            if (content) {
                const meta = document.createElement('meta');
                meta.setAttribute('name', name);
                meta.setAttribute('content', content);
                document.head.appendChild(meta);
            }
        });
    }

    /**
     * Auto-génération basée sur les données de page
     * @param {Object} pageData - Données page
     */
    autoGenerate(pageData) {
        if (pageData) {
            this.generateSocialMetas(pageData);
            console.log('✅ Social Metas générés:', pageData.type || 'page');
        }
    }

    /**
     * Templates pré-configurés
     */
    getTemplates() {
        return {
            // Template page catégorie
            category: (categoryName, description) => ({
                title: `${categoryName} - Innovation & Gadgets 2025 | TechViral`,
                description: description,
                type: 'website',
                path: `/pages/categories/${categoryName.toLowerCase()}.html`,
                image: `/assets/images/og-category-${categoryName.toLowerCase()}.jpg`,
                imageAlt: `Catégorie ${categoryName} - TechViral`
            }),

            // Template page produit
            product: (productData) => ({
                title: `${productData.name} | TechViral`,
                description: productData.description,
                type: 'product',
                path: `/pages/products/${productData.slug}.html`,
                image: productData.images ? productData.images[0] : null,
                imageAlt: productData.name,
                product: {
                    price: productData.price,
                    currency: 'EUR',
                    availability: productData.stock > 0 ? 'in stock' : 'out of stock'
                }
            }),

            // Template page statique
            page: (title, description, path) => ({
                title: `${title} | TechViral`,
                description: description,
                type: 'website',
                path: path,
                image: `/assets/images/og-${path.split('/').pop().replace('.html', '')}.jpg`
            })
        };
    }
}

// Instance globale
window.socialMetaGenerator = new SocialMetaGenerator();

// Auto-génération si données disponibles
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.pageMetaData !== 'undefined') {
        window.socialMetaGenerator.autoGenerate(window.pageMetaData);
    }
});

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialMetaGenerator;
}