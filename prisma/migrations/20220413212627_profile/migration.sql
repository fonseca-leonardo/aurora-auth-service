/*
  Warnings:

  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.
  - Added the required column `profile` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Profiles" AS ENUM ('ONG', 'ADOPTER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profile" "Profiles" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "OngProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ongId" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OngProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdopterProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "neighborhood" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "streetNumber" TEXT,
    "extra" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdopterProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OngProfile_userId_key" ON "OngProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdopterProfile_userId_key" ON "AdopterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationToken_userId_key" ON "ConfirmationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConfirmationToken_token_key" ON "ConfirmationToken"("token");

-- AddForeignKey
ALTER TABLE "OngProfile" ADD CONSTRAINT "OngProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterProfile" ADD CONSTRAINT "AdopterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationToken" ADD CONSTRAINT "ConfirmationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
