"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/cloudinary";

type AccountType = "user" | "seller";

export default function RegisterForm() {
  const [type, setType] = useState<AccountType>("user");
  const [loading, setLoading] = useState(false);
  const [userImage, setUserImage] = useState<FileList | null>(null);
  const [storeLogo, setStoreLogo] = useState<FileList | null>(null);

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
    storeLogo: "",
    GPSLocation: "",
    address: "",
    city: "",
    shippingOptions: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUserImage = userImage ? await uploadImage(userImage) : [];
      const uploadedStoreLogo = storeLogo ? await uploadImage(storeLogo) : [];

      const payload = {
        ...form,
        type,
        image: type === "user" ? uploadedUserImage[0] ?? null : null,
        storeLogo: type === "seller" ? uploadedStoreLogo[0] ?? null : null,
        shippingOptions:
          type === "seller"
            ? form.shippingOptions
                .split(",")
                .map((option: string) => option.trim())
                .filter(Boolean)
            : [],
      };

      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        body: JSON.stringify(payload),
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
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[1.75rem] border border-zinc-800 bg-zinc-950/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-7"
        >
          <div className="mb-6 border-b border-zinc-800 pb-5 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-red-400">
              Create account
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Sign up
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Choose your account type and continue.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-zinc-800 bg-black/40 p-2">
            <button
              type="button"
              onClick={() => setType("user")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                type === "user"
                  ? "bg-red-600 text-white shadow-[0_0_22px_rgba(220,38,38,0.35)]"
                  : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setType("seller")}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                type === "seller"
                  ? "bg-red-600 text-white shadow-[0_0_22px_rgba(220,38,38,0.35)]"
                  : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Seller
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
              />
              <Input
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
              />
            </div>

            <Input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
            />

            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
            />

            {type === "user" && (
              <label className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-black/50 px-4 text-sm text-zinc-300 transition-colors hover:border-red-500 hover:text-white">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUserImage(e.target.files)}
                />
                Pick profile image
              </label>
            )}

            {type === "seller" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  name="phone"
                  placeholder="Phone number"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="storeName"
                  placeholder="Store name"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="businessType"
                  placeholder="Business type"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="businessReg"
                  placeholder="Business registration"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="GPSLocation"
                  placeholder="GPS location"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20"
                />

                <Input
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20 sm:col-span-2"
                />

                <Input
                  name="shippingOptions"
                  placeholder="Shipping options (comma separated)"
                  onChange={handleChange}
                  className="h-12 border-zinc-800 bg-black/50 text-white placeholder:text-zinc-500 focus-visible:border-red-500/70 focus-visible:ring-red-500/20 sm:col-span-2"
                />

                <label className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-black/50 px-4 text-sm text-zinc-300 transition-colors hover:border-red-500 hover:text-white sm:col-span-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setStoreLogo(e.target.files)}
                  />
                  Pick store logo
                </label>
              </div>
            )}

            <Button
              disabled={loading}
              className="h-12 w-full rounded-xl bg-red-600 text-white transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_24px_rgba(220,38,38,0.35)]"
            >
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </div>
        </form>
      </div>
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