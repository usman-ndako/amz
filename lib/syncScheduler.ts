// // lib/syncScheduler.ts
// import { syncLocalToFirestore, listenAndSyncFromFirestore } from "./sync";

// let syncInterval: NodeJS.Timer | null = null;

// export function startSyncScheduler() {
//   if (syncInterval) return; // already running

//   // Pull Firestore updates → Dexie
//   listenAndSyncFromFirestore();

//   // Push unsynced Dexie changes → Firestore every 10s
//   syncInterval = setInterval(() => {
//     syncLocalToFirestore();
//   }, 10_000);

//   // Push immediately when online again
//   window.addEventListener("online", () => {
//     syncLocalToFirestore();
//   });
// }

// lib/syncScheduler.ts
import { syncLocalToFirestore } from "./sync";

let syncInterval: number | null = null;

export function startSyncScheduler() {
  if (syncInterval) return; // already running

  // Push unsynced Dexie changes → Firestore every 10s
  syncInterval = window.setInterval(() => {
    syncLocalToFirestore().catch(console.error);
  }, 10_000);

  // Push immediately when online again
  window.addEventListener("online", () => {
    syncLocalToFirestore().catch(console.error);
  });
}
