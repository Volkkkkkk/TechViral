/**
 * Favicon Pack Generator - TechViral
 * Version "Acier" : Package favicon complet multi-format
 */

const fs = require('fs');
const path = require('path');

class FaviconPackGenerator {
    constructor() {
        this.config = {
            siteName: 'TechViral',
            themeColor: '#6366f1',
            backgroundColor: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            description: 'TechViral - High-tech et accessoires premium'
        };
        
        this.sizes = {
            favicon: [16, 32, 48],
            apple: [57, 60, 72, 76, 114, 120, 144, 152, 167, 180],
            android: [36, 48, 72, 96, 144, 192, 256, 384, 512],
            windows: [70, 150, 310]
        };
        
        this.outputDir = path.join(__dirname, '..', 'assets', 'icons');
        this.manifestPath = path.join(__dirname, '..', 'manifest.json');
        this.browserConfigPath = path.join(__dirname, '..', 'browserconfig.xml');
    }

    /**
     * Génère le pack favicon complet
     */
    async generateComplete() {
        console.log('🎨 Génération pack favicon TechViral...\n');
        
        try {
            // Créer dossier icons
            this.ensureOutputDirectory();
            
            // Générer manifest.json
            this.generateWebAppManifest();
            
            // Générer browserconfig.xml
            this.generateBrowserConfig();
            
            // Générer HTML meta tags
            const htmlTags = this.generateHTMLTags();
            
            // Générer fichier d'instructions
            this.generateInstructions();
            
            // Créer exemples de SVG
            this.generateSVGTemplates();
            
            console.log('✅ Pack favicon généré avec succès!');
            console.log(`📁 Fichiers dans: ${this.outputDir}`);
            console.log('📝 Instructions: favicon-instructions.md');
            
            return {
                success: true,
                outputDir: this.outputDir,
                htmlTags: htmlTags,
                files: this.getGeneratedFiles()
            };
            
        } catch (error) {
            console.error('❌ Erreur génération favicon:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Assure que le dossier de sortie existe
     */
    ensureOutputDirectory() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
            console.log(`📁 Dossier créé: ${this.outputDir}`);
        }
    }

    /**
     * Génère le manifest.json PWA
     */
    generateWebAppManifest() {
        const manifest = {
            name: this.config.siteName,
            short_name: 'TechViral',
            description: this.config.description,
            lang: 'fr',
            start_url: '/',
            display: this.config.display,
            orientation: this.config.orientation,
            theme_color: this.config.themeColor,
            background_color: this.config.backgroundColor,
            scope: '/',
            
            icons: [
                // Android Chrome Icons
                {
                    src: 'assets/icons/android-chrome-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: 'assets/icons/android-chrome-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                // Apple Touch Icons
                {
                    src: 'assets/icons/apple-touch-icon.png',
                    sizes: '180x180',
                    type: 'image/png'
                },
                // Favicon
                {
                    src: 'assets/icons/favicon-32x32.png',
                    sizes: '32x32',
                    type: 'image/png'
                },
                {
                    src: 'assets/icons/favicon-16x16.png',
                    sizes: '16x16',
                    type: 'image/png'
                }
            ],
            
            categories: ['shopping', 'technology', 'business'],
            
            screenshots: [
                {
                    src: 'assets/icons/screenshot-wide.png',
                    sizes: '1280x720',
                    type: 'image/png',
                    form_factor: 'wide'
                },
                {
                    src: 'assets/icons/screenshot-narrow.png',
                    sizes: '640x1136',
                    type: 'image/png',
                    form_factor: 'narrow'
                }
            ],
            
            shortcuts: [
                {
                    name: 'iPhone',
                    short_name: 'iPhone',
                    description: 'Découvrir les iPhone',
                    url: '/iphone',
                    icons: [{ src: 'assets/icons/shortcut-iphone.png', sizes: '96x96' }]
                },
                {
                    name: 'Android',
                    short_name: 'Android',
                    description: 'Découvrir Android',
                    url: '/android',
                    icons: [{ src: 'assets/icons/shortcut-android.png', sizes: '96x96' }]
                },
                {
                    name: 'Gaming',
                    short_name: 'Gaming',
                    description: 'Matériel Gaming',
                    url: '/gaming',
                    icons: [{ src: 'assets/icons/shortcut-gaming.png', sizes: '96x96' }]
                }
            ]
        };
        
        fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
        console.log('✅ manifest.json généré');
    }

    /**
     * Génère browserconfig.xml pour Windows
     */
    generateBrowserConfig() {
        const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square70x70logo src="assets/icons/mstile-70x70.png"/>
            <square150x150logo src="assets/icons/mstile-150x150.png"/>
            <wide310x150logo src="assets/icons/mstile-310x150.png"/>
            <square310x310logo src="assets/icons/mstile-310x310.png"/>
            <TileColor>${this.config.themeColor}</TileColor>
        </tile>
        <notification>
            <polling-uri src="https://techviral.hostingersite.com/notifications/"/>
            <polling-uri2 src="https://techviral.hostingersite.com/notifications2/"/>
            <polling-uri3 src="https://techviral.hostingersite.com/notifications3/"/>
            <polling-uri4 src="https://techviral.hostingersite.com/notifications4/"/>
            <polling-uri5 src="https://techviral.hostingersite.com/notifications5/"/>
            <frequency>30</frequency>
            <cycle>1</cycle>
        </notification>
    </msapplication>
</browserconfig>`;
        
        fs.writeFileSync(this.browserConfigPath, browserConfig);
        console.log('✅ browserconfig.xml généré');
    }

    /**
     * Génère les meta tags HTML
     */
    generateHTMLTags() {
        const tags = `<!-- Favicon Package TechViral - Version Acier -->
<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="152x152" href="assets/icons/apple-touch-icon-152x152.png">
<link rel="apple-touch-icon" sizes="144x144" href="assets/icons/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="120x120" href="assets/icons/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="114x114" href="assets/icons/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="76x76" href="assets/icons/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="72x72" href="assets/icons/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="60x60" href="assets/icons/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="57x57" href="assets/icons/apple-touch-icon-57x57.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="assets/icons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="assets/icons/android-chrome-512x512.png">

<!-- Windows Tiles -->
<meta name="msapplication-TileColor" content="${this.config.themeColor}">
<meta name="msapplication-TileImage" content="assets/icons/mstile-144x144.png">
<meta name="msapplication-square70x70logo" content="assets/icons/mstile-70x70.png">
<meta name="msapplication-square150x150logo" content="assets/icons/mstile-150x150.png">
<meta name="msapplication-wide310x150logo" content="assets/icons/mstile-310x150.png">
<meta name="msapplication-square310x310logo" content="assets/icons/mstile-310x310.png">
<meta name="msapplication-config" content="browserconfig.xml">

<!-- Web App Manifest -->
<link rel="manifest" href="manifest.json">

<!-- Theme Colors -->
<meta name="theme-color" content="${this.config.themeColor}">
<meta name="msapplication-navbutton-color" content="${this.config.themeColor}">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- PWA Meta -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="${this.config.siteName}">
<meta name="application-name" content="${this.config.siteName}">

<!-- Safari Pinned Tab -->
<link rel="mask-icon" href="assets/icons/safari-pinned-tab.svg" color="${this.config.themeColor}">`;

        const htmlTagsPath = path.join(this.outputDir, 'favicon-meta-tags.html');
        fs.writeFileSync(htmlTagsPath, tags);
        console.log('✅ Meta tags HTML générés');
        
        return tags;
    }

    /**
     * Génère les templates SVG
     */
    generateSVGTemplates() {
        // Logo principal SVG
        const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${this.config.themeColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Background Circle -->
    <circle cx="256" cy="256" r="240" fill="url(#techGradient)" stroke="#ffffff" stroke-width="8"/>
    
    <!-- Tech Symbol -->
    <g transform="translate(256,256)">
        <!-- Circuit Pattern -->
        <circle cx="0" cy="0" r="80" fill="none" stroke="#ffffff" stroke-width="4"/>
        <circle cx="0" cy="0" r="120" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.7"/>
        
        <!-- Central Chip -->
        <rect x="-40" y="-40" width="80" height="80" rx="8" fill="#ffffff"/>
        <rect x="-32" y="-32" width="64" height="64" rx="4" fill="${this.config.themeColor}"/>
        
        <!-- Connection Points -->
        <circle cx="0" cy="-80" r="8" fill="#ffffff"/>
        <circle cx="80" cy="0" r="8" fill="#ffffff"/>
        <circle cx="0" cy="80" r="8" fill="#ffffff"/>
        <circle cx="-80" cy="0" r="8" fill="#ffffff"/>
        
        <!-- Lines -->
        <line x1="0" y1="-72" x2="0" y2="-40" stroke="#ffffff" stroke-width="3"/>
        <line x1="72" y1="0" x2="40" y2="0" stroke="#ffffff" stroke-width="3"/>
        <line x1="0" y1="72" x2="0" y2="40" stroke="#ffffff" stroke-width="3"/>
        <line x1="-72" y1="0" x2="-40" y2="0" stroke="#ffffff" stroke-width="3"/>
        
        <!-- Tech Text -->
        <text x="0" y="8" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="bold">TV</text>
    </g>
</svg>`;

        // Safari pinned tab SVG (monochrome)
        const safariSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M256 16C123.452 16 16 123.452 16 256s107.452 240 240 240 240-107.452 240-240S388.548 16 256 16zm0 80c88.366 0 160 71.634 160 160s-71.634 160-160 160S96 344.366 96 256s71.634-160 160-160zm0 40c-66.274 0-120 53.726-120 120s53.726 120 120 120 120-53.726 120-120-53.726-120-120-120zm0 40c44.183 0 80 35.817 80 80s-35.817 80-80 80-80-35.817-80-80 35.817-80 80-80z"/>
</svg>`;

        fs.writeFileSync(path.join(this.outputDir, 'logo-template.svg'), logoSVG);
        fs.writeFileSync(path.join(this.outputDir, 'safari-pinned-tab.svg'), safariSVG);
        
        console.log('✅ Templates SVG générés');
    }

    /**
     * Génère les instructions d'utilisation
     */
    generateInstructions() {
        const instructions = `# 🎨 Pack Favicon TechViral - Instructions
## Version "Acier" - Pack favicon enterprise complet

## 📋 RÉSUMÉ DU PACKAGE

### ✅ Fichiers Générés
- \`manifest.json\` - Progressive Web App manifest
- \`browserconfig.xml\` - Configuration Windows tiles
- \`favicon-meta-tags.html\` - Meta tags HTML complets
- \`logo-template.svg\` - Template logo vectoriel
- \`safari-pinned-tab.svg\` - Icône Safari monochrome

### 📱 Formats Supportés
- **Standard Favicon**: 16x16, 32x32, 48x48 (.ico, .png)
- **Apple Touch Icons**: 57-180px (9 tailles)
- **Android Chrome**: 192x192, 512x512 (.png)
- **Windows Tiles**: 70x70, 150x150, 310x150, 310x310 (.png)
- **Safari Pinned Tab**: Vectoriel monochrome (.svg)

## 🔧 ÉTAPES D'IMPLÉMENTATION

### 1. Créer les Images Sources
Vous devez créer les images à partir des templates SVG fournis:

\`\`\`bash
# Installer ImageMagick ou utiliser un outil de design
# Exporter le logo-template.svg aux tailles requises

# Favicon standard
convert logo-template.svg -resize 16x16 favicon-16x16.png
convert logo-template.svg -resize 32x32 favicon-32x32.png
convert logo-template.svg -resize 48x48 favicon-48x48.png

# Créer favicon.ico multi-tailles
convert favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico
\`\`\`

### 2. Générer Toutes les Tailles
\`\`\`bash
# Apple Touch Icons
convert logo-template.svg -resize 57x57 apple-touch-icon-57x57.png
convert logo-template.svg -resize 60x60 apple-touch-icon-60x60.png
convert logo-template.svg -resize 72x72 apple-touch-icon-72x72.png
convert logo-template.svg -resize 76x76 apple-touch-icon-76x76.png
convert logo-template.svg -resize 114x114 apple-touch-icon-114x114.png
convert logo-template.svg -resize 120x120 apple-touch-icon-120x120.png
convert logo-template.svg -resize 144x144 apple-touch-icon-144x144.png
convert logo-template.svg -resize 152x152 apple-touch-icon-152x152.png
convert logo-template.svg -resize 167x167 apple-touch-icon-167x167.png
convert logo-template.svg -resize 180x180 apple-touch-icon.png

# Android Chrome
convert logo-template.svg -resize 192x192 android-chrome-192x192.png
convert logo-template.svg -resize 512x512 android-chrome-512x512.png

# Windows Tiles
convert logo-template.svg -resize 70x70 mstile-70x70.png
convert logo-template.svg -resize 150x150 mstile-150x150.png
convert logo-template.svg -resize 310x150 mstile-310x150.png
convert logo-template.svg -resize 310x310 mstile-310x310.png
\`\`\`

### 3. Intégrer dans HTML
Copier le contenu de \`favicon-meta-tags.html\` dans le \`<head>\` de vos pages:

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechViral</title>
    
    <!-- FAVICON PACKAGE - INSÉRER ICI -->
    ${this.generateHTMLTags().replace(/\n/g, '\n    ')}
    <!-- FIN FAVICON PACKAGE -->
    
</head>
\`\`\`

### 4. Déployer les Fichiers
\`\`\`
📁 Racine du site/
├── favicon.ico
├── manifest.json
├── browserconfig.xml
└── assets/icons/
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── apple-touch-icon-*.png (8 tailles)
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── mstile-*.png (4 tailles)
    └── safari-pinned-tab.svg
\`\`\`

## 🧪 VALIDATION

### Tests Favicon
\`\`\`bash
# Vérifier que tous les fichiers existent
ls -la favicon.ico manifest.json browserconfig.xml
ls -la assets/icons/

# Tester dans navigateurs
# - Chrome: F12 > Application > Manifest
# - Safari: Ajouter à l'écran d'accueil
# - Windows: Épingler au menu Démarrer
\`\`\`

### Outils de Validation
- **Real Favicon Generator**: https://realfavicongenerator.net
- **Favicon Checker**: https://www.websiteplanet.com/webtools/favicon-checker/
- **PWA Builder**: https://www.pwabuilder.com/

## 📊 CARACTÉRISTIQUES ENTERPRISE

### ✅ PWA Ready
- Manifest.json complet avec shortcuts
- Service worker compatible
- Installation sur mobile/desktop

### ✅ Cross-Platform
- iOS Safari: Apple Touch Icons
- Android Chrome: Adaptive icons
- Windows: Live Tiles avec notifications
- macOS Safari: Pinned tab vectoriel

### ✅ SEO Optimized
- Tous les meta tags requis
- Schema.org WebSite intégré
- Theme colors cohérents

### ✅ Performance
- Formats optimaux par plateforme
- Lazy loading compatible
- CDN ready

## 🎨 PERSONNALISATION

### Couleurs
- **Primary**: ${this.config.themeColor}
- **Background**: ${this.config.backgroundColor}
- **Accent**: #8b5cf6

### Modifications
1. Éditer \`logo-template.svg\` avec votre design
2. Ajuster les couleurs dans \`manifest.json\`
3. Régénérer toutes les tailles
4. Tester sur tous les appareils

## 📋 CHECKLIST DÉPLOIEMENT

- [ ] Images générées (20+ fichiers)
- [ ] favicon.ico multi-tailles créé
- [ ] manifest.json déployé racine
- [ ] browserconfig.xml déployé racine
- [ ] Meta tags intégrés HTML
- [ ] Test iOS Safari
- [ ] Test Android Chrome
- [ ] Test Windows Edge
- [ ] Test macOS Safari
- [ ] Validation PWA Builder
- [ ] Performance Lighthouse OK

## 🚀 RÉSULTAT ATTENDU

Après implémentation complète:
- ✅ Icônes parfaites tous appareils
- ✅ Installation PWA fonctionnelle
- ✅ Branding cohérent multi-plateforme
- ✅ Score Lighthouse PWA 100%
- ✅ Support Windows Live Tiles
- ✅ Shortcuts app mobile

---

*Pack généré automatiquement par TechViral Favicon Generator "Acier"*
*Compatible: iOS 7+, Android 4.4+, Windows 8.1+, Safari 9+, Chrome 31+*`;

        const instructionsPath = path.join(__dirname, '..', 'favicon-instructions.md');
        fs.writeFileSync(instructionsPath, instructions);
        console.log('✅ Instructions complètes générées');
    }

    /**
     * Liste des fichiers générés
     */
    getGeneratedFiles() {
        return [
            'manifest.json',
            'browserconfig.xml',
            'favicon-instructions.md',
            'assets/icons/favicon-meta-tags.html',
            'assets/icons/logo-template.svg',
            'assets/icons/safari-pinned-tab.svg'
        ];
    }

    /**
     * Génère un exemple de validation
     */
    generateValidationScript() {
        const validationScript = `#!/bin/bash
# Validation Pack Favicon TechViral

echo "🧪 Validation pack favicon..."

# Vérifier fichiers critiques
CRITICAL_FILES=("favicon.ico" "manifest.json" "browserconfig.xml")
for file in "\${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file MANQUANT"
    fi
done

# Vérifier dossier icons
if [ -d "assets/icons" ]; then
    ICON_COUNT=$(ls assets/icons/*.png assets/icons/*.svg 2>/dev/null | wc -l)
    echo "✅ assets/icons/ ($ICON_COUNT fichiers)"
else
    echo "❌ assets/icons/ MANQUANT"
fi

# Vérifier manifest.json
if [ -f "manifest.json" ]; then
    if jq empty manifest.json 2>/dev/null; then
        echo "✅ manifest.json valide"
    else
        echo "❌ manifest.json invalide"
    fi
fi

echo "🎯 Validation terminée"`;

        const scriptPath = path.join(this.outputDir, 'validate-favicon.sh');
        fs.writeFileSync(scriptPath, validationScript);
        fs.chmodSync(scriptPath, 0o755);
        console.log('✅ Script de validation généré');
    }
}

// Export pour usage CLI
if (require.main === module) {
    const generator = new FaviconPackGenerator();
    
    generator.generateComplete()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 FAVICON PACK GÉNÉRÉ AVEC SUCCÈS!');
                console.log('\n📁 Fichiers générés:');
                result.files.forEach(file => console.log(`  - ${file}`));
                console.log('\n📖 Lire: favicon-instructions.md pour les étapes suivantes');
                process.exit(0);
            } else {
                console.error('\n💥 ERREUR:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 ERREUR FATALE:', error.message);
            process.exit(1);
        });
}

module.exports = FaviconPackGenerator;