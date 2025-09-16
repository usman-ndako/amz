// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// // next.config.js
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development", // disable PWA in dev mode
//   scope: "/",
//   sw: "service-worker.js",
//   fallbacks: {
//     document: "/offline",
//   },
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

// // next.config.js
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   scope: "/",
//   sw: "service-worker.js",
//   runtimeCaching: [
//     {
//       urlPattern: /^\/_next\/static\/.*/i,
//       handler: "CacheFirst",
//       options: { cacheName: "next-static" },
//     },
//     {
//       urlPattern: /^\/.*/i,
//       handler: "NetworkFirst",
//       options: { cacheName: "pages" },
//     },
//   ],
//   fallbacks: {
//     document: "/offline.html", // ⚡ must be offline.html, not offline.tsx
//   },
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

// // next.config.js
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   scope: "/",
//   sw: "service-worker.js",
//   fallbacks: {
//     document: "/offline",
//   },
//   runtimeCaching: [
//     {
//       urlPattern: /^\/$/, // ✅ cache the landing page
//       handler: "CacheFirst",
//       options: {
//         cacheName: "landing-page",
//       },
//     },
//     {
//       urlPattern: /^\/dashboard$/, // ✅ cache the dashboard page
//       handler: "CacheFirst",
//       options: {
//         cacheName: "dashboard-page",
//       },
//     },
//     {
//       urlPattern: /^https?.*/, // fallback for all other requests
//       handler: "NetworkFirst",
//       options: {
//         cacheName: "http-calls",
//       },
//     },
//   ],
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

// // next.config.js
// const runtimeCaching = require("./lib/pwaCache");

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   scope: "/",
//   sw: "service-worker.js",
//   fallbacks: {
//     document: "/offline",
//   },
//   runtimeCaching,
//   buildExcludes: [/middleware-manifest\.json$/],
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

// // next.config.js
// const runtimeCaching = require("./lib/pwaCache");

// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   scope: "/",
//   sw: "service-worker.js",
//   fallbacks: {
//     document: "/offline",
//   },
//   runtimeCaching,
//   buildExcludes: [/middleware-manifest\.json$/],

//   // Precache specific pages
//   include: ["/", "/dashboard", "/offline"],
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

const runtimeCaching = require("./lib/pwaCache");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  sw: "service-worker.js",
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  additionalManifestEntries: [
    "/",           // Landing page
    "/dashboard",  // Dashboard page
    "/offline",    // Offline fallback page
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
});
