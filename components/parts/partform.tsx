"use client";

import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { X, Undo2 } from "lucide-react"
import { uploadImage ,addOrphanedAsset } from "@/lib/cloudinary";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {deletePartImages} from "@/components/actions/deletePartImage";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type PartFormValues = {
  name: string;
  price: string;
  description: string;
  partBrand: string;
  partNumber: string;
  countryOfOrigin: string;
  quality: string;
  years: number[];
  brandName: string;
  modelName: string;
  categoryId?: string | number | null;
  image?: {imageURL: string, public_id: string}[] |  null;
};

type PartFormProps = {
  mode: "create" | "edit";
  partId?: number;
  initialValues?: Partial<PartFormValues> | null;
  publicherId?:number
  onSuccess?: () => void;
  onCancel?: () => void;
};

const DEFAULT_FORM: PartFormValues = {
  name: "",
  price: "",
  partBrand:"",
  description: "",
  categoryId:"",
  partNumber: "",
  countryOfOrigin: "",
  quality: "",
  years: [],
  brandName: "",
  modelName: "",
};

export default function PartFormStyled({
  mode,
  partId,
  initialValues,
  publicherId,
  onSuccess,
  onCancel,
}: PartFormProps) {
  const [form, setForm] = useState<PartFormValues>(DEFAULT_FORM);
  const [existingImage, setExistingImage] = useState<{imageURL: string, public_id: string}[] | [] >([]  );
  const [existingImageToDelete, setExistingImageToDelete] = useState<{public_id: string}[]>([]);
  const [images, setImages] = useState<File[] | []>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({mainText:'', text1:'', text2:''});
  const dialogCallback1 = useRef<() => void>(() => setDialogOpen(false));
  const dialogCallback2 = useRef<() => void>(() => setDialogOpen(false));

// set initial values for the form 
  const allYears = Array.from({ length: 60 }, (_, i) => 2026 - i);
  useEffect(() => {
    if (!initialValues) return;

    setForm({
      ...DEFAULT_FORM,
      ...initialValues,
      price:
        initialValues.price !== undefined && initialValues.price !== null
          ? String(initialValues.price as any)
          : "",
      years: Array.isArray(initialValues.years) ? initialValues.years : [],
    });

    if (initialValues.image) {
      if (Array.isArray(initialValues.image)) setExistingImage(initialValues.image);
      else setExistingImage(initialValues.image);
    } else {
      setExistingImage([]);
    }
  }, [initialValues]);

// Create temporary URLs for the added images
  useEffect(() => {
    if (!images) return;
    const urls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      urls.push(URL.createObjectURL(images[i]));
    }
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

// Function to show the dialog
  const showDialog = ({mainText, text1="close", text2, callback1, callback2}: {mainText: string, text1?: string, text2?: string, callback1?: () => void, callback2?: () => void}) => {
   console.log(mainText, text1, text2, callback1, callback2)
    setDialogData(pre=>({...pre , mainText, text1: text1 || '', text2: text2 || ''}));
    dialogCallback1.current = () => {
      setDialogOpen(false);
      callback1?.();
    };
    dialogCallback2.current = () => {
      setDialogOpen(false);
      callback2?.();
    };
    setDialogOpen(true);
  };

// Handle any changes to the form state
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const toggleYear = (year: number) => {
    if (form.years.includes(year)) {
      setForm({ ...form, years: form.years.filter((y) => y !== year) });
    } else {
      setForm({ ...form, years: [...form.years, year] });
    }
  };

// Remove existing images  
const removeExistingImage = (public_id: string) => {
setExistingImageToDelete((prev) => [...prev, { public_id }]);
  }

// Remove newly added images  
const removePreview = (index: number) => {
    setPreviews((p) => p.filter((_, i) => i !== index));
    setImages((p) => p ? p.filter((_, i) => i !== index) : []);
  };
// submit function to handle the form submission, including image upload and deletion
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
 e.preventDefault();
 setLoading(true);

   let uploadedImages: any[] = [];
   let deletedImages: { success: boolean; message: string; } | null = null;

try {

  try{
// upload new images   
     uploadedImages = images.length > 0 ? await uploadImage(images) : []  ;
     uploadedImages = uploadedImages.length > 0 ? uploadedImages.map((img: any) => ({ imageURL: img.secure_url, public_id: img.public_id })) : [] ;
    }catch(err){
       uploadedImages=[]
       await new Promise((resolve,reject)=>{showDialog({ mainText: "Error uploading images. Would you like to proceed without images?"
      ,text1: "Yes", text2: "No", callback1: () => {return resolve(true)}, callback2: () => {return reject(new Error("resolved"))}})})
}

 const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
 const endpoint = mode === "edit" ? `${baseUrl}/api/parts/${partId}` : "/api/parts/new";
 const method = mode === "edit" ? "PATCH" : "POST";

 const Payload = {
      ...form,
      price: Number(form.price),
      image: [...existingImage,...uploadedImages],
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };
// upload the form data to the server
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Payload),
      });

// If data upload fails, add the new image URLs to orphaned data      
      if (!res.ok) {
         uploadedImages.length >0 ? await addOrphanedAsset(uploadedImages) :null;
         const data = await res.json();
         console.log(data)
        throw new Error(data?.message || (mode === "edit" ? "Failed to update part" : "Failed to add part"));};

        const data = await res.json();

       if(mode==="create") return showDialog({mainText: "Part added successfully", text1: "OK", callback1: () => {setForm(DEFAULT_FORM); setImages([]); setPreviews([]); setExistingImage([]); onSuccess?.();}})
try{
// If data upload fails, add the new image URLs to orphaned data
   deletedImages = existingImageToDelete.length > 0 && publicherId ? await deletePartImages(partId,existingImageToDelete,publicherId) : null; 
  }catch(err){
await new Promise((resolve,reject)=>{showDialog({ mainText: "Error deleting old images. Do you want to proceed without deleting them?"
, text1: "Yes", text2: "No", callback1: () => {return resolve(true)}, callback2: () => {return reject(new Error("resolved"))}})})
}
window.location.reload();

} catch (err: any) {
      console.log( err.message);

      err.message === "resolved" ? null : showDialog({mainText:(err.message || "Server error")})
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl sm:max-w-2xl rounded-[1.25rem] border border-zinc-800 bg-zinc-950/95 p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.7)] text-white space-y-6"
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-red-400">Parts</p>
        <h2 className="mt-2 text-2xl font-bold">{mode === "edit" ? "Edit Part" : "Add Part"}</h2>
      </div>
  <Select value={String(form.categoryId )|| undefined} 
  onValueChange={(e) =>  e?handleChange({ target: { name: "categoryId", value: e } } as any): undefined}
  required>
  <SelectTrigger  className="w-full text-[17px] py-6 px-4 sm:h-12 border-zinc-800 bg-black/50 ">
    <SelectValue  className="text-white data-placeholder:text-gray-500"  placeholder="Select category" />
  </SelectTrigger>

  <SelectContent   position="popper"
  side="bottom"
  align="center"
  sideOffset={8}
   className="
    rounded-xl
    border border-zinc-700
    bg-zinc-900
    text-white
    shadow-2xl
    p-2
  ">
    <SelectGroup>
        <SelectItem value="1">Engine & Drivetrain</SelectItem>
        <SelectItem value="2">Brakes</SelectItem>
        <SelectItem value="3">Suspension & Steering</SelectItem>
        <SelectItem value="4">Electrical & Lighting</SelectItem>
        <SelectItem value="5">Cooling, Heating & AC</SelectItem>
        <SelectItem value="6">Wheels & Tires</SelectItem>
        <SelectItem value="7">Body & Exterior</SelectItem>
        <SelectItem value="8">Interior</SelectItem>
        <SelectItem value="9">Oils, Fluids & Maintenance</SelectItem>
        <SelectItem value="10">Tools & Garage</SelectItem>
        <SelectItem value="11">Accessories & Electronics</SelectItem>
        <SelectItem value="12">Performance Parts</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
      <Input
        name="partBrand"
        placeholder="Part Brand"
        value={form.partBrand}
        onChange={handleChange}
        className=" text-lg w-full h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="name"
          placeholder="Part Name"
          value={form.name}
          onChange={handleChange}
          className=" text-lg h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
        />
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className=" text-lg h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
        />
      </div>

      <Input
        name="partNumber"
        placeholder="Part Number"
        value={form.partNumber}
        onChange={handleChange}
        className=" text-lg w-full h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
      />

      <div className=" text-lg grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="brandName"
          placeholder="Car Brand (Toyota, BMW...)"
          value={form.brandName}
          onChange={handleChange}
          className=" text-lg h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
        />
        <Input
          name="modelName"
          placeholder="Car Model"
          value={form.modelName}
          onChange={handleChange}
          className=" text-lg h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
        />
      </div>

      <Input
        name="countryOfOrigin"
        placeholder="Country of Origin"
        value={form.countryOfOrigin}
        onChange={handleChange}
        className=" text-lg w-full h-10 sm:h-12 border-zinc-800 placeholder:text-zinc-500"
      />

     
     <Select value={form.quality} name="quality" onValueChange={(e) => e? handleChange({ target: { name: "quality", value: e } } as any): undefined}
        required>
  <SelectTrigger className="w-full text-[17px] py-6 px-4 sm:h-12 border-zinc-800 bg-black/50 ">
    <SelectValue className="text-white data-placeholder:text-gray-500"  placeholder="Part quality" />
  </SelectTrigger>

  <SelectContent   position="popper"
  side="bottom"
  align="center"
  sideOffset={8}
   className="
    rounded-xl
    border border-zinc-700
    bg-zinc-900
    text-white
    shadow-2xl
    p-2
  ">
    <SelectGroup>

       <SelectItem value="Good">Good</SelectItem>
        <SelectItem value="Average">Average</SelectItem>
        <SelectItem value="Poor">Poor</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="w-full rounded-lg border border-zinc-800 bg-black/50 p-3 text-white"
      />

      <div>
        <p className=" text-zinc-500 font-semibold mb-2 ">Compatible Years</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-40 hide-scrollbar overflow-y-auto border border-zinc-800 p-3 rounded-lg bg-black/40">
          {allYears.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => toggleYear(year)}
              className={`rounded-md px-3 py-1 text-sm border transition ${
                form.years.includes(year)
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-zinc-300">Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
           if (e.target.files && e.target.files.length > 0) {

  const newFiles = Array.from(e.target.files);


  setImages((prev) => [...(prev|| []), ...newFiles]);
}
            else return
          }}
          className="w-full rounded-lg border border-zinc-800 bg-black/40 p-2 text-white"
        />

        <div className="flex flex-col gap-3 mt-3 max-h-40 overflow-y-auto border border-zinc-800 p-3 rounded-lg hide-scrollbar bg-black/30">
            {previews.length === 0 && existingImage.length === 0 && <div className="text-zinc-400">No images </div>}
{ existingImage.length > 0 && <div > <p className="pb-2 text-sm text-zinc-300" >Existing Images :</p>           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                     {existingImage.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src.imageURL} alt={`preview-${idx}`} className="w-full h-20  sm:h-24 object-cover rounded-md" />

           {existingImageToDelete.find((img) => img.public_id === src.public_id) ? (
          <> <div className="absolute inset-0 bg-black/50" />
          <Undo2  type="button"
                  onClick={() => setExistingImageToDelete((prev) => prev.filter((img) => img.public_id !== src.public_id))}
                  className="absolute -top-1 -right-1 p-0.5 bg-sky-600 hover:bg-sky-400 rounded-full w-4 h-4 flex items-center justify-center text-white text-[6px]!" />
           </>
           ) : (
            <>

            <X  type="button"
                  onClick={() => removeExistingImage(src.public_id)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-600 hover:bg-red-400 rounded-full w-4 h-4 flex items-center justify-center text-white text-[6px]!" />
                  </>
           )}

              </div>
            ))}
          </div> </div>} 
        {previews.length>0 &&<div>  
       <p className="pb-2 text-sm text-zinc-300" >New Images :</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
           {previews.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt={`preview-${idx}`} className="w-full h-20 sm:h-24 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removePreview(idx)}
                  className="absolute -top-1 -right-1 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div></div>}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:flex-1 h-10 sm:h-12 bg-red-600 hover:bg-red-500"
        >
          {loading ? (mode === "edit" ? "Updating..." : "Adding...") : mode === "edit" ? "Update Part" : "Add Part"}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:flex-1 h-10 sm:h-12"
          >
            إلغاء
          </Button>
        )}
      </div>

      <AlertDialog
        open={dialogOpen}
        mainText={dialogData.mainText}
        button1Text={dialogData.text1}
        button2Text={dialogData.text2}
        callbackFunction1={() => dialogCallback1.current()}
        callbackFunction2={() => dialogCallback2.current()}
      />
    </form>
  );
}