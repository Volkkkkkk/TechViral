/**
 * Google Search Console Verification & Setup - TechViral
 * Version "Acier" : Validation complète GSC avant Go Live
 */

const fs = require('fs');
const path = require('path');

class SearchConsoleVerification {
    constructor() {
        this.siteUrl = 'https://techviral.hostingersite.com';
        this.sitemapUrl = `${this.siteUrl}/sitemap.xml`;
        this.verificationMethods = [];
        this.checkResults = {};
        
        this.requiredFiles = [
            'sitemap.xml',
            'robots.txt',
            'index.html'
        ];
    }

    /**
     * Validation complète Search Console
     */
    async runFullVerification() {
        console.log('🔍 Google Search Console - Vérification complète...\n');
        
        try {
            // 1. Vérifier fichiers requis
            this.checkRequiredFiles();
            
            // 2. Valider sitemap.xml
            this.validateSitemap();
            
            // 3. Vérifier robots.txt
            this.validateRobotsTxt();
            
            // 4. Analyser meta verification
            this.checkVerificationMeta();
            
            // 5. Vérifier canonical URLs
            this.validateCanonicalUrls();
            
            // 6. Analyser couverture des pages
            this.analyzeCoverage();
            
            // 7. Générer instructions
            this.generateSetupInstructions();
            
            // 8. Créer rapport final
            const report = this.generateReport();
            
            console.log('\n✅ Vérification Search Console terminée');
            return report;
            
        } catch (error) {
            console.error('❌ Erreur vérification Search Console:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Vérifier fichiers requis
     */
    checkRequiredFiles() {
        console.log('📁 Vérification fichiers requis...');
        
        for (const file of this.requiredFiles) {
            const filePath = path.join(__dirname, '..', file);
            const exists = fs.existsSync(filePath);
            
            this.checkResults[`file_${file.replace('.', '_')}`] = {
                exists: exists,
                path: filePath,
                status: exists ? 'OK' : 'MANQUANT'
            };
            
            if (exists) {
                console.log(`  ✅ ${file}`);
            } else {
                console.log(`  ❌ ${file} - MANQUANT`);
            }
        }
    }

    /**
     * Valider sitemap.xml
     */
    validateSitemap() {
        console.log('\n🗺️ Validation sitemap.xml...');
        
        const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
        
        if (!fs.existsSync(sitemapPath)) {
            this.checkResults.sitemap = { status: 'MANQUANT', error: 'Fichier sitemap.xml non trouvé' };
            console.log('  ❌ sitemap.xml manquant');
            return;
        }
        
        try {
            const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
            
            // Vérifications XML
            const hasXmlDeclaration = sitemapContent.includes('<?xml version="1.0"');
            const hasUrlset = sitemapContent.includes('<urlset');
            const hasSitemapNamespace = sitemapContent.includes('http://www.sitemaps.org/schemas/sitemap/0.9');
            
            // Compter URLs
            const urlMatches = sitemapContent.match(/<url>/g);
            const urlCount = urlMatches ? urlMatches.length : 0;
            
            // Vérifier structure
            const hasValidStructure = sitemapContent.includes('<loc>') && 
                                    sitemapContent.includes('<lastmod>') &&
                                    sitemapContent.includes('<changefreq>') &&
                                    sitemapContent.includes('<priority>');
            
            this.checkResults.sitemap = {
                status: hasXmlDeclaration && hasUrlset && hasSitemapNamespace ? 'OK' : 'INVALIDE',
                urlCount: urlCount,
                hasValidStructure: hasValidStructure,
                size: fs.statSync(sitemapPath).size,
                lastModified: fs.statSync(sitemapPath).mtime
            };
            
            console.log(`  ✅ sitemap.xml valide`);
            console.log(`  📊 ${urlCount} URLs trouvées`);
            console.log(`  📏 Taille: ${Math.round(this.checkResults.sitemap.size / 1024)}KB`);
            
            // Vérifier que toutes les pages importantes sont incluses
            const expectedPages = [
                '/', '/iphone', '/android', '/gaming', '/accessories',
                '/gaming/pc', '/gaming/console', '/gaming/mobile',
                '/maison', '/bebe', '/mode'
            ];
            
            const missingPages = expectedPages.filter(page => {
                const fullUrl = `${this.siteUrl}${page}`;
                return !sitemapContent.includes(fullUrl);
            });
            
            if (missingPages.length > 0) {
                console.log(`  ⚠️ Pages potentiellement manquantes:`, missingPages);
                this.checkResults.sitemap.missingPages = missingPages;
            } else {
                console.log(`  ✅ Toutes les pages importantes incluses`);
            }
            
        } catch (error) {
            this.checkResults.sitemap = { status: 'ERREUR', error: error.message };
            console.log(`  ❌ Erreur validation sitemap: ${error.message}`);
        }
    }

    /**
     * Valider robots.txt
     */
    validateRobotsTxt() {
        console.log('\n🤖 Validation robots.txt...');
        
        const robotsPath = path.join(__dirname, '..', 'robots.txt');
        
        if (!fs.existsSync(robotsPath)) {
            this.checkResults.robots = { status: 'MANQUANT' };
            console.log('  ❌ robots.txt manquant');
            return;
        }
        
        try {
            const robotsContent = fs.readFileSync(robotsPath, 'utf8');
            
            // Vérifications essentielles
            const hasUserAgent = robotsContent.includes('User-agent:');
            const hasAllow = robotsContent.includes('Allow:') || robotsContent.includes('Disallow:');
            const hasSitemap = robotsContent.includes('Sitemap:');
            const hasSitemapUrl = robotsContent.includes(this.sitemapUrl);
            
            this.checkResults.robots = {
                status: hasUserAgent && hasAllow && hasSitemap ? 'OK' : 'INVALIDE',
                hasUserAgent: hasUserAgent,
                hasDirectives: hasAllow,
                hasSitemap: hasSitemap,
                hasSitemapUrl: hasSitemapUrl,
                content: robotsContent
            };
            
            if (hasSitemapUrl) {
                console.log('  ✅ robots.txt valide avec sitemap référencé');
            } else {
                console.log('  ⚠️ robots.txt présent mais sitemap URL manquante');
            }
            
            // Vérifier exclusions
            const disallowedPaths = robotsContent.match(/Disallow:\s*(.+)/g);
            if (disallowedPaths) {
                console.log('  📋 Chemins exclus:', disallowedPaths.map(p => p.replace('Disallow:', '').trim()));
            }
            
        } catch (error) {
            this.checkResults.robots = { status: 'ERREUR', error: error.message };
            console.log(`  ❌ Erreur validation robots.txt: ${error.message}`);
        }
    }

    /**
     * Vérifier meta verification
     */
    checkVerificationMeta() {
        console.log('\n🔐 Vérification meta verification...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            this.checkResults.verification = { status: 'FICHIER_MANQUANT' };
            return;
        }
        
        try {
            const htmlContent = fs.readFileSync(indexPath, 'utf8');
            
            // Chercher meta verification Google
            const googleVerification = htmlContent.match(/<meta name="google-site-verification" content="([^"]+)"/);
            const bingVerification = htmlContent.match(/<meta name="msvalidate.01" content="([^"]+)"/);
            
            this.checkResults.verification = {
                status: 'CONFIGURÉ',
                hasGoogle: !!googleVerification,
                hasBing: !!bingVerification,
                googleToken: googleVerification ? googleVerification[1] : null,
                bingToken: bingVerification ? bingVerification[1] : null
            };
            
            if (googleVerification) {
                console.log('  ✅ Meta verification Google trouvée');
                console.log(`  🔑 Token: ${googleVerification[1].substring(0, 20)}...`);
            } else {
                console.log('  ⚠️ Meta verification Google manquante');
                console.log('  💡 Ajouter: <meta name="google-site-verification" content="YOUR_TOKEN">');
            }
            
            if (bingVerification) {
                console.log('  ✅ Meta verification Bing trouvée');
            } else {
                console.log('  ℹ️ Meta verification Bing optionnelle manquante');
            }
            
        } catch (error) {
            this.checkResults.verification = { status: 'ERREUR', error: error.message };
            console.log(`  ❌ Erreur vérification meta: ${error.message}`);
        }
    }

    /**
     * Valider canonical URLs
     */
    validateCanonicalUrls() {
        console.log('\n🔗 Validation canonical URLs...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        
        if (!fs.existsSync(indexPath)) {
            this.checkResults.canonical = { status: 'FICHIER_MANQUANT' };
            return;
        }
        
        try {
            const htmlContent = fs.readFileSync(indexPath, 'utf8');
            
            // Chercher canonical URL
            const canonicalMatch = htmlContent.match(/<link rel="canonical" href="([^"]+)"/);
            
            this.checkResults.canonical = {
                status: canonicalMatch ? 'OK' : 'MANQUANT',
                url: canonicalMatch ? canonicalMatch[1] : null,
                isAbsolute: canonicalMatch ? canonicalMatch[1].startsWith('http') : false
            };
            
            if (canonicalMatch) {
                const canonicalUrl = canonicalMatch[1];
                console.log('  ✅ Canonical URL trouvée');
                console.log(`  🌐 URL: ${canonicalUrl}`);
                
                if (canonicalUrl.startsWith('http')) {
                    console.log('  ✅ URL absolue (recommandé)');
                } else {
                    console.log('  ⚠️ URL relative (préférer absolue)');
                }
            } else {
                console.log('  ❌ Canonical URL manquante sur index.html');
            }
            
        } catch (error) {
            this.checkResults.canonical = { status: 'ERREUR', error: error.message };
            console.log(`  ❌ Erreur validation canonical: ${error.message}`);
        }
    }

    /**
     * Analyser couverture des pages
     */
    analyzeCoverage() {
        console.log('\n📊 Analyse couverture des pages...');
        
        const expectedPages = [
            { path: '/', priority: 1.0, category: 'Homepage' },
            { path: '/iphone', priority: 0.9, category: 'Product Category' },
            { path: '/android', priority: 0.9, category: 'Product Category' },
            { path: '/gaming', priority: 0.9, category: 'Product Category' },
            { path: '/accessories', priority: 0.8, category: 'Product Category' },
            { path: '/gaming/pc', priority: 0.8, category: 'Product Subcategory' },
            { path: '/gaming/console', priority: 0.8, category: 'Product Subcategory' },
            { path: '/gaming/mobile', priority: 0.8, category: 'Product Subcategory' },
            { path: '/maison', priority: 0.8, category: 'Product Category' },
            { path: '/bebe', priority: 0.8, category: 'Product Category' },
            { path: '/mode', priority: 0.8, category: 'Product Category' }
        ];
        
        const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
        let sitemapContent = '';
        
        if (fs.existsSync(sitemapPath)) {
            sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
        }
        
        const coverage = {
            total: expectedPages.length,
            found: 0,
            missing: [],
            priorities: {}
        };
        
        for (const page of expectedPages) {
            const fullUrl = `${this.siteUrl}${page.path}`;
            const isInSitemap = sitemapContent.includes(fullUrl);
            
            if (isInSitemap) {
                coverage.found++;
                coverage.priorities[page.category] = (coverage.priorities[page.category] || 0) + 1;
            } else {
                coverage.missing.push(page);
            }
            
            console.log(`  ${isInSitemap ? '✅' : '❌'} ${page.path} (${page.category})`);
        }
        
        this.checkResults.coverage = coverage;
        
        const coveragePercent = Math.round((coverage.found / coverage.total) * 100);
        console.log(`\n📈 Couverture: ${coverage.found}/${coverage.total} pages (${coveragePercent}%)`);
        
        if (coverage.missing.length > 0) {
            console.log('⚠️ Pages manquantes dans le sitemap:');
            coverage.missing.forEach(page => {
                console.log(`   - ${page.path} (${page.category})`);
            });
        }
    }

    /**
     * Générer instructions setup
     */
    generateSetupInstructions() {
        console.log('\n📋 Génération instructions setup...');
        
        const instructions = `# 🔍 Google Search Console - Instructions Setup
## TechViral - Configuration Production

### 1. VÉRIFICATION PROPRIÉTÉ
\`\`\`
1. Aller sur: https://search.google.com/search-console
2. Ajouter une propriété: ${this.siteUrl}
3. Méthode recommandée: Meta tag HTML
4. Copier le token de vérification
5. Ajouter dans <head> de index.html:
   <meta name="google-site-verification" content="YOUR_TOKEN">
\`\`\`

### 2. SOUMISSION SITEMAP
\`\`\`
1. Dans GSC > Sitemaps
2. Ajouter un sitemap: ${this.sitemapUrl}
3. Vérifier statut: "Réussi"
4. Contrôler couverture: viser 24/24 pages indexées
\`\`\`

### 3. VALIDATION ROBOTS.TXT
\`\`\`
1. Dans GSC > robots.txt
2. Tester: ${this.siteUrl}/robots.txt
3. Vérifier que sitemap est référencé
4. Confirmer exclusions appropriées
\`\`\`

### 4. SURVEILLANCE INDEXATION
\`\`\`
Pages prioritaires à surveiller:
- ${this.siteUrl}/ (Homepage)
- ${this.siteUrl}/iphone (Category)
- ${this.siteUrl}/android (Category)
- ${this.siteUrl}/gaming (Category)
- ${this.siteUrl}/accessories (Category)

Objectif: 100% indexation dans 7-14 jours
\`\`\`

### 5. MÉTRIQUES À SUIVRE
\`\`\`
- Couverture: Pages indexées vs soumises
- Performance: Core Web Vitals
- Ergonomie mobile: Compatibilité mobile
- Liens: Liens internes/externes
- Requêtes: Mots-clés et CTR
\`\`\`

### 6. ALERTES RECOMMANDÉES
\`\`\`
- Erreurs d'indexation (404, 5xx)
- Problèmes ergonomie mobile
- Dégradation Core Web Vitals
- Nouveaux liens entrants
- Problèmes de sécurité
\`\`\``;

        const instructionsPath = path.join(__dirname, '..', 'search-console-setup.md');
        fs.writeFileSync(instructionsPath, instructions);
        
        console.log('  ✅ Instructions générées: search-console-setup.md');
    }

    /**
     * Générer rapport final
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            siteUrl: this.siteUrl,
            sitemapUrl: this.sitemapUrl,
            status: 'ANALYSÉ',
            checks: this.checkResults,
            recommendations: this.generateRecommendations(),
            readyForSubmission: this.isReadyForSubmission()
        };
        
        // Sauvegarder rapport
        const reportPath = path.join(__dirname, '..', 'reports', `search-console-verification-${Date.now()}.json`);
        
        try {
            const reportsDir = path.dirname(reportPath);
            if (!fs.existsSync(reportsDir)) {
                fs.mkdirSync(reportsDir, { recursive: true });
            }
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`📊 Rapport sauvegardé: ${path.basename(reportPath)}`);
        } catch (error) {
            console.warn('⚠️ Impossible de sauvegarder le rapport:', error.message);
        }
        
        return report;
    }

    /**
     * Générer recommandations
     */
    generateRecommendations() {
        const recommendations = [];
        
        if (!this.checkResults.verification?.hasGoogle) {
            recommendations.push({
                priority: 'HIGH',
                action: 'Ajouter meta verification Google',
                description: 'Obtenir token GSC et ajouter <meta name="google-site-verification">'
            });
        }
        
        if (this.checkResults.sitemap?.status !== 'OK') {
            recommendations.push({
                priority: 'HIGH',
                action: 'Corriger sitemap.xml',
                description: 'Sitemap invalide ou manquant - requis pour indexation'
            });
        }
        
        if (this.checkResults.canonical?.status !== 'OK') {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Ajouter canonical URLs',
                description: 'URLs canoniques manquantes - risque duplicate content'
            });
        }
        
        if (this.checkResults.coverage?.found < this.checkResults.coverage?.total) {
            recommendations.push({
                priority: 'MEDIUM',
                action: 'Compléter couverture pages',
                description: `${this.checkResults.coverage.missing?.length || 0} pages manquantes dans sitemap`
            });
        }
        
        if (!this.checkResults.robots?.hasSitemapUrl) {
            recommendations.push({
                priority: 'LOW',
                action: 'Référencer sitemap dans robots.txt',
                description: 'Améliore découverte du sitemap par les crawlers'
            });
        }
        
        return recommendations;
    }

    /**
     * Vérifier si prêt pour soumission
     */
    isReadyForSubmission() {
        const criticalChecks = [
            this.checkResults.sitemap?.status === 'OK',
            this.checkResults.robots?.status === 'OK',
            this.checkResults.canonical?.status === 'OK'
        ];
        
        return criticalChecks.every(check => check === true);
    }
}

// Export pour usage CLI
if (require.main === module) {
    const verifier = new SearchConsoleVerification();
    
    verifier.runFullVerification()
        .then(result => {
            if (result.readyForSubmission) {
                console.log('\n🎉 PRÊT POUR SOUMISSION SEARCH CONSOLE!');
                console.log('📋 Suivre: search-console-setup.md');
            } else {
                console.log('\n⚠️ CORRECTIONS REQUISES AVANT SOUMISSION');
                console.log('📋 Voir recommendations dans le rapport');
            }
            
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Erreur vérification:', error.message);
            process.exit(1);
        });
}

module.exports = SearchConsoleVerification;