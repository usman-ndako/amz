// lib/sync.ts
import { liveQuery } from "dexie";
import { db, Customer } from "./db";
import { upsertCustomer, deleteCustomerFromFirestore, listenToFirestore } from "./firestoreHelpers";

// Dexie → React state (live updates, exclude deleted)
export const subscribeToDexieChanges = (onChange: (customers: Customer[]) => void) => {
  const subscription = liveQuery(() =>
    db.customers.toArray()
  ).subscribe({
    next: (customers) => {
      const visible = customers.filter((c) => !c._deleted); // ✅ hide deleted locally
      onChange(visible);
    },
    error: (err) => console.error("Dexie sync error:", err),
  });
  return () => subscription.unsubscribe();
};

// Firestore → Dexie
export const listenAndSyncFromFirestore = () => {
  return listenToFirestore(async (customers: Customer[]) => {
    const idsFromFirestore = customers.map((c) => c.id);

    // ✅ Upsert Firestore docs into Dexie
    for (const c of customers) {
      await db.customers.put({ ...c, synced: true });
    }

    // ✅ Remove any Dexie docs not in Firestore and not marked deleted
    const localCustomers = await db.customers.toArray();
    for (const local of localCustomers) {
      if (!idsFromFirestore.includes(local.id) && !local._deleted) {
        await db.customers.delete(local.id);
      }
    }
  });
};

// Save customer (Dexie + Firestore)
export const saveCustomer = async (data: Partial<Customer>) => {
  const now = Date.now();

  // ✅ Auto-generate date if missing
  if (!data.date) {
    data.date = new Date().toLocaleDateString();
  }

  if (data.id) {
    // Update existing
    await db.customers.put({ ...(data as Customer), timestamp: now, synced: false });
    upsertCustomer({ ...(data as Customer), timestamp: now }).catch(() => {});
  } else {
    // New record
    const id = crypto.randomUUID();
    await db.customers.add({ ...data, id, timestamp: now, synced: false } as Customer);
    upsertCustomer({ ...data, id, timestamp: now } as Customer).catch(() => {});
  }
};

// Delete (offline-first)
export const deleteCustomerSync = async (id: string) => {
  const existing = await db.customers.get(id);
  if (existing) {
    // ✅ Tombstone for sync tracking
    await db.customers.put({
      ...existing,
      _deleted: true,
      synced: false,
    });

    // ✅ Instantly remove from Dexie so UI updates offline
    await db.customers.delete(id);

    // Firestore deletion in background
    deleteCustomerFromFirestore(id).catch(() => {});
  }
};

// Dexie → Firestore sync periodically
export const syncLocalToFirestore = async () => {
  const unsynced = await db.customers.filter((c) => c.synced === false).toArray();

  for (const c of unsynced) {
    if (c._deleted) {
      await deleteCustomerFromFirestore(c.id).catch(() => {});
      await db.customers.delete(c.id);
    } else {
      await upsertCustomer(c).catch(() => {});
      await db.customers.put({ ...c, synced: true });
    }
  }
};
