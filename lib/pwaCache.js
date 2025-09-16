// lib/pwaCache.js

const runtimeCaching = [
  // Images
  {
    urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "images",
      expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
    },
  },
  // Fonts
  {
    urlPattern: /^https?.*\.(woff|woff2|eot|ttf|otf)$/,
    handler: "CacheFirst",
    options: {
      cacheName: "fonts",
      expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 }, // 1 year
    },
  },
  // JS / CSS
  {
    urlPattern: /^https?.*\.(js|css|ts|tsx)$/,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-resources",
    },
  },
  // API calls (optional, fallback to network first)
  {
    urlPattern: /^https?.*\/api\/.*$/,
    handler: "NetworkFirst",
    options: {
      cacheName: "api",
      networkTimeoutSeconds: 5,
      expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // 1 day
      cacheableResponse: { statuses: [0, 200] },
    },
  },
];

module.exports = runtimeCaching;
