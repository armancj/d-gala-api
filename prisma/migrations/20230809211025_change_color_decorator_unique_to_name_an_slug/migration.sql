-- DropIndex
DROP INDEX "Product_name_key";

-- DropIndex
DROP INDEX "Product_name_userId_idx";

-- DropIndex
DROP INDEX "Product_slug_key";

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");
