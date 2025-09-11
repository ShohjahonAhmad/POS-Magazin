/*
  Warnings:

  - You are about to drop the column `yaratilgan_vaqt` on the `sotuvlar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."sotuvlar" DROP COLUMN "yaratilgan_vaqt",
ADD COLUMN     "yaratilganVaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
