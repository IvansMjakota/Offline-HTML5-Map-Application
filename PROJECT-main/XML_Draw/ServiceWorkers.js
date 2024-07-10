/**
 * Service worker responsible for caching specified files for offline use.
 * It intercepts fetch requests and serves cached files when available.
 */

// Define a cache name for the service worker
const cacheName = 'v1';
// Specify the files to be cached
const cacheFiles = [
    './',
    './XML_Dot.html',
    './XML_Dot.css',
    './DrawingNodes.js',
    './Pan.js',
    './Zoom.js',
];

/**
 * Event listener triggered when the service worker is installed.
 * 
 * @param {ExtendableEvent} e - The event object associated with the installation.
 */

// Event listener triggered when the service worker is installed
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installed');
    // Extend the installation process until caching is complete
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            // Log a message indicating that the cache files are being cached
            console.log('[ServiceWorker] Caching cacheFiles');
            // Return a promise that resolves when all files are added to the cache
            return cache.addAll(cacheFiles);
        })
    );
});

/**
 * Event listener triggered when the service worker is activated.
 * 
 * @param {ExtendableEvent} e - The event object associated with the activation.
 */

// Event listener triggered when the service worker is activated
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activated');
});

/**
 * Event listener triggered when the service worker intercepts a fetch request.
 * 
 * @param {FetchEvent} e - The fetch event object associated with the intercepted request.
 */

// Event listener triggered when the service worker intercepts a fetch request
self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetching', e.request.url);
    // Respond with a fetch from the cache if available; otherwise, fetch from the network
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});