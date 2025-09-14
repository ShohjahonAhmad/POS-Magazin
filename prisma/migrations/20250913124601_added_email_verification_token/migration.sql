-- CreateTable
CREATE TABLE "public"."email_tokens" (
    "email_token_id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "muddati" TIMESTAMP(3) NOT NULL,
    "yaratilgan_vaqt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foydalanuvchiId" INTEGER NOT NULL,

    CONSTRAINT "email_tokens_pkey" PRIMARY KEY ("email_token_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_tokens_token_key" ON "public"."email_tokens"("token");

-- AddForeignKey
ALTER TABLE "public"."email_tokens" ADD CONSTRAINT "email_tokens_foydalanuvchiId_fkey" FOREIGN KEY ("foydalanuvchiId") REFERENCES "public"."foydalanuvchilar"("foydalanuvchi_id") ON DELETE CASCADE ON UPDATE CASCADE;
