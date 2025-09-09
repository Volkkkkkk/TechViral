// TechViral PWA Service Worker v2.0.0
// Advanced caching strategies, background sync, push notifications

const CACHE_VERSION = '2.0.0';
const STATIC_CACHE = `techviral-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `techviral-dynamic-v${CACHE_VERSION}`;
const IMAGES_CACHE = `techviral-images-v${CACHE_VERSION}`;
const API_CACHE = `techviral-api-v${CACHE_VERSION}`;

const OFFLINE_URL = '/offline.html';
const FALLBACK_IMAGE = '/assets/images/placeholder.svg';

// Static files to cache immediately
const STATIC_ASSETS = [
    '/',
    '/offline.html',
    '/manifest.json',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/js/cart.js',
    '/assets/js/advanced-filters.js',
    '/assets/js/smart-search.js',
    '/components/enhanced-navigation.html',
    '/components/advanced-filters.html',
    FALLBACK_IMAGE
];

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
    static: 'cache-first',
    dynamic: 'network-first', 
    images: 'cache-first',
    api: 'network-first'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log(`[SW] Installing version ${CACHE_VERSION}`);
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // Initialize other caches
            caches.open(DYNAMIC_CACHE),
            caches.open(IMAGES_CACHE),
            caches.open(API_CACHE)
        ]).then(() => {
            console.log('[SW] Installation complete');
            self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log(`[SW] Activating version ${CACHE_VERSION}`);
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.includes('techviral') && 
                            !cacheName.includes(CACHE_VERSION)) {
                            console.log(`[SW] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all pages
            self.clients.claim(),
            
            // Initialize background sync
            self.registration.sync?.register('background-sync')
        ]).then(() => {
            console.log('[SW] Activation complete');
        })
    );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and cross-origin requests (except for known CDNs)
    if (request.method !== 'GET' || 
        (url.origin !== location.origin && !isTrustedOrigin(url.origin))) {
        return;
    }
    
    // Route to appropriate cache strategy
    if (isStaticAsset(url.pathname)) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    } else if (isImageAsset(url.pathname)) {
        event.respondWith(imageStrategy(request));
    } else if (isAPIRequest(url.pathname)) {
        event.respondWith(apiStrategy(request));
    } else {
        event.respondWith(dynamicStrategy(request));
    }
});

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log(`[SW] Cache hit: ${request.url}`);
            return cachedResponse;
        }
        
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
            console.log(`[SW] Cached: ${request.url}`);
        }
        
        return response;
    } catch (error) {
        console.error(`[SW] Cache-first error: ${error}`);
        return await caches.match(OFFLINE_URL) || new Response('Offline');
    }
}

// Network-first strategy (for dynamic content)
async function networkFirstStrategy(request, cacheName) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
            console.log(`[SW] Updated cache: ${request.url}`);
        }
        return response;
    } catch (error) {
        console.log(`[SW] Network failed, trying cache: ${request.url}`);
        const cachedResponse = await caches.match(request);
        return cachedResponse || await caches.match(OFFLINE_URL) || 
               new Response('Content unavailable offline');
    }
}

// Dynamic content strategy
async function dynamicStrategy(request) {
    return networkFirstStrategy(request, DYNAMIC_CACHE);
}

// API strategy with smart caching
async function apiStrategy(request) {
    const url = new URL(request.url);
    
    // Don't cache POST/PUT/DELETE requests
    if (request.method !== 'GET') {
        return fetch(request);
    }
    
    try {
        const response = await fetch(request);
        
        if (response.ok && shouldCacheAPI(url.pathname)) {
            const cache = await caches.open(API_CACHE);
            // Cache for 5 minutes for API responses
            const expiryResponse = response.clone();
            expiryResponse.headers.set('sw-cache-timestamp', Date.now().toString());
            cache.put(request, expiryResponse);
        }
        
        return response;
    } catch (error) {
        // Check if we have a cached version that's not too old
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            const cacheTime = cachedResponse.headers.get('sw-cache-timestamp');
            const isExpired = cacheTime && (Date.now() - parseInt(cacheTime)) > 300000; // 5 min
            
            if (!isExpired) {
                console.log(`[SW] Using cached API response: ${request.url}`);
                return cachedResponse;
            }
        }
        
        throw error;
    }
}

// Image strategy with fallback
async function imageStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(IMAGES_CACHE);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log(`[SW] Image failed, using fallback: ${request.url}`);
        return await caches.match(FALLBACK_IMAGE) || 
               new Response('<svg>...</svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

async function performBackgroundSync() {
    try {
        // Sync cart data
        const cartData = await getStoredCartData();
        if (cartData && cartData.length > 0) {
            await syncCartToServer(cartData);
        }
        
        // Sync wishlist
        const wishlistData = await getStoredWishlistData();
        if (wishlistData && wishlistData.length > 0) {
            await syncWishlistToServer(wishlistData);
        }
        
        console.log('[SW] Background sync completed');
    } catch (error) {
        console.error('[SW] Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data?.text() || 'Nouvelle notification TechViral',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Voir les nouveautés',
                icon: '/assets/icons/explore-icon.png'
            },
            {
                action: 'close',
                title: 'Fermer',
                icon: '/assets/icons/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('TechViral', options)
    );
});

// Notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification click received');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/pages/categories/all.html?sort=newest')
        );
    } else if (event.action === 'close') {
        // Just close, no action needed
    } else {
        // Default action - open main page
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Periodic background sync (for supported browsers)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        // Sync latest products
        const response = await fetch('/api/products/latest');
        if (response.ok) {
            const cache = await caches.open(API_CACHE);
            cache.put('/api/products/latest', response.clone());
        }
        
        console.log('[SW] Content sync completed');
    } catch (error) {
        console.error('[SW] Content sync failed:', error);
    }
}

// Utility functions
function isStaticAsset(pathname) {
    return pathname.match(/\.(css|js|html|svg|woff2?|ttf)$/i) ||
           pathname === '/' ||
           pathname.startsWith('/components/');
}

function isImageAsset(pathname) {
    return pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i);
}

function isAPIRequest(pathname) {
    return pathname.startsWith('/api/') || 
           pathname.includes('search') ||
           pathname.includes('products');
}

function isTrustedOrigin(origin) {
    const trustedOrigins = [
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.techviral.com'
    ];
    return trustedOrigins.includes(origin);
}

function shouldCacheAPI(pathname) {
    const cacheable = [
        '/api/products/',
        '/api/categories/',
        '/api/search/'
    ];
    return cacheable.some(path => pathname.startsWith(path));
}

async function getStoredCartData() {
    // Get cart data from IndexedDB or localStorage
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

async function getStoredWishlistData() {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
}

async function syncCartToServer(cartData) {
    try {
        await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartData)
        });
        console.log('[SW] Cart synced successfully');
    } catch (error) {
        console.error('[SW] Cart sync failed:', error);
        throw error;
    }
}

async function syncWishlistToServer(wishlistData) {
    try {
        await fetch('/api/wishlist/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wishlistData)
        });
        console.log('[SW] Wishlist synced successfully');
    } catch (error) {
        console.error('[SW] Wishlist sync failed:', error);
        throw error;
    }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_VERSION':
                event.ports[0]?.postMessage({ version: CACHE_VERSION });
                break;
            case 'CACHE_URL':
                cacheUrl(event.data.url);
                break;
        }
    }
});

async function cacheUrl(url) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.add(url);
        console.log(`[SW] Manually cached: ${url}`);
    } catch (error) {
        console.error(`[SW] Manual cache failed: ${url}`, error);
    }
}

console.log(`[SW] Service Worker v${CACHE_VERSION} loaded`);