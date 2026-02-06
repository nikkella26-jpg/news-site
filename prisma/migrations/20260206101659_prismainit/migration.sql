/*
  Warnings:

  - You are about to drop the column `slug` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `subscription` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subscriptionTypeId` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'EDITOR', 'ADMIN');

-- DropIndex
DROP INDEX "category_slug_key";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "plan",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionTypeId" TEXT NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT,
ALTER COLUMN "emailVerified" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "subscription_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "subscription_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "subscription_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
