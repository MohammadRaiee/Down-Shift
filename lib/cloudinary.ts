export  async function  uploadImage  (image:FileList){
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
}
return imagesUlr
}else{
  throw new Error('there are not image')
}
    
} catch (error) {
       alert("حدث خطأ أثناء رفع الصورة");
      throw new Error('upload field')
     
    }
  }
