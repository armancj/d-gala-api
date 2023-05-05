/*
  Warnings:

  - A unique constraint covering the columns `[name,nameGeneral]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "nameGeneral" TEXT NOT NULL DEFAULT 'GeneralCategory';

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_nameGeneral_key" ON "Category"("name", "nameGeneral");
