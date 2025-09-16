// // components/CustomerForm.tsx
// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave: (data: Partial<Customer>) => void;
//   onDelete?: (id: string) => void;
//   isNew?: boolean;
// }

// export default function CustomerForm({
//   initialData,
//   onSave,
//   onDelete,
//   isNew = false,
// }: CustomerFormProps) {
//   const [formData, setFormData] = useState<Partial<Customer>>(initialData);
//   const [editable, setEditable] = useState(isNew);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const measurementFields = [
//     "top","shoulder","hand","burst","neck",
//     "trouser","length","waist","bmb","links",
//   ];

//   return (
//     <div>
//       {!editable ? (
//         <div className="space-y-6">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
//               <User className="w-8 h-8 text-primary-content" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{formData.name}</h2>
//               <p className="text-sm opacity-80">{formData.phone}</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm font-semibold opacity-70">Address</p>
//             <p className="text-lg">{formData.address}</p>
//           </div>

//           <div>
//             <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {measurementFields.map((field) => (
//                 <div key={field} className="p-3 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition">
//                   <p className="text-xs font-semibold opacity-70 capitalize">{field}</p>
//                   <p className="text-lg font-medium">{formData[field as keyof Customer] ?? "-"}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <button onClick={() => setEditable(true)} className="btn btn-secondary flex items-center gap-2">
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button onClick={() => onDelete(formData.id!)} className="btn btn-error flex items-center gap-2">
//                 <Trash className="w-4 h-4" /> Delete
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input name="name" placeholder="Name" value={formData.name ?? ""} onChange={handleChange} className="input input-bordered w-full" />
//           <input name="phone" placeholder="Phone" value={formData.phone ?? ""} onChange={handleChange} className="input input-bordered w-full" />
//           <textarea name="address" placeholder="Address" value={formData.address ?? ""} onChange={handleChange} className="textarea textarea-bordered col-span-2" />

//           {measurementFields.map((field) => (
//             <input key={field} name={field} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
//               value={formData[field as keyof Customer] != null ? String(formData[field as keyof Customer]) : ""}
//               onChange={handleChange} className="input input-bordered w-full" />
//           ))}

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={() => { onSave(formData); setEditable(false); }} className="btn btn-primary">Save</button>
//             <button onClick={() => setEditable(false)} className="btn btn-ghost">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // components/CustomerForm.tsx
// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave: (data: Partial<Customer>) => void;
//   onDelete?: (id: string) => void;
//   isNew?: boolean;
// }

// export default function CustomerForm({
//   initialData,
//   onSave,
//   onDelete,
//   isNew = false,
// }: CustomerFormProps) {
//   const [formData, setFormData] = useState<Partial<Customer>>(initialData);
//   const [editable, setEditable] = useState(isNew);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "number" ? (value === "" ? undefined : parseFloat(value)) : value,
//     });
//   };

//   const measurementFields: { name: keyof Customer; label: string }[] = [
//     { name: "shoulder", label: "Shoulder" },
//     { name: "sleeveLength", label: "Sleeve Length" },
//     { name: "topLength", label: "Top Length" },
//     { name: "chest", label: "Chest" },
//     { name: "tommy", label: "Tommy" },
//     { name: "neck", label: "Neck" },
//     { name: "cufflinks", label: "Cufflinks" },
//     { name: "trouserLength", label: "Trouser Length" },
//     { name: "waist", label: "Waist" },
//     { name: "lap", label: "Lap" },
//     { name: "ankleSize", label: "Ankle Size" },
//     { name: "calf", label: "Calf" },
//     { name: "embroidery", label: "Embroidery" },
//     { name: "lengthWidth", label: "Length & Width" },
//   ];

//   return (
//     <div>
//       {!editable ? (
//         <div className="space-y-6">
//           {/* Avatar + Name */}
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
//               <User className="w-8 h-8 text-primary-content" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{formData.name}</h2>
//               <p className="text-sm opacity-80">{formData.phone}</p>
//               <p className="text-xs opacity-60">
//                 {formData.date ?? new Date().toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <p className="text-sm font-semibold opacity-70">Address</p>
//             <p className="text-lg">{formData.address}</p>
//           </div>

//           {/* Measurements */}
//           <div>
//             <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {measurementFields.map((field) => (
//                 <div
//                   key={field.name}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition"
//                 >
//                   <p className="text-xs font-semibold opacity-70">{field.label}</p>
//                   <p className="text-lg font-medium">
//                     {formData[field.name] ?? "-"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={() => onDelete(formData.id!)}
//                 className="btn btn-error flex items-center gap-2"
//               >
//                 <Trash className="w-4 h-4" /> Delete
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             name="name"
//             placeholder="Name"
//             value={formData.name ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <input
//             name="phone"
//             placeholder="Phone"
//             value={formData.phone ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <textarea
//             name="address"
//             placeholder="Address"
//             value={formData.address ?? ""}
//             onChange={handleChange}
//             className="textarea textarea-bordered col-span-2"
//           />

//           {measurementFields.map((field) => (
//             <input
//               key={field.name}
//               name={field.name}
//               type="number"
//               placeholder={field.label}
//               value={formData[field.name] !== undefined ? String(formData[field.name]) : ""}
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           ))}

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => {
//                 onSave(formData);
//                 setEditable(false);
//               }}
//               className="btn btn-primary"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditable(false)}
//               className="btn btn-ghost"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave: (data: Partial<Customer>) => void;
//   onDelete?: (id: string) => void;
//   isNew?: boolean;
// }

// export default function CustomerForm({
//   initialData,
//   onSave,
//   onDelete,
//   isNew = false,
// }: CustomerFormProps) {
//   const [formData, setFormData] = useState<Partial<Customer>>(initialData);
//   const [editable, setEditable] = useState(isNew);

//   // ✅ String fields
//   const stringFields = ["name", "phone", "address", "embroidery"] as const;

//   // ✅ Numeric measurement fields
//   const numberFields = [
//     "shoulder",
//     "sleeveLength",
//     "topLength",
//     "chest",
//     "tommy",
//     "neck",
//     "cufflinks",
//     "trouserLength",
//     "waist",
//     "lap",
//     "ankleSize",
//     "calf",
//     "lengthWidth",
//   ] as const;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (numberFields.includes(name as any)) {
//       setFormData({ ...formData, [name]: value === "" ? undefined : parseInt(value, 10) });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   return (
//     <div>
//       {!editable ? (
//         // 📌 Read-only view
//         <div className="space-y-6">
//           {/* Avatar + Name */}
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
//               <User className="w-8 h-8 text-primary-content" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{formData.name}</h2>
//               <p className="text-sm opacity-80">{formData.phone}</p>
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <p className="text-sm font-semibold opacity-70">Address</p>
//             <p className="text-lg">{formData.address}</p>
//           </div>

//           {/* Measurements */}
//           <div>
//             <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {[...numberFields, "embroidery"].map((field) => (
//                 <div
//                   key={field}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition"
//                 >
//                   <p className="text-xs font-semibold opacity-70 capitalize">
//                     {field}
//                   </p>
//                   <p className="text-lg font-medium">
//                     {formData[field as keyof Customer] ?? "-"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={() => onDelete(formData.id!)}
//                 className="btn btn-error flex items-center gap-2"
//               >
//                 <Trash className="w-4 h-4" /> Delete
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         // 📌 Editable form
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* String inputs */}
//           <input
//             name="name"
//             placeholder="Name"
//             value={formData.name ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <input
//             name="phone"
//             placeholder="Phone"
//             value={formData.phone ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <textarea
//             name="address"
//             placeholder="Address"
//             value={formData.address ?? ""}
//             onChange={handleChange}
//             className="textarea textarea-bordered col-span-2"
//           />

//           {/* Measurements */}
//           {numberFields.map((field) => (
//             <input
//               key={field}
//               type="number"
//               name={field}
//               placeholder={field}
//               value={
//                 formData[field as keyof Customer] != null
//                   ? String(formData[field as keyof Customer])
//                   : ""
//               }
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           ))}

//           {/* Embroidery (string) */}
//           <input
//             name="embroidery"
//             placeholder="Embroidery"
//             value={formData.embroidery ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full col-span-2"
//           />

//           {/* Buttons */}
//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => {
//                 onSave(formData);
//                 setEditable(false);
//               }}
//               className="btn btn-primary"
//             >
//               Save
//             </button>
//             <button onClick={() => setEditable(false)} className="btn btn-ghost">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave: (data: Partial<Customer>) => void;
//   onDelete?: (id: string) => void;
//   isNew?: boolean;
// }

// export default function CustomerForm({
//   initialData,
//   onSave,
//   onDelete,
//   isNew = false,
// }: CustomerFormProps) {
//   const [formData, setFormData] = useState<Partial<Customer>>(initialData);
//   const [editable, setEditable] = useState(isNew);

//   // ✅ String fields
//   const stringFields = ["name", "phone", "address", "embroidery", "lengthWidth"] as const;

//   // ✅ Numeric measurement fields
//   const numberFields = [
//     "shoulder",
//     "sleeveLength",
//     "topLength",
//     "chest",
//     "tommy",
//     "neck",
//     "cufflinks",
//     "trouserLength",
//     "waist",
//     "lap",
//     "ankleSize",
//     "calf",
//   ] as const;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (numberFields.includes(name as any)) {
//       setFormData({ ...formData, [name]: value === "" ? undefined : parseInt(value, 10) });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   return (
//     <div>
//       {!editable ? (
//         // 📌 Read-only view
//         <div className="space-y-6">
//           {/* Avatar + Name */}
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
//               <User className="w-8 h-8 text-primary-content" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{formData.name}</h2>
//               <p className="text-sm opacity-80">{formData.phone}</p>
//             </div>
//           </div>

//           {/* Address */}
//           <div>
//             <p className="text-sm font-semibold opacity-70">Address</p>
//             <p className="text-lg">{formData.address}</p>
//           </div>

//           {/* Measurements */}
//           <div>
//             <p className="text-sm font-semibold opacity-70 mb-2">Measurements</p>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div
//                   key={field}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm hover:shadow-md transition"
//                 >
//                   <p className="text-xs font-semibold opacity-70 capitalize">
//                     {field}
//                   </p>
//                   <p className="text-lg font-medium">
//                     {formData[field as keyof Customer] ?? "-"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={() => onDelete(formData.id!)}
//                 className="btn btn-error flex items-center gap-2"
//               >
//                 <Trash className="w-4 h-4" /> Delete
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         // 📌 Editable form
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* String inputs */}
//           <input
//             name="name"
//             placeholder="Name"
//             value={formData.name ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <input
//             name="phone"
//             placeholder="Phone"
//             value={formData.phone ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full"
//           />
//           <textarea
//             name="address"
//             placeholder="Address"
//             value={formData.address ?? ""}
//             onChange={handleChange}
//             className="textarea textarea-bordered col-span-2"
//           />

//           {/* Numeric fields */}
//           {numberFields.map((field) => (
//             <input
//               key={field}
//               type="number"
//               name={field}
//               placeholder={field}
//               value={
//                 formData[field as keyof Customer] != null
//                   ? String(formData[field as keyof Customer])
//                   : ""
//               }
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           ))}

//           {/* String fields (extra ones) */}
//           <input
//             name="embroidery"
//             placeholder="Embroidery"
//             value={formData.embroidery ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full col-span-2"
//           />

//           <input
//             name="lengthWidth"
//             placeholder="Length & Width"
//             value={formData.lengthWidth ?? ""}
//             onChange={handleChange}
//             className="input input-bordered w-full col-span-2"
//           />

//           {/* Buttons */}
//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button
//               onClick={() => {
//                 onSave(formData);
//                 setEditable(false);
//               }}
//               className="btn btn-primary"
//             >
//               Save
//             </button>
//             <button onClick={() => setEditable(false)} className="btn btn-ghost">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
