const CACHE_NAME = 'caltrack-v2';
const urlsToCache = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/ui.js',
  'js/events.js',
  'js/storage.js',
  'js/calculations.js',
  'data/foods.js',
  'images/favicon.png',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache successful responses (except for CDN resources to save space)
            if (!event.request.url.includes('cdn.jsdelivr.net')) {
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache));
            }
            
            return response;
          })
          .catch(() => {
            // Return a custom offline page or cached response if available
            return caches.match('index.html');
          });
      })
  );
});
