/*
  Warnings:

  - You are about to drop the column `pokemon_id` on the `PokedexEntry` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Pokemon` table. All the data in the column will be lost.
  - The primary key for the `TypeEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `entry_number` on the `TypeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `pokemon_id` on the `TypeEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pokedex_id,entry_number,pokemon_form_id]` on the table `PokedexEntry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pokedex_entry_id,type_id]` on the table `TypeEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokemon_form_id` to the `PokedexEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokedex_entry_id` to the `TypeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pokemon_form_id` to the `TypeEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PokedexEntry" DROP CONSTRAINT "PokedexEntry_pokemon_id_fkey";

-- DropForeignKey
ALTER TABLE "TypeEntry" DROP CONSTRAINT "TypeEntry_pokemon_id_fkey";

-- DropIndex
DROP INDEX "PokedexEntry_pokedex_id_entry_number_key";

-- AlterTable
ALTER TABLE "PokedexEntry" DROP COLUMN "pokemon_id",
ADD COLUMN     "pokemon_form_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pokemon" DROP COLUMN "height",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "TypeEntry" DROP CONSTRAINT "TypeEntry_pkey",
DROP COLUMN "entry_number",
DROP COLUMN "pokemon_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "pokedex_entry_id" INTEGER NOT NULL,
ADD COLUMN     "pokemon_form_id" INTEGER NOT NULL,
ADD CONSTRAINT "TypeEntry_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "PokemonForm" (
    "id" SERIAL NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "form_name" TEXT NOT NULL,

    CONSTRAINT "PokemonForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PokedexEntry_pokedex_id_entry_number_pokemon_form_id_key" ON "PokedexEntry"("pokedex_id", "entry_number", "pokemon_form_id");

-- CreateIndex
CREATE UNIQUE INDEX "TypeEntry_pokedex_entry_id_type_id_key" ON "TypeEntry"("pokedex_entry_id", "type_id");

-- AddForeignKey
ALTER TABLE "PokemonForm" ADD CONSTRAINT "PokemonForm_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_pokemon_form_id_fkey" FOREIGN KEY ("pokemon_form_id") REFERENCES "PokemonForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_pokedex_entry_id_fkey" FOREIGN KEY ("pokedex_entry_id") REFERENCES "PokedexEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_pokemon_form_id_fkey" FOREIGN KEY ("pokemon_form_id") REFERENCES "PokemonForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
