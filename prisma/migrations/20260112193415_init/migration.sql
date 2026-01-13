/*
  Warnings:

  - Added the required column `userDeb` to the `debt_participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "debt_participants" ADD COLUMN     "userDeb" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false;
