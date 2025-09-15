-- CreateEnum
CREATE TYPE "public"."Valyuta" AS ENUM ('UZS', 'USD', 'RUB', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN');

-- CreateTable
CREATE TABLE "public"."mahsulotlar" (
    "mahsulot_id" TEXT NOT NULL,
    "nomi" TEXT NOT NULL,
    "olinganNarx" DECIMAL(10,2) NOT NULL,
    "sotishNarx" DECIMAL(10,2) NOT NULL,
    "miqdor" INTEGER NOT NULL,
    "razmer" TEXT,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilangan_vaqt" TIMESTAMP(3) NOT NULL,
    "kategoriyaId" INTEGER NOT NULL,

    CONSTRAINT "mahsulotlar_pkey" PRIMARY KEY ("mahsulot_id")
);

-- CreateTable
CREATE TABLE "public"."kategoriyalar" (
    "kategoriya_id" SERIAL NOT NULL,
    "nomi" TEXT NOT NULL,

    CONSTRAINT "kategoriyalar_pkey" PRIMARY KEY ("kategoriya_id")
);

-- CreateTable
CREATE TABLE "public"."foydalanuvchilar" (
    "foydalanuvchi_id" SERIAL NOT NULL,
    "ism" TEXT NOT NULL,
    "familiya" TEXT NOT NULL,
    "parol" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_tasdiqlangan_vaqt" TIMESTAMP(3),
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "yangilangan_vaqt" TIMESTAMP(3) NOT NULL,
    "role" "public"."Role",

    CONSTRAINT "foydalanuvchilar_pkey" PRIMARY KEY ("foydalanuvchi_id")
);

-- CreateTable
CREATE TABLE "public"."rasxodlar" (
    "rasxod_id" SERIAL NOT NULL,
    "summa" DECIMAL(10,2) NOT NULL,
    "izoh" TEXT NOT NULL,
    "kun" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valyuta" "public"."Valyuta" NOT NULL DEFAULT 'UZS',

    CONSTRAINT "rasxodlar_pkey" PRIMARY KEY ("rasxod_id")
);

-- CreateTable
CREATE TABLE "public"."sotuvlar" (
    "sotuv_id" SERIAL NOT NULL,
    "mahsulot_id" TEXT NOT NULL,
    "mahsulot_nomi" TEXT NOT NULL,
    "miqdor" INTEGER NOT NULL,
    "tushum" DECIMAL(10,2) NOT NULL,
    "valyuta" "public"."Valyuta" NOT NULL DEFAULT 'UZS',
    "yaratilganVaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sotuvlar_pkey" PRIMARY KEY ("sotuv_id")
);

-- CreateTable
CREATE TABLE "public"."email_tokens" (
    "email_token_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "muddati" TIMESTAMP(3) NOT NULL,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foydalanuvchiId" INTEGER NOT NULL,

    CONSTRAINT "email_tokens_pkey" PRIMARY KEY ("email_token_id")
);

-- CreateTable
CREATE TABLE "public"."RefreshToken" (
    "refresh_token_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foydalanuvchiId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("refresh_token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kategoriyalar_nomi_key" ON "public"."kategoriyalar"("nomi");

-- CreateIndex
CREATE UNIQUE INDEX "foydalanuvchilar_email_key" ON "public"."foydalanuvchilar"("email");

-- CreateIndex
CREATE UNIQUE INDEX "email_tokens_token_key" ON "public"."email_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "public"."RefreshToken"("token");

-- AddForeignKey
ALTER TABLE "public"."mahsulotlar" ADD CONSTRAINT "mahsulotlar_kategoriyaId_fkey" FOREIGN KEY ("kategoriyaId") REFERENCES "public"."kategoriyalar"("kategoriya_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sotuvlar" ADD CONSTRAINT "sotuvlar_mahsulot_id_fkey" FOREIGN KEY ("mahsulot_id") REFERENCES "public"."mahsulotlar"("mahsulot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."email_tokens" ADD CONSTRAINT "email_tokens_foydalanuvchiId_fkey" FOREIGN KEY ("foydalanuvchiId") REFERENCES "public"."foydalanuvchilar"("foydalanuvchi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_foydalanuvchiId_fkey" FOREIGN KEY ("foydalanuvchiId") REFERENCES "public"."foydalanuvchilar"("foydalanuvchi_id") ON DELETE CASCADE ON UPDATE CASCADE;
