/*
  Warnings:

  - You are about to drop the `profileId, productId` table. If the table is not empty, all the createReviewDto it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "profileId, productId" DROP CONSTRAINT "profileId, productId_productId_fkey";

-- DropForeignKey
ALTER TABLE "profileId, productId" DROP CONSTRAINT "profileId, productId_profileId_fkey";

-- DropTable
DROP TABLE "profileId, productId";

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "space" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER,
    "profileId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Photo_productId_key" ON "Photo"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Photo_profileId_key" ON "Photo"("profileId");

-- CreateIndex
CREATE INDEX "Photo_productId_profileId_idx" ON "Photo"("productId", "profileId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
