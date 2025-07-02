/*
  Warnings:

  - You are about to drop the column `order` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `pokemon_id` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `sprite` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `form_id` on the `PokedexEntry` table. All the data in the column will be lost.
  - You are about to drop the column `form_id` on the `TypeEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pokedex_id,entry_number,form_entry_id]` on the table `PokedexEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `form_entry_id` to the `PokedexEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_entry_id` to the `TypeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_pokemon_id_fkey";

-- DropForeignKey
ALTER TABLE "PokedexEntry" DROP CONSTRAINT "PokedexEntry_form_id_fkey";

-- DropForeignKey
ALTER TABLE "TypeEntry" DROP CONSTRAINT "TypeEntry_form_id_fkey";

-- DropIndex
DROP INDEX "Form_pokemon_id_order_key";

-- DropIndex
DROP INDEX "PokedexEntry_pokedex_id_entry_number_form_id_key";

-- 1. FormEntryテーブル作成
CREATE TABLE "FormEntry" (
    "id" SERIAL PRIMARY KEY,
    "pokemon_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "sprite" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- 2. 既存FormデータをFormEntryに移行
INSERT INTO "FormEntry" (pokemon_id, form_id, sprite, "order")
SELECT pokemon_id, id, sprite, "order" FROM "Form";

-- 3. PokedexEntry/TypeEntryにform_entry_idカラムをNULL許容で追加
ALTER TABLE "PokedexEntry" ADD COLUMN "form_entry_id" INTEGER;
ALTER TABLE "TypeEntry" ADD COLUMN "form_entry_id" INTEGER;

-- 4. PokedexEntry/TypeEntryのform_entry_idをセット
UPDATE "PokedexEntry" pe
SET form_entry_id = fe.id
FROM "FormEntry" fe, "Form" f
WHERE pe.form_id = f.id
  AND fe.form_id = f.id
  AND fe.pokemon_id = f.pokemon_id;

UPDATE "TypeEntry" te
SET form_entry_id = pe.form_entry_id
FROM "PokedexEntry" pe
WHERE te.pokedex_entry_id = pe.id;

-- 5. 旧カラム削除
ALTER TABLE "Form" DROP COLUMN "order";
ALTER TABLE "Form" DROP COLUMN "pokemon_id";
ALTER TABLE "Form" DROP COLUMN "sprite";
ALTER TABLE "PokedexEntry" DROP COLUMN "form_id";
ALTER TABLE "TypeEntry" DROP COLUMN "form_id";

-- 6. form_entry_idをNOT NULLに変更
ALTER TABLE "PokedexEntry" ALTER COLUMN "form_entry_id" SET NOT NULL;
ALTER TABLE "TypeEntry" ALTER COLUMN "form_entry_id" SET NOT NULL;

-- 7. インデックス・制約再作成
CREATE UNIQUE INDEX "FormEntry_pokemon_id_order_key" ON "FormEntry"("pokemon_id", "order");
CREATE UNIQUE INDEX "PokedexEntry_pokedex_id_entry_number_form_entry_id_key" ON "PokedexEntry"("pokedex_id", "entry_number", "form_entry_id");

-- 8. 外部キー制約
ALTER TABLE "FormEntry" ADD CONSTRAINT "FormEntry_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FormEntry" ADD CONSTRAINT "FormEntry_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_form_entry_id_fkey" FOREIGN KEY ("form_entry_id") REFERENCES "FormEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_form_entry_id_fkey" FOREIGN KEY ("form_entry_id") REFERENCES "FormEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
