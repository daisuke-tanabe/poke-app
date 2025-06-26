/*
  Warnings:

  - You are about to drop the column `pokemon_form_id` on the `PokedexEntry` table. All the data in the column will be lost.
  - You are about to drop the column `pokemon_form_id` on the `TypeEntry` table. All the data in the column will be lost.
  - You are about to drop the `PokemonForm` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pokedex_id,entry_number,form_id]` on the table `PokedexEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `form_id` to the `PokedexEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_id` to the `TypeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- テーブル名リネーム
ALTER TABLE "PokemonForm" RENAME TO "Form";

-- カラム名リネーム
ALTER TABLE "PokedexEntry" RENAME COLUMN "pokemon_form_id" TO "form_id";
ALTER TABLE "TypeEntry" RENAME COLUMN "pokemon_form_id" TO "form_id";

-- インデックス名リネーム
ALTER INDEX "PokedexEntry_pokedex_id_entry_number_pokemon_form_id_key" RENAME TO "PokedexEntry_pokedex_id_entry_number_form_id_key";

-- 外部キー制約名リネーム
ALTER TABLE "PokedexEntry" RENAME CONSTRAINT "PokedexEntry_pokemon_form_id_fkey" TO "PokedexEntry_form_id_fkey";
ALTER TABLE "TypeEntry" RENAME CONSTRAINT "TypeEntry_pokemon_form_id_fkey" TO "TypeEntry_form_id_fkey";
ALTER TABLE "Form" RENAME CONSTRAINT "PokemonForm_pkey" TO "Form_pkey";
ALTER TABLE "Form" RENAME CONSTRAINT "PokemonForm_pokemon_id_fkey" TO "Form_pokemon_id_fkey";
