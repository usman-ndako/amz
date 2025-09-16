// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import CustomerForm from "@/components/CustomerForm";
import CustomerCard from "@/components/CustomerCard";
import { Customer } from "@/lib/db";
import {
  subscribeToDexieChanges,
  listenAndSyncFromFirestore,
  saveCustomer,
  deleteCustomerSync,
  syncLocalToFirestore,
} from "@/lib/sync";
import { LayoutGrid, Table } from "lucide-react";
import { showToast } from "@/lib/toast";

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    const unsubscribeDexie = subscribeToDexieChanges(setCustomers);
    const unsubscribeFirestore = listenAndSyncFromFirestore();

    const interval = setInterval(() => {
      syncLocalToFirestore().catch(console.error);
    }, 5000);

    return () => {
      unsubscribeDexie();
      unsubscribeFirestore();
      clearInterval(interval);
    };
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );
  const sortedCustomers = [...filteredCustomers].sort((a, b) =>
    sortOrder === "newest"
      ? (b.timestamp || 0) - (a.timestamp || 0)
      : (a.timestamp || 0) - (b.timestamp || 0)
  );

  const handleSaveCustomer = async (data: Partial<Customer>) => {
    // Auto-fill date if new
    if (!data.date) {
      data.date = new Date().toLocaleDateString();
    }
    await saveCustomer(data);
    showToast("Customer saved", "success");
    closeModals();
  };

  const handleDeleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    await deleteCustomerSync(id);
    showToast("Customer deleted", "success");
    closeModals();
  };

  const closeModals = () => {
    (document.getElementById("customer_modal") as HTMLDialogElement)?.close();
    (document.getElementById("detail_modal") as HTMLDialogElement)?.close();
    setSelectedCustomer(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-6">
      <div id="app-toast" className="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-base-300/90 backdrop-blur-md shadow-md rounded-xl p-3 mb-6">
        <div className="flex flex-col gap-3">
          {/* Desktop */}
          <div className="hidden sm:flex items-center justify-between gap-3">
            <div className="w-64">
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div className="join">
              <button
                className={`btn join-item ${
                  viewMode === "cards" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                className={`btn join-item ${
                  viewMode === "table" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setViewMode("table")}
              >
                <Table className="w-5 h-5" />
              </button>
            </div>

            <div className="join">
              <button
                className={`btn join-item ${
                  sortOrder === "newest" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setSortOrder("newest")}
              >
                Newest
              </button>
              <button
                className={`btn join-item ${
                  sortOrder === "oldest" ? "btn-primary" : "btn-ghost"
                }`}
                onClick={() => setSortOrder("oldest")}
              >
                Oldest
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedCustomer({
                  name: "",
                  phone: "",
                  address: "",
                });
                (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
              }}
            >
              Add Customer
            </button>
          </div>

          {/* Mobile */}
          <div className="flex flex-col sm:hidden gap-2">
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />

            <div className="flex items-center gap-2">
              <div className="join flex-1">
                <button
                  className={`btn join-item ${
                    viewMode === "cards" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setViewMode("cards")}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  className={`btn join-item ${
                    viewMode === "table" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setViewMode("table")}
                >
                  <Table className="w-5 h-5" />
                </button>
              </div>

              <div className="join flex-1">
                <button
                  className={`btn join-item ${
                    sortOrder === "newest" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSortOrder("newest")}
                >
                  Newest
                </button>
                <button
                  className={`btn join-item ${
                    sortOrder === "oldest" ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setSortOrder("oldest")}
                >
                  Oldest
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              onClick={() => {
                setSelectedCustomer({
                  name: "",
                  phone: "",
                  address: "",
                });
                (document.getElementById("customer_modal") as HTMLDialogElement)?.showModal();
              }}
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      {viewMode === "cards" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={() => {
                setSelectedCustomer(customer);
                (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
              }}
            />
          ))}
        </div>
      )}

      {/* Table */}
      {viewMode === "table" && (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>{customer.date ?? "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        (document.getElementById("detail_modal") as HTMLDialogElement)?.showModal();
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <dialog id="customer_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Add New Customer</h3>
          {selectedCustomer && (
            <CustomerForm initialData={selectedCustomer} onSave={handleSaveCustomer} isNew={true} />
          )}
          <div className="modal-action">
            <button className="btn" onClick={closeModals}>
              Close
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="detail_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Customer Details</h3>
          {selectedCustomer && (
            <CustomerForm
              initialData={selectedCustomer}
              onSave={handleSaveCustomer}
              onDelete={handleDeleteCustomer}
            />
          )}
          <div className="modal-action">
            <button className="btn" onClick={closeModals}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}

export const dynamic = "force-static";