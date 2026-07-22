'use server';

import { after } from 'next/server';
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export async function uploadImage(image: File | File[] | FileList) {
  const imagesUrl: any[] = []; // يمكنك تغيير any للنوع المناسب لبيانات Cloudinary
  const UploadURL = process.env.CLOUDINARY_UPLOAD_URL;
  const StringURL = String(UploadURL);

  try {
    // 1. التحقق من وجود المدخل
    if (!image) {
      throw new Error("There are no images");
    }

    // 2. توحيد المدخل ليكون دائماً مصفوفة (Array)
    let filesArray: File[];
    if (image instanceof File) {
      filesArray = [image]; // تحويل الملف الواحد إلى مصفوفة
    } else {
      filesArray = Array.from(image); // تحويل File[] أو FileList إلى مصفوفة
    }

    // التحقق من أن المصفوفة ليست فارغة
    if (filesArray.length === 0) {
      throw new Error("There are no images");
    }

    console.log(StringURL, 'uploading images');

    if (typeof StringURL !== "string" || StringURL.trim() === "" || StringURL === "undefined") {
      throw new Error("Error Uploading Images: Invalid URL");
    }

    // 3. المرور على جميع الملفات ورفعها
    for (const file of filesArray) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "car_parts");
      formData.append("folder", "car_parts");

      const res = await fetch(StringURL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Upload failed");
      }

      imagesUrl.push(data);
    }

    return imagesUrl;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw new Error("Upload image failed");
  }
}


// export async function uploadImage(image: File[]) {
//   const imagesUrl: string[] = [];
//   const UploadURL = process.env.CLOUDINARY_UPLOAD_URL;
//   const StringURL = String(UploadURL);

//   try {
//     if (!image || image.length === 0) {
//       throw new Error("there are no images");
//     }

//     console.log(StringURL, 'uploading images');

//     if (typeof StringURL !== "string" || StringURL.trim() === "") {
//       throw new Error("Error Uploading Images");
//     }

//     for (const file of Array.from(image)) {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_preset", "car_parts");
//       formData.append("folder", "car_parts");

//       const res = await fetch(
//         StringURL,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Upload failed");
//       }

//       imagesUrl.push(data);
//     }

//     return imagesUrl;
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     throw new Error("upload image failed");
//   }
// }

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(publicIds: { public_id: string }[]) {
  // 1. Validate data existence
  if (!publicIds || publicIds.length === 0) {
    throw new Error("No images to delete");
  }

  try {
    // 2. Convert the object array into an array of strings only
    const idsArray = publicIds.map((item) => item.public_id);

    // 3. Send a single request to Cloudinary to delete all images at once
    // This method is faster and ensures requests are not scattered
    const response = await cloudinary.api.delete_resources(idsArray);

    const successfulDeletions: string[] = [];
    const failedDeletions: string[] = [];

    // 4. Cloudinary returns an object containing the status of each image
    // Example: { deleted: { "image_1": "deleted", "image_2": "not_found" } }
    const deletedItems = response.deleted || {};

    for (const [id, status] of Object.entries(deletedItems)) {
      if (status === "deleted") {
        successfulDeletions.push(id);
      } else {
        // If the status is anything else (like "not_found")
        failedDeletions.push(id);
      }
    }

    // 5. Return detailed result to the UI
    return {
      success: failedDeletions.length === 0, // true if no images failed
      totalAttempted: idsArray.length,
      successfulDeletions,
      failedDeletions, // Here you will find the array of image IDs that failed to delete
    };

  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("An unexpected error occurred while connecting to Cloudinary servers");
  }
}

export async function deleteImageFromClodinary(images: { imageURL: string, public_id: string }[]) {
  console.log(images, 'from cloudinary');
  
  // 2. Use the 'after' function to perform deletion in the background
  if (images && images.length > 0) {
    after(async () => {
      console.log("🛠️ Running in the background after the user received the response...");
      try {
        const deletedImages = await deleteImage(images.map(img => ({ public_id: img.public_id })));
        console.log("Deleted Images Result:", deletedImages);
        
        if (deletedImages.failedDeletions.length > 0) {
          await prisma.orphanedAsset.create({
            data: {
              publicId: images.filter(img => deletedImages.failedDeletions.includes(img.public_id)),
              retryCount: 1,
              lastError: "delete image failed in background",
            }
          });
        }
        
        console.log("✅ Images successfully deleted from the cloud!", deletedImages);
      } catch (error) {
        console.error("❌ Background deletion failed:", error);
        addOrphanedAsset(images, "delete image failed in background");
      }
    });
  }

  // 3. This response reaches the user immediately, without waiting for the code inside 'after' to execute
  return { success: true, message: "Updated successfully" };
}

export async function addOrphanedAsset(publicId: { imageURL: string, public_id: string }[], lastError?: string) {
  await prisma.orphanedAsset.create({
    data: {
      publicId,
      retryCount: 0,
      lastError,
    }
  });
}
        // await prisma.orphanedAsset.create({
        //   data: {
        //     publicId: images,
        //     retryCount: 1,
        //     lastError: "delete image failed in background",
        //   }
        // });
// export async function deleteImage(publicIds: { public_id: string }[]) {
//   if (!publicIds || publicIds.length != 0) {
//         throw new Error("Failed to delete image");
//   }

//   const results = await Promise.all(
//     publicIds.map(async (publicId) => {
//       const res = await fetch("/api/cloudinary/delete", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ publicId: publicId.public_id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to delete image");
//       }

//       return data;
//     })
//   );

//   return results;
// }



// // جدول تتبع الصور التي فشل حذفها من السحابي
// model OrphanedAsset {
//   id          String   @id @default(cuid())
//   publicId    String   @unique
//   retryCount  Int      @default(0)
//   lastError   String?  
//   createdAt   DateTime @default(now())
// }






// // app/api/cron/cleanup/route.js
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { deleteFromCloudinary } from "@/lib/cloudinary";

// export async function GET(request) {
//   // التحقق من أن الطلب قادم من Vercel Cron (أمان)
//   const authHeader = request.headers.get('authorization');
//   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // 1. جلب الصور اليتيمة (التي لم تتجاوز 5 محاولات فاشلة)
//     const orphans = await db.orphanedAsset.findMany({
//       where: { retryCount: { lt: 5 } },
//       take: 20 // معالجة 20 صورة في كل مرة لتجنب إرهاق السيرفر
//     });

//     if (orphans.length === 0) return NextResponse.json({ message: "No orphans found" });

//     // 2. المرور عليها ومحاولة حذفها
//     for (const orphan of orphans) {
//       try {
//         await deleteFromCloudinary(orphan.publicId);
//         // إذا نجح الحذف، نزيل السجل من قاعدة البيانات
//         await db.orphanedAsset.delete({ where: { id: orphan.id } });
//       } catch (error) {
//         // إذا فشل مجدداً، نزيد العداد
//         await db.orphanedAsset.update({
//           where: { id: orphan.id },
//           data: {
//             retryCount: { increment: 1 },
//             lastError: error.message
//           }
//         });
//       }
//     }

//     return NextResponse.json({ success: true, processed: orphans.length });
//   } catch (error) {
//     return NextResponse.json({ error: "Cron Job Failed" }, { status: 500 });
//   }
// }