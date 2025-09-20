"use client";

import { useState } from "react";
import CustomerForm from "@/components/CustomerForm";
import CustomerCard from "@/components/CustomerCard";
import { Customer } from "@/lib/db";
import { useCustomers } from "@/hooks/useCustomers";
import { showToast } from "@/lib/toast";
import { LayoutGrid, Table } from "lucide-react";

export default function DashboardPageImpl() {
  const { customers, loading, saveCustomer, deleteCustomer } = useCustomers();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Partial<Customer> | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Search + sort
  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "newest"
      ? (b.timestamp || 0) - (a.timestamp || 0)
      : (a.timestamp || 0) - (b.timestamp || 0)
  );

  const handleSave = async (data: Customer) => {
    await saveCustomer(data);
    showToast("Customer saved", "success");
    setSelectedCustomer(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    showToast("Customer deleted", "success");
    setSelectedCustomer(null);
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-base-200">
      {/* Header / Search + Controls */}
      <div className="mb-6 space-y-4">
        {/* Search bar - full width on mobile */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          {/* View mode buttons */}
          <div className="flex gap-2">
            <button
              className={`btn flex-1 sm:flex-none ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Cards</span>
            </button>
            <button
              className={`btn flex-1 sm:flex-none ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setViewMode("table")}
            >
              <Table className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">Table</span>
            </button>
          </div>

          {/* Sort and Add customer row */}
          <div className="flex gap-2">
            <select
              className="select select-bordered flex-1 sm:flex-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>

            <button
              className="btn btn-primary flex-1 sm:flex-none"
              onClick={() => setSelectedCustomer({})}
            >
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* View: Cards or Table */}
      {viewMode === "cards" ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c) => (
            <CustomerCard
              key={c.id}
              customer={c}
              onClick={() => setSelectedCustomer(c)}
            />
          ))}
          {loading && (
            <div className="col-span-full text-center py-8">
              <p>Loading customers...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th className="hidden sm:table-cell">Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr
                  key={c.id}
                  className="hover cursor-pointer"
                  onClick={() => setSelectedCustomer(c)}
                >
                  <td>{c.name}</td>
                  <td>{c.phone}</td>
                  <td className="hidden sm:table-cell">{c.address}</td>
                  <td>{c.date}</td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading customers...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedCustomer && (
        <dialog open className="modal">
          <div className="modal-box max-w-4xl">
            <CustomerForm
              initialData={selectedCustomer}
              onSave={handleSave}
              onDelete={selectedCustomer.id ? handleDelete : undefined}
              isNew={!selectedCustomer.id}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedCustomer(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}