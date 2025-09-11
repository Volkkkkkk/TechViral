/**
 * Lighthouse CI Configuration - TechViral
 * Version "Acier" : Performance Budgets Enterprise
 */

module.exports = {
  ci: {
    collect: {
      // URLs à tester
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/pages/categories/electronique.html',
        'http://localhost:3000/pages/products/camera-pov-gopro-hero13.html',
        'http://localhost:3000/pages/cart/cart.html'
      ],
      
      // Configuration Chrome
      chromeFlags: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--headless'
      ],
      
      // Nombre de runs pour moyenne
      numberOfRuns: 3,
      
      // Options serveur local
      startServerCommand: 'npm run serve',
      startServerReadyPattern: 'Local server started',
      startServerReadyTimeout: 60000
    },

    assert: {
      // Budgets performance "acier"
      assertions: {
        // Core Web Vitals - Seuils enterprise
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],

        // Scores minimums
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        // Métriques réseau
        'network-requests': ['warn', { maxNumericValue: 50 }],
        'total-byte-weight': ['error', { maxNumericValue: 2000000 }], // 2MB
        'dom-size': ['warn', { maxNumericValue: 1500 }],

        // Images et ressources
        'unused-css-rules': ['warn', { maxLength: 2 }],
        'unused-javascript': ['warn', { maxLength: 2 }],
        'modern-image-formats': 'error',
        'efficient-animated-content': 'error',
        'offscreen-images': 'error',

        // SEO Critical
        'document-title': 'error',
        'meta-description': 'error',
        'canonical': 'error',
        'hreflang': 'off',
        'robots-txt': 'error',

        // Accessibilité Critical
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'heading-order': 'error',
        'duplicate-id-aria': 'error',

        // PWA & Sécurité
        'is-on-https': 'error',
        'redirects-http': 'error',
        'uses-responsive-images': 'warn',
        'viewport': 'error'
      }
    },

    upload: {
      // Stockage résultats (optionnel - server LHCI)
      target: 'temporary-public-storage',
      
      // Configuration serveur LHCI custom (si déployé)
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-build-token'
    },

    server: {
      // Configuration serveur LHCI local
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci-data.db'
      }
    }
  },

  // Configuration audits personnalisés
  audits: [
    // Audit custom budgets
    require.resolve('./audits/performance-budget-audit.js'),
    require.resolve('./audits/core-web-vitals-audit.js')
  ],

  // Catégories personnalisées
  categories: {
    'techviral-performance': {
      title: 'TechViral Performance',
      description: 'Métriques performance spécifiques TechViral',
      auditRefs: [
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'cumulative-layout-shift', weight: 25 },
        { id: 'first-contentful-paint', weight: 15 },
        { id: 'speed-index', weight: 15 },
        { id: 'total-blocking-time', weight: 20 }
      ]
    },
    'techviral-ecommerce': {
      title: 'E-commerce Optimization',
      description: 'Métriques spécifiques e-commerce',
      auditRefs: [
        { id: 'interactive', weight: 30 },
        { id: 'total-byte-weight', weight: 20 },
        { id: 'modern-image-formats', weight: 15 },
        { id: 'unused-css-rules', weight: 15 },
        { id: 'efficient-animated-content', weight: 20 }
      ]
    }
  },

  // Réglages par environnement
  settings: {
    // Simulation mobile premium
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,        // 4G latency
      throughputKbps: 1600, // 4G download
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1600,
      uploadThroughputKbps: 750
    },
    
    // Émulation device
    screenEmulation: {
      mobile: true,
      width: 360,
      height: 640,
      deviceScaleFactor: 2,
      disabled: false
    },

    // Locales
    locale: 'fr-FR',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    
    // Budget alertes
    budgets: [
      {
        path: '/*',
        timings: [
          { metric: 'largest-contentful-paint', budget: 2500 },
          { metric: 'cumulative-layout-shift', budget: 100 }, // * 1000 for integer
          { metric: 'first-contentful-paint', budget: 1500 },
          { metric: 'speed-index', budget: 3000 },
          { metric: 'interactive', budget: 3500 }
        ],
        resourceSizes: [
          { resourceType: 'total', budget: 2000 }, // 2MB total
          { resourceType: 'script', budget: 500 },  // 500KB JS
          { resourceType: 'stylesheet', budget: 150 }, // 150KB CSS
          { resourceType: 'image', budget: 1000 }, // 1MB images
          { resourceType: 'font', budget: 100 }    // 100KB fonts
        ],
        resourceCounts: [
          { resourceType: 'total', budget: 50 },
          { resourceType: 'script', budget: 10 },
          { resourceType: 'stylesheet', budget: 5 },
          { resourceType: 'image', budget: 20 },
          { resourceType: 'third-party', budget: 15 }
        ]
      }
    ]
  }
};