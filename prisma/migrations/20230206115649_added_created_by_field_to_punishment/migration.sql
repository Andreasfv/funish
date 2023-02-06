/*
  Warnings:

  - Added the required column `createdById` to the `Punishment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Punishment" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
