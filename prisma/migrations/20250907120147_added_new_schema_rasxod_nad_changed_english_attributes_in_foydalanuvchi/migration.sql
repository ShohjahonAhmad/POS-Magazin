/*
  Warnings:

  - The primary key for the `foydalanuvchilar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `foydalanuvchilar` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `foydalanuvchilar` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `foydalanuvchilar` table. All the data in the column will be lost.
  - The `foydalanuvchi_id` column on the `foydalanuvchilar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `familiya` to the `foydalanuvchilar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ism` to the `foydalanuvchilar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parol` to the `foydalanuvchilar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."foydalanuvchilar" DROP CONSTRAINT "foydalanuvchilar_pkey",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "password",
ADD COLUMN     "familiya" TEXT NOT NULL,
ADD COLUMN     "ism" TEXT NOT NULL,
ADD COLUMN     "parol" TEXT NOT NULL,
DROP COLUMN "foydalanuvchi_id",
ADD COLUMN     "foydalanuvchi_id" SERIAL NOT NULL,
ADD CONSTRAINT "foydalanuvchilar_pkey" PRIMARY KEY ("foydalanuvchi_id");

-- AlterTable
ALTER TABLE "public"."mahsulotlar" ADD COLUMN     "razmer" TEXT;

-- CreateTable
CREATE TABLE "public"."rasxodlar" (
    "rasxod_id" SERIAL NOT NULL,
    "summa" DECIMAL(10,2) NOT NULL,
    "izoh" TEXT NOT NULL,
    "kun" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valyuta" TEXT NOT NULL DEFAULT 'UZS',

    CONSTRAINT "rasxodlar_pkey" PRIMARY KEY ("rasxod_id")
);
