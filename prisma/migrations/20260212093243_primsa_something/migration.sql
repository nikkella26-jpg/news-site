/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `subscription_type` will be added. If there are existing duplicate values, this will fail.
  - Made the column `role` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscription_type_name_key" ON "subscription_type"("name");
