#!/usr/bin/env node

/**
 * TechViral Sitemap Generator
 * Génère automatiquement le sitemap XML pour le site e-commerce
 */

const fs = require('fs');
const path = require('path');

// Configuration du site
const SITE_URL = 'https://antiquewhite-rabbit-562143.hostingersite.com';
const OUTPUT_FILE = 'sitemap.xml';

// Pages principales du site
const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/pages/categories/all.html', priority: '0.9', changefreq: 'daily' },
    { url: '/pages/categories/electronique.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/categories/ecologique.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/categories/sante.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/categories/animaux.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/promotions.html', priority: '0.9', changefreq: 'daily' },
    { url: '/pages/blog.html', priority: '0.7', changefreq: 'weekly' },
    { url: '/pages/contact.html', priority: '0.6', changefreq: 'monthly' },
    { url: '/pages/legal/mentions.html', priority: '0.3', changefreq: 'yearly' },
    { url: '/pages/legal/cookies.html', priority: '0.3', changefreq: 'yearly' },
    { url: '/pages/support/returns.html', priority: '0.5', changefreq: 'monthly' },
    { url: '/pages/support/warranty.html', priority: '0.5', changefreq: 'monthly' },
    
    // Pages produits
    { url: '/pages/products/bouteille-hydrogene-piurify.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/products/camera-pov-gopro-hero13.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/products/collier-gps-intelligent.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/pages/products/cotons-demaquillants-reutilisables.html', priority: '0.8', changefreq: 'weekly' },
];

/**
 * Génère le XML du sitemap
 */
function generateSitemapXML() {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    pages.forEach(page => {
        xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    xml += `</urlset>`;
    
    return xml;
}

/**
 * Fonction principale
 */
function main() {
    try {
        console.log('🗺️  Génération du sitemap XML...');
        
        const sitemapContent = generateSitemapXML();
        
        // Écrire le fichier sitemap.xml
        fs.writeFileSync(OUTPUT_FILE, sitemapContent, 'utf8');
        
        console.log(`✅ Sitemap généré avec succès : ${OUTPUT_FILE}`);
        console.log(`📊 ${pages.length} pages incluses`);
        console.log(`🔗 URL du sitemap : ${SITE_URL}/sitemap.xml`);
        
    } catch (error) {
        console.error('❌ Erreur lors de la génération du sitemap:', error.message);
        process.exit(1);
    }
}

// Exécution si appelé directement
if (require.main === module) {
    main();
}

module.exports = { generateSitemapXML, pages };