// // app/dashboard/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import CustomerCard from "@/components/CustomerCard";
// import { Customer } from "@/lib/db";
// import {
//   subscribeToDexieChanges,
//   listenAndSyncFromFirestore,
//   saveCustomer,
//   deleteCustomerSync,
//   syncLocalToFirestore,
// } from "@/lib/sync";
// import { LayoutGrid, Table } from "lucide-react";
// import { showToast } from "@/lib/toast";

// export default function DashboardPage() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

//   useEffect(() => {
//     const unsubscribeDexie = subscribeToDexieChanges(setCustomers);
//     const unsubscribeFirestore = listenAndSyncFromFirestore();

//     const interval = setInterval(() => {
//       syncLocalToFirestore().catch(console.error);
//     }, 5000);

//     return () => {
//       unsubscribeDexie();
//       unsubscribeFirestore();
//       clearInterval(interval);
//     };
//   }, []);

//   const filteredCustomers = customers.filter((c) =>
//     c.name?.toLowerCase().includes(search.toLowerCase())
//   );
//   const sortedCustomers = [...filteredCustomers].sort((a, b) =>
//     sortOrder === "newest"
//       ? (b.timestamp || 0) - (a.timestamp || 0)
//       : (a.timestamp || 0) - (b.timestamp || 0)
//   );

//   const handleSaveCustomer = async (data: Partial<Customer>) => {
//     // Auto-fill date if new
//     if (!data.date) {
//       data.date = new Date().toLocaleDateString();
//     }
//     await saveCustomer(data);
//     showToast("Customer saved", "success");
//     closeModals();
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     setCustomers((prev) => prev.filter((c) => c.id !== id));
//     await deleteCustomerSync(id);
//     showToast("Customer deleted", "success");
//     closeModals();
//   };

//   const closeModals = () => {
//     (document.getElementById("customer_modal") as HTMLDialogElement)?.close();
//     (document.getElementById("detail_modal") as HTMLDialogElement)?.close();
//     setSelectedCustomer(null);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6">
//       <div id="app-toast" className="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-base-300/90 backdrop-blur-md shadow-md rounded-xl p-3 mb-6">
//         <div className="flex flex-col gap-3">
//           {/* Desktop */}
//           <div className="hidden sm:flex items-center justify-between gap-3">
//             <div className="w-64">
//               <input
//                 type="text"
//                 placeholder="Search customers..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="input input-bordered w-full"
//               />
//             </div>

//             <div className="join">
//               <button
//                 className={`btn join-item ${
//                   viewMode === "cards" ? "btn-primary" : "btn-ghost"
//                 }`}
//                 onClick={() => setViewMode("cards")}
//               >
//                 <LayoutGrid className="w-5 h-5" />
//               </button>
//               <button
//                 className={`btn join-item ${
//                   viewMode === "table" ? "btn-primary" : "btn-ghost"
//                 }`}
//                 onClick={() => setViewMode("table")}
//               >
//                 <Table className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="join">
//               <button
//                 className={`btn join-item ${
//                   sortOrder === "newest" ? "btn-primary" : "btn-ghost"
//                 }`}
//                 onClick={() => setSortOrder("newest")}
//               >
//                 Newest
//               </button>
//               <button
//                 className={`btn join-item ${
//                   sortOrder === "oldest" ? "btn-primary" : "btn-ghost"
//                 }`}
//                 onClick={() => setSortOrder("oldest")}
//               >
//                 Oldest
//               </button>
//             </div>

//             <button
//               className="btn btn-primary"
//               onClick={() => {
//                 setSelectedCustomer({
//                   name: "",
//                   phone: "",
//                   address: "",
//                 });
//                 (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
//               }}
//             >
//               Add Customer
//             </button>
//           </div>

//           {/* Mobile */}
//           <div className="flex flex-col sm:hidden gap-2">
//             <input
//               type="text"
//               placeholder="Search customers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="input input-bordered w-full"
//             />

//             <div className="flex items-center gap-2">
//               <div className="join flex-1">
//                 <button
//                   className={`btn join-item ${
//                     viewMode === "cards" ? "btn-primary" : "btn-ghost"
//                   }`}
//                   onClick={() => setViewMode("cards")}
//                 >
//                   <LayoutGrid className="w-5 h-5" />
//                 </button>
//                 <button
//                   className={`btn join-item ${
//                     viewMode === "table" ? "btn-primary" : "btn-ghost"
//                   }`}
//                   onClick={() => setViewMode("table")}
//                 >
//                   <Table className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="join flex-1">
//                 <button
//                   className={`btn join-item ${
//                     sortOrder === "newest" ? "btn-primary" : "btn-ghost"
//                   }`}
//                   onClick={() => setSortOrder("newest")}
//                 >
//                   Newest
//                 </button>
//                 <button
//                   className={`btn join-item ${
//                     sortOrder === "oldest" ? "btn-primary" : "btn-ghost"
//                   }`}
//                   onClick={() => setSortOrder("oldest")}
//                 >
//                   Oldest
//                 </button>
//               </div>
//             </div>

//             <button
//               className="btn btn-primary w-full"
//               onClick={() => {
//                 setSelectedCustomer({
//                   name: "",
//                   phone: "",
//                   address: "",
//                 });
//                 (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
//               }}
//             >
//               Add Customer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Cards */}
//       {viewMode === "cards" && (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {sortedCustomers.map((customer) => (
//             <CustomerCard
//               key={customer.id}
//               customer={customer}
//               onClick={() => {
//                 setSelectedCustomer(customer);
//                 (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Table */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Address</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedCustomers.map((customer) => (
//                 <tr key={customer.id}>
//                   <td>{customer.name}</td>
//                   <td>{customer.phone}</td>
//                   <td>{customer.address}</td>
//                   <td>{customer.date ?? "-"}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline"
//                       onClick={() => {
//                         setSelectedCustomer(customer);
//                         (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
//                       }}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modals */}
//       <dialog id="customer_modal" className="modal">
//         <div className="modal-box max-w-2xl">
//           <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
//           {selectedCustomer && (
//             <CustomerForm initialData={selectedCustomer} onSave={handleSaveCustomer} isNew={true} />
//           )}
//           <div className="modal-action">
//             <button className="btn" onClick={closeModals}>
//               Close
//             </button>
//           </div>
//         </div>
//       </dialog>

//       <dialog id="detail_modal" className="modal">
//         <div className="modal-box max-w-3xl">
//           <h3 className="font-bold text-lg mb-4">Customer Details</h3>
//           {selectedCustomer && (
//             <CustomerForm
//               initialData={selectedCustomer}
//               onSave={handleSaveCustomer}
//               onDelete={handleDeleteCustomer}
//             />
//           )}
//           <div className="modal-action">
//             <button className="btn" onClick={closeModals}>
//               Close
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </main>
//   );
// }

// export const dynamic = "force-static";

// // app/dashboard/page.tsx
// "use client";

// import { useState } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import CustomerCard from "@/components/CustomerCard";
// import { Customer } from "@/lib/db";
// import { saveCustomer, deleteCustomerSync } from "@/lib/sync";
// import { LayoutGrid, Table } from "lucide-react";
// import { showToast } from "@/lib/toast";
// import { useCustomers } from "@/hooks/useCustomers";

// export default function DashboardPage() {
//   const { customers, loading } = useCustomers();
//   const [search, setSearch] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

//   const filteredCustomers = customers.filter((c) =>
//     c.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const sortedCustomers = [...filteredCustomers].sort((a, b) =>
//     sortOrder === "newest"
//       ? (b.timestamp || 0) - (a.timestamp || 0)
//       : (a.timestamp || 0) - (b.timestamp || 0)
//   );

//   const handleSaveCustomer = async (data: Partial<Customer>) => {
//     if (!data.date) {
//       data.date = new Date().toLocaleDateString();
//     }
//     await saveCustomer(data);
//     showToast("Customer saved", "success");
//     closeModals();
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     await deleteCustomerSync(id);
//     showToast("Customer deleted", "success");
//     closeModals();
//   };

//   const closeModals = () => {
//     (document.getElementById("customer_modal") as HTMLDialogElement)?.close();
//     (document.getElementById("detail_modal") as HTMLDialogElement)?.close();
//     setSelectedCustomer(null);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6">
//       <div id="app-toast" className="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-base-300/90 backdrop-blur-md shadow-md rounded-xl p-3 mb-6">
//         <div className="flex flex-col gap-3">
//           {/* Desktop */}
//           <div className="hidden sm:flex items-center justify-between gap-3">
//             <div className="w-64">
//               <input
//                 type="text"
//                 placeholder="Search customers..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="input input-bordered w-full"
//               />
//             </div>

//             <div className="join">
//               <button
//                 className={`btn join-item ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`}
//                 onClick={() => setViewMode("cards")}
//               >
//                 <LayoutGrid className="w-5 h-5" />
//               </button>
//               <button
//                 className={`btn join-item ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
//                 onClick={() => setViewMode("table")}
//               >
//                 <Table className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="join">
//               <button
//                 className={`btn join-item ${sortOrder === "newest" ? "btn-primary" : "btn-ghost"}`}
//                 onClick={() => setSortOrder("newest")}
//               >
//                 Newest
//               </button>
//               <button
//                 className={`btn join-item ${sortOrder === "oldest" ? "btn-primary" : "btn-ghost"}`}
//                 onClick={() => setSortOrder("oldest")}
//               >
//                 Oldest
//               </button>
//             </div>

//             <button
//               className="btn btn-primary"
//               onClick={() => {
//                 setSelectedCustomer({ name: "", phone: "", address: "" });
//                 (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
//               }}
//             >
//               Add Customer
//             </button>
//           </div>

//           {/* Mobile */}
//           <div className="flex flex-col sm:hidden gap-2">
//             <input
//               type="text"
//               placeholder="Search customers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="input input-bordered w-full"
//             />

//             <div className="flex items-center gap-2">
//               <div className="join flex-1">
//                 <button
//                   className={`btn join-item ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`}
//                   onClick={() => setViewMode("cards")}
//                 >
//                   <LayoutGrid className="w-5 h-5" />
//                 </button>
//                 <button
//                   className={`btn join-item ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
//                   onClick={() => setViewMode("table")}
//                 >
//                   <Table className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="join flex-1">
//                 <button
//                   className={`btn join-item ${sortOrder === "newest" ? "btn-primary" : "btn-ghost"}`}
//                   onClick={() => setSortOrder("newest")}
//                 >
//                   Newest
//                 </button>
//                 <button
//                   className={`btn join-item ${sortOrder === "oldest" ? "btn-primary" : "btn-ghost"}`}
//                   onClick={() => setSortOrder("oldest")}
//                 >
//                   Oldest
//                 </button>
//               </div>
//             </div>

//             <button
//               className="btn btn-primary w-full"
//               onClick={() => {
//                 setSelectedCustomer({ name: "", phone: "", address: "" });
//                 (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
//               }}
//             >
//               Add Customer
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Cards */}
//       {viewMode === "cards" && (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {sortedCustomers.map((customer) => (
//             <CustomerCard
//               key={customer.id}
//               customer={customer}
//               onClick={() => {
//                 setSelectedCustomer(customer);
//                 (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
//               }}
//             />
//           ))}
//           {loading && <p>Loading customers...</p>}
//         </div>
//       )}

//       {/* Table */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Address</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sortedCustomers.map((customer) => (
//                 <tr key={customer.id}>
//                   <td>{customer.name}</td>
//                   <td>{customer.phone}</td>
//                   <td>{customer.address}</td>
//                   <td>{customer.date ?? "-"}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline"
//                       onClick={() => {
//                         setSelectedCustomer(customer);
//                         (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
//                       }}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {loading && (
//                 <tr>
//                   <td colSpan={5} className="text-center">
//                     Loading customers...
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modals */}
//       <dialog id="customer_modal" className="modal">
//         <div className="modal-box max-w-2xl">
//           <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
//           {selectedCustomer && (
//             <CustomerForm initialData={selectedCustomer} onSave={handleSaveCustomer} isNew={true} />
//           )}
//           <div className="modal-action">
//             <button className="btn" onClick={closeModals}>
//               Close
//             </button>
//           </div>
//         </div>
//       </dialog>

//       <dialog id="detail_modal" className="modal">
//         <div className="modal-box max-w-3xl">
//           <h3 className="font-bold text-lg mb-4">Customer Details</h3>
//           {selectedCustomer && (
//             <CustomerForm
//               initialData={selectedCustomer}
//               onSave={handleSaveCustomer}
//               onDelete={handleDeleteCustomer}
//             />
//           )}
//           <div className="modal-action">
//             <button className="btn" onClick={closeModals}>
//               Close
//             </button>
//           </div>
//         </div>
//       </dialog>
//     </main>
//   );
// }

// export const dynamic = "force-static";

// // app/dashboard/page.tsx
// "use client";

// import { useState } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import CustomerCard from "@/components/CustomerCard";
// import { Customer } from "@/lib/db";
// import { saveCustomer, deleteCustomerSync } from "@/lib/sync";
// import { LayoutGrid, Table } from "lucide-react";
// import { showToast } from "@/lib/toast";
// import { useCustomers } from "@/hooks/useCustomers";

// export default function DashboardPage() {
//   const { customers, loading } = useCustomers();
//   const [search, setSearch] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

//   const filteredCustomers = customers.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));
//   const sortedCustomers = [...filteredCustomers].sort((a, b) =>
//     sortOrder === "newest" ? (b.timestamp || 0) - (a.timestamp || 0) : (a.timestamp || 0) - (b.timestamp || 0)
//   );

//   const handleSaveCustomer = async (data: Partial<Customer>) => {
//     if (!data.date) data.date = new Date().toLocaleDateString();
//     await saveCustomer(data);
//     showToast("Customer saved", "success");
//     closeModals();
//   };

//   const handleDeleteCustomer = async (id: string) => {
//     // locally hide immediately (UI reads from Dexie so this will update automatically after tombstone)
//     await deleteCustomerSync(id);
//     showToast("Customer deleted", "success");
//     closeModals();
//   };

//   const closeModals = () => {
//     (document.getElementById("customer_modal") as HTMLDialogElement)?.close();
//     (document.getElementById("detail_modal") as HTMLDialogElement)?.close();
//     setSelectedCustomer(null);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6">
//       <div id="app-toast" className="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-base-300/90 backdrop-blur-md shadow-md rounded-xl p-3 mb-6">
//         <div className="flex flex-col gap-3">
//           {/* Desktop */}
//           <div className="hidden sm:flex items-center justify-between gap-3">
//             <div className="w-64">
//               <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-full" />
//             </div>

//             <div className="join">
//               <button className={`btn join-item ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`} onClick={() => setViewMode("cards")}><LayoutGrid className="w-5 h-5" /></button>
//               <button className={`btn join-item ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`} onClick={() => setViewMode("table")}><Table className="w-5 h-5" /></button>
//             </div>

//             <div className="join">
//               <button className={`btn join-item ${sortOrder === "newest" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSortOrder("newest")}>Newest</button>
//               <button className={`btn join-item ${sortOrder === "oldest" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSortOrder("oldest")}>Oldest</button>
//             </div>

//             <button className="btn btn-primary" onClick={() => { setSelectedCustomer({ name: "", phone: "", address: "" }); (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal(); }}>Add Customer</button>
//           </div>

//           {/* Mobile */}
//           <div className="flex flex-col sm:hidden gap-2">
//             <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered w-full" />

//             <div className="flex items-center gap-2">
//               <div className="join flex-1">
//                 <button className={`btn join-item ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`} onClick={() => setViewMode("cards")}><LayoutGrid className="w-5 h-5" /></button>
//                 <button className={`btn join-item ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`} onClick={() => setViewMode("table")}><Table className="w-5 h-5" /></button>
//               </div>

//               <div className="join flex-1">
//                 <button className={`btn join-item ${sortOrder === "newest" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSortOrder("newest")}>Newest</button>
//                 <button className={`btn join-item ${sortOrder === "oldest" ? "btn-primary" : "btn-ghost"}`} onClick={() => setSortOrder("oldest")}>Oldest</button>
//               </div>
//             </div>

//             <button className="btn btn-primary w-full" onClick={() => { setSelectedCustomer({ name: "", phone: "", address: "" }); (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal(); }}>Add Customer</button>
//           </div>
//         </div>
//       </div>

//       {/* Cards */}
//       {viewMode === "cards" && (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {sortedCustomers.map((customer) => (
//             <CustomerCard key={customer.id} customer={customer} onClick={() => { setSelectedCustomer(customer); (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal(); }} />
//           ))}
//           {loading && <p>Loading customers...</p>}
//         </div>
//       )}

//       {/* Table */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr><th>Name</th><th>Phone</th><th>Address</th><th>Date</th><th>Actions</th></tr>
//             </thead>
//             <tbody>
//               {sortedCustomers.map((customer) => (
//                 <tr key={customer.id}>
//                   <td>{customer.name}</td>
//                   <td>{customer.phone}</td>
//                   <td>{customer.address}</td>
//                   <td>{customer.date ?? "-"}</td>
//                   <td><button className="btn btn-sm btn-outline" onClick={() => { setSelectedCustomer(customer); (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal(); }}>View</button></td>
//                 </tr>
//               ))}
//               {loading && <tr><td colSpan={5} className="text-center">Loading customers...</td></tr>}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modals */}
//       <dialog id="customer_modal" className="modal">
//         <div className="modal-box max-w-2xl">
//           <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
//           {selectedCustomer && <CustomerForm initialData={selectedCustomer} onSave={handleSaveCustomer} isNew={true} />}
//           <div className="modal-action"><button className="btn" onClick={closeModals}>Close</button></div>
//         </div>
//       </dialog>

//       <dialog id="detail_modal" className="modal">
//         <div className="modal-box max-w-3xl">
//           <h3 className="font-bold text-lg mb-4">Customer Details</h3>
//           {selectedCustomer && <CustomerForm initialData={selectedCustomer} onSave={handleSaveCustomer} onDelete={handleDeleteCustomer} />}
//           <div className="modal-action"><button className="btn" onClick={closeModals}>Close</button></div>
//         </div>
//       </dialog>
//     </main>
//   );
// }

// export const dynamic = "force-static";

// // app/dashboard/page.tsx
// "use client";

// import { useCustomers } from "@/hooks/useCustomers";
// import CustomerForm from "@/components/CustomerForm";

// export default function DashboardPage() {
//   const { customers, addCustomer, updateCustomer, deleteCustomer } =
//     useCustomers();

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Customer Dashboard</h1>

//       <button
//         onClick={() =>
//           addCustomer({
//             id: crypto.randomUUID(),
//             date: new Date().toISOString(),
//             name: "New Customer",
//             phone: "",
//             address: "",
//             timestamp: Date.now(),
//             synced: false,
//             _deleted: false,
//           })
//         }
//         className="btn btn-primary"
//       >
//         + Add Customer
//       </button>

//       <div className="grid gap-4 md:grid-cols-2">
//         {customers.map((customer) => (
//           <CustomerForm
//             key={customer.id}
//             initialData={customer}
//             onSave={updateCustomer}
//             onDelete={deleteCustomer}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import CustomerForm from "@/components/CustomerForm";
// import { useCustomers } from "@/hooks/useCustomers";
// import { Customer } from "@/lib/db";

// export default function DashboardPage() {
//   const { customers, saveCustomer, deleteCustomer, loading } = useCustomers();

//   const handleSave = async (customer: Customer) => {
//     await saveCustomer(customer); // ✅ works for both add + update
//   };

//   const handleDelete = async (id: string) => {
//     await deleteCustomer(id);
//   };

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-3xl font-bold">Customers</h1>

//       {/* New Customer Form */}
//       <CustomerForm
//         initialData={{}}
//         onSave={handleSave}
//         isNew={true}
//       />

//       {/* Existing Customers */}
//       <div className="grid gap-6">
//         {customers.map((customer) => (
//           <CustomerForm
//             key={customer.id}
//             initialData={customer}
//             onSave={handleSave}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import CustomerCard from "@/components/CustomerCard";
// import { Customer } from "@/lib/db";
// import { useCustomers } from "@/hooks/useCustomers";
// import { LayoutGrid, Table } from "lucide-react";
// import { showToast } from "@/lib/toast";
// import { initOnlineSync } from "@/lib/sync";

// export default function DashboardPage() {
//   const { customers, loading, saveCustomer, deleteCustomer } = useCustomers();
//   const [search, setSearch] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

//   useEffect(() => {
//     const cleanup = initOnlineSync(30_000); // sync every 30s
//     return () => cleanup();
//   }, []);

//   const filtered = customers.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));
//   const sorted = [...filtered].sort((a, b) => sortOrder === "newest" ? (b.timestamp || 0) - (a.timestamp || 0) : (a.timestamp || 0) - (b.timestamp || 0));

//   const handleSave = async (data: Customer) => {
//     await saveCustomer(data);
//     showToast("Customer saved", "success");
//     setSelectedCustomer(null);
//   };

//   const handleDelete = async (id: string) => {
//     await deleteCustomer(id);
//     showToast("Customer deleted", "success");
//     setSelectedCustomer(null);
//   };

//   return (
//     <main className="min-h-screen p-6 bg-base-200">
//       {/* Header / Search */}
//       <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
//         <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input input-bordered" />
//         <button className="btn btn-primary" onClick={() => setSelectedCustomer({})}>Add Customer</button>
//       </div>

//       {/* Cards */}
//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {sorted.map((c) => (
//           <CustomerCard key={c.id} customer={c} onClick={() => setSelectedCustomer(c)} />
//         ))}
//         {loading && <p>Loading customers...</p>}
//       </div>

//       {/* Modal */}
//       {selectedCustomer && (
//         <dialog open className="modal">
//           <div className="modal-box">
//             <CustomerForm initialData={selectedCustomer} onSave={handleSave} onDelete={selectedCustomer.id ? handleDelete : undefined} isNew={!selectedCustomer.id} />
//             <div className="modal-action">
//               <button className="btn" onClick={() => setSelectedCustomer(null)}>Close</button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </main>
//   );
// }

// "use client";

// import { useState } from "react";
// import CustomerForm from "@/components/CustomerForm";
// import CustomerCard from "@/components/CustomerCard";
// import { Customer } from "@/lib/db";
// import { useCustomers } from "@/hooks/useCustomers";
// import { LayoutGrid, Table } from "lucide-react";
// import { showToast } from "@/lib/toast";

// export default function DashboardPage() {
//   const { customers, loading, saveCustomer, deleteCustomer } = useCustomers();
//   const [search, setSearch] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
//   const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
//   const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

//   const filtered = customers.filter((c) =>
//     c.name?.toLowerCase().includes(search.toLowerCase())
//   );

//   const sorted = [...filtered].sort((a, b) =>
//     sortOrder === "newest"
//       ? (b.timestamp || 0) - (a.timestamp || 0)
//       : (a.timestamp || 0) - (b.timestamp || 0)
//   );

//   const handleSave = async (data: Customer) => {
//     await saveCustomer(data);
//     showToast("Customer saved", "success");
//     setSelectedCustomer(null);
//   };

//   const handleDelete = async (id: string) => {
//     await deleteCustomer(id);
//     showToast("Customer deleted", "success");
//     setSelectedCustomer(null);
//   };

//   return (
//     <main className="min-h-screen p-6 bg-base-200">
//       {/* Header / Search */}
//       <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="input input-bordered"
//         />
//         <button className="btn btn-primary" onClick={() => setSelectedCustomer({})}>
//           Add Customer
//         </button>
//       </div>

//       {/* Cards */}
//       {viewMode === "cards" && (
//         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {sorted.map((c) => (
//             <CustomerCard key={c.id} customer={c} onClick={() => setSelectedCustomer(c)} />
//           ))}
//           {loading && <p>Loading customers...</p>}
//         </div>
//       )}

//       {/* Table view (optional if needed) */}
//       {viewMode === "table" && (
//         <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
//           <table className="table table-zebra w-full">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Address</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {sorted.map((c) => (
//                 <tr key={c.id}>
//                   <td>{c.name}</td>
//                   <td>{c.phone}</td>
//                   <td>{c.address}</td>
//                   <td>{c.date ?? "-"}</td>
//                   <td>
//                     <button
//                       className="btn btn-sm btn-outline"
//                       onClick={() => setSelectedCustomer(c)}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {loading && (
//                 <tr>
//                   <td colSpan={5} className="text-center">
//                     Loading customers...
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {selectedCustomer && (
//         <dialog open className="modal">
//           <div className="modal-box">
//             <CustomerForm
//               initialData={selectedCustomer}
//               onSave={handleSave}
//               onDelete={selectedCustomer.id ? handleDelete : undefined}
//               isNew={!selectedCustomer.id}
//             />
//             <div className="modal-action">
//               <button className="btn" onClick={() => setSelectedCustomer(null)}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </dialog>
//       )}
//     </main>
//   );
// }

"use client";

import dynamic from "next/dynamic";

// Client-only import to avoid SSR + IndexedDB issues
const DashboardPageImpl = dynamic(() => import("./DashboardPageImpl"), {
  ssr: false,
});

export default function DashboardPage() {
  return <DashboardPageImpl />;
}
