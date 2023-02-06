/*
  Warnings:

  - You are about to drop the column `amount` on the `PunishmentConversion` table. All the data in the column will be lost.
  - Added the required column `rate` to the `PunishmentConversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PunishmentConversion" DROP COLUMN "amount",
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL;
