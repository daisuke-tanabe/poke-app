-- 統合マイグレーション: 2025-07-03_init

-- 1. Pokemon, Form, Region, Pokedex, Type テーブル作成
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_kana" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Region" (
    "id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Pokedex" (
    "id" INTEGER NOT NULL,
    "region_id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Pokedex_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Type" (
    "id" INTEGER NOT NULL,
    "name_ja" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- 2. FormEntryテーブル作成
CREATE TABLE "FormEntry" (
    "id" SERIAL PRIMARY KEY,
    "pokemon_id" INTEGER NOT NULL,
    "form_id" INTEGER NOT NULL,
    "sprite_default" TEXT NOT NULL,
    "sprite_shiny" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- 3. PokedexEntry, TypeEntryテーブル作成
CREATE TABLE "PokedexEntry" (
    "id" SERIAL NOT NULL,
    "pokedex_id" INTEGER NOT NULL,
    "form_entry_id" INTEGER NOT NULL,
    "entry_number" INTEGER NOT NULL,
    CONSTRAINT "PokedexEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TypeEntry" (
    "id" SERIAL NOT NULL,
    "pokedex_entry_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "form_entry_id" INTEGER NOT NULL,
    CONSTRAINT "TypeEntry_pkey" PRIMARY KEY ("id")
);

-- 4. インデックス・ユニーク制約
CREATE UNIQUE INDEX "FormEntry_pokemon_id_order_key" ON "FormEntry"("pokemon_id", "order");
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");
CREATE UNIQUE INDEX "Pokedex_slug_key" ON "Pokedex"("slug");
CREATE UNIQUE INDEX "PokedexEntry_pokedex_id_entry_number_form_entry_id_key" ON "PokedexEntry"("pokedex_id", "entry_number", "form_entry_id");
CREATE UNIQUE INDEX "Type_slug_key" ON "Type"("slug");
CREATE UNIQUE INDEX "TypeEntry_pokedex_entry_id_type_id_key" ON "TypeEntry"("pokedex_entry_id", "type_id");

-- 5. 外部キー制約
ALTER TABLE "FormEntry" ADD CONSTRAINT "FormEntry_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FormEntry" ADD CONSTRAINT "FormEntry_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Pokedex" ADD CONSTRAINT "Pokedex_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_pokedex_id_fkey" FOREIGN KEY ("pokedex_id") REFERENCES "Pokedex"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PokedexEntry" ADD CONSTRAINT "PokedexEntry_form_entry_id_fkey" FOREIGN KEY ("form_entry_id") REFERENCES "FormEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_pokedex_entry_id_fkey" FOREIGN KEY ("pokedex_entry_id") REFERENCES "PokedexEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TypeEntry" ADD CONSTRAINT "TypeEntry_form_entry_id_fkey" FOREIGN KEY ("form_entry_id") REFERENCES "FormEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
