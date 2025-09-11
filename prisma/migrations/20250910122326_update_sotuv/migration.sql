/*
  Warnings:

  - You are about to drop the column `yaratilganVaqt` on the `sotuvlar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."sotuvlar" DROP COLUMN "yaratilganVaqt",
ADD COLUMN     "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
