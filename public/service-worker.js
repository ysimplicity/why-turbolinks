var files = [
  "manifest.json",
  "index.html",
  "signal-vs-noise.html",
  "ios.html",
  "android.html",
  "videos.html",
  "pwa.html",
  "license.html",
  "css/vex.css",
  "css/vex-theme.css",
  "css/main.css",
  "images/ysimplicity-logo-white-bg-black.png",
  "images/ysimplicity-logo-white-sm.png",
  "images/icons/android-icon-192x192.png",
  "images/icons/apple-icon-180x180.png",
  "images/icons/favicon.ico",
  "images/icons/ms-icon-144x144.png",
  "js/vex.combined.js",
  "js/turbolinks.js",
  "js/articlesMenu.js",
  "js/main.js"
];

// dev only
if (typeof files == 'undefined') {
  var files = [];
} else {
  files.push('./');
}

var CACHE_NAME = 'try-turbolinks-v010';

self.addEventListener('activate', function(event) {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (CACHE_NAME.indexOf(cacheName) == -1) {
            console.log('[SW] Delete cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('install', function(event){
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
      	files.map(function(file){
      		return cache.add(file);
      	})
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('[SW] fetch ' + event.request.url)
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request.clone());
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event);
  clients.openWindow('/');
});
