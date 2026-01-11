/*
  Warnings:

  - You are about to drop the column `code` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "debts" ADD COLUMN     "status" "DebtStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "code";
