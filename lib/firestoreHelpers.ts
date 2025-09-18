// import { firestore } from "./firebase";
// import {
//   collection,
//   setDoc,
//   deleteDoc,
//   doc,
//   onSnapshot,
//   getDocs,
// } from "firebase/firestore";
// import { Customer } from "./db";

// const customersCollection = collection(firestore, "customers");

// // ✅ Add or update a customer
// export const upsertCustomer = async (customer: Customer) => {
//   if (!customer.id) throw new Error("Customer must have an ID");

//   // Ensure Firestore always has the latest fields
//   const docRef = doc(firestore, "customers", customer.id);

//   // Save full object (all fields, including new ones)
//   await setDoc(docRef, { ...customer });
// };

// // ✅ Delete a customer
// export const deleteCustomerFromFirestore = async (id: string) => {
//   const docRef = doc(firestore, "customers", id);
//   await deleteDoc(docRef);
// };

// // ✅ Fetch all customers once
// export const fetchAllCustomers = async (): Promise<Customer[]> => {
//   const snapshot = await getDocs(customersCollection);
//   return snapshot.docs.map(
//     (d) =>
//       ({
//         id: d.id,
//         ...d.data(),
//       } as Customer)
//   );
// };

// // ✅ Listen for realtime updates
// export const listenToFirestore = (callback: (customers: Customer[]) => void) => {
//   return onSnapshot(customersCollection, (snapshot) => {
//     const data = snapshot.docs.map(
//       (d) =>
//         ({
//           id: d.id,
//           ...d.data(),
//         } as Customer)
//     );
//     callback(data);
//   });
// };


// // lib/firestoreHelpers.ts
// import { firestore } from "./firebase";
// import { collection, setDoc, deleteDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
// import { Customer } from "./db";

// // ✅ Ensure Firestore is initialized (type narrowing)
// if (!firestore) {
//   throw new Error("Firestore not initialized. Check firebase.ts");
// }

// // Now TypeScript knows firestore is Firestore, not null
// const customersCollection = collection(firestore, "customers");

// // Add or update a customer
// export const upsertCustomer = async (customer: Customer) => {
//   if (!customer.id) throw new Error("Customer must have an ID");
//   const docRef = doc(customersCollection, customer.id);
//   await setDoc(docRef, { ...customer });
// };

// // Delete a customer
// export const deleteCustomerFromFirestore = async (id: string) => {
//   const docRef = doc(customersCollection, id);
//   await deleteDoc(docRef);
// };

// // Fetch all customers once
// export const fetchAllCustomers = async (): Promise<Customer[]> => {
//   const snapshot = await getDocs(customersCollection);
//   return snapshot.docs.map(
//     (d) =>
//       ({
//         id: d.id,
//         ...d.data(),
//       } as Customer)
//   );
// };

// // Listen for realtime updates
// export const listenToFirestore = (callback: (customers: Customer[]) => void) => {
//   return onSnapshot(customersCollection, (snapshot) => {
//     const data = snapshot.docs.map(
//       (d) =>
//         ({
//           id: d.id,
//           ...d.data(),
//         } as Customer)
//     );
//     callback(data);
//   });
// };


// lib/firestoreHelpers.ts
import { firestore } from "./firebase";
import {
  collection,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { Customer } from "./db";

// Firestore collection reference (non-null)
const customersCollection = collection(firestore, "customers");

// Add or update a customer
export const upsertCustomer = async (customer: Customer) => {
  if (!customer.id) throw new Error("Customer must have an ID");
  const docRef = doc(customersCollection, customer.id);
  await setDoc(docRef, { ...customer });
};

// Delete a customer
export const deleteCustomerFromFirestore = async (id: string) => {
  const docRef = doc(customersCollection, id);
  await deleteDoc(docRef);
};

// Fetch all customers once
export const fetchAllCustomers = async (): Promise<Customer[]> => {
  const snapshot = await getDocs(customersCollection);
  return snapshot.docs.map(
    (d) =>
      ({
        id: d.id,
        ...d.data(),
      } as Customer)
  );
};

// Listen for realtime updates
export const listenToFirestore = (
  callback: (customers: Customer[]) => void
) => {
  return onSnapshot(customersCollection, (snapshot) => {
    const data = snapshot.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
        } as Customer)
    );
    callback(data);
  });
};
