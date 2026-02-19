-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'EDITOR');

-- AlterTable
ALTER TABLE "article" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
