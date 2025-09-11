/**
 * Pagination & Facettes SEO Validation - TechViral
 * Version "Acier" : Validation URLs canoniques + fallback no-JS
 */

const fs = require('fs');
const path = require('path');

class PaginationSEOValidation {
    constructor() {
        this.issues = [];
        this.validations = [];
        this.testUrls = [];
    }

    /**
     * Validation complète pagination SEO
     */
    async runFullValidation() {
        console.log('🔗 Pagination & Facettes SEO - Validation complète...\n');
        
        try {
            // 1. Vérifier scripts pagination
            this.validatePaginationScripts();
            
            // 2. Vérifier canonical URLs
            this.validateCanonicalHandling();
            
            // 3. Vérifier fallback no-JS
            this.validateNoJSFallback();
            
            // 4. Vérifier URLs SEO-friendly
            this.validateSEOUrls();
            
            // 5. Vérifier rel=prev/next
            this.validatePrevNextLinks();
            
            // 6. Générer recommandations
            this.generateSEORecommendations();
            
            const report = this.generateReport();
            console.log('\n✅ Validation pagination SEO terminée');
            return report;
            
        } catch (error) {
            console.error('❌ Erreur validation pagination:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Valider scripts pagination
     */
    validatePaginationScripts() {
        console.log('📄 Validation scripts pagination...');
        
        const filtersPath = path.join(__dirname, '..', 'assets', 'js', 'category-filters.js');
        
        if (!fs.existsSync(filtersPath)) {
            this.issues.push({
                severity: 'HIGH',
                category: 'PAGINATION_SCRIPTS',
                message: 'Script category-filters.js manquant'
            });
            console.log('  ❌ category-filters.js manquant');
            return;
        }
        
        const filtersContent = fs.readFileSync(filtersPath, 'utf8');
        
        // Vérifications critiques
        const hasSEOMode = filtersContent.includes('seoMode') && 
                          filtersContent.includes('canonical');
        const hasUrlHandling = filtersContent.includes('setupUrlHandling') ||
                              filtersContent.includes('History API');
        const hasPaginationSEO = filtersContent.includes('updatePaginationSEO') ||
                                filtersContent.includes('prev') && filtersContent.includes('next');
        const hasCanonicalUpdate = filtersContent.includes('canonical.href') ||
                                  filtersContent.includes('updateCanonical');
        
        this.validations.push({
            name: 'SEO Mode',
            passed: hasSEOMode,
            required: true
        });
        
        this.validations.push({
            name: 'URL Handling',
            passed: hasUrlHandling,
            required: true
        });
        
        this.validations.push({
            name: 'Pagination SEO',
            passed: hasPaginationSEO,
            required: true
        });
        
        this.validations.push({
            name: 'Canonical Update',
            passed: hasCanonicalUpdate,
            required: true
        });
        
        if (hasSEOMode && hasUrlHandling && hasPaginationSEO && hasCanonicalUpdate) {
            console.log('  ✅ Scripts pagination SEO complets');
        } else {
            console.log('  ⚠️ Scripts pagination SEO incomplets');
            this.issues.push({
                severity: 'MEDIUM',
                category: 'PAGINATION_SCRIPTS',
                message: 'Fonctionnalités pagination SEO manquantes'
            });
        }
    }

    /**
     * Valider gestion canonical
     */
    validateCanonicalHandling() {
        console.log('\n🔗 Validation gestion canonical...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            this.issues.push({
                severity: 'HIGH',
                category: 'CANONICAL_HANDLING',
                message: 'index.html non trouvé'
            });
            return;
        }
        
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        
        // Vérifier canonical initial
        const hasCanonicalTag = htmlContent.includes('<link rel="canonical"');
        
        // Vérifier meta viewport (requis pagination mobile)
        const hasViewport = htmlContent.includes('<meta name="viewport"');
        
        console.log(`  ${hasCanonicalTag ? '✅' : '❌'} Tag canonical initial`);
        console.log(`  ${hasViewport ? '✅' : '❌'} Meta viewport (mobile)`);
        
        if (!hasCanonicalTag) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'CANONICAL_HANDLING',
                message: 'Tag canonical initial manquant'
            });
        }
        
        if (!hasViewport) {
            this.issues.push({
                severity: 'LOW',
                category: 'CANONICAL_HANDLING',
                message: 'Meta viewport manquant pour mobile'
            });
        }
    }

    /**
     * Valider fallback no-JS
     */
    validateNoJSFallback() {
        console.log('\n🚫 Validation fallback no-JS...');
        
        // Vérifier existence de pages statiques pour fallback
        const fallbackPages = [
            'pages/categories/all.html',
            'pages/categories/electronique.html',
            'pages/categories/maison.html'
        ];
        
        let fallbackCount = 0;
        
        for (const page of fallbackPages) {
            const pagePath = path.join(__dirname, '..', page);
            const exists = fs.existsSync(pagePath);
            
            console.log(`  ${exists ? '✅' : '⚠️'} ${page}`);
            
            if (exists) {
                fallbackCount++;
                
                // Vérifier que la page a canonical et pagination
                const pageContent = fs.readFileSync(pagePath, 'utf8');
                const hasCanonical = pageContent.includes('rel="canonical"');
                const hasPagination = pageContent.includes('pagination') || 
                                     pageContent.includes('page-');
                
                if (!hasCanonical) {
                    this.issues.push({
                        severity: 'LOW',
                        category: 'NO_JS_FALLBACK',
                        message: `Page ${page} sans canonical`
                    });
                }
            }
        }
        
        if (fallbackCount < fallbackPages.length) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'NO_JS_FALLBACK',
                message: `${fallbackPages.length - fallbackCount} pages fallback manquantes`
            });
        }
        
        console.log(`  📊 Fallback: ${fallbackCount}/${fallbackPages.length} pages`);
    }

    /**
     * Valider URLs SEO-friendly
     */
    validateSEOUrls() {
        console.log('\n🌐 Validation URLs SEO-friendly...');
        
        // Exemples d'URLs à tester
        this.testUrls = [
            // URLs propres
            { url: '/iphone', type: 'category', valid: true },
            { url: '/gaming/pc', type: 'subcategory', valid: true },
            { url: '/accessories?page=2', type: 'pagination', valid: true },
            { url: '/maison?sort=price&filter=eco', type: 'filtered', valid: true },
            
            // URLs problématiques
            { url: '/category.php?id=123', type: 'dynamic', valid: false },
            { url: '/products.aspx?cat=tech&p=2', type: 'dynamic', valid: false },
            { url: '/?ajax=1&filters=true', type: 'ajax_params', valid: false }
        ];
        
        let validUrls = 0;
        let totalUrls = this.testUrls.length;
        
        for (const test of this.testUrls) {
            const isValid = this.isValidSEOUrl(test.url);
            const matches = isValid === test.valid;
            
            console.log(`  ${matches ? '✅' : '❌'} ${test.url} (${test.type})`);
            
            if (matches && test.valid) {
                validUrls++;
            }
            
            if (!matches) {
                this.issues.push({
                    severity: test.valid ? 'MEDIUM' : 'LOW',
                    category: 'SEO_URLS',
                    message: `URL ${test.url} ne respecte pas les standards SEO`
                });
            }
        }
        
        const validPercent = Math.round((validUrls / totalUrls) * 100);
        console.log(`  📊 URLs SEO: ${validUrls}/${totalUrls} (${validPercent}%)`);
    }

    /**
     * Vérifier si URL est SEO-friendly
     */
    isValidSEOUrl(url) {
        // Critères URLs SEO-friendly
        const hasCleanPath = !url.includes('.php') && 
                            !url.includes('.aspx') && 
                            !url.includes('id=');
        const hasReadableParams = !url.includes('ajax=') &&
                                 !url.includes('filters=true');
        const hasReasonableLength = url.length < 100;
        const hasNoSpecialChars = !/[^a-zA-Z0-9\-\/_?&=]/.test(url);
        
        return hasCleanPath && hasReadableParams && hasReasonableLength && hasNoSpecialChars;
    }

    /**
     * Valider liens rel=prev/next
     */
    validatePrevNextLinks() {
        console.log('\n⬅️➡️ Validation liens rel=prev/next...');
        
        const filtersPath = path.join(__dirname, '..', 'assets', 'js', 'category-filters.js');
        
        if (!fs.existsSync(filtersPath)) {
            return;
        }
        
        const filtersContent = fs.readFileSync(filtersPath, 'utf8');
        
        // Vérifier implémentation prev/next
        const hasPrevNext = filtersContent.includes('rel="prev"') || 
                           filtersContent.includes('rel="next"') ||
                           filtersContent.includes('prev') && filtersContent.includes('next');
        
        const hasPaginationLinks = filtersContent.includes('link[rel=') ||
                                  filtersContent.includes('createElement(\'link\')');
        
        console.log(`  ${hasPrevNext ? '✅' : '⚠️'} Logique prev/next`);
        console.log(`  ${hasPaginationLinks ? '✅' : '⚠️'} Génération liens pagination`);
        
        if (!hasPrevNext) {
            this.issues.push({
                severity: 'MEDIUM',
                category: 'PREV_NEXT_LINKS',
                message: 'Liens rel=prev/next non implémentés'
            });
        }
        
        if (!hasPaginationLinks) {
            this.issues.push({
                severity: 'LOW',
                category: 'PREV_NEXT_LINKS',
                message: 'Génération automatique liens pagination manquante'
            });
        }
    }

    /**
     * Générer recommandations SEO
     */
    generateSEORecommendations() {
        console.log('\n📋 Génération recommandations SEO...');
        
        const recommendations = `# 🔗 Pagination & Facettes SEO - Recommandations
## TechViral - Optimisations production

### ✅ URLS CANONIQUES DYNAMIQUES

#### 1. IMPLEMENTATION JAVASCRIPT
\`\`\`javascript
// Dans category-filters.js - Méthode updateCanonical()
function updateCanonical(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    
    // URL absolue requise
    canonical.href = url.startsWith('http') ? url : 
                    \`https://techviral.hostingersite.com\${url}\`;
    
    console.log('🔗 Canonical updated:', canonical.href);
}
\`\`\`

#### 2. GESTION ÉTATS FILTRES
\`\`\`javascript
// Règles canonical pour états filtres:
// ✅ /iphone (page category principale)
// ✅ /iphone?page=2 (pagination)
// ✅ /iphone?sort=price (tri)
// ❌ /iphone?ajax=1&loaded=true (paramètres techniques)

function buildCanonicalUrl(filters, page, sort) {
    let url = window.location.pathname;
    let params = [];
    
    // Pagination significative
    if (page > 1) {
        params.push(\`page=\${page}\`);
    }
    
    // Tri utilisateur
    if (sort && sort !== 'default') {
        params.push(\`sort=\${sort}\`);
    }
    
    // Filtres SEO-friendly uniquement
    if (filters.category && filters.category !== 'all') {
        params.push(\`category=\${filters.category}\`);
    }
    
    return url + (params.length ? '?' + params.join('&') : '');
}
\`\`\`

### ✅ LIENS REL=PREV/NEXT

#### 1. IMPLEMENTATION DYNAMIQUE
\`\`\`javascript
function updatePaginationLinks(currentPage, totalPages, baseUrl) {
    // Supprimer liens existants
    document.querySelectorAll('link[rel="prev"], link[rel="next"]')
        .forEach(link => link.remove());
    
    // Link prev
    if (currentPage > 1) {
        const prevLink = document.createElement('link');
        prevLink.rel = 'prev';
        prevLink.href = currentPage === 2 ? 
            baseUrl : \`\${baseUrl}?page=\${currentPage - 1}\`;
        document.head.appendChild(prevLink);
    }
    
    // Link next
    if (currentPage < totalPages) {
        const nextLink = document.createElement('link');
        nextLink.rel = 'next';
        nextLink.href = \`\${baseUrl}?page=\${currentPage + 1}\`;
        document.head.appendChild(nextLink);
    }
}
\`\`\`

#### 2. INTEGRATION AVEC FILTRES
\`\`\`javascript
// Lors changement page/filtres:
function onPaginationChange() {
    const canonicalUrl = buildCanonicalUrl(filters, page, sort);
    
    // 1. Mettre à jour canonical
    updateCanonical(canonicalUrl);
    
    // 2. Mettre à jour prev/next
    updatePaginationLinks(page, totalPages, canonicalUrl.split('?')[0]);
    
    // 3. Mettre à jour History API
    if (history.pushState) {
        history.pushState({filters, page}, '', canonicalUrl);
    }
}
\`\`\`

### ✅ FALLBACK NO-JAVASCRIPT

#### 1. PAGES STATIQUES PAGINATION
\`\`\`html
<!-- pages/categories/iphone.html -->
<nav class="pagination" aria-label="Pagination">
    <a href="/iphone" rel="prev">← Précédent</a>
    <span class="current">Page 1</span>
    <a href="/iphone?page=2" rel="next">Suivant →</a>
</nav>

<!-- Pages générées automatiquement: -->
<!-- /iphone?page=2 → pages/categories/iphone-page-2.html -->
<!-- /iphone?sort=price → pages/categories/iphone-sort-price.html -->
\`\`\`

#### 2. FORMULAIRES FALLBACK
\`\`\`html
<!-- Formulaire filtres sans JS -->
<form method="GET" action="/iphone" class="filters-form no-js-fallback">
    <select name="sort">
        <option value="">Tri par défaut</option>
        <option value="price">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Note client</option>
    </select>
    
    <fieldset>
        <legend>Marque</legend>
        <input type="checkbox" name="brand[]" value="apple" id="apple">
        <label for="apple">Apple</label>
        <input type="checkbox" name="brand[]" value="samsung" id="samsung">
        <label for="samsung">Samsung</label>
    </fieldset>
    
    <button type="submit">Filtrer</button>
</form>

<!-- Enhancement progressif avec JS -->
<script>
if ('querySelector' in document) {
    document.querySelector('.no-js-fallback').style.display = 'none';
    // Activer filtres Ajax
}
</script>
\`\`\`

### ✅ STRUCTURED DATA PAGINATION

#### 1. SCHEMA.ORG COLLECTION
\`\`\`html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "iPhone - TechViral",
    "description": "Collection d'iPhone et accessoires",
    "url": "https://techviral.hostingersite.com/iphone",
    "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": 45,
        "itemListElement": [
            {
                "@type": "Product",
                "position": 1,
                "name": "iPhone 15 Pro",
                "url": "/products/iphone-15-pro"
            }
        ]
    }
}
</script>
\`\`\`

### 🧪 TESTS VALIDATION

#### 1. TESTS MANUELS
\`\`\`bash
# Test pagination Ajax
curl -s "https://techviral.hostingersite.com/iphone?page=2" | grep canonical

# Test fallback no-JS  
curl -s -H "User-Agent: Googlebot" "https://techviral.hostingersite.com/iphone"

# Test prev/next links
curl -s "https://techviral.hostingersite.com/iphone?page=2" | grep -E "rel=.prev|rel=.next"
\`\`\`

#### 2. VALIDATION GOOGLE
\`\`\`
1. Search Console > Couverture
   - Vérifier indexation pages paginées
   - Pas d'erreurs "Exclue par balise canonical"

2. Test Rich Results
   - schema.org validator
   - Structured data testing tool

3. Mobile-Friendly Test
   - Pages filtres responsive
   - Navigation tactile pagination
\`\`\`

---

**🎯 OBJECTIFS SEO:**
- ✅ 100% pages paginées indexables  
- ✅ 0 duplicate content canoniques  
- ✅ Navigation prev/next complète  
- ✅ Fallback no-JS fonctionnel`;

        const recommendationsPath = path.join(__dirname, '..', 'pagination-seo-recommendations.md');
        fs.writeFileSync(recommendationsPath, recommendations);
        
        console.log('  ✅ Recommandations générées: pagination-seo-recommendations.md');
    }

    /**
     * Générer rapport final
     */
    generateReport() {
        const passed = this.validations.filter(v => v.passed).length;
        const total = this.validations.length;
        const score = Math.round((passed / total) * 100);
        
        const criticalIssues = this.issues.filter(i => i.severity === 'HIGH').length;
        const seoReady = criticalIssues === 0 && score >= 80;
        
        const report = {
            timestamp: new Date().toISOString(),
            seoReady: seoReady,
            score: score,
            validations: {
                passed: passed,
                total: total,
                details: this.validations
            },
            issues: this.issues,
            testUrls: this.testUrls,
            summary: {
                critical: criticalIssues,
                total: this.issues.length,
                status: seoReady ? 'SEO_READY' : 'NEEDS_FIXES'
            }
        };
        
        // Sauvegarder rapport
        const reportPath = path.join(__dirname, '..', 'reports', `pagination-seo-${Date.now()}.json`);
        
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
    const validator = new PaginationSEOValidation();
    
    validator.runFullValidation()
        .then(result => {
            if (result.seoReady) {
                console.log('\n🎉 PAGINATION SEO READY!');
                console.log(`✅ Score: ${result.score}/100`);
                console.log('📋 Guide: pagination-seo-recommendations.md');
            } else {
                console.log('\n⚠️ AMÉLIORATIONS PAGINATION REQUISES');
                console.log(`📊 Score: ${result.score}/100`);
                console.log(`❌ ${result.summary.critical} problèmes critiques`);
            }
            
            process.exit(result.seoReady ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Erreur validation pagination:', error.message);
            process.exit(1);
        });
}

module.exports = PaginationSEOValidation;