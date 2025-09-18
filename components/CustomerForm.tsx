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

//     if ((numberFields as readonly string[]).includes(name)) {
//       setFormData({
//         ...formData,
//         [name]: value === "" ? undefined : parseInt(value, 10),
//       });
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

// "use client";

// import { useState } from "react";
// import { Customer, db } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave?: (data: Partial<Customer>) => void;
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
//       setFormData({
//         ...formData,
//         [name]: value === "" ? undefined : parseInt(value, 10),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSave = async () => {
//     const updated: Customer = {
//       ...formData,
//       id: formData.id ?? crypto.randomUUID(),
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//     } as Customer;

//     await db.customers.put(updated);
//     onSave?.(updated);
//     setEditable(false);
//   };

//   const handleDelete = async () => {
//     if (!formData.id) return;

//     await db.customers.update(formData.id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });

//     onDelete?.(formData.id);
//   };

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
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div
//                   key={field}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm"
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

//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={handleDelete}
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

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={handleSave} className="btn btn-primary">
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
// import { Customer, db } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave?: (data: Partial<Customer>) => void;
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

//   // ✅ strongly typed number fields
//   const numberFields: (keyof Customer)[] = [
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
//   ];

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (numberFields.includes(name as keyof Customer)) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value === "" ? undefined : parseInt(value, 10),
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSave = async () => {
//     const updated: Customer = {
//       ...formData,
//       id: formData.id ?? crypto.randomUUID(),
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//     } as Customer;

//     await db.customers.put(updated);
//     onSave?.(updated);
//     setEditable(false);
//   };

//   const handleDelete = async () => {
//     if (!formData.id) return;

//     await db.customers.update(formData.id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });

//     onDelete?.(formData.id);
//   };

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
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div
//                   key={field}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm"
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

//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={handleDelete}
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

//           {numberFields.map((field) => (
//             <input
//               key={field}
//               type="number"
//               name={field}
//               placeholder={field}
//               value={
//                 formData[field] != null ? String(formData[field]) : ""
//               }
//               onChange={handleChange}
//               className="input input-bordered w-full"
//             />
//           ))}

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

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={handleSave} className="btn btn-primary">
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

// // components/CustomerForm.tsx
// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";
// import { saveCustomer, deleteCustomerSync } from "@/lib/sync";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave?: (data: Partial<Customer>) => void;
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

//   const numberFields: (keyof Customer)[] = [
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
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (numberFields.includes(name as keyof Customer)) {
//       setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : parseInt(value, 10) }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const onSaveClicked = async () => {
//     await saveCustomer(formData);
//     onSave?.(formData);
//     setEditable(false);
//   };

//   const onDeleteClicked = async () => {
//     if (!formData.id) return;
//     await deleteCustomerSync(formData.id);
//     onDelete?.(formData.id);
//   };

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
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div key={String(field)} className="p-3 bg-base-200 rounded-xl shadow-sm">
//                   <p className="text-xs font-semibold opacity-70 capitalize">{String(field)}</p>
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
//               <button onClick={onDeleteClicked} className="btn btn-error flex items-center gap-2">
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

//           {numberFields.map((field) => (
//             <input key={String(field)} type="number" name={String(field)} placeholder={String(field)} value={formData[field as keyof Customer] != null ? String(formData[field as keyof Customer]) : ""} onChange={handleChange} className="input input-bordered w-full" />
//           ))}

//           <input name="embroidery" placeholder="Embroidery" value={formData.embroidery ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />
//           <input name="lengthWidth" placeholder="Length & Width" value={formData.lengthWidth ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={onSaveClicked} className="btn btn-primary">Save</button>
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
// import { Customer, db } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave?: (data: Customer) => void;   // ✅ now expects full Customer
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

//     if (numberFields.includes(name as (typeof numberFields)[number])) {
//       setFormData({
//         ...formData,
//         [name]: value === "" ? undefined : parseInt(value, 10),
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSave = async () => {
//     const updated: Customer = {
//       ...formData,
//       id: formData.id ?? crypto.randomUUID(),
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//       date: formData.date ?? new Date().toISOString(),
//     } as Customer;

//     await db.customers.put(updated);
//     onSave?.(updated); // ✅ now matches type
//     setEditable(false);
//   };

//   const handleDelete = async () => {
//     if (!formData.id) return;

//     await db.customers.update(formData.id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });

//     onDelete?.(formData.id);
//   };

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
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div
//                   key={field}
//                   className="p-3 bg-base-200 rounded-xl shadow-sm"
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

//           <div className="flex justify-end gap-2 pt-4">
//             <button
//               onClick={() => setEditable(true)}
//               className="btn btn-secondary flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button
//                 onClick={handleDelete}
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

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={handleSave} className="btn btn-primary">
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

// // hooks/useCustomers.ts
// "use client";

// import { useEffect, useState } from "react";
// import { db, Customer } from "@/lib/db";
// import { liveQuery } from "dexie";
// import {
//   syncLocalToFirestore,
//   listenAndSyncFromFirestore,
// } from "@/lib/sync";

// /**
//  * Hook for managing customers from Dexie with offline support
//  */
// export function useCustomers() {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // ✅ Live Dexie subscription
//     const subscription = liveQuery(() => db.customers.toArray()).subscribe({
//       next: (rows) => {
//         setCustomers(rows.filter((c) => !c._deleted));
//         setLoading(false);
//       },
//       error: (err) => console.error("[Dexie liveQuery error]", err),
//     });

//     // ✅ Sync with Firestore
//     const unsubscribe = listenAndSyncFromFirestore();

//     const interval = setInterval(() => {
//       syncLocalToFirestore().catch(console.error);
//     }, 10_000);

//     return () => {
//       subscription.unsubscribe();
//       unsubscribe();
//       clearInterval(interval);
//     };
//   }, []);

//   /**
//    * Add or update a customer
//    */
//   const saveCustomer = async (customer: Partial<Customer>) => {
//     const updated: Customer = {
//       ...customer,
//       id: customer.id ?? crypto.randomUUID(),
//       timestamp: Date.now(),
//       synced: false,
//       _deleted: false,
//       date: customer.date ?? new Date().toLocaleDateString(),
//     } as Customer;

//     await db.customers.put(updated);
//     return updated;
//   };

//   /**
//    * Soft-delete a customer
//    */
//   const deleteCustomer = async (id: string) => {
//     await db.customers.update(id, {
//       _deleted: true,
//       synced: false,
//       timestamp: Date.now(),
//     });
//   };

//   return {
//     customers,
//     loading,
//     saveCustomer,   // returns a full Customer
//     deleteCustomer,
//   };
// }

// // components/CustomerForm.tsx
// "use client";

// import { useState } from "react";
// import { Customer } from "@/lib/db";
// import { User, Edit, Trash } from "lucide-react";

// interface CustomerFormProps {
//   initialData: Partial<Customer>;
//   onSave?: (data: Customer) => void; // expects full Customer
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

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if ((numberFields as readonly string[]).includes(name)) {
//       setFormData((prev) => ({ ...prev, [name]: value === "" ? undefined : parseInt(value, 10) }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSaveClick = () => {
//     const full: Customer = {
//       ...(formData as Customer),
//       id: formData.id ?? (typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2,9)}`),
//       timestamp: Date.now(),
//       date: formData.date ?? new Date().toLocaleDateString(),
//       synced: false,
//       _deleted: false,
//     };

//     onSave?.(full);
//     setEditable(false);
//   };

//   const handleDeleteClick = () => {
//     if (!formData.id) return;
//     onDelete?.(formData.id);
//   };

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
//               {[...numberFields, "embroidery", "lengthWidth"].map((field) => (
//                 <div key={String(field)} className="p-3 bg-base-200 rounded-xl shadow-sm">
//                   <p className="text-xs font-semibold opacity-70 capitalize">{String(field)}</p>
//                   <p className="text-lg font-medium">{(formData as any)[field] ?? "-"}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 pt-4">
//             <button onClick={() => setEditable(true)} className="btn btn-secondary flex items-center gap-2">
//               <Edit className="w-4 h-4" /> Edit
//             </button>
//             {onDelete && formData.id && (
//               <button onClick={handleDeleteClick} className="btn btn-error flex items-center gap-2">
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

//           {numberFields.map((field) => (
//             <input key={field} type="number" name={String(field)} placeholder={String(field)} value={formData[field as keyof Customer] != null ? String(formData[field as keyof Customer]) : ""} onChange={handleChange} className="input input-bordered w-full" />
//           ))}

//           <input name="embroidery" placeholder="Embroidery" value={formData.embroidery ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />
//           <input name="lengthWidth" placeholder="Length & Width" value={formData.lengthWidth ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />

//           <div className="col-span-2 flex justify-end gap-2 mt-4">
//             <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
//             <button onClick={() => setEditable(false)} className="btn btn-ghost">Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// components/CustomerForm.tsx
"use client";

import { useState } from "react";
import { Customer } from "@/lib/db";
import { User, Edit, Trash } from "lucide-react";

interface CustomerFormProps {
  initialData: Partial<Customer>;
  onSave?: (data: Customer) => void; // expects a full Customer
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
                <div key={String(field)} className="p-3 bg-base-200 rounded-xl shadow-sm">
                  <p className="text-xs font-semibold opacity-70 capitalize">{String(field)}</p>
                  <p className="text-lg font-medium">
                    {/* graceful display for number/string fields */}
                    {String(formData[field as keyof Customer] ?? "-")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button onClick={() => setEditable(true)} className="btn btn-secondary flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit
            </button>
            {onDelete && formData.id && (
              <button onClick={handleDeleteClick} className="btn btn-error flex items-center gap-2">
                <Trash className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={formData.name ?? ""} onChange={handleChange} className="input input-bordered w-full" />
          <input name="phone" placeholder="Phone" value={formData.phone ?? ""} onChange={handleChange} className="input input-bordered w-full" />
          <textarea name="address" placeholder="Address" value={formData.address ?? ""} onChange={handleChange} className="textarea textarea-bordered col-span-2" />

          {numberFields.map((field) => (
            <input
              key={field}
              type="number"
              name={String(field)}
              placeholder={String(field)}
              value={formData[field as keyof Customer] != null ? String(formData[field as keyof Customer]) : ""}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ))}

          <input name="embroidery" placeholder="Embroidery" value={formData.embroidery ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />
          <input name="lengthWidth" placeholder="Length & Width" value={formData.lengthWidth ?? ""} onChange={handleChange} className="input input-bordered w-full col-span-2" />

          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
            <button onClick={() => setEditable(false)} className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
