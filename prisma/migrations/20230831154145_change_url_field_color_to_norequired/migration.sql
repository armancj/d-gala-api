-- AlterTable
ALTER TABLE "Colors" ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "url" SET DEFAULT 'updated_url';
