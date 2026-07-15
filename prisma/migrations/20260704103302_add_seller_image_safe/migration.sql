-- AlterTable (safe for existing rows)
ALTER TABLE "Seller" ADD COLUMN IF NOT EXISTS "image" JSONB;

UPDATE "Seller"
SET "image" = '{}'::jsonb
WHERE "image" IS NULL;

ALTER TABLE "Seller" ALTER COLUMN "image" SET NOT NULL;
