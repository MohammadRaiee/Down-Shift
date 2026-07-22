import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {isItemOwnedBySeller} from "@/components/auth/isItemOwnedBySeller";


export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await params;
  const partId = Number(id);
  if (!Number.isInteger(partId) || partId <= 0) {
    return   NextResponse.json({ "success": false, "message": "ID does not exist." }, { status: 400 });

  }
// Fetch part by ID
  const part = await prisma.parts.findUnique({
    where: { id: partId },
    include: {
      cars: {
        include: {
          carModel: {
            include: { brand: true },
          },
        },
      },
    },
  });


  
  if (!part) {
    return NextResponse.json({ "success": false, "message": "Part not found" }, { status: 404 });
  }
  
// Extract data
  const firstCar = part.cars[0]?.carModel;
  const years = part.cars.map((car) => car.carModel.year);

  return NextResponse.json({data:{
    id: part.id,
    name: part.name,
    price: Number(part.price),
    description: part.description,
    partNumber: part.partNumber,
    partBrand:part.partBrand,
    countryOfOrigin: part.countryOfOrigin,
    quality: part.quality,
    categoryId: part.categoryId,
    image: part.image,
    brandName: firstCar?.brand?.name ?? "",
    modelName: firstCar?.name ?? "",
    years,},
    "success": true, 
    "message": "Car part details retrieved successfully.",
     status: 200 
  });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {

const { id } = await params;

  try{
    
  const partId = Number(id);
  if (!Number.isInteger(partId) || partId <= 0) {
    return   NextResponse.json({ "success": false, "message": "ID does not exist." }, { status: 400 });
  }

 // Authenticate user and authorize role
  const session = await auth()
    if (!session) {
       
      return NextResponse.json(
        { "success": false, "message": "Please log in first to access this page." },
        { status: 401 }
      );
    }
    if (session?.user.role !== "seller") {
       
      return NextResponse.json(
     { "success": false, "message": "Sorry, You don't own this part." },
        { status: 403 }
      );
    }

  // Check if the part belongs to the user
   const isOwnedBySeller = isItemOwnedBySeller(partId,Number(session.user.id))
 
if(!isOwnedBySeller){
  return NextResponse.json(
    { "success": false, "message": "You do not have permission to edit this part." },
    { status: 403 }
  );
}

// Extract and validate request data
  const body = await req.json();
  const {
    name,
    price,
    description,
    partNumber,
    partBrand,
    brandName,
    modelName,
    years,
    quality,
    countryOfOrigin,
    image,
    categoryId,
  } = body;

 if (!name || !price || !partNumber || !partBrand || !categoryId ||!quality  ||!countryOfOrigin) {
            return NextResponse.json({ "success": false, "message": "Missing required fields" },{ status: 400 });
    }

if(!((years.length>0 && modelName && brandName)||(years.length===0 && !modelName && !brandName))){
          return NextResponse.json({ "success": false, "message": "You must fill out all car fields, or leave them all empty." },{ status: 400 });
}

// Fetch current data
    const currentData = await prisma.parts.findUnique({
    where: { id: partId },
    include: {
      cars: {
        include: {
          carModel: {
            include: { brand: true },
          },
        },
      },
    },
  });

  if (!currentData) {
    return NextResponse.json({ success: false, message: "Part not found" }, { status: 404 });
  }

// Extract data
  const firstCar = currentData.cars[0]?.carModel;
  const oldYears = currentData.cars.map((car) => car.carModel.year);

// Update part data excluding model, brand, and years
  if(years.every((year :number) => oldYears.includes(year)) && years.length === oldYears.length) {
 try{
  const updatedPart = await prisma.parts.update({
      where: { id: partId },
      data: {
        name,
        partBrand,
        price: Number(price),
        description,
        partNumber,
        quality,
        countryOfOrigin,
        categoryId: categoryId ? Number(categoryId) : null,
        image: image && image.length > 0 ? image : [],
      },
    })
  return NextResponse.json({ success: true, message: "Part updated successfully", part: updatedPart });

  }catch (error) {
    console.error("Error updating part:", error);
    return NextResponse.json({ success: false, message: "Failed to update part" }, { status: 500 });
  }
  }else {
  try{
      const result = await prisma.$transaction(async (tx) => {
const deleteResult = await tx.partCar.deleteMany({
  where: {
    partId: partId,
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
        partId: partId,
        carModelId: carModel.id,
      });
    }
// Bulk insert all relations into the PartCar table
    await tx.partCar.createMany({
      data: partCarConnections,
      skipDuplicates: true, // Avoid duplicating the link if it already exists
    });

});
   return NextResponse.json({ "success": true, "message":  "Part updated successfully" },{ status: 200 });

  }catch(error) {
    console.error("Error updating part:", error);
    return NextResponse.json({ "success": false, "message":  "Failed to update part" },{ status: 500 });
  }}
  }catch(error) {
        return NextResponse.json({ "success": false, "message":  "Failed to update part" },{ status: 500 });
  }

}















// console.log("Deleted partCar records:", deleteResult);
  //   const updatedPart = await tx.parts.update({
  //     where: { id: partId },
  //     data: {
  //       name,
  //       price: Number(price),
  //       description,
  //       partNumber,
  //       quality,
  //       countryOfOrigin,
  //       categoryId: categoryId ? Number(categoryId) : null,
  //       image: image ? image : existing.image,
  //     },
  //   });

  //   let brand = await tx.carBrand.findUnique({ where: { name: brandName } });
  //   if (!brand) {
  //     brand = await tx.carBrand.create({ data: { name: brandName } });
  //   }

  //   await tx.partCar.deleteMany({ where: { partId } });

  //   const partCarConnections = [] as Array<{ partId: number; carModelId: number }>;
  //   for (const year of years) {
  //     let carModel = await tx.carModel.findFirst({
  //       where: {
  //         brandId: brand.id,
  //         name: modelName,
  //         year: Number(year),
  //       },
  //     });

  //     if (!carModel) {
  //       carModel = await tx.carModel.create({
  //         data: {
  //           brandId: brand.id,
  //           name: modelName,
  //           year: Number(year),
  //         },
  //       });
  //     }

  //     partCarConnections.push({ partId, carModelId: carModel.id });
  //   }

  //   if (partCarConnections.length) {
  //     await tx.partCar.createMany({
  //       data: partCarConnections,
  //       skipDuplicates: true,
  //     });
  //   }

  //   return updatedPart;
