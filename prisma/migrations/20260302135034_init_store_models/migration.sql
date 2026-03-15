-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('NEW', 'USED', 'REFURBISHED');

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "condition" "Condition" NOT NULL,
    "compatibleCars" TEXT[],
    "publisherId" INTEGER NOT NULL,
    "images" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Part_manufacturer_idx" ON "Part"("manufacturer");

-- CreateIndex
CREATE INDEX "Part_condition_idx" ON "Part"("condition");

-- CreateIndex
CREATE INDEX "Part_compatibleCars_idx" ON "Part" USING GIN ("compatibleCars");

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
