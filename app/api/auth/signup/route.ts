// pages/api/auth/signup.js








import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { email, password, firstName, lastName, type, image } = body;
console.log(body.GPSLocation ,'fdfffffffffffffffffffffffffffffffffff')
    if (!email || !password || !type) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check if email already exists in either table
    const existingUser =
      (await prisma.user.findUnique({ where: { email } })) ||
      (await prisma.seller.findUnique({ where: { email } }));

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let createdAccount;

    if (type === "user") {
      // Create User
      createdAccount = await prisma.user.create({
        data: {
          email,
          passwordHash: hashedPassword,
          firstName: firstName || null,
          lastName: lastName || null,
          image: image || null,
        },
      });
    } else if (type === "seller") {
      // Seller fields from request
      const {
        phone,
        storeName,
        businessType,
        businessReg,
        storeLogo,
        GPSLocation,
        address,
        city,
        shippingOptions,
      } = body;

      // Basic validation
      if (!firstName || !lastName || !phone || !storeName ||  !businessType || !GPSLocation || !address || !city) {
        return NextResponse.json(
          { error: "Missing required fields for seller" },
          { status: 400 }
        );
      }

      // Create Seller
      createdAccount = await prisma.seller.create({
        data: {
          email,
          password:hashedPassword,
          firstName,
          lastName,
          phone,
          storeName,
          businessType,
          businessReg: businessReg || null,
          storeLogo: storeLogo || null,
          GPSLocation:GPSLocation || null,
          address,
          city,
          shippingOptions: shippingOptions || [],
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Signup successful", user: createdAccount },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}












// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from 'bcryptjs';
// import { PrismaClient } from '@prisma/client'

// export async function POST(req: NextRequest) {
//   const prisma = new PrismaClient()
  
//   const body = await req.json();
//   const { email, password, firstName, lastName, role } = body;
//   console.log(email, password, firstName, lastName, role)

//   try {
//     // Check if user already exists in the database
//     const existingUser = await prisma.user.findUnique({
//       where: { email }
//     });

//     if (existingUser) {
 
//       return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create the new user in the database
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         passwordHash: hashedPassword,
//         firstName,
//         lastName,
//       },
//     });

//     return NextResponse.json({ message: 'Signup successful', user: 'newUser' }, { status: 201 });
//   } catch (error) {
//  console.log(error)
//     return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 });
//   }
// }
// {
//     "firstName": "Mohammad",
//     "lastName": " raiee",
//     "email": "mohammadraiee@gmail.com",
//     "password": "mo2hammad2003",
//     "role": "seller"
// }