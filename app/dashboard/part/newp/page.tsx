"use client";

import PartForm from "@/components/dashboard/PartForm";

export default function AddPartPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <PartForm mode="create" />
    </div>
  );
}
// 'use client'
// import { useState, ChangeEvent, FormEvent } from "react";
// import { uploadImage } from "@/lib/cloudinary";
// interface PartForm {
//   name: string;
//   price: string;
//   description: string;
//   partNumber: string;
//   brandName: string;
//   modelName: string;
//   years: number[];
// }

// export default function AddPartForm() {
//   const [form, setForm] = useState<PartForm>({
//     name: "",
//     price: "",
//     description: "",
//     partNumber: "",
//     brandName: "",
//     modelName: "",
//     years: []
//   });

//   const [images, setImages] = useState<FileList | null>(null);

//   const allYears = Array.from({ length: 30 }, (_, i) => 2025 - i);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const toggleYear = (year: number) => {
//     if (form.years.includes(year)) {
//       setForm({
//         ...form,
//         years: form.years.filter((y) => y !== year)
//       });
//     } else {
//       setForm({
//         ...form,
//         years: [...form.years, year]
//       });
//     }
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     let uploadedImages=undefined
// if (images) {
//   uploadedImages = await uploadImage(images);
// }

//     const data = {
//       ...form,
//       price: Number(form.price),
//       image: uploadedImages
//     };


//     const res = await fetch("/api/parts/newsructeur", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     });

//     alert("Part added successfully");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6"
//       >
//         <h2 className="text-2xl font-bold text-gray-800">
//           Add Car Part
//         </h2>

//         {/* Name */}
//         <input
//           name="name"
//           placeholder="Part Name"
//           value={form.name}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Price */}
//         <input
//           name="price"
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Part Number */}
//         <input
//           name="partNumber"
//           placeholder="Part Number"
//           value={form.partNumber}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Brand */}
//         <input
//           name="brandName"
//           placeholder="Car Brand (Toyota, BMW...)"
//           value={form.brandName}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Model */}
//         <input
//           name="modelName"
//           placeholder="Car Model"
//           value={form.modelName}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Years */}
//         <div>
//           <p className="font-semibold mb-2 text-gray-700">
//             Compatible Years
//           </p>
//           <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto border p-3 rounded-lg">
//             {allYears.map((year) => (
//               <button
//                 type="button"
//                 key={year}
//                 onClick={() => toggleYear(year)}
//                 className={`rounded-md px-3 py-1 text-sm border transition 
//                 ${form.years.includes(year)
//                     ? "bg-blue-600 text-white border-blue-600"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {year}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Description */}
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//         />

//         {/* Images */}
//         <div>
//           <label className="block mb-2 font-semibold text-gray-700">Upload Images</label>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
            
//             onChange={(e) => {
//               if (e.target.files && e.target.files.length > 0) {
//                 setImages(e.target.files);
//               }
//             }}
//             className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//         >
//           Add Part
//         </button>
//       </form>
//     </div>
//   );
// }