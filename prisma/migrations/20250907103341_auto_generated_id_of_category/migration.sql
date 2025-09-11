/*
  Warnings:

  - Added the required column `kategoriyaId` to the `mahsulotlar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."mahsulotlar" ADD COLUMN     "kategoriyaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."kategoriyalar" (
    "kategoriya_id" SERIAL NOT NULL,
    "nomi" TEXT NOT NULL,

    CONSTRAINT "kategoriyalar_pkey" PRIMARY KEY ("kategoriya_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategoriyalar_nomi_key" ON "public"."kategoriyalar"("nomi");

-- AddForeignKey
ALTER TABLE "public"."mahsulotlar" ADD CONSTRAINT "mahsulotlar_kategoriyaId_fkey" FOREIGN KEY ("kategoriyaId") REFERENCES "public"."kategoriyalar"("kategoriya_id") ON DELETE RESTRICT ON UPDATE CASCADE;
