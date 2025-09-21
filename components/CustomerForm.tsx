"use client";

import { useState } from "react";
import { Customer } from "@/lib/db";
import { User, Edit, Trash } from "lucide-react";

interface CustomerFormProps {
  initialData: Partial<Customer>;
  onSave?: (data: Customer) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

const numberFields = [
  "shoulder",
  "sleeveLength",
  "topLength",
  "chest",
  "tommy",
  "neck",
  "cufflinks",
  "trouserLength",
  "waist",
  "lap",
  "ankleSize",
  "calf",
] as const;
type NumberField = typeof numberFields[number];

// Field display names mapping
const fieldDisplayNames: Record<string, string> = {
  shoulder: "Shoulder",
  sleeveLength: "Sleeve Length",
  topLength: "Top Length",
  chest: "Chest",
  tommy: "Tummy",
  neck: "Neck",
  cufflinks: "Cufflinks",
  trouserLength: "Trouser Length",
  waist: "Waist",
  lap: "Lap",
  ankleSize: "Ankle Size",
  calf: "Calf",
  embroidery: "Embroidery",
  lengthWidth: "Length & Width",
};

function isNumberField(name: string): name is NumberField {
  return (numberFields as readonly string[]).includes(name);
}

export default function CustomerForm({
  initialData,
  onSave,
  onDelete,
  isNew = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(initialData);
  const [editable, setEditable] = useState<boolean>(isNew);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    if (isNumberField(name)) {
      const parsed = value === "" ? undefined : Number(value);
      setFormData((prev) => ({ ...prev, [name]: parsed }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = () => {
    const full: Customer = {
      ...(formData as Customer),
      id:
        formData.id ??
        (typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
      timestamp: Date.now(),
      date: formData.date ?? new Date().toLocaleDateString(),
      synced: false,
      _deleted: false,
    };

    onSave?.(full);
    setEditable(false);
  };

  const handleDeleteClick = () => {
    if (!formData.id) return;
    onDelete?.(formData.id);
  };

  return (
    <div>
      {!editable ? (
        // READ-ONLY VIEW
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-primary-content" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-sm opacity-80">{formData.phone}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold opacity-70">Address</p>
            <p className="text-lg">{formData.address}</p>
          </div>

          <div>
            <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
                <div
                  key={String(field)}
                  className="p-3 bg-base-200 rounded-xl shadow-sm"
                >
                  <p className="text-xs font-semibold opacity-70">
                    {fieldDisplayNames[String(field)] || String(field)}
                  </p>
                  <p className="text-lg font-medium">
                    {String(formData[field as keyof Customer] ?? "-")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setEditable(true)}
              className="btn btn-secondary shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
              style={{ borderRadius: '0.5rem' }}
            >
              <span className="absolute inset-0 bg-secondary-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <Edit className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Edit</span>
            </button>
            {onDelete && formData.id && (
              <button
                onClick={handleDeleteClick}
                className="btn btn-error shadow-lg shadow-error/25 hover:shadow-error/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 relative overflow-hidden group"
                style={{ borderRadius: '0.5rem' }}
              >
                <span className="absolute inset-0 bg-error-focus opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Trash className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Delete</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        // EDIT FORM
        <div className="space-y-4 pt-6">
          {/* Name - Full width on mobile, stacked above phone */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Phone - Full width on mobile, below name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              name="phone"
              value={formData.phone ?? ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          {/* Address - Full width */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <textarea
              name="address"
              value={formData.address ?? ""}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Measurements Grid */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {numberFields.map((field) => (
                <div key={field} className="form-control">
                  <label className="label">
                    <span className="label-text">
                      {fieldDisplayNames[field] || field}
                    </span>
                  </label>
                  <input
                    type="number"
                    name={String(field)}
                    value={
                      formData[field as keyof Customer] != null
                        ? String(formData[field as keyof Customer])
                        : ""
                    }
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}

              {/* Extra fields */}
              <div className="form-control sm:col-span-2 md:col-span-3">
                <label className="label">
                  <span className="label-text">
                    {fieldDisplayNames.embroidery}
                  </span>
                </label>
                <input
                  name="embroidery"
                  value={formData.embroidery ?? ""}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control sm:col-span-2 md:col-span-3">
                <label className="label">
                  <span className="label-text">
                    {fieldDisplayNames.lengthWidth}
                  </span>
                </label>
                <input
                  name="lengthWidth"
                  value={formData.lengthWidth ?? ""}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={handleSaveClick} className="btn btn-primary">
              Save
            </button>
            <button onClick={() => setEditable(false)} className="btn btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}