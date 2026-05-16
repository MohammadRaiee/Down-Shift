-- DropForeignKey
ALTER TABLE "Parts" DROP CONSTRAINT "Parts_publisherId_fkey";

-- CreateTable
CREATE TABLE "Seller" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "businessReg" TEXT,
    "storeLogo" TEXT,
    "GPSLocation" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "shippingOptions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- AddForeignKey
ALTER TABLE "Parts" ADD CONSTRAINT "Parts_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;
