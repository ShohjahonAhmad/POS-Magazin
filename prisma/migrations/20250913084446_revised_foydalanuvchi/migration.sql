/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `foydalanuvchilar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `foydalanuvchilar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."foydalanuvchilar" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "email_tasdiqlangan_vaqt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "foydalanuvchilar_email_key" ON "public"."foydalanuvchilar"("email");
