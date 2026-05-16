/*
  Warnings:

  - Added the required column `countryOfOrigin` to the `Parts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parts" ADD COLUMN     "countryOfOrigin" TEXT NOT NULL,
ADD COLUMN     "quality" TEXT NOT NULL DEFAULT 'Good';
