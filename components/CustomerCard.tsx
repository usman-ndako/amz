// components/CustomerCard.tsx
"use client";

import { Customer } from "@/lib/db";

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <div
      className="card bg-base-200/70 backdrop-blur-md shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-base-300"
      onClick={onClick}
    >
      <div className="card-body">
        {/* Name + Phone */}
        <h2 className="card-title text-primary">{customer.name}</h2>
        <p className="text-sm opacity-80">📞 {customer.phone}</p>
        <p className="text-sm opacity-70">📍 {customer.address}</p>

        {/* Measurement Preview */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded bg-base-100/70 shadow-sm">
            <span className="font-bold">Shoulder:</span>{" "}
            {customer.shoulder ?? "-"}
          </div>
          <div className="p-2 rounded bg-base-100/70 shadow-sm">
            <span className="font-bold">Waist:</span> {customer.waist ?? "-"}
          </div>
          <div className="p-2 rounded bg-base-100/70 shadow-sm">
            <span className="font-bold">Chest:</span> {customer.chest ?? "-"}
          </div>
        </div>

        {/* Date + Timestamp */}
        {customer.date && (
          <p className="text-xs opacity-70 mt-2">📅 {customer.date}</p>
        )}
        {customer.timestamp && (
          <p className="text-xs opacity-60">
            Last updated:{" "}
            {new Date(customer.timestamp).toLocaleDateString()}
          </p>
        )}

        {/* Action Footer - Futuristic Button */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-primary !rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
            <span className="absolute inset-0 bg-primary-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}