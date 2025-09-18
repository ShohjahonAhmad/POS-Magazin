/*
  Warnings:

  - Made the column `mahsulot_id` on table `sotuvlar` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."sotuvlar" DROP CONSTRAINT "sotuvlar_mahsulot_id_fkey";

-- AlterTable
ALTER TABLE "public"."sotuvlar" ALTER COLUMN "mahsulot_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."sotuvlar" ADD CONSTRAINT "sotuvlar_mahsulot_id_fkey" FOREIGN KEY ("mahsulot_id") REFERENCES "public"."mahsulotlar"("mahsulot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
