"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPartPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [condition, setCondition] = useState("NEW");
  const [description, setDescription] = useState("");
  const [compatibleCars, setCompatibleCars] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [image , setImage] = useState<FileList>()


  const handleAddCar = (car: string) => {
    if (!car) return;
    setCompatibleCars([...compatibleCars, car]);
    console.log(compatibleCars)
  };

 async function  uploadImage  (){
  const imagesUlr=[]
     try {
      if(image !== undefined){
        for (const file  of Array.from(image)) {
        const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "car_parts"); 
    formData.append("folder", "car_parts");

 const res = await fetch(
        "https://api.cloudinary.com/v1_1/dlxcorjvq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

   if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.error?.message || "Upload failed")}
          imagesUlr.push(data.secure_url)
     console.log(data.secure_url)   
}
return imagesUlr
}else{
  throw new Error('there are not image')
}
    
} catch (error) {
    console.log(error)
       alert("حدث خطأ أثناء رفع الصورة");
      throw new Error('upload field')
     
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

  const image = await uploadImage()
console.log(image)

    setLoading(false);
    const res = await fetch("/api/parts/new", {
      method: "POST",
      body: JSON.stringify({
        title,
        price,
        manufacturer,
        condition,
        description,
        compatibleCars,
        image,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/parts");
    } else {
      console.log(res)
      alert("حدث خطأ أثناء رفع القطعة");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">إضافة قطعة جديدة</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="اسم القطعة"
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="السعر"
          className="w-full border p-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          placeholder="الشركة المصنعة"
          className="w-full border p-2"
          value={manufacturer}
          onChange={(e) => setManufacturer(e.target.value)}
          required
        />

        <select
          className="w-full border p-2"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        >
          <option value="NEW">جديدة</option>
          <option value="USED">مستعملة</option>
          <option value="REFURBISHED">مجددة</option>
        </select>

        <textarea
          placeholder="الوصف"
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          placeholder="أضف سيارة متوافقة (مثال: Toyota Camry 2018)"
          className="w-full border p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCar((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />

        {/* <input
          placeholder="رابط صورة (S3 / Cloudinary)"
          className="w-full border p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setImages([...images, (e.target as HTMLInputElement).value]);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        /> */}

  <input
        type="file"
        accept="image/*"
        multiple
        required
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            // handleAddImage();
               setImage(e.target.files)
          }
        }}
      />

        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2"
        >
          {loading ? "جاري الرفع..." : "نشر القطعة"}
        </button>
      </form>
    </div>
  );
}