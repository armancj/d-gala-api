/*
  Warnings:

  - You are about to drop the column `start` on the `Product` table. All the createReviewDto in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "start",
ADD COLUMN     "stars" INTEGER NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_key" ON "Review"("userId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
