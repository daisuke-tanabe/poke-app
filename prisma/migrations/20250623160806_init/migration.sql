-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_kana" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokedex" (
    "id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Pokedex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokedexEntry" (
    "id" SERIAL NOT NULL,
    "pokedex_id" INTEGER NOT NULL,
    "pokemon_id" INTEGER NOT NULL,
    "entry_number" INTEGER NOT NULL,

    CONSTRAINT "PokedexEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeEntry" (
    "pokemon_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "entry_number" INTEGER NOT NULL,

    CONSTRAINT "TypeEntry_pkey" PRIMARY KEY ("pokemon_id","type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pokedex_slug_key" ON "Pokedex"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PokedexEntry_pokedex_id_entry_number_key" ON "PokedexEntry"("pokedex_id", "entry_number");

-- CreateIndex
CREATE UNIQUE INDEX "Type_slug_key" ON "Type"("slug");

-- AddForeignKey
ALTER TABLE "Pokedex" ADD CONSTRAINT "Pokedex_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_pokedex_id_fkey" FOREIGN KEY ("pokedex_id") REFERENCES "Pokedex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
