import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from '@/auth'
export async function POST(req:any, res:any) {
  if (req.method !== "POST") {
    return res.status(405).json({ "success": false, "message": "Method PATCH not allowed here. Please use POST." },
)}

  try {
// Authenticate user and authorize role
  const session = await auth()
  console.log('session',session)
    if (!session) {
       
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

// Extract and validate request data
 const body = await req.json();
   
   const { name, price, description, partNumber, brandName,partBrand, modelName, years, quality ,countryOfOrigin,image  , categoryId } = body;

   if (!name || !price || !partNumber || !partBrand ||  !categoryId ||!quality  ||!countryOfOrigin ) {
         return NextResponse.json({ "success": false, "message": "Missing required fields" },{ status: 400 });
  }

if(!((years.length>0 && modelName && brandName)||(years.length===0 && !modelName && !brandName))){
         return NextResponse.json({ "success": false, "message": "You must fill out all car fields, or leave them all empty." },{ status: 400 });
}


await prisma.$transaction(async (tx) => {

// Create new item
    const part = await tx.parts.create({
      data: {
        name,
        image: image.length > 0 ? image : [],
        price: Number(price),
        description,
        partNumber,
        partBrand,
        publisherId:  +session.user.id,
        quality,
        countryOfOrigin,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
    });
// Find the brand, if not found create a new one
    let brand = await tx.carBrand.findUnique({ where: { name: brandName } });
      if (!brand) {
        brand = await tx.carBrand.create({ data: { name: brandName } });
      }
// Process each year and associate it with the model
    const partCarConnections = [];

    for (const year of years) {
// Check if the model exists for the given year
      let carModel = await tx.carModel.findFirst({
        where: {
          brandId: brand.id,
          name: modelName,
          year: Number(year),
        },
      })
// If it doesn't exist, create it
      if (!carModel) {
        carModel = await tx.carModel.create({
          data: {
            brandId: brand.id,
            name: modelName,
            year: Number(year),
          },
        });
      }    
    
// Add the relationship between the part and the model
      partCarConnections.push({
        partId: part.id,
        carModelId: carModel.id,
      });
    }
// Bulk insert all relations into the PartCar table
    await tx.partCar.createMany({
      data: partCarConnections,
      skipDuplicates: true, // Avoid duplicating the link if it already exists
    });
  },{
    maxWait: 5000,  
    timeout: 10000, 
  });

    return NextResponse.json({ "success": true, "message": "Part added successfully." },{ status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ "success": false, "message": "An error occurred while adding the part." },    { status: 500 });
  }

}