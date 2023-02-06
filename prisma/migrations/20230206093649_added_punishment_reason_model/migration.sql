/*
  Warnings:

  - You are about to drop the column `reason` on the `Punishment` table. All the data in the column will be lost.
  - Added the required column `reasonId` to the `Punishment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Punishment" DROP COLUMN "reason",
ADD COLUMN     "reasonId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PunishmentReason" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PunishmentReason_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PunishmentReason_name_key" ON "PunishmentReason"("name");

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "PunishmentReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
