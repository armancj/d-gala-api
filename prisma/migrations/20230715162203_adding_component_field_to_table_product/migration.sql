-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "component" TEXT[] DEFAULT ARRAY[]::TEXT[];
