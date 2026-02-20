/*
  Warnings:

  - You are about to drop the column `createdAt` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscription_userId_key";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'incomplete',
ALTER COLUMN "plan" DROP NOT NULL;
