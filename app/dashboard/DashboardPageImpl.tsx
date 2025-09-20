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
    <main className="min-h-screen p-6 bg-base-200">
      {/* Header / Search + Controls */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered"
        />

        <div className="flex gap-2">
          {/* Toggle view mode */}
          <button
            className={`btn ${viewMode === "cards" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setViewMode("cards")}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            className={`btn ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setViewMode("table")}
          >
            <Table className="w-5 h-5" />
          </button>

          {/* Sort toggle */}
          <select
            className="select select-bordered"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* Add customer */}
          <button
            className="btn btn-primary"
            onClick={() => setSelectedCustomer({})}
          >
            Add Customer
          </button>
        </div>
      </div>

      {/* View: Cards or Table */}
      {viewMode === "cards" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((c) => (
            <CustomerCard
              key={c.id}
              customer={c}
              onClick={() => setSelectedCustomer(c)}
            />
          ))}
          {loading && <p>Loading customers...</p>}
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
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
                  <td>{c.address}</td>
                  <td>{c.date}</td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={4}>Loading customers...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedCustomer && (
        <dialog open className="modal">
          <div className="modal-box">
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
