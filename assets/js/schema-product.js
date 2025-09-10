/**
 * Schema.org Product Template Engine - TechViral
 * Version "Acier" : Scalable pour TOUS les produits
 */
class SchemaProductGenerator {
    constructor() {
        this.baseUrl = 'https://techviral.com';
    }

    /**
     * Génère le JSON-LD Schema.org Product complet
     * @param {Object} product - Données produit
     * @returns {Object} Schema JSON-LD
     */
    generateProductSchema(product) {
        // Validation des données requises
        if (!product.name || !product.price || !product.sku) {
            console.error('SchemaProduct: Données produit manquantes');
            return null;
        }

        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description || `${product.name} - Produit innovant disponible chez TechViral`,
            "sku": product.sku,
            "mpn": product.mpn || product.sku,
            "brand": {
                "@type": "Brand",
                "name": product.brand || "TechViral"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": product.manufacturer || "TechViral"
            }
        };

        // Images (array)
        if (product.images && product.images.length > 0) {
            schema.image = product.images.map(img => 
                img.startsWith('http') ? img : `${this.baseUrl}${img}`
            );
        } else if (product.image) {
            schema.image = [product.image.startsWith('http') ? product.image : `${this.baseUrl}${product.image}`];
        }

        // Offre commerciale
        schema.offers = {
            "@type": "Offer",
            "url": `${this.baseUrl}/pages/products/${product.slug || product.sku.toLowerCase()}.html`,
            "priceCurrency": "EUR",
            "price": product.price,
            "priceValidUntil": this.getPriceValidUntil(),
            "availability": this.getAvailabilitySchema(product.stock),
            "seller": {
                "@type": "Organization",
                "name": "TechViral"
            }
        };

        // Prix promotionnel si applicable
        if (product.originalPrice && product.originalPrice > product.price) {
            schema.offers.priceSpecification = {
                "@type": "UnitPriceSpecification",
                "price": product.price,
                "priceCurrency": "EUR",
                "valueAddedTaxIncluded": true
            };
        }

        // Reviews et ratings si disponibles
        if (product.reviews && product.reviews.length > 0) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.avgRating || this.calculateAvgRating(product.reviews),
                "reviewCount": product.reviews.length,
                "bestRating": 5,
                "worstRating": 1
            };

            // Exemple de review (premier avis)
            const firstReview = product.reviews[0];
            if (firstReview) {
                schema.review = {
                    "@type": "Review",
                    "reviewRating": {
                        "@type": "Rating",
                        "ratingValue": firstReview.rating
                    },
                    "author": {
                        "@type": "Person",
                        "name": firstReview.author
                    },
                    "reviewBody": firstReview.comment
                };
            }
        }

        // Catégorie
        if (product.category) {
            schema.category = product.category;
        }

        // Caractéristiques techniques
        if (product.features && product.features.length > 0) {
            schema.additionalProperty = product.features.map(feature => ({
                "@type": "PropertyValue",
                "name": feature.name,
                "value": feature.value
            }));
        }

        return schema;
    }

    /**
     * Injecte le Schema dans le DOM
     * @param {Object} schema - Schema JSON-LD généré
     */
    injectSchema(schema) {
        if (!schema) return;

        // Supprimer ancien schema s'il existe
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            existingSchema.remove();
        }

        // Créer et injecter le nouveau schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }

    /**
     * Génère et injecte le schema automatiquement
     * @param {Object} productData - Données produit
     */
    autoGenerate(productData) {
        const schema = this.generateProductSchema(productData);
        if (schema) {
            this.injectSchema(schema);
            console.log('✅ Schema Product généré:', schema['@type']);
        }
    }

    // Méthodes utilitaires
    getPriceValidUntil() {
        const date = new Date();
        date.setMonth(date.getMonth() + 6); // Validité 6 mois
        return date.toISOString().split('T')[0];
    }

    getAvailabilitySchema(stock) {
        if (!stock || stock === 0) return "https://schema.org/OutOfStock";
        if (stock < 5) return "https://schema.org/LimitedAvailability";
        return "https://schema.org/InStock";
    }

    calculateAvgRating(reviews) {
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }
}

// Instance globale
window.schemaGenerator = new SchemaProductGenerator();

// Auto-génération si données produit disponibles
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.productData !== 'undefined') {
        window.schemaGenerator.autoGenerate(window.productData);
    }
});

// Export pour usage manuel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchemaProductGenerator;
}