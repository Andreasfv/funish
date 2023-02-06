-- AlterTable
ALTER TABLE "Punishment" ADD COLUMN     "description" TEXT,
ADD COLUMN     "proof" TEXT;

-- AlterTable
ALTER TABLE "PunishmentReason" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "PunishmentType" ADD COLUMN     "description" TEXT;
