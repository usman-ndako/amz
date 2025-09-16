"use client";

import { useState } from "react";
import { Customer } from "@/lib/db";
import { User, Edit, Trash } from "lucide-react";

interface CustomerFormProps {
  initialData: Partial<Customer>;
  onSave: (data: Partial<Customer>) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

export default function CustomerForm({
  initialData,
  onSave,
  onDelete,
  isNew = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(initialData);
  const [editable, setEditable] = useState(isNew);

  // ✅ String fields
  const stringFields = ["name", "phone", "address", "embroidery", "lengthWidth"] as const;

  // ✅ Numeric measurement fields
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if ((numberFields as readonly string[]).includes(name)) {
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : parseInt(value, 10),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div>
      {!editable ? (
        // 📌 Read-only view
        <div className="space-y-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
              <User className="w-8 h-8 text-primary-content" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{formData.name}</h2>
              <p className="text-sm opacity-80">{formData.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-semibold opacity-70">Address</p>
            <p className="text-lg">{formData.address}</p>
          </div>

          {/* Measurements */}
          <div>
            <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
                <div
                  key={field}
                  className="p-3 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <p className="text-xs font-semibold opacity-70 capitalize">
                    {field}
                  </p>
                  <p className="text-lg font-medium">
                    {formData[field as keyof Customer] ?? "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={() => setEditable(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit
            </button>
            {onDelete && formData.id && (
              <button
                onClick={() => onDelete(formData.id!)}
                className="btn btn-error flex items-center gap-2"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        // 📌 Editable form
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* String inputs */}
          <input
            name="name"
            placeholder="Name"
            value={formData.name ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address ?? ""}
            onChange={handleChange}
            className="textarea textarea-bordered col-span-2"
          />

          {/* Numeric fields */}
          {numberFields.map((field) => (
            <input
              key={field}
              type="number"
              name={field}
              placeholder={field}
              value={
                formData[field as keyof Customer] != null
                  ? String(formData[field as keyof Customer])
                  : ""
              }
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ))}

          {/* String fields (extra ones) */}
          <input
            name="embroidery"
            placeholder="Embroidery"
            value={formData.embroidery ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full col-span-2"
          />

          <input
            name="lengthWidth"
            placeholder="Length & Width"
            value={formData.lengthWidth ?? ""}
            onChange={handleChange}
            className="input input-bordered w-full col-span-2"
          />

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                onSave(formData);
                setEditable(false);
              }}
              className="btn btn-primary"
            >
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
