// pages/api/auth/signup.js
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client'

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient()
  
  const body = await req.json();
  const { email, password, firstName, lastName, role } = body;
  console.log(email, password, firstName, lastName, role)

  try {
    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
 
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({ message: 'Signup successful', user: 'newUser' }, { status: 201 });
  } catch (error) {
 console.log(error)
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 });
  }
}
// {
//     "firstName": "Mohammad",
//     "lastName": " raiee",
//     "email": "mohammadraiee@gmail.com",
//     "password": "mo2hammad2003",
//     "role": "seller"
// }