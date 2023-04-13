/*
  Warnings:

  - You are about to drop the `Photo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_productId_fkey";

-- DropForeignKey
ALTER TABLE "Photo" DROP CONSTRAINT "Photo_profileId_fkey";

-- DropTable
DROP TABLE "Photo";

-- CreateTable
CREATE TABLE "profileId, productId" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "space" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER,
    "profileId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profileId, productId_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profileId, productId_productId_key" ON "profileId, productId"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "profileId, productId_profileId_key" ON "profileId, productId"("profileId");

-- AddForeignKey
ALTER TABLE "profileId, productId" ADD CONSTRAINT "profileId, productId_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profileId, productId" ADD CONSTRAINT "profileId, productId_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
