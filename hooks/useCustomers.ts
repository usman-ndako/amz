"use client";

import { useState, useEffect, useCallback } from "react";
import { db, Customer } from "@/lib/db";
import { firestore } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe directly to Firestore in real-time
    const unsubscribe = onSnapshot(collection(firestore, "customers"), async (snap) => {
      const fresh: Customer[] = [];

      for (const docSnap of snap.docs) {
        const data = docSnap.data() as Customer;
        if (!data._deleted) {
          fresh.push(data);
        }
        // Keep Dexie in sync (for offline use)
        await db.customers.put(data);
      }

      setCustomers(fresh);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Add or update customer
  const saveCustomer = useCallback(async (customer: Customer) => {
    const updated: Customer = {
      ...customer,
      id: customer.id ?? crypto.randomUUID(),
      timestamp: Date.now(),
      _deleted: false,
      date: customer.date ?? new Date().toLocaleDateString(),
    };

    // Write to Dexie (offline-first)
    await db.customers.put(updated);

    // Push immediately to Firestore
    await setDoc(doc(firestore, "customers", updated.id), updated);

    return updated;
  }, []);

  // ✅ Delete customer
  const deleteCustomer = useCallback(async (id: string) => {
    const existing = await db.customers.get(id);
    if (!existing) return;

    const deleted: Customer = {
      ...existing,
      _deleted: true,
      timestamp: Date.now(),
    };

    // Remove from Dexie
    await db.customers.delete(id);

    // Delete from Firestore
    await deleteDoc(doc(firestore, "customers", id));

    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { customers, loading, saveCustomer, deleteCustomer };
}
