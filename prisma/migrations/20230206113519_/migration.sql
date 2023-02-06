/*
  Warnings:

  - A unique constraint covering the columns `[fromId,toId,organizationId]` on the table `PunishmentConversion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PunishmentConversion_fromId_toId_key";

-- CreateIndex
CREATE UNIQUE INDEX "PunishmentConversion_fromId_toId_organizationId_key" ON "PunishmentConversion"("fromId", "toId", "organizationId");
