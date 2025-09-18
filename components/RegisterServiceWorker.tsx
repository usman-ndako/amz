// // components/RegisterServiceWorker.tsx
// "use client";

// import { useEffect } from "react";

// export default function RegisterServiceWorker() {
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/service-worker.js")
//         .then((reg) => console.log("Service worker registered:", reg))
//         .catch((err) => console.error("Service worker registration failed:", err));
//     }
//   }, []);

//   return null;
// }

// // components/RegisterServiceWorker.tsx
// "use client";

// import { useEffect } from "react";
// import { initOnlineSync } from "@/lib/sync";

// export default function RegisterServiceWorker() {
//   useEffect(() => {
//     // ✅ Register service worker
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker
//         .register("/service-worker.js")
//         .then((reg) => console.log("[SW] registered:", reg.scope))
//         .catch((err) => console.error("[SW] registration failed:", err));
//     }

//     // ✅ Start Dexie ↔ Firestore sync loop
//     const cleanup = initOnlineSync(30_000); // sync every 30s

//     return () => cleanup(); // cleanup listener
//   }, []);

//   return null;
// }

// components/RegisterServiceWorker.tsx
"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    // ✅ Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("[SW] registered:", reg.scope))
        .catch((err) => console.error("[SW] registration failed:", err));
    }
  }, []);

  return null;
}
