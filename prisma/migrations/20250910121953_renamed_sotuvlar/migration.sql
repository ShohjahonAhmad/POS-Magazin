/*
  Warnings:

  - You are about to drop the `Sotuv` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Sotuv" DROP CONSTRAINT "Sotuv_mahsulot_id_fkey";

-- DropTable
DROP TABLE "public"."Sotuv";

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

-- AddForeignKey
ALTER TABLE "public"."sotuvlar" ADD CONSTRAINT "sotuvlar_mahsulot_id_fkey" FOREIGN KEY ("mahsulot_id") REFERENCES "public"."mahsulotlar"("mahsulot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
