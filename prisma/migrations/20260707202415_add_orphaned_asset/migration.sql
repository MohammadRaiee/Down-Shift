-- CreateTable
CREATE TABLE "OrphanedAsset" (
    "id" TEXT NOT NULL,
    "publicId" JSONB[],
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrphanedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrphanedAsset_publicId_key" ON "OrphanedAsset"("publicId");
