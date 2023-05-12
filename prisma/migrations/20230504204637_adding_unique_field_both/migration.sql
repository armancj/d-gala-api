/*
  Warnings:

  - You are about to drop the column `nameGeneral` on the `Category` table. All the createReviewDto in the column will be lost.

*/
-- DropIndex
DROP INDEX "Category_name_nameGeneral_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "nameGeneral";
