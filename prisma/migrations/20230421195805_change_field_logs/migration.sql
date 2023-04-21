/*
  Warnings:

  - The `params` column on the `Logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "params",
ADD COLUMN     "params" JSONB;
