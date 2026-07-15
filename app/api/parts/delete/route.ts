import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {deleteImageFromClodinary} from "@/lib/cloudinary";
import {auth} from '@/auth'
import {isItemOwnedBySeller} from "@/components/auth/isItemOwnedBySeller";

export async function POST(req:any, res:any) {
 
  try {
     if (req.method !== "POST") {
    return res.status(405).json({ "success": false, "message": "Method  GET or POST not allowed here. Please use DELETE." },
)}

  const session = await auth()
  console.log('session',session)
    if (!session) {
       console.log('unauthorized access attempt to delete parts')
      return NextResponse.json(
        { "success": false, "message": "Please log in first to access this page." },
        { status: 401 }
      );
    }
    if (session?.user.role !== "seller") {
       
      return NextResponse.json(
     { "success": false, "message": "Sorry, you do not have permission to manage products in the system." },
        { status: 403 }
      );
    }

// Define the shape of the data coming from the frontend
interface DeleteItemRequest {
  id: number;
  public_id: string[]; // Or an array of strings if a part has multiple images
}

const body = await req.json();
const { items } = body; // Expecting an array of items to delete

    // 1. Extract all requested part IDs from the incoming array
    const requestedIds = items.map((item: DeleteItemRequest) => item.id);
    // console.log('Requested IDs for deletion:', items);
// console.log('Requested IDs for deletion:', items);
    // 2. Verification: Find which of these parts actually exist and belong to the current publisher
    // (This step is crucial to know exactly what will be deleted, so we can safely extract their image public_ids)
    const validParts = await prisma.parts.findMany({
      where: {
        id: { in: requestedIds },
        publisherId: Number(session?.user.id), // Authorization Check: Ensures the publisher owns these parts
      },
      select: { id: true }, // We only need the 'id' to speed up the query
    });

    // Extract only the valid IDs that are safe to delete
    const validIds = validParts.map((part: { id: number }) => part.id);

    // If no valid parts are found, abort the process
    if (validIds.length === 0) {
      return { 
        success: false, 
        message: "No parts were deleted. Please check your permissions and the provided part IDs.", 
        status: 403 // Forbidden (or 404 Not Found)
      };
    }

    // 3. Delete the validated parts from the database
    await prisma.parts.deleteMany({
      where: {
        id: { in: validIds },
      },
    });

    // 4. Extract the public_ids only for the successfully deleted parts
    // We filter the original array to keep only the items whose IDs were validated and deleted
    const successfullyDeletedItems = items.filter((item: DeleteItemRequest) => validIds.includes(item.id));
    const publicIdsToDelete = items.map((item: DeleteItemRequest) => item.public_id.length>0? item.public_id.map(url=>({ public_id: url })) : null).flat().filter((id: { publicIds: string } | null) => id !== null); // Filter out any nulls
    // ? item.public_id : null).filter((id: string | null) => id !== null); // Filter out any nulls

    // 5. Call your image deletion function here
    // Example:
    // await yourImageDeletionFunction(publicIdsToDelete);
    await deleteImageFromClodinary(publicIdsToDelete);
    console.log("Public IDs to delete from storage:", publicIdsToDelete);

    // 6. Check the final result and return the appropriate response
    if (validIds.length === requestedIds.length) {
      return { 
        success: true, 
        message: "All parts and their related images were deleted successfully.", 
        status: 200 // OK
      };
    } else {
      
      return { 
        success: true, 
        message: `Only ${validIds.length} parts were deleted. Some parts either do not exist or you do not have permission.`, 
        status: 207 // Multi-Status (Partial Success)
      };
    }

  } catch (error) {
    console.error("Error deleting parts:", error);
    return { 
      success: false, 
      message: "An internal server error occurred during deletion.", 
      status: 500 // Internal Server Error
    };
  }
}

  