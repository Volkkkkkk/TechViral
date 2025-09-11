/**
 * Sitemap XML Generator - TechViral
 * Version "Acier" : Génération automatique sitemap.xml
 */
class SitemapGenerator {
    constructor() {
        this.baseUrl = 'https://techviral.com';
        this.pages = [];
    }

    /**
     * Initialise les pages du site
     */
    initPages() {
        // Pages statiques principales
        this.addPage('/', 1.0, 'daily');
        this.addPage('/pages/categories/all.html', 0.9, 'daily');
        
        // Pages catégories
        const categories = [
            'electronique', 'ecologique', 'sante', 'maison', 
            'bebe', 'mode', 'lifestyle', 'animaux'
        ];
        
        categories.forEach(category => {
            this.addPage(`/pages/categories/${category}.html`, 0.8, 'weekly');
        });
        
        // Pages produits (génération dynamique)
        this.addProductPages();
        
        // Pages support et légales
        this.addPage('/pages/contact.html', 0.6, 'monthly');
        this.addPage('/pages/support/faq.html', 0.7, 'weekly');
        this.addPage('/pages/support/shipping.html', 0.6, 'monthly');
        this.addPage('/pages/legal/terms.html', 0.3, 'yearly');
        this.addPage('/pages/legal/privacy.html', 0.3, 'yearly');
        
        // Pages compte et panier (faible priorité pour SEO)
        this.addPage('/pages/account/login.html', 0.2, 'monthly');
        this.addPage('/pages/account/register.html', 0.2, 'monthly');
        this.addPage('/pages/cart/cart.html', 0.1, 'never');
        
        // Page blog et promotions
        this.addPage('/pages/blog.html', 0.8, 'weekly');
        this.addPage('/pages/promotions.html', 0.9, 'daily');
        
        console.log(`✅ Sitemap initialisé avec ${this.pages.length} pages`);
    }

    /**
     * Ajoute une page au sitemap
     * @param {string} url - URL relative de la page
     * @param {number} priority - Priorité SEO (0.0 à 1.0)
     * @param {string} changefreq - Fréquence de mise à jour
     */
    addPage(url, priority = 0.5, changefreq = 'weekly') {
        this.pages.push({
            loc: this.baseUrl + url,
            lastmod: this.getCurrentDate(),
            changefreq: changefreq,
            priority: priority.toFixed(1)
        });
    }

    /**
     * Ajoute les pages produits dynamiquement
     */
    addProductPages() {
        // Base des produits connus
        const products = [
            { slug: 'camera-pov-gopro-hero13', priority: 0.9 },
            { slug: 'bouteille-hydrogene-piurify', priority: 0.8 },
            { slug: 'collier-gps-intelligent', priority: 0.7 },
            { slug: 'cotons-demaquillants-reutilisables', priority: 0.6 }
        ];

        products.forEach(product => {
            this.addPage(
                `/pages/products/${product.slug}.html`,
                product.priority,
                'weekly'
            );
        });

        // Scan automatique des produits existants
        this.scanProductFiles();
    }

    /**
     * Scanne les fichiers produits existants
     */
    async scanProductFiles() {
        try {
            // Cette méthode peut être étendue pour scanner le système de fichiers
            // Pour maintenant, on utilise la liste statique
            console.log('📁 Scan des produits existants terminé');
        } catch (error) {
            console.warn('⚠️ Scan produits impossible:', error.message);
        }
    }

    /**
     * Génère le XML du sitemap
     * @returns {string} Contenu XML du sitemap
     */
    generateXML() {
        let xml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\\n';
        xml += '<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"';
        xml += ' xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"';
        xml += ' xsi:schemaLocation=\"http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd\">\\n';

        this.pages.forEach(page => {
            xml += '  <url>\\n';
            xml += `    <loc>${this.escapeXML(page.loc)}</loc>\\n`;
            xml += `    <lastmod>${page.lastmod}</lastmod>\\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\\n`;
            xml += `    <priority>${page.priority}</priority>\\n`;
            xml += '  </url>\\n';
        });

        xml += '</urlset>';
        return xml;
    }

    /**
     * Génère sitemap pour robots.txt
     * @returns {string} Ligne sitemap pour robots.txt
     */
    generateRobotsEntry() {
        return `Sitemap: ${this.baseUrl}/sitemap.xml`;
    }

    /**
     * Échappe les caractères XML spéciaux
     * @param {string} text - Texte à échapper
     * @returns {string} Texte échappé
     */
    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    /**
     * Retourne la date actuelle au format ISO
     * @returns {string} Date formatée YYYY-MM-DD
     */
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    }

    /**
     * Télécharge le sitemap XML
     */
    downloadSitemap() {
        const xml = this.generateXML();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📥 Sitemap téléchargé: sitemap.xml');
    }

    /**
     * Affiche le sitemap dans la console
     */
    logSitemap() {
        console.log('📄 SITEMAP XML GÉNÉRÉ:');
        console.log(this.generateXML());
        console.log('\\n📋 ROBOTS.TXT ENTRY:');
        console.log(this.generateRobotsEntry());
    }

    /**
     * Génère automatiquement le sitemap
     */
    autoGenerate() {
        this.initPages();
        const xml = this.generateXML();
        
        // Affichage en console pour développement
        this.logSitemap();
        
        return {
            xml: xml,
            robotsEntry: this.generateRobotsEntry(),
            pagesCount: this.pages.length
        };
    }

    /**
     * Valide le sitemap généré
     * @returns {Object} Résultat de validation
     */
    validateSitemap() {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            stats: {
                totalPages: this.pages.length,
                highPriority: this.pages.filter(p => parseFloat(p.priority) >= 0.8).length,
                mediumPriority: this.pages.filter(p => parseFloat(p.priority) >= 0.5 && parseFloat(p.priority) < 0.8).length,
                lowPriority: this.pages.filter(p => parseFloat(p.priority) < 0.5).length
            }
        };

        // Vérifications de base
        if (this.pages.length === 0) {
            validation.isValid = false;
            validation.errors.push('Aucune page trouvée');
        }

        if (this.pages.length > 50000) {
            validation.isValid = false;
            validation.errors.push('Trop de pages (limite: 50,000)');
        }

        // Vérification des URLs dupliquées
        const urls = this.pages.map(p => p.loc);
        const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
        if (duplicates.length > 0) {
            validation.warnings.push(`URLs dupliquées détectées: ${duplicates.length}`);
        }

        return validation;
    }
}

// Instance globale (browser uniquement)
if (typeof window !== 'undefined') {
    window.sitemapGenerator = new SitemapGenerator();
}

// Génération automatique si appelée
if (typeof window !== 'undefined' && window.location && window.location.pathname === '/generate-sitemap') {
    document.addEventListener('DOMContentLoaded', function() {
        const result = window.sitemapGenerator.autoGenerate();
        console.log(`🗺️ Sitemap généré avec ${result.pagesCount} pages`);
    });
}

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SitemapGenerator;
}