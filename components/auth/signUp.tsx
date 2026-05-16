"use client";

import { useState } from "react";

type AccountType = "user" | "seller";

export default function RegisterForm() {
  const [type, setType] = useState<AccountType>("user");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",

    // seller fields
    phone: "",
    storeName: "",
    businessType: "",
    businessReg: "",
    GPSLocation: "",
    address: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ ...form, type }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    if(! res.ok){
      alert('fddddddddddd')
    }
      const data = await res.json();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">إنشاء حساب</h2>

        {/* اختيار النوع */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("user")}
            className={`w-full py-2 rounded-lg ${
              type === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            مستخدم
          </button>

          <button
            type="button"
            onClick={() => setType("seller")}
            className={`w-full py-2 rounded-lg ${
              type === "seller"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            بائع
          </button>
        </div>

        {/* حقول مشتركة */}
        <input
          name="email"
          placeholder="البريد الإلكتروني"
          onChange={handleChange}
          className="input"
        />

        <input
          name="password"
          type="password"
          placeholder="كلمة المرور"
          onChange={handleChange}
          className="input"
        />

        <input
          name="firstName"
          placeholder="الاسم الأول"
          onChange={handleChange}
          className="input"
        />

        <input
          name="lastName"
          placeholder="الاسم الأخير"
          onChange={handleChange}
          className="input"
        />

        {/* حقول البائع */}
        {type === "seller" && (
          <>
            <input
              name="phone"
              placeholder="رقم الهاتف"
              onChange={handleChange}
              className="input"
            />

            <input
              name="storeName"
              placeholder="اسم المتجر"
              onChange={handleChange}
              className="input"
            />

            <input
              name="businessType"
              placeholder="نوع النشاط"
              onChange={handleChange}
              className="input"
            />

            <input
              name="businessReg"
              placeholder="السجل التجاري"
              onChange={handleChange}
              className="input"
            />

            <input
              name="GPSLocation"
              placeholder="الموقع (GPS)"
              onChange={handleChange}
              className="input"
            />

            <input
              name="address"
              placeholder="العنوان"
              onChange={handleChange}
              className="input"
            />

            <input
              name="city"
              placeholder="المدينة"
              onChange={handleChange}
              className="input"
            />
          </>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "جاري الإنشاء..." : "تسجيل"}
        </button>
      </form>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { uploadImage } from "@/lib/cloudinary";
// type Role = "client" | "seller";

// type FormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   role: Role;

// };

// export default function SignupForm() {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     role: "client",

//   });
//   const [image , setImage] = useState<FileList>()
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
// const imageUrl=image?await uploadImage(image):undefined
// const res=await fetch(`${window.location.origin}/api/auth/signup`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({...formData,image:imageUrl?imageUrl[0]:imageUrl}),
// });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "حدث خطأ أثناء التسجيل");
//       }
//       setMessage("✅ تم إنشاء الحساب بنجاح");
//       setFormData({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         role: "client",
//       });
//     } catch (error: any) {
//       setMessage(`❌ ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           إنشاء حساب جديد
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="flex gap-4">
//             <input
//               type="text"
//               name="firstName"
//               placeholder="الاسم الأول"
//               value={formData.firstName}
//               onChange={handleChange}
//               required
//               className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//             <input
//               type="text"
//               name="lastName"
//               placeholder="اسم العائلة"
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//               className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           <input
//             type="email"
//             name="email"
//             placeholder="البريد الإلكتروني"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="كلمة المرور"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           />

//             <input
//         type="file"
//         accept="image/*"
        
//         required
//         onChange={(e) => {
//           if (e.target.files && e.target.files[0]) {
//             // handleAddImage();
//                setImage(e.target.files)
//           }
//         }}
//       />

//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           >
//             <option value="client">Client</option>
//             <option value="seller">Seller</option>
//           </select>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {loading ? "جاري التسجيل..." : "تسجيل"}
//           </button>
//         </form>

//         {message && (
//           <p className="mt-4 text-center text-sm font-medium">
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }