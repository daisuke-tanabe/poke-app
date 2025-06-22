/*
  Warnings:

  - The primary key for the `PokedexEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[pokedex_id,entry_number]` on the table `PokedexEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PokedexEntry" DROP CONSTRAINT "PokedexEntry_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PokedexEntry_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PokedexEntry_pokedex_id_entry_number_key" ON "PokedexEntry"("pokedex_id", "entry_number");
