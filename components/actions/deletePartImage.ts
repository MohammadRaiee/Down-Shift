// app/actions/spareParts.js
'use server';
import {isItemOwnedBySeller} from "@/components/auth/isItemOwnedBySeller";
import { prisma } from "@/lib/prisma";
import { deleteImageFromClodinary } from "@/lib/cloudinary"; 

export async function deletePartImages(partId:any, puplick_ids:{public_id: string}[] ,publisherId:number) {
try {
// Check for part ownership
  const isOwned = await isItemOwnedBySeller(partId, publisherId);
  if (!isOwned) {
    throw new Error("Unauthorized: You do not own this part.");
  }

 const part = await prisma.parts.findUnique({
    where: { id: partId },
    select: { image: true }, 
  });

    if (!part || !part.image) {
    throw new Error("Error occurred: Part not found or has no images.");
  }

  const currentImages = part.image as { imageURL: string; public_id: string }[];
    const updatedImages = currentImages.filter(
    (img) => !puplick_ids.find((delImg) => delImg.public_id === img.public_id)
  );
  const updatedPart = await prisma.parts.update({
    where: { id: partId },
    data: {
      image: updatedImages,
    },
  });

  console.log("✅ Part images updated successfully in the database.", updatedPart);

// delete the images from Cloudinary in the background
await deleteImageFromClodinary( currentImages.filter(
    (img) => puplick_ids.find((delImg) => delImg.public_id === img.public_id)))
    return { success: true, message: "Images deleted successfully" };
}catch(error) {
    console.error("❌ Error occurred while checking item ownership:", error);
    return { success: false, message: `Error occurred ${error}` };

  }
}