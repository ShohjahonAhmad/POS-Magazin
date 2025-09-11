/*
  Warnings:

  - You are about to drop the column `midqor` on the `mahsulotlar` table. All the data in the column will be lost.
  - The `valyuta` column on the `rasxodlar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `miqdor` to the `mahsulotlar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Valyuta" AS ENUM ('UZS', 'USD', 'RUB', 'EUR', 'GBP');

-- AlterTable
ALTER TABLE "public"."mahsulotlar" DROP COLUMN "midqor",
ADD COLUMN     "miqdor" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."rasxodlar" DROP COLUMN "valyuta",
ADD COLUMN     "valyuta" "public"."Valyuta" NOT NULL DEFAULT 'UZS';
