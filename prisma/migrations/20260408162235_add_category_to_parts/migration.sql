-- AlterTable
ALTER TABLE "Parts" ADD COLUMN     "categoryId" INTEGER;

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "GPSLocation" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- AddForeignKey
ALTER TABLE "Parts" ADD CONSTRAINT "Parts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
