-- CreateTable
CREATE TABLE "PunishmentType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PunishmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PunishmentConversion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "PunishmentConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Punishment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "typeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Punishment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PunishmentType_name_key" ON "PunishmentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PunishmentConversion_fromId_toId_key" ON "PunishmentConversion"("fromId", "toId");

-- AddForeignKey
ALTER TABLE "PunishmentConversion" ADD CONSTRAINT "PunishmentConversion_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "PunishmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PunishmentConversion" ADD CONSTRAINT "PunishmentConversion_toId_fkey" FOREIGN KEY ("toId") REFERENCES "PunishmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "PunishmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishment" ADD CONSTRAINT "Punishment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
