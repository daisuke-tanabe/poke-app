-- AlterTable
ALTER TABLE "public"."Form" ADD COLUMN     "region_id" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
