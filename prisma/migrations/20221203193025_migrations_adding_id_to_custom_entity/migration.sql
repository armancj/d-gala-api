/*
  Warnings:

  - The primary key for the `CategoriesOnPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CategoriesOnPosts_pkey" PRIMARY KEY ("id");
