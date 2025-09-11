import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  // Build optimizations
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['intersection-observer'],
        },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 1600,
  },

  // CSS optimization
  css: {
    postcss: './postcss.config.js',
  },

  // Development server
  server: {
    port: 3000,
    host: 'localhost',
    open: false,
  },

  // Preview server (for production builds)
  preview: {
    port: 3000,
    host: 'localhost',
  },

  // Assets optimization
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],

  // Plugins
  plugins: [
    // HTML processing
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'TechViral - Électronique & High-Tech',
          description: 'Découvrez notre sélection d\'électronique et high-tech',
        },
      },
    }),

    // Legacy browser support
    legacy({
      targets: ['> 1%', 'last 2 versions', 'Firefox ESR', 'not dead', 'not ie 11'],
      modernPolyfills: true,
    }),

    // Progressive Web App
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png'],
      manifest: {
        name: 'TechViral E-commerce',
        short_name: 'TechViral',
        description: 'Électronique & High-Tech',
        theme_color: '#1a202c',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  // Performance optimizations
  optimizeDeps: {
    include: ['intersection-observer'],
  },

  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});