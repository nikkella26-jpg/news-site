/*
  Warnings:

  - You are about to drop the column `subscriptionTypeId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `subscription_type` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceId` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EDITOR');

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_subscriptionTypeId_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "subscriptionTypeId",
ADD COLUMN     "plan" TEXT NOT NULL,
ADD COLUMN     "referenceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "subscription_type";

-- CreateIndex
CREATE UNIQUE INDEX "subscription_userId_key" ON "subscription"("userId");
