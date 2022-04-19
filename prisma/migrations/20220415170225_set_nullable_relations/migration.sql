-- DropForeignKey
ALTER TABLE "AdopterProfile" DROP CONSTRAINT "AdopterProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "ConfirmationToken" DROP CONSTRAINT "ConfirmationToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "OngProfile" DROP CONSTRAINT "OngProfile_userId_fkey";

-- AlterTable
ALTER TABLE "AdopterProfile" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ConfirmationToken" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OngProfile" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OngProfile" ADD CONSTRAINT "OngProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdopterProfile" ADD CONSTRAINT "AdopterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfirmationToken" ADD CONSTRAINT "ConfirmationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
