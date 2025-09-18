// // hooks/useCustomers.ts
// "use client";

// import { useEffect, useState } from "react";
// import { Customer } from "@/lib/db";
// import {
//   subscribeToDexieChanges,
//   listenAndSyncFromFirestore,
//   syncLocalToFirestore,
// } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Dexie subscription (local first)
//     const unsubscribeDexie = subscribeToDexieChanges((c) => {
//       setCustomers(c);
//       setLoading(false);
//     });

//     // Firestore → Dexie sync
//     const unsubscribeFirestore = listenAndSyncFromFirestore();

//     // Dexie → Firestore periodic sync
//     const interval = setInterval(() => {
//       syncLocalToFirestore().catch(console.error);
//     }, 5000);

//     return () => {
//       unsubscribeDexie();
//       unsubscribeFirestore();
//       clearInterval(interval);
//     };
//   }, []);

//   return { customers, loading };
// }

// // hooks/useCustomers.ts
// "use client";

// import { useEffect, useState } from "react";
// import { Customer } from "@/lib/db";
// import {
//   subscribeToDexieChanges,
//   listenAndSyncFromFirestore,
//   syncLocalToFirestore,
//   pullFromFirestoreOnce,
// } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 1) Subscribe to local Dexie live updates (immediate source of truth)
//     const unsubscribeDexie = subscribeToDexieChanges((data) => {
//       setCustomers(data);
//       setLoading(false);
//     });

//     // 2) Start remote->local realtime listener that merges safe (won't overwrite local unsynced)
//     const unsubscribeFirestore = listenAndSyncFromFirestore();

//     // 3) Do an initial one-time pull (merge) if online
//     if (typeof navigator !== "undefined" && navigator.onLine) {
//       pullFromFirestoreOnce().catch((e) => console.error("[useCustomers] initial pull error", e));
//     }

//     // 4) Start periodic local->remote sync and online listener
//     const interval = setInterval(() => {
//       if (typeof navigator !== "undefined" && navigator.onLine) {
//         syncLocalToFirestore().catch((e) => console.error("[useCustomers] periodic sync error", e));
//       }
//     }, 10_000); // every 10s

//     const handleOnline = () => {
//       syncLocalToFirestore().catch((e) => console.error("[useCustomers] online sync error", e));
//       // also optionally pull remote updates after pushing
//       pullFromFirestoreOnce().catch((e) => console.error("[useCustomers] pull after online error", e));
//     };
//     window.addEventListener("online", handleOnline);

//     return () => {
//       unsubscribeDexie();
//       unsubscribeFirestore();
//       clearInterval(interval);
//       window.removeEventListener("online", handleOnline);
//     };
//   }, []);

//   return { customers, loading };
// }

// // hooks/useCustomers.ts
// "use client";

// import { useEffect, useState } from "react";
// import { db, Customer } from "@/lib/db";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);

//   useEffect(() => {
//     const sub = db.customers.hook("creating", () => refresh());
//     const sub2 = db.customers.hook("updating", () => refresh());
//     const sub3 = db.customers.hook("deleting", () => refresh());

//     refresh();

//     return () => {
//       db.customers.hook("creating").unsubscribe(sub);
//       db.customers.hook("updating").unsubscribe(sub2);
//       db.customers.hook("deleting").unsubscribe(sub3);
//     };
//   }, []);

//   const refresh = async () => {
//     const all = await db.customers.toArray();
//     setCustomers(all.sort((a, b) => b.timestamp - a.timestamp));
//   };

//   const addCustomer = async (customer: Customer) => {
//     await db.customers.put(customer);
//     refresh();
//   };

//   const updateCustomer = async (customer: Customer) => {
//     await db.customers.put({
//       ...customer,
//       timestamp: Date.now(),
//       synced: false,
//     });
//     refresh();
//   };

//   const deleteCustomer = async (id: string) => {
//     await db.customers.update(id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//     refresh();
//   };

//   return { customers, addCustomer, updateCustomer, deleteCustomer };
// }

// // hooks/useCustomers.ts
// "use client";

// import { useEffect, useState } from "react";
// import { Customer } from "@/lib/db";
// import {
//   subscribeToDexieChanges,
//   listenAndSyncFromFirestore,
//   syncLocalToFirestore,
//   saveCustomer as syncSaveCustomer,
//   deleteCustomerSync,
//   pullFromFirestoreOnce,
// } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 1) Dexie subscription (UI source of truth)
//     const unsubscribeDexie = subscribeToDexieChanges((rows) => {
//       setCustomers(rows);
//       setLoading(false);
//     });

//     // 2) Start Firestore -> Dexie merge listener
//     const unsubscribeFirestore = listenAndSyncFromFirestore();

//     // 3) If online, do an initial pull
//     if (typeof navigator !== "undefined" && navigator.onLine) {
//       pullFromFirestoreOnce().catch((e) => console.error(e));
//     }

//     // 4) Periodic local -> remote sync
//     const interval = setInterval(() => {
//       if (typeof navigator !== "undefined" && navigator.onLine) {
//         syncLocalToFirestore().catch((e) => console.error(e));
//       }
//     }, 10_000);

//     // 5) On online, trigger immediate sync
//     const onOnline = () => {
//       syncLocalToFirestore().catch((e) => console.error(e));
//       pullFromFirestoreOnce().catch((e) => console.error(e));
//     };
//     window.addEventListener("online", onOnline);

//     return () => {
//       unsubscribeDexie();
//       unsubscribeFirestore();
//       clearInterval(interval);
//       window.removeEventListener("online", onOnline);
//     };
//   }, []);

//   // wrapper around sync.saveCustomer which expects a full Customer
//   const saveCustomer = async (customer: Customer) => {
//     await syncSaveCustomer(customer);
//   };

//   const deleteCustomer = async (id: string) => {
//     await deleteCustomerSync(id);
//   };

//   return { customers, loading, saveCustomer, deleteCustomer };
// }


// // hooks/useCustomers.ts
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { db, Customer } from "@/lib/db";
// import { syncLocalToFirestore } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadCustomers = useCallback(async () => {
//     const all = await db.customers.toArray();
//     setCustomers(all.filter(c => !c._deleted));
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadCustomers();

//     // Dexie hooks
//     const handleCreate = () => loadCustomers();
//     const handleUpdate = () => loadCustomers();
//     const handleDelete = () => loadCustomers();

//     db.customers.hook.creating.subscribe(handleCreate);
//     db.customers.hook.updating.subscribe(handleUpdate);
//     db.customers.hook.deleting.subscribe(handleDelete);

//     // Periodic sync
//     const timer = window.setInterval(() => syncLocalToFirestore().catch(console.error), 30_000);

//     return () => {
//       db.customers.hook.creating.unsubscribe(handleCreate);
//       db.customers.hook.updating.unsubscribe(handleUpdate);
//       db.customers.hook.deleting.unsubscribe(handleDelete);
//       window.clearInterval(timer);
//     };
//   }, [loadCustomers]);

//   const saveCustomer = useCallback(async (customer: Customer) => {
//     const updated: Customer = {
//       ...customer,
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//       id: customer.id ?? crypto.randomUUID(),
//       date: customer.date ?? new Date().toLocaleDateString(),
//     };
//     await db.customers.put(updated);
//     setCustomers(prev => {
//       const idx = prev.findIndex(c => c.id === updated.id);
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx] = updated;
//         return copy;
//       }
//       return [updated, ...prev];
//     });
//     return updated;
//   }, []);

//   const deleteCustomer = useCallback(async (id: string) => {
//     await db.customers.update(id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//     setCustomers(prev => prev.filter(c => c.id !== id));
//   }, []);

//   return { customers, loading, saveCustomer, deleteCustomer };
// }


// // hooks/useCustomers.ts
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { db, Customer } from "@/lib/db";
// import { syncLocalToFirestore } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadCustomers = useCallback(async () => {
//     const all = await db.customers.toArray();
//     setCustomers(all.filter(c => !c._deleted));
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadCustomers();

//     // Dexie hooks
//     const handleCreate = () => loadCustomers();
//     const handleUpdate = () => loadCustomers();
//     const handleDelete = () => loadCustomers();

//     db.customers.hook.creating.subscribe(handleCreate);
//     db.customers.hook.updating.subscribe(handleUpdate);
//     db.customers.hook.deleting.subscribe(handleDelete);

//     // Periodic sync with Firestore
//     const timer = window.setInterval(() => syncLocalToFirestore().catch(console.error), 30_000);

//     return () => {
//       db.customers.hook.creating.unsubscribe(handleCreate);
//       db.customers.hook.updating.unsubscribe(handleUpdate);
//       db.customers.hook.deleting.unsubscribe(handleDelete);
//       window.clearInterval(timer);
//     };
//   }, [loadCustomers]);

//   const saveCustomer = useCallback(async (customer: Customer) => {
//     const updated: Customer = {
//       ...customer,
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//       id: customer.id ?? crypto.randomUUID(),
//       date: customer.date ?? new Date().toLocaleDateString(),
//     };
//     await db.customers.put(updated);

//     setCustomers(prev => {
//       const idx = prev.findIndex(c => c.id === updated.id);
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx] = updated;
//         return copy;
//       }
//       return [updated, ...prev];
//     });

//     return updated;
//   }, []);

//   const deleteCustomer = useCallback(async (id: string) => {
//     await db.customers.update(id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//     setCustomers(prev => prev.filter(c => c.id !== id));
//   }, []);

//   return { customers, loading, saveCustomer, deleteCustomer };
// }

// // hooks/useCustomers.ts
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { db, Customer } from "@/lib/db";
// import { syncLocalToFirestore } from "@/lib/sync";

// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadCustomers = useCallback(async () => {
//     const all = await db.customers.toArray();
//     setCustomers(all.filter((c) => !c._deleted));
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     loadCustomers();

//     // Dexie hooks — proper signature
//     const handleCreate = () => loadCustomers();
//     const handleUpdate = () => loadCustomers();
//     const handleDelete = () => loadCustomers();

//     // Dexie expects function signature (primKey, obj, transaction)
//     db.customers.hook.creating.subscribe((primKey, obj, transaction) => handleCreate());
//     db.customers.hook.updating.subscribe((modifications, primKey, obj, transaction) =>
//       handleUpdate()
//     );
//     db.customers.hook.deleting.subscribe((primKey, obj, transaction) => handleDelete());

//     const timer = window.setInterval(() => syncLocalToFirestore().catch(console.error), 30_000);

//     return () => {
//       db.customers.hook.creating.unsubscribe((primKey, obj, transaction) => handleCreate());
//       db.customers.hook.updating.unsubscribe((modifications, primKey, obj, transaction) =>
//         handleUpdate()
//       );
//       db.customers.hook.deleting.unsubscribe((primKey, obj, transaction) => handleDelete());
//       window.clearInterval(timer);
//     };
//   }, [loadCustomers]);

//   const saveCustomer = useCallback(async (customer: Customer) => {
//     const updated: Customer = {
//       ...customer,
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//       id: customer.id ?? crypto.randomUUID(),
//       date: customer.date ?? new Date().toLocaleDateString(),
//     };
//     await db.customers.put(updated);

//     setCustomers((prev) => {
//       const idx = prev.findIndex((c) => c.id === updated.id);
//       if (idx >= 0) {
//         const copy = [...prev];
//         copy[idx] = updated;
//         return copy;
//       }
//       return [updated, ...prev];
//     });

//     return updated;
//   }, []);

//   const deleteCustomer = useCallback(async (id: string) => {
//     await db.customers.update(id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//     setCustomers((prev) => prev.filter((c) => c.id !== id));
//   }, []);

//   return { customers, loading, saveCustomer, deleteCustomer };
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import { db, Customer } from "@/lib/db";
import { syncLocalToFirestore } from "@/lib/sync";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    const all = await db.customers.toArray();
    setCustomers(all.filter((c) => !c._deleted));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCustomers();

    // Dexie hooks — keep stable references for unsubscribe
    const handleCreate = () => loadCustomers();
    const handleUpdate = () => loadCustomers();
    const handleDelete = () => loadCustomers();

    const creatingHook = (primKey: string, obj: Customer, transaction: any) =>
      handleCreate();
    const updatingHook = (
      modifications: Partial<Customer>,
      primKey: string,
      obj: Customer,
      transaction: any
    ) => handleUpdate();
    const deletingHook = (
      primKey: string,
      obj: Customer,
      transaction: any
    ) => handleDelete();

    db.customers.hook.creating.subscribe(creatingHook);
    db.customers.hook.updating.subscribe(updatingHook);
    db.customers.hook.deleting.subscribe(deletingHook);

    // Periodic Firestore sync
    const timer = window.setInterval(
      () => syncLocalToFirestore().catch(console.error),
      30_000
    );

    return () => {
      db.customers.hook.creating.unsubscribe(creatingHook);
      db.customers.hook.updating.unsubscribe(updatingHook);
      db.customers.hook.deleting.unsubscribe(deletingHook);
      window.clearInterval(timer);
    };
  }, [loadCustomers]);

  const saveCustomer = useCallback(async (customer: Customer) => {
    const updated: Customer = {
      ...customer,
      timestamp: Date.now(),
      synced: false,
      _deleted: false,
      id: customer.id ?? crypto.randomUUID(),
      date: customer.date ?? new Date().toLocaleDateString(),
    };
    await db.customers.put(updated);

    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });

    return updated;
  }, []);

  const deleteCustomer = useCallback(async (id: string) => {
    await db.customers.update(id, {
      _deleted: true,
      synced: false,
      timestamp: Date.now(),
    });
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { customers, loading, saveCustomer, deleteCustomer };
}
