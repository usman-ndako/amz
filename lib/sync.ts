// // lib/sync.ts
// import { liveQuery } from "dexie";
// import { db, Customer } from "./db";
// import { upsertCustomer, deleteCustomerFromFirestore, listenToFirestore } from "./firestoreHelpers";

// // Dexie → React state (live updates, exclude deleted)
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const subscription = liveQuery(() =>
//     db.customers.toArray()
//   ).subscribe({
//     next: (customers) => {
//       const visible = customers.filter((c) => !c._deleted); // ✅ hide deleted locally
//       onChange(visible);
//     },
//     error: (err) => console.error("Dexie sync error:", err),
//   });
//   return () => subscription.unsubscribe();
// };

// // Firestore → Dexie
// export const listenAndSyncFromFirestore = () => {
//   return listenToFirestore(async (customers: Customer[]) => {
//     const idsFromFirestore = customers.map((c) => c.id);

//     // ✅ Upsert Firestore docs into Dexie
//     for (const c of customers) {
//       await db.customers.put({ ...c, synced: true });
//     }

//     // ✅ Remove any Dexie docs not in Firestore and not marked deleted
//     const localCustomers = await db.customers.toArray();
//     for (const local of localCustomers) {
//       if (!idsFromFirestore.includes(local.id) && !local._deleted) {
//         await db.customers.delete(local.id);
//       }
//     }
//   });
// };

// // Save customer (Dexie + Firestore)
// export const saveCustomer = async (data: Partial<Customer>) => {
//   const now = Date.now();

//   // ✅ Auto-generate date if missing
//   if (!data.date) {
//     data.date = new Date().toLocaleDateString();
//   }

//   if (data.id) {
//     // Update existing
//     await db.customers.put({ ...(data as Customer), timestamp: now, synced: false });
//     upsertCustomer({ ...(data as Customer), timestamp: now }).catch(() => {});
//   } else {
//     // New record
//     const id = crypto.randomUUID();
//     await db.customers.add({ ...data, id, timestamp: now, synced: false } as Customer);
//     upsertCustomer({ ...data, id, timestamp: now } as Customer).catch(() => {});
//   }
// };

// // Delete (offline-first)
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (existing) {
//     // ✅ Tombstone for sync tracking
//     await db.customers.put({
//       ...existing,
//       _deleted: true,
//       synced: false,
//     });

//     // ✅ Instantly remove from Dexie so UI updates offline
//     await db.customers.delete(id);

//     // Firestore deletion in background
//     deleteCustomerFromFirestore(id).catch(() => {});
//   }
// };

// // Dexie → Firestore sync periodically
// export const syncLocalToFirestore = async () => {
//   const unsynced = await db.customers.filter((c) => c.synced === false).toArray();

//   for (const c of unsynced) {
//     if (c._deleted) {
//       await deleteCustomerFromFirestore(c.id).catch(() => {});
//       await db.customers.delete(c.id);
//     } else {
//       await upsertCustomer(c).catch(() => {});
//       await db.customers.put({ ...c, synced: true });
//     }
//   }
// };

// // lib/sync.ts
// import { liveQuery } from "dexie";
// import { db, Customer } from "./db";
// import {
//   upsertCustomer,
//   deleteCustomerFromFirestore,
//   listenToFirestore,
// } from "./firestoreHelpers";

// /**
//  * Dexie → React state (live updates, exclude deleted)
//  */
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const subscription = liveQuery(() => db.customers.toArray()).subscribe({
//     next: (customers) => {
//       const visible = customers.filter((c) => !c._deleted); // hide deleted locally
//       onChange(visible);
//     },
//     error: (err) => console.error("Dexie liveQuery error:", err),
//   });

//   return () => subscription.unsubscribe();
// };

// /**
//  * Firestore → Dexie (keep local copy updated)
//  * returns the unsubscribe function from the Firestore listener
//  */
// export const listenAndSyncFromFirestore = () => {
//   return listenToFirestore(async (customers: Customer[]) => {
//     const idsFromFirestore = customers.map((c) => c.id);

//     // Upsert Firestore docs into Dexie (mark synced = true)
//     for (const c of customers) {
//       try {
//         await db.customers.put({ ...c, synced: true, _deleted: false });
//       } catch (err) {
//         console.error("[listenAndSyncFromFirestore] put error:", err);
//       }
//     }

//     // Remove any Dexie docs not in Firestore and not marked deleted
//     const localCustomers = await db.customers.toArray();
//     for (const local of localCustomers) {
//       if (!idsFromFirestore.includes(local.id) && !local._deleted) {
//         try {
//           await db.customers.delete(local.id);
//         } catch (err) {
//           console.error("[listenAndSyncFromFirestore] delete local error:", err);
//         }
//       }
//     }
//   });
// };

// /**
//  * Save or update a customer locally and attempt to push to Firestore
//  * (works offline — sets synced: false)
//  */
// export const saveCustomer = async (data: Partial<Customer>) => {
//   const now = Date.now();

//   // Auto-generate date if missing
//   if (!data.date) {
//     data.date = new Date().toLocaleDateString();
//   }

//   if (data.id) {
//     // Update existing
//     const updated = {
//       ...(data as Customer),
//       timestamp: now,
//       synced: false,
//       _deleted: false,
//     } as Customer;

//     await db.customers.put(updated);

//     // try to push to Firestore (fails silently if offline)
//     upsertCustomer(updated)
//       .then(() => db.customers.update(updated.id, { synced: true }))
//       .catch(() => {
//         /* offline - will sync later */
//       });
//   } else {
//     // New record
//     const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
//     const toAdd = {
//       ...(data as Customer),
//       id,
//       timestamp: now,
//       synced: false,
//       _deleted: false,
//     } as Customer;

//     await db.customers.add(toAdd);

//     upsertCustomer(toAdd)
//       .then(() => db.customers.update(id, { synced: true }))
//       .catch(() => {
//         /* offline - will sync later */
//       });
//   }
// };

// /**
//  * Delete (offline-first) — tombstone locally, try delete on Firestore.
//  * We DO NOT immediately remove the record from IndexedDB so the tombstone
//  * will be available to sync when back online. The UI hides tombstoned records.
//  */
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (!existing) return;

//   // Mark as deleted (tombstone) and mark unsynced
//   await db.customers.put({
//     ...existing,
//     _deleted: true,
//     synced: false,
//     timestamp: Date.now(),
//   });

//   // Try to delete in Firestore in background. If succeeds remove local record.
//   deleteCustomerFromFirestore(id)
//     .then(async () => {
//       try {
//         await db.customers.delete(id);
//       } catch (err) {
//         console.error("[deleteCustomerSync] delete local after remote success:", err);
//       }
//     })
//     .catch(() => {
//       /* offline - tombstone remains until next sync */
//     });
// };

// /**
//  * Push unsynced local changes to Firestore, then pull remote changes.
//  * Safe to call multiple times; intended to be used on 'online' event.
//  */
// export const syncLocalToFirestore = async () => {
//   try {
//     // Read all locals and filter unsynced in memory to avoid TypeScript/IndexableType issues
//     const allLocal = await db.customers.toArray();
//     const unsynced = allLocal.filter((c) => c.synced === false);

//     for (const c of unsynced) {
//       try {
//         if (c._deleted) {
//           // remote delete
//           await deleteCustomerFromFirestore(c.id).catch(() => {});
//           // remove local tombstone after successful remote delete (or keep if remote failed)
//           await db.customers.delete(c.id).catch(() => {});
//         } else {
//           // upsert remote
//           await upsertCustomer(c).catch(() => {});
//           // mark local as synced
//           await db.customers.update(c.id, { synced: true }).catch(() => {});
//         }
//       } catch (err) {
//         console.error("[syncLocalToFirestore] per-item error:", err);
//         // continue with next item
//       }
//     }
//   } catch (err) {
//     console.error("[syncLocalToFirestore] error:", err);
//   }
// };

// /**
//  * Convenience: try a full two-way sync (push then pull)
//  */
// export const syncAll = async () => {
//   try {
//     await syncLocalToFirestore();
//     // listenAndSyncFromFirestore pulls from Firestore in real-time via snapshot listener,
//     // but we still offer a one-time pull here:
//     // NOTE: If you want an explicit pull, call your firestoreHelpers fetch and upsert into Dexie.
//   } catch (err) {
//     console.error("[syncAll] error:", err);
//   }
// };

// /**
//  * Initialize automatic syncing when back online.
//  * Call this once from a client component (e.g. RegisterServiceWorker or a small client
//  * component in app/layout.tsx). Optionally pass pollIntervalMs to sync periodically.
//  *
//  * Returns a cleanup function to remove listeners/interval.
//  */
// export const initOnlineSync = (pollIntervalMs?: number) => {
//   if (typeof window === "undefined") return () => {};

//   const onOnline = () => {
//     console.log("[sync] navigator.onLine -> syncing local -> Firestore");
//     syncLocalToFirestore().catch((e) => console.error("[initOnlineSync] sync error:", e));
//   };

//   window.addEventListener("online", onOnline);

//   // If currently online, try an initial sync
//   if (navigator.onLine) {
//     onOnline();
//   }

//   let intervalId: number | undefined;
//   if (pollIntervalMs && pollIntervalMs > 0) {
//     intervalId = window.setInterval(() => {
//       if (navigator.onLine) {
//         syncLocalToFirestore().catch((e) => console.error("[initOnlineSync] periodic sync error:", e));
//       }
//     }, pollIntervalMs);
//   }

//   // cleanup
//   return () => {
//     window.removeEventListener("online", onOnline);
//     if (intervalId) window.clearInterval(intervalId);
//   };
// };

// // lib/sync.ts
// import { liveQuery } from "dexie";
// import { db, Customer } from "./db";
// import {
//   upsertCustomer,
//   deleteCustomerFromFirestore,
//   listenToFirestore,
// } from "./firestoreHelpers";

// // Dexie → React state (live updates, exclude deleted)
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const subscription = liveQuery(() => db.customers.toArray()).subscribe({
//     next: (customers) => {
//       const visible = customers.filter((c) => !c._deleted); // ✅ hide deleted locally
//       onChange(visible);
//     },
//     error: (err) => console.error("Dexie sync error:", err),
//   });
//   return () => subscription.unsubscribe();
// };

// // Firestore → Dexie
// export const listenAndSyncFromFirestore = () => {
//   return listenToFirestore(async (customers: Customer[]) => {
//     const idsFromFirestore = customers.map((c) => c.id);

//     // ✅ Upsert Firestore docs into Dexie
//     for (const c of customers) {
//       await db.customers.put({ ...c, synced: true });
//     }

//     // ✅ Remove any Dexie docs not in Firestore and not marked deleted
//     const localCustomers = await db.customers.toArray();
//     for (const local of localCustomers) {
//       if (!idsFromFirestore.includes(local.id) && !local._deleted) {
//         await db.customers.delete(local.id);
//       }
//     }
//   });
// };

// // Save customer (Dexie + Firestore)
// export const saveCustomer = async (data: Partial<Customer>) => {
//   const now = Date.now();

//   // ✅ Auto-generate date if missing
//   if (!data.date) {
//     data.date = new Date().toLocaleDateString();
//   }

//   if (data.id) {
//     // Update existing
//     await db.customers.put({ ...(data as Customer), timestamp: now, synced: false });
//     upsertCustomer({ ...(data as Customer), timestamp: now }).catch(() => {});
//   } else {
//     // New record
//     const id = crypto.randomUUID();
//     await db.customers.add({ ...data, id, timestamp: now, synced: false } as Customer);
//     upsertCustomer({ ...data, id, timestamp: now } as Customer).catch(() => {});
//   }
// };

// // Delete (offline-first)
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (existing) {
//     // ✅ Tombstone for sync tracking
//     await db.customers.put({
//       ...existing,
//       _deleted: true,
//       synced: false,
//     });

//     // ✅ Instantly remove from Dexie so UI updates offline
//     await db.customers.delete(id);

//     // Firestore deletion in background
//     deleteCustomerFromFirestore(id).catch(() => {});
//   }
// };

// // Dexie → Firestore sync periodically
// export const syncLocalToFirestore = async () => {
//   const unsynced = await db.customers.filter((c) => c.synced === false).toArray();

//   for (const c of unsynced) {
//     if (c._deleted) {
//       await deleteCustomerFromFirestore(c.id).catch(() => {});
//       await db.customers.delete(c.id);
//     } else {
//       await upsertCustomer(c).catch(() => {});
//       await db.customers.put({ ...c, synced: true });
//     }
//   }
// };

// // ✅ Background sync bootstrap
// export const initOnlineSync = (intervalMs = 30_000) => {
//   // Start listening to Firestore → Dexie updates
//   const unsubscribe = listenAndSyncFromFirestore();

//   // Sync immediately on startup
//   syncLocalToFirestore();

//   // Re-sync whenever the app comes back online
//   const handleOnline = () => {
//     console.log("[Sync] Back online, syncing...");
//     syncLocalToFirestore();
//   };
//   window.addEventListener("online", handleOnline);

//   // Run periodic background sync
//   const interval = setInterval(syncLocalToFirestore, intervalMs);

//   // Cleanup function
//   return () => {
//     unsubscribe();
//     clearInterval(interval);
//     window.removeEventListener("online", handleOnline);
//   };
// };

// // lib/sync.ts
// import { liveQuery } from "dexie";
// import { db, Customer } from "./db";
// import { upsertCustomer, deleteCustomerFromFirestore, listenToFirestore } from "./firestoreHelpers";

// // Dexie → React state (live updates, exclude deleted)
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const subscription = liveQuery(() =>
//     db.customers.toArray()
//   ).subscribe({
//     next: (customers) => {
//       const visible = customers.filter((c) => !c._deleted);
//       onChange(visible);
//     },
//     error: (err) => console.error("Dexie sync error:", err),
//   });
//   return () => subscription.unsubscribe();
// };

// // Firestore → Dexie
// export const listenAndSyncFromFirestore = () => {
//   return listenToFirestore(async (customers: Customer[]) => {
//     for (const c of customers) {
//       await db.customers.put({ ...c, synced: true });
//     }
//   });
// };

// // Save customer (Dexie + Firestore when online)
// export const saveCustomer = async (data: Partial<Customer>) => {
//   const now = Date.now();

//   if (!data.date) {
//     data.date = new Date().toLocaleDateString();
//   }

//   if (data.id) {
//     await db.customers.put({ ...(data as Customer), timestamp: now, synced: false });
//     upsertCustomer({ ...(data as Customer), timestamp: now }).catch(() => {});
//   } else {
//     const id = crypto.randomUUID();
//     await db.customers.add({ ...data, id, timestamp: now, synced: false } as Customer);
//     upsertCustomer({ ...data, id, timestamp: now } as Customer).catch(() => {});
//   }
// };

// // Delete (offline-first)
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (existing) {
//     await db.customers.put({
//       ...existing,
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//     deleteCustomerFromFirestore(id).catch(() => {});
//   }
// };

// // Push unsynced Dexie changes → Firestore
// export const syncLocalToFirestore = async () => {
//   const unsynced = await db.customers.filter((c) => c.synced === false).toArray();

//   for (const c of unsynced) {
//     if (c._deleted) {
//       await deleteCustomerFromFirestore(c.id).catch(() => {});
//       await db.customers.delete(c.id);
//     } else {
//       await upsertCustomer(c).catch(() => {});
//       await db.customers.put({ ...c, synced: true });
//     }
//   }
// };

// // lib/sync.ts
// import { liveQuery } from "dexie";
// import { db, Customer } from "./db";
// import {
//   upsertCustomer,
//   deleteCustomerFromFirestore,
//   listenToFirestore,
//   fetchAllCustomers,
// } from "./firestoreHelpers";

// /**
//  * Subscribe to Dexie changes (liveQuery). Returns unsubscribe function.
//  * UI should use this as the source of truth.
//  */
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const subscription = liveQuery(() => db.customers.toArray()).subscribe({
//     next(customers) {
//       const visible = customers.filter((c) => !c._deleted);
//       onChange(visible);
//     },
//     error(err) {
//       console.error("[sync] Dexie liveQuery error:", err);
//     },
//   });

//   return () => subscription.unsubscribe();
// };

// /**
//  * Merge remote Firestore docs into Dexie.
//  * - If local record exists and is unsynced (synced === false), we keep local version (do not overwrite).
//  * - Otherwise, we upsert remote into local and mark synced = true.
//  */
// export const listenAndSyncFromFirestore = () => {
//   // We use the realtime listener (if available) to keep local in sync.
//   return listenToFirestore(async (remoteCustomers: Customer[]) => {
//     try {
//       for (const remote of remoteCustomers) {
//         const local = await db.customers.get(remote.id);

//         // If local exists and has local unsynced edits, skip overwriting it.
//         if (local && local.synced === false) {
//           // merge simple: keep local entirely (assume local will be pushed up eventually)
//           continue;
//         }

//         // Otherwise safe to upsert remote into local store
//         await db.customers.put({ ...remote, synced: true, _deleted: false });
//       }
//     } catch (err) {
//       console.error("[sync] listenAndSyncFromFirestore error:", err);
//     }
//   });
// };

// /**
//  * One-time remote -> local pull (useful on startup)
//  * This uses a fetchAllCustomers (non-realtime) and merges similarly.
//  */
// export const pullFromFirestoreOnce = async () => {
//   try {
//     const remoteCustomers = await fetchAllCustomers();
//     for (const remote of remoteCustomers) {
//       const local = await db.customers.get(remote.id);
//       if (local && local.synced === false) continue;
//       await db.customers.put({ ...remote, synced: true, _deleted: false });
//     }
//   } catch (err) {
//     console.error("[sync] pullFromFirestoreOnce error:", err);
//   }
// };

// /**
//  * Save a customer locally (used by form). Sets synced=false so background sync will push it.
//  * Accepts partial; fills id/timestamp/date if missing.
//  */
// export const saveCustomer = async (data: Partial<Customer>) => {
//   const now = Date.now();
//   const id =
//     (data.id as string) ??
//     (typeof crypto !== "undefined" && "randomUUID" in crypto
//       ? crypto.randomUUID()
//       : `${now}-${Math.random().toString(36).slice(2, 9)}`);

//   if (!data.date) data.date = new Date().toLocaleDateString();

//   const toSave: Customer = {
//     ...(data as Customer),
//     id,
//     timestamp: now,
//     synced: false,
//     _deleted: false,
//   } as Customer;

//   await db.customers.put(toSave);
//   // attempt immediate push (best-effort)
//   try {
//     await upsertCustomer(toSave);
//     await db.customers.update(id, { synced: true });
//   } catch {
//     /* offline or failed — will be synced later */
//   }
// };

// /**
//  * Delete offline-first: set tombstone & synced=false locally.
//  * Do NOT remove local record immediately — keep tombstone until server delete completes.
//  */
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (!existing) return;

//   await db.customers.put({
//     ...existing,
//     _deleted: true,
//     synced: false,
//     timestamp: Date.now(),
//   });

//   // best-effort remote delete; if succeed, remove local tombstone
//   try {
//     await deleteCustomerFromFirestore(id);
//     await db.customers.delete(id);
//   } catch {
//     // offline: tombstone remains and will be cleaned on successful sync
//   }
// };

// /**
//  * Push unsynced local changes to Firestore.
//  * - For _deleted items: delete remote then remove local.
//  * - For others: upsert remote and mark local as synced.
//  */
// export const syncLocalToFirestore = async () => {
//   try {
//     // load all locals and filter in-memory to avoid index querying type issues
//     const allLocal = await db.customers.toArray();
//     const unsynced = allLocal.filter((c) => c.synced === false);

//     for (const c of unsynced) {
//       if (c._deleted) {
//         try {
//           await deleteCustomerFromFirestore(c.id);
//         } catch (err) {
//           // remote delete failed — keep tombstone for later retry
//           console.warn("[sync] remote delete failed, will retry later", c.id, err);
//           continue;
//         }
//         // remote delete succeeded -> remove local tombstone
//         await db.customers.delete(c.id);
//       } else {
//         try {
//           await upsertCustomer(c);
//           await db.customers.update(c.id, { synced: true }).catch(() => {});
//         } catch (err) {
//           console.warn("[sync] upsert failed for", c.id, err);
//           // leave it unsynced for next attempt
//         }
//       }
//     }
//   } catch (err) {
//     console.error("[sync] syncLocalToFirestore error:", err);
//   }
// };

// // lib/sync.ts
// import { db, Customer } from "./db";
// import {
//   collection,
//   getDocs,
//   setDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { firestore } from "./firebase";

// /**
//  * Push unsynced changes from Dexie → Firestore
//  */
// async function pushLocalChanges() {
//   const unsynced = await db.customers
//     .filter((c) => !c.synced)
//     .toArray();

//   for (const customer of unsynced) {
//     const ref = doc(firestore, "customers", customer.id);

//     if (customer._deleted) {
//       await deleteDoc(ref);
//       await db.customers.delete(customer.id);
//     } else {
//       await setDoc(ref, {
//         ...customer,
//         serverTimestamp: serverTimestamp(),
//       });
//       await db.customers.update(customer.id, { synced: true });
//     }
//   }
// }

// /**
//  * Pull remote changes Firestore → Dexie
//  */
// async function pullRemoteChanges() {
//   const snap = await getDocs(collection(firestore, "customers"));
//   const remote = snap.docs.map((d) => d.data() as Customer);

//   for (const r of remote) {
//     const local = await db.customers.get(r.id);

//     if (!local) {
//       // New record from server
//       await db.customers.put({ ...r, synced: true });
//     } else if (r.timestamp > (local.timestamp ?? 0)) {
//       // Remote is newer → overwrite
//       await db.customers.put({ ...r, synced: true });
//     }
//   }
// }

// /**
//  * Bi-directional sync
//  */
// export async function syncOnce() {
//   try {
//     await pushLocalChanges();
//     await pullRemoteChanges();
//   } catch (err) {
//     console.error("[sync] error:", err);
//   }
// }

// /**
//  * Start a periodic sync loop
//  */
// export function initOnlineSync(interval = 30000) {
//   syncOnce(); // run immediately
//   const id = setInterval(syncOnce, interval);
//   return () => clearInterval(id);
// }

// // lib/sync.ts
// import { db, Customer } from "./db";
// import {
//   upsertCustomer,
//   deleteCustomerFromFirestore,
//   listenToFirestore,
//   fetchAllCustomers,
// } from "./firestoreHelpers";
// import { liveQuery } from "dexie";

// /**
//  * Subscribe to local Dexie changes (UI source of truth).
//  * Returns unsubscribe function.
//  */
// export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
//   const sub = liveQuery(() => db.customers.toArray()).subscribe({
//     next(rows) {
//       onChange(rows.filter((r) => !r._deleted));
//     },
//     error(err) {
//       console.error("[sync] Dexie liveQuery error:", err);
//     },
//   });

//   return () => sub.unsubscribe();
// };

// /**
//  * Realtime listener from Firestore that merges remote -> Dexie safely.
//  * Returns unsubscribe function from the Firestore listener.
//  */
// export const listenAndSyncFromFirestore = () => {
//   return listenToFirestore(async (remoteCustomers: Customer[]) => {
//     try {
//       for (const remote of remoteCustomers) {
//         const local = await db.customers.get(remote.id);

//         // If local exists and has unsynced local edits, keep local (do not overwrite)
//         if (local && local.synced === false) {
//           continue;
//         }

//         // Otherwise upsert remote into Dexie and mark as synced
//         await db.customers.put({ ...remote, synced: true, _deleted: false });
//       }
//     } catch (err) {
//       console.error("[sync] listenAndSyncFromFirestore error:", err);
//     }
//   });
// };

// /**
//  * Save a full Customer object locally and attempt an immediate upload (best-effort).
//  * Expects a full Customer (id, timestamp assigned here if needed).
//  */
// export const saveCustomer = async (customer: Customer) => {
//   const now = Date.now();
//   const id = customer.id ?? (typeof crypto !== "undefined" ? crypto.randomUUID() : `${now}-${Math.random().toString(36).slice(2,9)}`);

//   const toSave: Customer = {
//     ...customer,
//     id,
//     timestamp: now,
//     date: customer.date ?? new Date().toLocaleDateString(),
//     synced: false,
//     _deleted: false,
//   };

//   await db.customers.put(toSave);

//   // try immediate push (non-blocking)
//   try {
//     await upsertCustomer(toSave);
//     await db.customers.update(id, { synced: true });
//   } catch (err) {
//     // offline / failed - keep unsynced
//     console.warn("[sync] immediate upsert failed (will retry later)", err);
//   }
// };

// /**
//  * Mark as deleted locally (tombstone) and attempt remote delete.
//  */
// export const deleteCustomerSync = async (id: string) => {
//   const existing = await db.customers.get(id);
//   if (!existing) return;

//   await db.customers.put({
//     ...existing,
//     _deleted: true,
//     synced: false,
//     timestamp: Date.now(),
//   });

//   try {
//     await deleteCustomerFromFirestore(id);
//     // remote deleted -> remove local tombstone
//     await db.customers.delete(id);
//   } catch (err) {
//     // offline: keep tombstone for later
//     console.warn("[sync] remote delete failed (will retry later)", err);
//   }
// };

// /**
//  * Push unsynced local changes to Firestore and handle tombstones.
//  */
// export const syncLocalToFirestore = async () => {
//   try {
//     const allLocal = await db.customers.toArray();
//     const unsynced = allLocal.filter((c) => c.synced !== true);

//     for (const c of unsynced) {
//       if (c._deleted) {
//         try {
//           await deleteCustomerFromFirestore(c.id);
//           await db.customers.delete(c.id);
//         } catch (err) {
//           console.warn("[sync] delete remote failed, will retry", c.id, err);
//         }
//       } else {
//         try {
//           await upsertCustomer(c);
//           await db.customers.update(c.id, { synced: true });
//         } catch (err) {
//           console.warn("[sync] upsert remote failed, will retry", c.id, err);
//         }
//       }
//     }
//   } catch (err) {
//     console.error("[sync] syncLocalToFirestore error:", err);
//   }
// };

// /**
//  * One-shot pull from Firestore -> Dexie (merge-safe).
//  * Useful on app start when online.
//  */
// export const pullFromFirestoreOnce = async () => {
//   try {
//     const remoteCustomers = await fetchAllCustomers();
//     for (const remote of remoteCustomers) {
//       const local = await db.customers.get(remote.id);
//       if (local && local.synced === false) continue;
//       await db.customers.put({ ...remote, synced: true, _deleted: false });
//     }
//   } catch (err) {
//     console.error("[sync] pullFromFirestoreOnce error:", err);
//   }
// };


// // lib/sync.ts
// import { db, Customer } from "./db";
// import { collection, getFirestore, setDoc, doc, deleteDoc, getDocs } from "firebase/firestore";

// const firestore = getFirestore();

// // Push local changes to Firestore
// export async function pushLocalChanges() {
//   const unsynced = await db.customers.filter((c) => !c.synced).toArray();

//   for (const customer of unsynced) {
//     const ref = doc(firestore, "customers", customer.id);
//     if (customer._deleted) {
//       await deleteDoc(ref).catch(console.error);
//       await db.customers.delete(customer.id);
//     } else {
//       await setDoc(ref, customer).catch(console.error);
//       await db.customers.update(customer.id, { synced: true });
//     }
//   }
// }

// // Pull remote changes from Firestore
// export async function pullRemoteChanges() {
//   const snapshot = await getDocs(collection(firestore, "customers"));
//   snapshot.forEach(async (docSnap) => {
//     const data = docSnap.data() as Customer;
//     const existing = await db.customers.get(data.id);

//     if (!existing || (existing.timestamp || 0) < (data.timestamp || 0)) {
//       await db.customers.put({ ...data, synced: true });
//     }
//   });
// }

// // Full two-way sync
// export async function syncLocalToFirestore() {
//   await pushLocalChanges();
//   await pullRemoteChanges();
// }

// // Initialize online sync loop (call in service worker or component)
// export function initOnlineSync(intervalMs = 30_000) {
//   // sync immediately
//   syncLocalToFirestore().catch(console.error);

//   // set interval
//   const timer = window.setInterval(() => {
//     syncLocalToFirestore().catch(console.error);
//   }, intervalMs);

//   // cleanup
//   return () => window.clearInterval(timer);
//}

// // lib/sync.ts
// import { db, Customer } from "./db";
// import { firestore } from "./firebase";
// import {
//   collection,
//   doc,
//   getDocs,
//   setDoc,
//   deleteDoc,
//   Timestamp,
// } from "firebase/firestore";

// /**
//  * Push local unsynced entries to Firestore
//  */
// export async function syncLocalToFirestore() {
//   if (!firestore) return;

//   try {
//     // 1️⃣ Push local unsynced entries (filter instead of where().equals())
//     const unsynced: Customer[] = await db.customers
//       .filter((c) => c.synced === false && !c._deleted)
//       .toArray();

//     for (const customer of unsynced) {
//       const docRef = doc(firestore, "customers", customer.id);

//       // If marked deleted locally, remove from Firestore
//       if (customer._deleted) {
//         await deleteDoc(docRef);
//         await db.customers.delete(customer.id);
//       } else {
//         // Push/update to Firestore
//         const data = {
//           ...customer,
//           timestamp: Timestamp.fromMillis(customer.timestamp),
//         };
//         await setDoc(docRef, data);
//         await db.customers.update(customer.id, { synced: true });
//       }
//     }
//   } catch (err) {
//     console.error("Error syncing local to Firestore:", err);
//   }
// }

// /**
//  * Pull Firestore updates → Dexie
//  */
// export async function pullFromFirestore() {
//   if (!firestore) return;

//   try {
//     const querySnapshot = await getDocs(collection(firestore, "customers"));
//     const firestoreCustomers: Customer[] = [];

//     querySnapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       firestoreCustomers.push({
//         id: docSnap.id,
//         name: data.name,
//         phone: data.phone,
//         address: data.address,
//         shoulder: data.shoulder,
//         sleeveLength: data.sleeveLength,
//         topLength: data.topLength,
//         chest: data.chest,
//         tommy: data.tommy,
//         neck: data.neck,
//         cufflinks: data.cufflinks,
//         trouserLength: data.trouserLength,
//         waist: data.waist,
//         lap: data.lap,
//         ankleSize: data.ankleSize,
//         calf: data.calf,
//         embroidery: data.embroidery,
//         lengthWidth: data.lengthWidth,
//         timestamp: data.timestamp?.toMillis() ?? Date.now(),
//         synced: true,
//         _deleted: false,
//       });
//     });

//     for (const customer of firestoreCustomers) {
//       const exists = await db.customers.get(customer.id);
//       if (!exists || customer.timestamp > (exists.timestamp || 0)) {
//         await db.customers.put(customer);
//       }
//     }
//   } catch (err) {
//     console.error("Error pulling from Firestore:", err);
//   }
// }

// import { db, Customer } from "./db";
// import { firestore } from "./firebase";
// import {
//   collection,
//   doc,
//   getDocs,
//   setDoc,
//   deleteDoc,
//   Timestamp,
// } from "firebase/firestore";

// /**
//  * Push local unsynced entries to Firestore
//  */
// export async function syncLocalToFirestore() {
//   if (!firestore) return;

//   try {
//     const unsynced: Customer[] = await db.customers
//       .filter((c) => c.synced === false) // only unsynced
//       .toArray();

//     for (const customer of unsynced) {
//       const docRef = doc(firestore, "customers", customer.id);

//       if (customer._deleted) {
//         // Delete remotely + locally
//         await deleteDoc(docRef);
//         await db.customers.delete(customer.id);
//       } else {
//         // Push/update to Firestore
//         const data = {
//           ...customer,
//           timestamp: Timestamp.fromMillis(customer.timestamp),
//         };
//         await setDoc(docRef, data);
//         await db.customers.update(customer.id, { synced: true });
//       }
//     }
//   } catch (err) {
//     console.error("Error syncing local to Firestore:", err);
//   }
// }

// /**
//  * Pull Firestore updates → Dexie
//  * Falls back to Dexie if offline
//  */
// export async function pullFromFirestore() {
//   if (!firestore) {
//     console.warn("⚠️ Firestore not available, using Dexie only.");
//     return db.customers.toArray(); // fallback
//   }

//   try {
//     const querySnapshot = await getDocs(collection(firestore, "customers"));
//     const firestoreCustomers: Customer[] = [];

//     querySnapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       firestoreCustomers.push({
//         id: docSnap.id,
//         name: data.name,
//         phone: data.phone,
//         address: data.address,
//         shoulder: data.shoulder,
//         sleeveLength: data.sleeveLength,
//         topLength: data.topLength,
//         chest: data.chest,
//         tommy: data.tommy,
//         neck: data.neck,
//         cufflinks: data.cufflinks,
//         trouserLength: data.trouserLength,
//         waist: data.waist,
//         lap: data.lap,
//         ankleSize: data.ankleSize,
//         calf: data.calf,
//         embroidery: data.embroidery,
//         lengthWidth: data.lengthWidth,
//         timestamp: data.timestamp?.toMillis() ?? Date.now(),
//         synced: true,
//         _deleted: false,
//       });
//     });

//     // Merge Firestore → Dexie
//     for (const customer of firestoreCustomers) {
//       const exists = await db.customers.get(customer.id);
//       if (!exists || customer.timestamp > (exists.timestamp || 0)) {
//         await db.customers.put(customer);
//       }
//     }

//     return firestoreCustomers;
//   } catch (err) {
//     console.warn("⚠️ Firestore fetch failed, using Dexie only.", err);
//     return db.customers.toArray(); // fallback if offline or error
//   }
// }

// lib/sync.ts
import { db, Customer } from "./db";
import { firestore } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

/**
 * Push local unsynced entries to Firestore
 */
export async function syncLocalToFirestore() {
  try {
    const unsynced: Customer[] = await db.customers
      .filter((c) => c.synced === false) // only unsynced
      .toArray();

    for (const customer of unsynced) {
      const docRef = doc(firestore, "customers", customer.id);

      if (customer._deleted) {
        // Delete remotely + locally
        await deleteDoc(docRef);
        await db.customers.delete(customer.id);
      } else {
        // Push/update to Firestore
        const data = {
          ...customer,
          timestamp: Timestamp.fromMillis(customer.timestamp),
        };
        await setDoc(docRef, data);
        await db.customers.update(customer.id, { synced: true });
      }
    }
  } catch (err) {
    console.error("Error syncing local to Firestore:", err);
  }
}

/**
 * Pull Firestore updates → Dexie
 * Falls back to Dexie if offline
 */
export async function pullFromFirestore(): Promise<Customer[]> {
  try {
    const querySnapshot = await getDocs(collection(firestore, "customers"));
    const firestoreCustomers: Customer[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      firestoreCustomers.push({
        id: docSnap.id,
        name: data.name,
        phone: data.phone,
        address: data.address,
        shoulder: data.shoulder,
        sleeveLength: data.sleeveLength,
        topLength: data.topLength,
        chest: data.chest,
        tommy: data.tommy,
        neck: data.neck,
        cufflinks: data.cufflinks,
        trouserLength: data.trouserLength,
        waist: data.waist,
        lap: data.lap,
        ankleSize: data.ankleSize,
        calf: data.calf,
        embroidery: data.embroidery,
        lengthWidth: data.lengthWidth,
        timestamp: data.timestamp?.toMillis() ?? Date.now(),
        synced: true,
        _deleted: false,
      });
    });

    // Merge Firestore → Dexie
    for (const customer of firestoreCustomers) {
      const exists = await db.customers.get(customer.id);
      if (!exists || customer.timestamp > (exists.timestamp || 0)) {
        await db.customers.put(customer);
      }
    }

    return firestoreCustomers;
  } catch (err) {
    console.warn("⚠️ Firestore fetch failed, using Dexie only.", err);
    return db.customers.toArray(); // fallback if offline or error
  }
}
