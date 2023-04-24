/*
  Warnings:

  - The `contentLength` column on the `Logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "contentLength",
ADD COLUMN     "contentLength" INTEGER;
