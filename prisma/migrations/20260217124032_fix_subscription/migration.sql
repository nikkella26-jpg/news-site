/*
  Warnings:

  - You are about to drop the column `userId` on the `subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_fkey";

-- DropIndex
DROP INDEX "subscription_userId_idx";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "userId";
