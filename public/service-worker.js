// // public/service-worker.js
// const CACHE_NAME = "tailor-app-cache-v1";
// const urlsToCache = [
//   "/",
//   "/dashboard",
//   "/offline",
//   "/manifest.json",
//   "/icons/icon-192.png",
//   "/icons/icon-512.png",
//   "/favicon.ico",
//   // add any other static assets or JS/CSS bundles you need cached
// ];

// self.addEventListener("install", (event) => {
//   console.log("[SW] Installing...");
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("[SW] Caching pre-defined URLs");
//       return cache.addAll(urlsToCache);
//     })
//   );
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   console.log("[SW] Activated");
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys
//           .filter((key) => key !== CACHE_NAME)
//           .map((key) => caches.delete(key))
//       )
//     )
//   );
//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) return cachedResponse;

//       return fetch(event.request)
//         .then((response) => {
//           if (!response || response.status !== 200 || response.type !== "basic") {
//             return response;
//           }
//           const responseClone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseClone);
//           });
//           return response;
//         })
//         .catch(() => {
//           // fallback to offline page for navigation requests
//           if (event.request.mode === "navigate") {
//             return caches.match("/offline");
//           }
//         });
//     })
//   );
// });


// public/service-worker.js
const CACHE_NAME = "tailor-app-cache-v2"; // bump version when updating cache
const urlsToCache = [
  "/",
  "/dashboard",
  "/offline",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/favicon.ico",
];

// ✅ Install event — cache core assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching core URLs");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// ✅ Activate event — clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// ✅ Fetch event — cache-first with network fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          // Cache valid responses
          if (response && response.status === 200 && response.type === "basic") {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 🔹 Always return a valid Response to avoid "Failed to convert" error
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }

          return new Response("⚠️ Offline: resource not cached", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});
