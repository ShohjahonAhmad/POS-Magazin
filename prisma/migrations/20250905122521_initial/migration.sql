-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "public"."mahsulotlar" (
    "mahsulot_id" TEXT NOT NULL,
    "nomi" TEXT NOT NULL,
    "olinganNarx" DECIMAL(10,2) NOT NULL,
    "sotishNarx" DECIMAL(10,2) NOT NULL,
    "midqor" INTEGER NOT NULL,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilangan_vaqt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahsulotlar_pkey" PRIMARY KEY ("mahsulot_id")
);

-- CreateTable
CREATE TABLE "public"."foydalanuvchilar" (
    "foydalanuvchi_id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilangan_vaqt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role",

    CONSTRAINT "foydalanuvchilar_pkey" PRIMARY KEY ("foydalanuvchi_id")
);
