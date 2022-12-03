/*
  Warnings:

  - Added the required column `codeExpireAt` to the `emailConfirmed` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emailConfirmed" ADD COLUMN     "codeExpireAt" TIMESTAMP(3) NOT NULL;
