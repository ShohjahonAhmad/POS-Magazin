-- DropForeignKey
ALTER TABLE "public"."sotuvlar" DROP CONSTRAINT "sotuvlar_mahsulot_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."sotuvlar" ADD CONSTRAINT "sotuvlar_mahsulot_id_fkey" FOREIGN KEY ("mahsulot_id") REFERENCES "public"."mahsulotlar"("mahsulot_id") ON DELETE SET NULL ON UPDATE CASCADE;
