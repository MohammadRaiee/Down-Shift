// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({ log: ['query'] }); // يمكنك إزالة log لاحقًا

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query'], // يمكن إزالة هذا لاحقًا
  });

// مشاركة نفس النسخة في التطوير
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// generator client {
//   provider = "prisma-client-js"
// }

// datasource db {
//   provider = "postgresql"
//   url      = env("DATABASE_URL")  // تأكد من إضافة DATABASE_URL في .env
// }

// model User {
//   id            Int      @id @default(autoincrement()) // معرف المستخدم
//   email         String   @unique                      // البريد الإلكتروني (يجب أن يكون فريدًا)
//   passwordHash  String   // كلمة المرور المجزأة
//   firstName     String?  // الاسم الأول
//   lastName      String?  // الاسم الأخير
//   role          String   @default("client") // الدور (مثل: user, admin)
//   createdAt     DateTime @default(now())  // تاريخ الإنشاء
//   updatedAt     DateTime @updatedAt       // تاريخ التحديث
//   isVerified    Boolean  @default(false)  // هل تم التحقق من البريد الإلكتروني؟
// }

// model Part {
//   id             String      @id @default(cuid())


//   title          String
//   price          Decimal     @db.Decimal(10,2)
//   manufacturer   String
//   condition      Condition
//   compatibleCars String[]
//   publisherId    String

//   publisher      User        @relation(fields: [publisherId], references: [id], onDelete: Cascade)

//   images         String[]


//   description    String?

//   createdAt      DateTime    @default(now())
//   updatedAt      DateTime    @updatedAt

//   @@index([manufacturer])
//   @@index([condition])
//   @@index([compatibleCars], type: Gin)
// }
