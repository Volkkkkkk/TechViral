/**
 * Schema.org Validation - TechViral
 * Version "Acier" : Validation schemas tous produits
 */

const fs = require('fs');
const path = require('path');

class SchemaValidation {
    constructor() {
        this.issues = [];
        this.validations = [];
        this.schemas = [];
        this.productPages = [];
    }

    /**
     * Validation complète Schema.org
     */
    async runFullValidation() {
        console.log('📊 Schema.org - Validation complète produits...\n');
        
        try {
            // 1. Identifier toutes les pages produit
            this.findProductPages();
            
            // 2. Valider schema generator
            this.validateSchemaGenerator();
            
            // 3. Tester schemas sur chaque page
            this.validateProductSchemas();
            
            // 4. Vérifier cohérence schemas
            this.validateSchemaConsistency();
            
            // 5. Tester schema organization
            this.validateOrganizationSchema();
            
            // 6. Générer recommandations
            this.generateSchemaRecommendations();
            
            const report = this.generateReport();
            console.log('\n✅ Validation Schema.org terminée');
            return report;
            
        } catch (error) {
            console.error('❌ Erreur validation Schema.org:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Identifier pages produit
     */
    findProductPages() {
        console.log('🔍 Identification pages produit...');
        
        // Pages principales avec produits
        const mainPages = [
            'index.html',
            'pages/categories/all.html',
            'pages/categories/electronique.html',
            'pages/categories/maison.html',
            'pages/categories/bebe.html',
            'pages/categories/mode.html'
        ];
        
        // Pages produits spécifiques
        const productPagesPattern = [
            'pages/products/camera-pov-gopro-hero13.html',
            'pages/products/bouteille-hydrogene-piurify.html',
            'pages/products/collier-gps-intelligent.html',
            'pages/products/cotons-demaquillants-reutilisables.html'
        ];
        
        this.productPages = [...mainPages, ...productPagesPattern];
        
        // Vérifier existence
        let existingPages = 0;
        for (const page of this.productPages) {
            const pagePath = path.join(__dirname, '..', page);
            const exists = fs.existsSync(pagePath);
            
            console.log(`  ${exists ? '✅' : '⚠️'} ${page}`);
            if (exists) existingPages++;
        }
        
        console.log(`  📊 Pages trouvées: ${existingPages}/${this.productPages.length}`);
        
        if (existingPages < this.productPages.length) {
            this.issues.push({
                severity: 'LOW',
                category: 'PRODUCT_PAGES',
                message: `${this.productPages.length - existingPages} pages produit manquantes`
            });
        }
    }

    /**
     * Valider schema generator
     */
    validateSchemaGenerator() {
        console.log('\n⚙️ Validation schema generator...');
        
        const generatorPath = path.join(__dirname, '..', 'assets', 'js', 'schema-generator.js');
        
        if (!fs.existsSync(generatorPath)) {
            this.issues.push({
                severity: 'HIGH',
                category: 'SCHEMA_GENERATOR',
                message: 'Script schema-generator.js manquant'
            });
            console.log('  ❌ schema-generator.js manquant');
            return;
        }
        
        const generatorContent = fs.readFileSync(generatorPath, 'utf8');
        
        // Vérifications critiques
        const hasProductSchema = generatorContent.includes('@type') && 
                                generatorContent.includes('Product');
        const hasOrganizationSchema = generatorContent.includes('Organization');
        const hasWebSiteSchema = generatorContent.includes('WebSite');
        const hasBreadcrumbSchema = generatorContent.includes('BreadcrumbList');
        const hasOffersSchema = generatorContent.includes('Offer') ||
                               generatorContent.includes('price');
        const hasAggregateRating = generatorContent.includes('AggregateRating') ||
                                  generatorContent.includes('ratingValue');
        
        this.validations.push({
            name: 'Product Schema',
            passed: hasProductSchema,
            required: true
        });
        
        this.validations.push({
            name: 'Organization Schema',
            passed: hasOrganizationSchema,
            required: true
        });
        
        this.validations.push({
            name: 'WebSite Schema',
            passed: hasWebSiteSchema,
            required: true
        });
        
        this.validations.push({
            name: 'Breadcrumb Schema',
            passed: hasBreadcrumbSchema,
            required: true
        });
        
        this.validations.push({
            name: 'Offers Schema',
            passed: hasOffersSchema,
            required: true
        });
        
        this.validations.push({
            name: 'Aggregate Rating',
            passed: hasAggregateRating,
            required: false
        });
        
        const passedRequired = [hasProductSchema, hasOrganizationSchema, hasWebSiteSchema, hasBreadcrumbSchema, hasOffersSchema].filter(Boolean).length;
        
        if (passedRequired === 5) {
            console.log('  ✅ Schema generator complet');
        } else {
            console.log('  ⚠️ Schema generator incomplet');
            this.issues.push({
                severity: 'MEDIUM',
                category: 'SCHEMA_GENERATOR',
                message: `${5 - passedRequired} types de schema manquants`
            });
        }
    }

    /**
     * Valider schemas produits
     */
    validateProductSchemas() {
        console.log('\n📦 Validation schemas produits...');
        
        const testProducts = [
            {
                file: 'pages/products/camera-pov-gopro-hero13.html',
                expectedName: 'GoPro Hero13',
                expectedCategory: 'Caméra',
                expectedBrand: 'GoPro'
            },
            {
                file: 'pages/products/bouteille-hydrogene-piurify.html',
                expectedName: 'Bouteille Hydrogène',
                expectedCategory: 'Santé',
                expectedBrand: 'Piurify'
            },
            {
                file: 'pages/products/collier-gps-intelligent.html',
                expectedName: 'Collier GPS',
                expectedCategory: 'Animaux',
                expectedBrand: 'Smart'
            }
        ];
        
        let validProducts = 0;
        
        for (const product of testProducts) {
            const productPath = path.join(__dirname, '..', product.file);
            
            if (!fs.existsSync(productPath)) {
                console.log(`  ⚠️ ${product.file} - Page manquante`);
                continue;
            }
            
            const productContent = fs.readFileSync(productPath, 'utf8');
            
            // Rechercher schema JSON-LD
            const jsonLdMatches = productContent.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
            
            if (!jsonLdMatches) {
                console.log(`  ❌ ${product.file} - Aucun schema JSON-LD`);
                this.issues.push({
                    severity: 'HIGH',
                    category: 'PRODUCT_SCHEMAS',
                    message: `Page ${product.file} sans schema`
                });
                continue;
            }
            
            let hasValidProductSchema = false;
            
            for (const match of jsonLdMatches) {
                try {
                    const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                    const schema = JSON.parse(jsonContent);
                    
                    // Vérifier schema Product
                    if (schema['@type'] === 'Product' || 
                        (Array.isArray(schema) && schema.some(s => s['@type'] === 'Product'))) {
                        
                        const productSchema = Array.isArray(schema) ? 
                            schema.find(s => s['@type'] === 'Product') : schema;
                        
                        // Vérifications détaillées
                        const hasName = productSchema.name;
                        const hasDescription = productSchema.description;
                        const hasImage = productSchema.image;
                        const hasOffers = productSchema.offers;
                        const hasBrand = productSchema.brand;
                        const hasCategory = productSchema.category;
                        
                        const requiredFields = [hasName, hasDescription, hasImage, hasOffers].filter(Boolean).length;
                        
                        if (requiredFields >= 4) {
                            hasValidProductSchema = true;
                            this.schemas.push({
                                file: product.file,
                                schema: productSchema,
                                valid: true,
                                fields: { hasName, hasDescription, hasImage, hasOffers, hasBrand, hasCategory }
                            });
                        }
                    }
                } catch (error) {
                    console.log(`  ❌ ${product.file} - JSON-LD invalide: ${error.message}`);
                }
            }
            
            if (hasValidProductSchema) {
                console.log(`  ✅ ${product.file} - Schema Product valide`);
                validProducts++;
            } else {
                console.log(`  ❌ ${product.file} - Schema Product invalide`);
                this.issues.push({
                    severity: 'MEDIUM',
                    category: 'PRODUCT_SCHEMAS',
                    message: `Schema Product invalide: ${product.file}`
                });
            }
        }
        
        console.log(`  📊 Produits valides: ${validProducts}/${testProducts.length}`);
    }

    /**
     * Valider cohérence schemas
     */
    validateSchemaConsistency() {
        console.log('\n🔄 Validation cohérence schemas...');
        
        if (this.schemas.length === 0) {
            console.log('  ⚠️ Aucun schema à analyser');
            return;
        }
        
        // Vérifier cohérence marques
        const brands = this.schemas.map(s => s.schema.brand?.name || s.schema.brand).filter(Boolean);
        const uniqueBrands = [...new Set(brands)];
        
        // Vérifier cohérence devises
        const currencies = this.schemas
            .map(s => s.schema.offers?.priceCurrency || s.schema.offers?.[0]?.priceCurrency)
            .filter(Boolean);
        const uniqueCurrencies = [...new Set(currencies)];
        
        // Vérifier cohérence availability
        const availabilities = this.schemas
            .map(s => s.schema.offers?.availability || s.schema.offers?.[0]?.availability)
            .filter(Boolean);
        
        console.log(`  📊 Marques: ${uniqueBrands.length} uniques (${brands.length} total)`);
        console.log(`  💰 Devises: ${uniqueCurrencies.length} uniques (${currencies.length} total)`);
        console.log(`  📦 Disponibilités: ${availabilities.length} définies`);
        
        // Vérifications cohérence
        if (uniqueCurrencies.length > 1) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'SCHEMA_CONSISTENCY',
                message: `Devises incohérentes: ${uniqueCurrencies.join(', ')}`
            });
        }
        
        if (currencies.length < this.schemas.length) {
            this.issues.push({
                severity: 'LOW',
                category: 'SCHEMA_CONSISTENCY',
                message: `${this.schemas.length - currencies.length} produits sans devise`
            });
        }
        
        // Vérifier format prix
        const prices = this.schemas
            .map(s => s.schema.offers?.price || s.schema.offers?.[0]?.price)
            .filter(Boolean);
        
        const invalidPrices = prices.filter(price => isNaN(parseFloat(price)));
        
        if (invalidPrices.length > 0) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'SCHEMA_CONSISTENCY',
                message: `${invalidPrices.length} prix au format invalide`
            });
        }
    }

    /**
     * Valider schema organization
     */
    validateOrganizationSchema() {
        console.log('\n🏢 Validation schema Organization...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            this.issues.push({
                severity: 'HIGH',
                category: 'ORGANIZATION_SCHEMA',
                message: 'index.html non trouvé'
            });
            return;
        }
        
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Rechercher schema Organization
        const jsonLdMatches = indexContent.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
        
        if (!jsonLdMatches) {
            console.log('  ❌ Aucun schema JSON-LD sur homepage');
            return;
        }
        
        let hasOrganization = false;
        let hasWebSite = false;
        
        for (const match of jsonLdMatches) {
            try {
                const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                const schema = JSON.parse(jsonContent);
                
                if (Array.isArray(schema)) {
                    hasOrganization = schema.some(s => s['@type'] === 'Organization');
                    hasWebSite = schema.some(s => s['@type'] === 'WebSite');
                } else {
                    if (schema['@type'] === 'Organization') hasOrganization = true;
                    if (schema['@type'] === 'WebSite') hasWebSite = true;
                }
            } catch (error) {
                console.log(`  ❌ JSON-LD invalide: ${error.message}`);
            }
        }
        
        console.log(`  ${hasOrganization ? '✅' : '❌'} Schema Organization`);
        console.log(`  ${hasWebSite ? '✅' : '❌'} Schema WebSite`);
        
        if (!hasOrganization) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'ORGANIZATION_SCHEMA',
                message: 'Schema Organization manquant sur homepage'
            });
        }
        
        if (!hasWebSite) {
            this.issues.push({
                severity: 'LOW',
                category: 'ORGANIZATION_SCHEMA',
                message: 'Schema WebSite manquant sur homepage'
            });
        }
    }

    /**
     * Générer recommandations Schema.org
     */
    generateSchemaRecommendations() {
        const recommendations = `# 📊 Schema.org - Recommandations Produits
## TechViral - Optimisation Rich Snippets

### ✅ TEMPLATE PRODUCT UNIFIÉ

#### 1. SCHEMA PRODUCT COMPLET
\`\`\`javascript
function generateProductSchema(product) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": [
            product.image_url,
            product.image_alt1,
            product.image_alt2
        ].filter(Boolean),
        "brand": {
            "@type": "Brand",
            "name": product.brand || "TechViral"
        },
        "category": product.category,
        "sku": product.sku || generateSKU(product),
        "gtin": product.gtin,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": getDatePlusOneYear(),
            "seller": {
                "@type": "Organization",
                "name": "TechViral"
            }
        },
        "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating.average,
            "reviewCount": product.rating.count,
            "bestRating": 5,
            "worstRating": 1
        } : undefined,
        "review": product.reviews ? product.reviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.author
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating,
                "bestRating": 5
            },
            "reviewBody": review.text,
            "datePublished": review.date
        })) : undefined
    };
}
\`\`\`

#### 2. DONNÉES PRODUITS CENTRALISÉES
\`\`\`javascript
// Fichier: assets/data/products.json
{
    "camera-pov-gopro-hero13": {
        "name": "Caméra POV GoPro Hero 13 Black",
        "description": "Caméra d'action ultra-performante avec stabilisation HyperSmooth 6.0",
        "brand": "GoPro",
        "category": "Électronique",
        "price": "399.99",
        "sku": "GOPRO-H13-BLACK",
        "gtin": "818279025743",
        "image_url": "/assets/images/products/gopro-hero13.jpg",
        "rating": {
            "average": 4.7,
            "count": 2847
        },
        "features": [
            "Résolution 5.3K à 60fps",
            "Stabilisation HyperSmooth 6.0",
            "Étanche jusqu'à 10m"
        ]
    }
}

// Chargement automatique:
async function loadProductData(productId) {
    const response = await fetch('/assets/data/products.json');
    const products = await response.json();
    return products[productId];
}
\`\`\`

### ✅ INTÉGRATION AUTOMATIQUE

#### 1. SCRIPT UNIVERSEL PAGES PRODUIT
\`\`\`html
<!-- À ajouter dans toutes les pages produit -->
<script>
document.addEventListener('DOMContentLoaded', async function() {
    // Détection automatique ID produit
    const productId = window.location.pathname
        .split('/')
        .pop()
        .replace('.html', '');
    
    // Chargement données
    try {
        const productData = await loadProductData(productId);
        
        if (productData) {
            // Génération schema
            const schema = generateProductSchema(productData);
            
            // Injection dans page
            const scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(scriptTag);
            
            console.log('📊 Schema Product injecté:', productId);
        }
    } catch (error) {
        console.warn('⚠️ Erreur chargement schema produit:', error);
    }
});
</script>
\`\`\`

#### 2. BREADCRUMBS DYNAMIQUES
\`\`\`javascript
function generateBreadcrumbSchema(product) {
    const breadcrumbs = [
        { name: "Accueil", url: "/" },
        { name: product.category, url: \`/\${product.category.toLowerCase()}\` },
        { name: product.name, url: window.location.pathname }
    ];
    
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url.startsWith('http') ? item.url : 
                   \`https://techviral.hostingersite.com\${item.url}\`
        }))
    };
}
\`\`\`

### ✅ SCHEMA ORGANISATION GLOBAL

#### 1. CONFIGURATION CENTRALISÉE
\`\`\`javascript
const ORGANIZATION_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TechViral",
    "description": "Boutique spécialisée en high-tech et accessoires premium",
    "url": "https://techviral.hostingersite.com",
    "logo": "https://techviral.hostingersite.com/assets/icons/logo.png",
    "image": "https://techviral.hostingersite.com/assets/icons/logo-1200x630.png",
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+33-1-23-45-67-89",
        "contactType": "Customer Service",
        "email": "contact@techviral.com",
        "availableLanguage": "French"
    },
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "FR",
        "addressLocality": "Paris"
    },
    "sameAs": [
        "https://www.facebook.com/techviral",
        "https://www.instagram.com/techviral",
        "https://www.twitter.com/techviral"
    ]
};

const WEBSITE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TechViral",
    "description": "High-tech et accessoires premium",
    "url": "https://techviral.hostingersite.com",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://techviral.hostingersite.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
    }
};
\`\`\`

### 🧪 VALIDATION AUTOMATIQUE

#### 1. SCRIPT TEST SCHEMAS
\`\`\`javascript
async function validateAllSchemas() {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    const results = [];
    
    for (const schema of schemas) {
        try {
            const data = JSON.parse(schema.textContent);
            const validation = await validateSchema(data);
            results.push({
                type: data['@type'],
                valid: validation.valid,
                errors: validation.errors
            });
        } catch (error) {
            results.push({
                type: 'unknown',
                valid: false,
                errors: [error.message]
            });
        }
    }
    
    console.table(results);
    return results;
}

// Test en console:
validateAllSchemas();
\`\`\`

#### 2. OUTILS VALIDATION EXTERNE
\`\`\`
1. Google Rich Results Test
   URL: https://search.google.com/test/rich-results
   
2. Schema.org Validator
   URL: https://validator.schema.org/
   
3. Structured Data Testing Tool
   URL: https://search.google.com/structured-data/testing-tool
   
4. Yandex Structured Data Validator
   URL: https://webmaster.yandex.com/tools/microformat/
\`\`\`

---

**🎯 OBJECTIFS RICH SNIPPETS:**
- ✅ 100% produits avec schema Product  
- ✅ Rich snippets prix/availability  
- ✅ Étoiles rating dans SERP  
- ✅ Breadcrumbs navigation Google`;

        const recommendationsPath = path.join(__dirname, '..', 'schema-recommendations.md');
        fs.writeFileSync(recommendationsPath, recommendations);
        
        console.log('  ✅ Recommandations générées: schema-recommendations.md');
    }

    /**
     * Générer rapport final
     */
    generateReport() {
        const passed = this.validations.filter(v => v.passed).length;
        const total = this.validations.length;
        const score = total > 0 ? Math.round((passed / total) * 100) : 0;
        
        const criticalIssues = this.issues.filter(i => i.severity === 'HIGH').length;
        const schemaReady = criticalIssues === 0 && score >= 80;
        
        const report = {
            timestamp: new Date().toISOString(),
            schemaReady: schemaReady,
            score: score,
            validations: {
                passed: passed,
                total: total,
                details: this.validations
            },
            schemas: this.schemas,
            productPages: this.productPages.length,
            issues: this.issues,
            summary: {
                critical: criticalIssues,
                total: this.issues.length,
                status: schemaReady ? 'SCHEMA_READY' : 'NEEDS_FIXES'
            }
        };
        
        // Sauvegarder rapport
        const reportPath = path.join(__dirname, '..', 'reports', `schema-validation-${Date.now()}.json`);
        
        try {
            const reportsDir = path.dirname(reportPath);
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder le rapport:', error.message);
        }
        
        return report;
    }
}

// Export pour usage CLI
if (require.main === module) {
    const validator = new SchemaValidation();
    
    validator.runFullValidation()
        .then(result => {
            if (result.schemaReady) {
                console.log('\n🎉 SCHEMAS PRODUCT READY!');
                console.log(`✅ Score: ${result.score}/100`);
                console.log(`📦 Produits: ${result.schemas ? result.schemas.length : 0} validés`);
                console.log('📋 Guide: schema-recommendations.md');
            } else {
                console.log('\n⚠️ AMÉLIORATIONS SCHEMAS REQUISES');
                console.log(`📊 Score: ${result.score}/100`);
                console.log(`❌ ${result.summary.critical} problèmes critiques`);
            }
            
            process.exit(result.schemaReady ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Erreur validation schemas:', error.message);
            process.exit(1);
        });
}

module.exports = SchemaValidation;