// lib/sync.ts
import { db, Customer } from "./db";
import { firestore } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

// ✅ Push local changes → Firestore
export async function pushToFirestore(customer: Customer) {
  if (!firestore) return;

  const docRef = doc(firestore, "customers", customer.id);

  if (customer._deleted) {
    await deleteDoc(docRef);
    await db.customers.delete(customer.id);
  } else {
    const data = {
      ...customer,
      timestamp: Timestamp.fromMillis(customer.timestamp),
    };
    await setDoc(docRef, data);
    await db.customers.update(customer.id, { synced: true });
  }
}

// ✅ Subscribe to Firestore changes in real-time
export function subscribeToFirestore() {
  if (!firestore) return;

  const colRef = collection(firestore, "customers");

  const unsubscribe = onSnapshot(colRef, async (snapshot) => {
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const customer: Customer = {
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
        _deleted: data._deleted ?? false,
        date: data.date ?? new Date().toLocaleDateString(),
      };

      // Latest change wins
      const existing = await db.customers.get(customer.id);
      if (!existing || customer.timestamp > (existing.timestamp || 0)) {
        await db.customers.put(customer);
      }
    }
  });

  return unsubscribe;
}
