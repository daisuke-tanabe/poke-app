/*
  Warnings:

  - Made the column `region_id` on table `Form` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Form" DROP CONSTRAINT "Form_region_id_fkey";

-- AlterTable
ALTER TABLE "public"."Form" ALTER COLUMN "region_id" SET NOT NULL,
ALTER COLUMN "region_id" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "public"."Form" ADD CONSTRAINT "Form_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
