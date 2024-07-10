// Define a cache name for the service worker
const cacheName = 'v2';
// Specify the files to be cached
const cacheFiles = [
    './',
    './HelloWorld.html',
    './danny.jpeg',
];

// Event listener triggered when the service worker is installed
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installed');
    // Extends the installation process until caching is complete
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            // Log a message indicating that the cache files are being cached
            console.log('[ServiceWorker] Caching cacheFiles');
            // Return a promise that resolves when all files are added to the cache
            return cache.addAll(cacheFiles);
        })
    );
});