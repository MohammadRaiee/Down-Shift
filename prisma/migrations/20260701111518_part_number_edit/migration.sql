-- AlterTable
ALTER TABLE "Parts" ALTER COLUMN "partNumber" SET NOT NULL;

-- DropIndex
DROP INDEX "Parts_partNumber_key";
