/**
 * Service Worker TechViral - Version basique
 * Cache les ressources principales pour améliorer les performances
 */

const CACHE_NAME = 'techviral-v1';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/cart.js',
  '/assets/js/main.js',
  '/assets/js/search.js',
  '/assets/js/forms.js'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('TechViral: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('TechViral: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourner la ressource du cache si trouvée
        if (response) {
          return response;
        }
        // Sinon, récupérer depuis le réseau
        return fetch(event.request);
      }
    )
  );
});

console.log('TechViral Service Worker loaded ✅');