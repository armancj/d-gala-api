/*
  Warnings:

  - The `params` column on the `Logs` table would be dropped and recreated. This will lead to createReviewDto loss if there is createReviewDto in the column.

*/
-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "params",
ADD COLUMN     "params" JSONB;
