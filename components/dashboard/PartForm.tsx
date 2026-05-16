"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { uploadImage } from "@/lib/cloudinary";

export type PartFormValues = {
  name: string;
  price: string;
  description: string;
  partNumber: string;
  countryOfOrigin: string;
  quality: string;
  years: number[];
  brandName: string;
  modelName: string;
  categoryId?: string | number | null;
  image?: string | null;
};

type PartFormProps = {
  mode: "create" | "edit";
  partId?: number;
  initialValues?: Partial<PartFormValues> | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const DEFAULT_FORM: PartFormValues = {
  name: "",
  price: "",
  description: "",
  partNumber: "",
  countryOfOrigin: "",
  quality: "Good",
  years: [],
  brandName: "",
  modelName: "",
};

export default function PartForm({ mode, partId, initialValues, onSuccess, onCancel }: PartFormProps) {
  const [form, setForm] = useState<PartFormValues>(DEFAULT_FORM);
  const [category, setCategory] = useState("");
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const allYears = Array.from({ length: 30 }, (_, i) => 2025 - i);

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setForm({
      ...DEFAULT_FORM,
      ...initialValues,
      price:
        initialValues.price !== undefined && initialValues.price !== null
          ? String(initialValues.price)
          : "",
      years: Array.isArray(initialValues.years) ? initialValues.years : [],
    });
    setCategory(initialValues.categoryId ? String(initialValues.categoryId) : "");
    setExistingImage(initialValues.image ?? null);
  }, [initialValues]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleYear = (year: number) => {
    if (form.years.includes(year)) {
      setForm({ ...form, years: form.years.filter((y) => y !== year) });
    } else {
      setForm({ ...form, years: [...form.years, year] });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImages: string[] | undefined = undefined;
    if (images) {
      uploadedImages = await uploadImage(images);
    }

    const payload = {
      ...form,
      price: Number(form.price),
      image:
        uploadedImages?.[0] ??
        existingImage ??
        "https://res.cloudinary.com/dlxcorjvq/image/upload/v1773879019/car_parts/ckbbsqcuo4m7nlo6xezh.jpg",
      categoryId: category ? Number(category) : null,
    };

    try {
      const endpoint = mode === "edit" ? `/api/parts/${partId}` : "/api/parts/newsructeur";
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(mode === "edit" ? "Failed to update part" : "Failed to add part");
      }

      alert(mode === "edit" ? "Part updated successfully" : "Part added successfully");

      if (mode === "edit") {
        onSuccess?.();
      } else {
        setForm(DEFAULT_FORM);
        setCategory("");
        setImages(null);
        setExistingImage(null);
      }
    } catch (err) {
      console.error(err);
      alert(mode === "edit" ? "Error updating part" : "Error adding part");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {mode === "edit" ? "Edit Car Part" : "Add Car Part"}
      </h2>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">اختر التصنيف</option>
        <option value="1">Engine & Drivetrain</option>
        <option value="2">Brakes</option>
        <option value="3">Suspension & Steering</option>
        <option value="4">Electrical & Lighting</option>
        <option value="5">Cooling, Heating & AC</option>
        <option value="6">Wheels & Tires</option>
        <option value="7">Body & Exterior</option>
        <option value="8">Interior</option>
        <option value="9">Oils, Fluids & Maintenance</option>
        <option value="10">Tools & Garage</option>
        <option value="11">Accessories & Electronics</option>
        <option value="12">Performance Parts</option>
      </select>

      <input
        name="name"
        placeholder="Part Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="partNumber"
        placeholder="Part Number"
        value={form.partNumber}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="brandName"
        placeholder="Car Brand (Toyota, BMW...)"
        value={form.brandName}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="modelName"
        placeholder="Car Model"
        value={form.modelName}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="countryOfOrigin"
        placeholder="Country of Origin"
        value={form.countryOfOrigin}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="quality"
        value={form.quality}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      >
        <option value="Good">Good</option>
        <option value="Average">Average</option>
        <option value="Poor">Poor</option>
      </select>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
      />

      <div>
        <p className="font-semibold mb-2 text-gray-700">Compatible Years</p>
        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto border p-3 rounded-lg">
          {allYears.map((year) => (
            <button
              type="button"
              key={year}
              onClick={() => toggleYear(year)}
              className={`rounded-md px-3 py-1 text-sm border transition 
                ${form.years.includes(year)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImages(e.target.files);
            }
          }}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading
            ? mode === "edit"
              ? "Updating..."
              : "Adding..."
            : mode === "edit"
              ? "Update Part"
              : "Add Part"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            إلغاء
          </button>
        )}
      </div>
    </form>
  );
}
