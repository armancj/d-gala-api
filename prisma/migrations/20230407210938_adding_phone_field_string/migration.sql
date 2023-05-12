/*
  Warnings:

  - You are about to drop the `emailConfirmed` table. If the table is not empty, all the createReviewDto it contains will be lost.
  - You are about to drop the `phoneConfirmed` table. If the table is not empty, all the createReviewDto it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "emailConfirmed" DROP CONSTRAINT "emailConfirmed_userId_fkey";

-- DropForeignKey
ALTER TABLE "phoneConfirmed" DROP CONSTRAINT "phoneConfirmed_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "emailConfirmed";

-- DropTable
DROP TABLE "phoneConfirmed";

-- CreateTable
CREATE TABLE "EmailConfirmed" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "codeExpireAt" TIMESTAMP(3) NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'REGISTER_SEND_EMAIL',
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailConfirmed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneConfirmed" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "codeExpireAt" TIMESTAMP(3) NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'REGISTER_SEND_EMAIL',
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneConfirmed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmed_email_key" ON "EmailConfirmed"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmed_code_key" ON "EmailConfirmed"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfirmed_userId_key" ON "EmailConfirmed"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneConfirmed_phone_key" ON "PhoneConfirmed"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneConfirmed_code_key" ON "PhoneConfirmed"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneConfirmed_userId_key" ON "PhoneConfirmed"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "EmailConfirmed" ADD CONSTRAINT "EmailConfirmed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneConfirmed" ADD CONSTRAINT "PhoneConfirmed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
