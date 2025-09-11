-- CreateTable
CREATE TABLE "public"."Sotuv" (
    "sotuv_id" SERIAL NOT NULL,
    "mahsulot_id" TEXT NOT NULL,
    "mahsulot_nomi" TEXT NOT NULL,
    "miqdor" INTEGER NOT NULL,
    "tushum" DECIMAL(10,2) NOT NULL,
    "valyuta" "public"."Valyuta" NOT NULL DEFAULT 'UZS',
    "yaratilganVaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sotuv_pkey" PRIMARY KEY ("sotuv_id")
);

-- AddForeignKey
ALTER TABLE "public"."Sotuv" ADD CONSTRAINT "Sotuv_mahsulot_id_fkey" FOREIGN KEY ("mahsulot_id") REFERENCES "public"."mahsulotlar"("mahsulot_id") ON DELETE RESTRICT ON UPDATE CASCADE;
