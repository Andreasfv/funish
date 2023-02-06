/*
  Warnings:

  - Added the required column `quantityToFulfill` to the `PunishmentType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Punishment" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PunishmentType" ADD COLUMN     "quantityToFulfill" INTEGER NOT NULL;
