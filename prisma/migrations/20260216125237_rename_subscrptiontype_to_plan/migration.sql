/*
  Warnings:

  - You are about to drop the column `subscriptionTypeId` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `plan` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "subscriptionTypeId",
ADD COLUMN     "plan" TEXT NOT NULL;
