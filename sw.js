/**
 * Service Worker TechViral - Version optimisée
 * Cache stratégique pour Core Web Vitals
 */

const CACHE_NAME = 'techviral-v2-optimized';
const STATIC_CACHE = 'static-v2';
const RUNTIME_CACHE = 'runtime-v2';

// Ressources critiques à mettre en cache immédiatement
const CRITICAL_RESOURCES = [
  '/',
  '/assets/css/tailwind.min.css',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/js/cart.js',
  '/assets/js/image-optimizer.js',
  '/assets/js/mobile-navigation.js'
];

// Ressources à mettre en cache en runtime
const RUNTIME_CACHE_URLS = [
  '/assets/js/',
  '/assets/images/',
  '/assets/icons/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Installation du Service Worker (cache critique immédiat)
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('SW: Critical resources cached ✅');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker (nettoyage des anciens caches)
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('SW: Activated ✅');
      return self.clients.claim();
    })
  );
});

// Stratégie de cache intelligente
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  event.respondWith(
    handleRequest(request, url)
  );
});

async function handleRequest(request, url) {
  // 1. Ressources statiques critiques (Cache First)
  if (CRITICAL_RESOURCES.some(resource => url.pathname === resource)) {
    return cacheFirst(request, STATIC_CACHE);
  }
  
  // 2. Images et assets (Cache First avec fallback)
  if (url.pathname.startsWith('/assets/images/') || url.pathname.startsWith('/assets/icons/')) {
    return cacheFirst(request, RUNTIME_CACHE);
  }
  
  // 3. CSS et JS non-critiques (Stale While Revalidate)
  if (url.pathname.startsWith('/assets/css/') || url.pathname.startsWith('/assets/js/')) {
    return staleWhileRevalidate(request, RUNTIME_CACHE);
  }
  
  // 4. Fonts externes (Cache First)
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    return cacheFirst(request, RUNTIME_CACHE);
  }
  
  // 5. Pages HTML (Network First avec cache fallback)
  if (request.mode === 'navigate') {
    return networkFirst(request, RUNTIME_CACHE);
  }
  
  // 6. Tout le reste (Network First)
  return networkFirst(request, RUNTIME_CACHE);
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('SW: Network failed for:', request.url);
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  // Return cached version immediately if available
  return cached || fetchPromise;
}

console.log('TechViral Service Worker loaded ✅');