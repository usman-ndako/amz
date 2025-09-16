

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
