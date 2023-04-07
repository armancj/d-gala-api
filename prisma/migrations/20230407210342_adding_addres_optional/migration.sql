-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;
