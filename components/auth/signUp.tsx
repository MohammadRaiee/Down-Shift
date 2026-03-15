// export default function signup(){
//     return (<>
    
//     </>)
// }

"use client";

import { useState } from "react";

type Role = "client" | "seller";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
};

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "client",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {


const res=await fetch(`${window.location.origin}/api/auth/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});

      const data = await res.json();

      if (!res.ok) {
        console.log(res)
        throw new Error(data.error || "حدث خطأ أثناء التسجيل");
      }
console.log(formData)
      setMessage("✅ تم إنشاء الحساب بنجاح");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "client",
      });
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          إنشاء حساب جديد
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="الاسم الأول"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="اسم العائلة"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="client">Client</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "جاري التسجيل..." : "تسجيل"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}