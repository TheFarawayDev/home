const CACHE_NAME = 'ba-cache-v1';
let ASSETS_TO_CACHE = [];

fetch('assets-to-cache.json')
  .then(response => response.json())
  .then(assets => {
    ASSETS_TO_CACHE = assets;
  })
  .catch(error => {
    console.error('Failed to load assets-to-cache.json:', error);
  });

// Install event - caching assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning up old caches if necessary
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serving cached assets when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Serve asset from cache
      }
      return fetch(event.request).then(networkResponse => {
        // Optionally cache new assets
        return caches.open(CACHE_NAME).then(cache => {
          // Clone the response before caching
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Fallback response if both cache & network fail
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html'); // Serve a fallback HTML page
        }
      });
    })
  );
});
