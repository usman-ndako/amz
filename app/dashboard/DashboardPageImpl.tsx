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
      <div className="mb-6">
        {/* Mobile: Search on top, controls below */}
        <div className="flex flex-col sm:hidden space-y-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-bordered w-full"
          />
          <div className="flex flex-col gap-3">
            {/* View mode buttons */}
            <div className="flex gap-2">
              <button
                className={`btn flex-1 !rounded-lg transition-all duration-300 ${
                  viewMode === "cards" 
                    ? "btn-primary shadow-lg shadow-primary/25" 
                    : "btn-outline hover:btn-primary hover:shadow-lg"
                }`}
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="ml-2">Cards</span>
              </button>
              <button
                className={`btn flex-1 !rounded-lg transition-all duration-300 ${
                  viewMode === "table" 
                    ? "btn-primary shadow-lg shadow-primary/25" 
                    : "btn-outline hover:btn-primary hover:shadow-lg"
                }`}
                onClick={() => setViewMode("table")}
              >
                <Table className="w-5 h-5" />
                <span className="ml-2">Table</span>
              </button>
            </div>
            {/* Sort and Add customer */}
            <div className="flex gap-2">
              <select
                className="select select-bordered !rounded-lg flex-1 bg-base-100 focus:border-primary focus:outline-primary/50 transition-all duration-300 shadow-lg"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <button
                className="btn flex-1 btn-secondary !rounded-lg shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                onClick={() => setSelectedCustomer({})}
              >
                <span className="absolute inset-0 bg-secondary-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Add Customer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Search left, controls right on same row */}
        <div className="hidden sm:flex items-center justify-between gap-6">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            {/* View mode buttons - No container, direct buttons */}
            <button
              className={`btn btn-sm !rounded-lg transition-all duration-300 h-8 min-h-8 ${
                viewMode === "cards" 
                  ? "btn-primary shadow-lg shadow-primary/25 scale-105" 
                  : "btn-ghost text-base-content/60 hover:text-base-content hover:bg-base-content/10"
              }`}
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline ml-1">Cards</span>
            </button>
            <button
              className={`btn btn-sm !rounded-lg transition-all duration-300 h-8 min-h-8 ${
                viewMode === "table" 
                  ? "btn-primary shadow-lg shadow-primary/25 scale-105" 
                  : "btn-ghost text-base-content/60 hover:text-base-content hover:bg-base-content/10"
              }`}
              onClick={() => setViewMode("table")}
            >
              <Table className="w-4 h-4" />
              <span className="hidden md:inline ml-1">Table</span>
            </button>

            <select
              className="select select-bordered select-sm !rounded-lg w-32 h-8 min-h-8 bg-base-100 border-base-content/20 focus:border-primary focus:outline-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              className="btn btn-sm btn-secondary !rounded-lg h-8 min-h-8 shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-105 transition-all duration-300 whitespace-nowrap relative overflow-hidden group"
              onClick={() => setSelectedCustomer({})}
            >
              <span className="absolute inset-0 bg-secondary-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Add Customer</span>
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
              <button 
                className="btn btn-ghost hover:bg-base-content/10 transition-all duration-300 rounded-lg" 
                onClick={() => setSelectedCustomer(null)}
                style={{ borderRadius: '0.5rem !important' }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}