# 📊 Schema.org - Recommandations Produits
## TechViral - Optimisation Rich Snippets

### ✅ TEMPLATE PRODUCT UNIFIÉ

#### 1. SCHEMA PRODUCT COMPLET
```javascript
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
```

#### 2. DONNÉES PRODUITS CENTRALISÉES
```javascript
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
```

### ✅ INTÉGRATION AUTOMATIQUE

#### 1. SCRIPT UNIVERSEL PAGES PRODUIT
```html
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
```

#### 2. BREADCRUMBS DYNAMIQUES
```javascript
function generateBreadcrumbSchema(product) {
    const breadcrumbs = [
        { name: "Accueil", url: "/" },
        { name: product.category, url: `/${product.category.toLowerCase()}` },
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
                   `https://techviral.hostingersite.com${item.url}`
        }))
    };
}
```

### ✅ SCHEMA ORGANISATION GLOBAL

#### 1. CONFIGURATION CENTRALISÉE
```javascript
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
```

### 🧪 VALIDATION AUTOMATIQUE

#### 1. SCRIPT TEST SCHEMAS
```javascript
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
```

#### 2. OUTILS VALIDATION EXTERNE
```
1. Google Rich Results Test
   URL: https://search.google.com/test/rich-results
   
2. Schema.org Validator
   URL: https://validator.schema.org/
   
3. Structured Data Testing Tool
   URL: https://search.google.com/structured-data/testing-tool
   
4. Yandex Structured Data Validator
   URL: https://webmaster.yandex.com/tools/microformat/
```

---

**🎯 OBJECTIFS RICH SNIPPETS:**
- ✅ 100% produits avec schema Product  
- ✅ Rich snippets prix/availability  
- ✅ Étoiles rating dans SERP  
- ✅ Breadcrumbs navigation Google