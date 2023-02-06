/*
  Warnings:

  - Added the required column `organizationId` to the `PunishmentConversion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `PunishmentReason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `PunishmentType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PunishmentConversion" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PunishmentReason" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PunishmentType" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PunishmentType" ADD CONSTRAINT "PunishmentType_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PunishmentConversion" ADD CONSTRAINT "PunishmentConversion_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PunishmentReason" ADD CONSTRAINT "PunishmentReason_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
