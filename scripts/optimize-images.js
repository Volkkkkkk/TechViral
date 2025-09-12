// Import avec gestion d'erreur pour les packages d'optimisation d'images
let imagemin, imageminWebp, imageminMozjpeg, imageminPngquant;

try {
    imagemin = require('imagemin');
    imageminWebp = require('imagemin-webp');
    imageminMozjpeg = require('imagemin-mozjpeg');
    imageminPngquant = require('imagemin-pngquant');
} catch (error) {
    console.warn('⚠️  Packages d\'optimisation d\'images non disponibles:', error.message);
    // Mode dégradé sans optimisation
}
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

/**
 * Script d'optimisation d'images pour TechViral
 * Génère WebP + optimise JPEG/PNG
 */
class ImageBuildOptimizer {
    constructor() {
        this.inputDir = 'assets/images';
        this.outputDir = 'dist/assets/images';
        this.stats = {
            processed: 0,
            originalSize: 0,
            optimizedSize: 0,
            webpGenerated: 0
        };
    }

    async run() {
        console.log('🖼️  Starting image optimization...');
        
        try {
            // Créer dossier de sortie
            await this.ensureOutputDir();
            
            // Traiter toutes les images
            await this.processImages();
            
            // Afficher statistiques
            this.printStats();
            
        } catch (error) {
            console.error('❌ Image optimization failed:', error);
            process.exit(1);
        }
    }

    async ensureOutputDir() {
        try {
            await fs.mkdir(this.outputDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }
    }

    async processImages() {
        const patterns = [
            `${this.inputDir}/**/*.jpg`,
            `${this.inputDir}/**/*.jpeg`,
            `${this.inputDir}/**/*.png`,
            `${this.inputDir}/**/*.svg`
        ];

        for (const pattern of patterns) {
            const files = await glob(pattern);
            await this.processFileList(files);
        }
    }

    async processFileList(files) {
        for (const file of files) {
            await this.processFile(file);
        }
    }

    async processFile(inputPath) {
        const stats = await fs.stat(inputPath);
        const originalSize = stats.size;
        const ext = path.extname(inputPath).toLowerCase();
        
        console.log(`Processing: ${inputPath}`);

        try {
            // Optimiser selon le type
            switch (ext) {
                case '.jpg':
                case '.jpeg':
                    await this.optimizeJpeg(inputPath, originalSize);
                    break;
                case '.png':
                    await this.optimizePng(inputPath, originalSize);
                    break;
                case '.svg':
                    await this.copySvg(inputPath);
                    break;
            }

            this.stats.processed++;
            
        } catch (error) {
            console.warn(`⚠️  Failed to process ${inputPath}:`, error.message);
        }
    }

    async optimizeJpeg(inputPath, originalSize) {
        const outputPath = this.getOutputPath(inputPath);
        const webpPath = this.getWebpPath(inputPath);

        if (!imagemin || !imageminMozjpeg) {
            console.log(`📋 Copie ${inputPath} (optimisation indisponible)`);
            await this.copyFile(inputPath, outputPath);
            return;
        }

        // Optimiser JPEG original
        const jpegFiles = await imagemin([inputPath], {
            destination: path.dirname(outputPath),
            plugins: [
                imageminMozjpeg({
                    quality: 85,
                    progressive: true
                })
            ]
        });

        // Générer version WebP
        const webpFiles = await imagemin([inputPath], {
            destination: path.dirname(webpPath),
            plugins: [
                imageminWebp({
                    quality: 80,
                    method: 6
                })
            ]
        });

        // Renommer WebP avec extension correcte
        if (webpFiles[0]) {
            const tempWebpPath = webpFiles[0].destinationPath;
            await fs.rename(tempWebpPath, webpPath);
            this.stats.webpGenerated++;
        }

        // Stats
        if (jpegFiles[0]) {
            const optimizedSize = jpegFiles[0].data.length;
            this.stats.originalSize += originalSize;
            this.stats.optimizedSize += optimizedSize;
            
            const savings = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
            console.log(`  ✅ JPEG: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% saved)`);
        }
    }

    async optimizePng(inputPath, originalSize) {
        const outputPath = this.getOutputPath(inputPath);
        const webpPath = this.getWebpPath(inputPath);

        // Optimiser PNG original
        const pngFiles = await imagemin([inputPath], {
            destination: path.dirname(outputPath),
            plugins: [
                imageminPngquant({
                    quality: [0.8, 0.9],
                    speed: 1
                })
            ]
        });

        // Générer version WebP
        const webpFiles = await imagemin([inputPath], {
            destination: path.dirname(webpPath),
            plugins: [
                imageminWebp({
                    quality: 80,
                    method: 6
                })
            ]
        });

        // Renommer WebP
        if (webpFiles[0]) {
            const tempWebpPath = webpFiles[0].destinationPath;
            await fs.rename(tempWebpPath, webpPath);
            this.stats.webpGenerated++;
        }

        // Stats
        if (pngFiles[0]) {
            const optimizedSize = pngFiles[0].data.length;
            this.stats.originalSize += originalSize;
            this.stats.optimizedSize += optimizedSize;
            
            const savings = Math.round(((originalSize - optimizedSize) / originalSize) * 100);
            console.log(`  ✅ PNG: ${this.formatBytes(originalSize)} → ${this.formatBytes(optimizedSize)} (${savings}% saved)`);
        }
    }

    async copySvg(inputPath) {
        const outputPath = this.getOutputPath(inputPath);
        await fs.copyFile(inputPath, outputPath);
        console.log(`  ✅ SVG copied: ${inputPath}`);
    }

    getOutputPath(inputPath) {
        const relativePath = path.relative(this.inputDir, inputPath);
        return path.join(this.outputDir, relativePath);
    }

    getWebpPath(inputPath) {
        const outputPath = this.getOutputPath(inputPath);
        const ext = path.extname(outputPath);
        return outputPath.replace(ext, '.webp');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    printStats() {
        const totalSavings = this.stats.originalSize - this.stats.optimizedSize;
        const savingsPercent = Math.round((totalSavings / this.stats.originalSize) * 100);

        console.log('\n📊 Image Optimization Summary:');
        console.log('─'.repeat(50));
        console.log(`Images processed: ${this.stats.processed}`);
        console.log(`WebP versions generated: ${this.stats.webpGenerated}`);
        console.log(`Original size: ${this.formatBytes(this.stats.originalSize)}`);
        console.log(`Optimized size: ${this.formatBytes(this.stats.optimizedSize)}`);
        console.log(`Total savings: ${this.formatBytes(totalSavings)} (${savingsPercent}%)`);
        console.log('✅ Image optimization complete!');
    }
}

// Lancer si appelé directement
if (require.main === module) {
    const optimizer = new ImageBuildOptimizer();
    optimizer.run();
}

module.exports = ImageBuildOptimizer;