-- DropIndex
DROP INDEX "ConfirmationToken_userId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DEFAULT E'';
