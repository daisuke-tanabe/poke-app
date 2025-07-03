import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';

// __dirname polyfill for ESM
const dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// 型定義
type PokemonForm = {
  name_ja: string;
  name_en: string;
  sprite_default: string;
  sprite_shiny: string;
  order: number;
  types: string[];
};

type PokemonRegion = {
  slug: string;
  pokedex_entry_number: number;
};

type PokemonMaster = {
  nationalNo: number;
  name_ja: string;
  name_kana: string;
  name_en: string;
  forms: PokemonForm[];
  regions: PokemonRegion[];
};

type FormEntryData = {
  pokemonId: number;
  formId: number;
  sprite_default: string;
  sprite_shiny: string;
  order: number;
};

type DbFormEntry = {
  id: number;
  pokemon_id: number;
  form_id: number;
  sprite_default: string;
  sprite_shiny: string;
  order: number;
};

type PokedexEntryData = {
  pokedexId: number;
  entryNumber: number;
  formEntryId: number;
};

type DbPokedexEntry = {
  id: number;
  pokedex_id: number;
  form_entry_id: number;
  entry_number: number;
};

type TypeEntryData = {
  pokedexEntryId: number;
  typeId: number;
  formEntryId: number;
};

// 定数
const formMaster = [
  { id: 1, name_ja: '通常', name_en: 'Normal' },
  { id: 2, name_ja: 'メガシンカ', name_en: 'Mega' },
  { id: 3, name_ja: 'メガシンカX', name_en: 'Mega X' },
  { id: 4, name_ja: 'メガシンカY', name_en: 'Mega Y' },
  { id: 5, name_ja: 'アローラのすがた', name_en: 'Alolan Form' },
  { id: 6, name_ja: 'ガラルのすがた', name_en: 'Galarian Form' },
];

const regionMaster = [
  { id: 1, name_ja: '全国', name_en: 'Global', slug: 'global' },
  { id: 10, name_ja: 'カントー', name_en: 'Kanto', slug: 'kanto' },
  { id: 20, name_ja: 'ジョウト', name_en: 'Johto', slug: 'johto' },
  { id: 30, name_ja: 'ホウエン', name_en: 'Hoeen', slug: 'hoeen' },
  { id: 40, name_ja: 'シンオウ', name_en: 'Sinnoh', slug: 'sinnoh' },
  { id: 50, name_ja: 'イッシュ', name_en: 'Unova', slug: 'unova' },
  { id: 60, name_ja: 'カロス', name_en: 'Kalos', slug: 'kalos' },
  { id: 70, name_ja: 'アローラ', name_en: 'Alola', slug: 'alola' },
  { id: 80, name_ja: 'ヒスイ', name_en: 'Hisui', slug: 'hisui' },
  { id: 90, name_ja: 'ガラル', name_en: 'Galar', slug: 'galar' },
  { id: 100, name_ja: 'パルデア', name_en: 'Paldea', slug: 'paldea' },
];

const pokedexMaster = [
  { id: 1, region_id: 1, name_ja: '全国', name_en: 'National', slug: 'national' },
  { id: 10, region_id: 10, name_ja: 'カントー', name_en: 'Kanto', slug: 'kanto' },
  { id: 20, region_id: 20, name_ja: 'ジョウト', name_en: 'Johto', slug: 'johto' },
  { id: 30, region_id: 30, name_ja: 'ホウエン', name_en: 'Hoeen', slug: 'hoeen' },
  { id: 40, region_id: 40, name_ja: 'シンオウ', name_en: 'Sinnoh', slug: 'sinnoh' },
  { id: 50, region_id: 50, name_ja: 'イッシュ', name_en: 'Unova', slug: 'unova' },
  { id: 60, region_id: 60, name_ja: 'カロス', name_en: 'Kalos', slug: 'kalos' },
  { id: 70, region_id: 70, name_ja: 'アローラ', name_en: 'Alola', slug: 'alola' },
  { id: 71, region_id: 70, name_ja: 'メレメレ', name_en: 'Melemele', slug: 'melemele' },
  { id: 72, region_id: 70, name_ja: 'アーカラ', name_en: 'Akala', slug: 'akala' },
  { id: 73, region_id: 70, name_ja: 'ウラウラ', name_en: "Ula'ula", slug: 'ulaula' },
  { id: 74, region_id: 70, name_ja: 'ポニ', name_en: 'Poni', slug: 'poni' },
  { id: 80, region_id: 80, name_ja: 'ヒスイ', name_en: 'Hisui', slug: 'hisui' },
  { id: 90, region_id: 90, name_ja: 'ガラル', name_en: 'Galar', slug: 'galar' },
  { id: 91, region_id: 90, name_ja: 'ヨロイじま', name_en: 'Isle of Armor', slug: 'isle-of-armor' },
  { id: 92, region_id: 90, name_ja: 'カンムリせつげん', name_en: 'Crown Tundra', slug: 'crown-tundra' },
  { id: 100, region_id: 100, name_ja: 'パルデア', name_en: 'Paldea', slug: 'paldea' },
  { id: 101, region_id: 100, name_ja: 'キタカミ', name_en: 'Kitakami', slug: 'kitakami' },
  { id: 102, region_id: 100, name_ja: 'ブルーベリー', name_en: 'Blueberry', slug: 'blueberry' },
];

const typeMaster = [
  { id: 10, name_ja: 'ノーマル', name_en: 'Normal', slug: 'normal' },
  { id: 20, name_ja: 'ほのお', name_en: 'Fire', slug: 'fire' },
  { id: 30, name_ja: 'みず', name_en: 'Water', slug: 'water' },
  { id: 40, name_ja: 'でんき', name_en: 'Electric', slug: 'electric' },
  { id: 50, name_ja: 'くさ', name_en: 'Grass', slug: 'grass' },
  { id: 60, name_ja: 'こおり', name_en: 'Ice', slug: 'ice' },
  { id: 70, name_ja: 'かくとう', name_en: 'Fighting', slug: 'fighting' },
  { id: 80, name_ja: 'どく', name_en: 'Poison', slug: 'poison' },
  { id: 90, name_ja: 'じめん', name_en: 'Ground', slug: 'ground' },
  { id: 100, name_ja: 'ひこう', name_en: 'Flying', slug: 'flying' },
  { id: 110, name_ja: 'エスパー', name_en: 'Psychic', slug: 'psychic' },
  { id: 120, name_ja: 'むし', name_en: 'Bug', slug: 'bug' },
  { id: 130, name_ja: 'いわ', name_en: 'Rock', slug: 'rock' },
  { id: 140, name_ja: 'ゴースト', name_en: 'Ghost', slug: 'ghost' },
  { id: 150, name_ja: 'ドラゴン', name_en: 'Dragon', slug: 'dragon' },
  { id: 160, name_ja: 'あく', name_en: 'Dark', slug: 'dark' },
  { id: 170, name_ja: 'はがね', name_en: 'Steel', slug: 'steel' },
  { id: 180, name_ja: 'フェアリー', name_en: 'Fairy', slug: 'fairy' },
];

const typeSlugToId: Record<string, number> = {
  normal: 10,
  fire: 20,
  water: 30,
  electric: 40,
  grass: 50,
  ice: 60,
  fighting: 70,
  poison: 80,
  ground: 90,
  flying: 100,
  psychic: 110,
  bug: 120,
  rock: 130,
  ghost: 140,
  dragon: 150,
  dark: 160,
  steel: 170,
  fairy: 180,
};

const pokedexSlugToId: Record<string, number> = {
  national: 1,
  kanto: 10,
  johto: 20,
  hoeen: 30,
  sinnoh: 40,
  unova: 50,
  kalos: 60,
  alola: 70,
  hisui: 80,
  galar: 90,
  paldea: 100,
  kitakami: 101,
  blueberry: 102,
};

/**
 * 既存データの削除と基本マスタデータの再構築
 */
async function resetDatabase(): Promise<void> {
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.formEntry.deleteMany();
  await prisma.form.deleteMany();
  await prisma.pokemon.deleteMany();

  await prisma.form.createMany({ data: formMaster, skipDuplicates: true });
  console.log('全データ削除・formマスタ再投入完了');
}

/**
 * リージョンマスタデータの投入
 */
async function seedRegions(): Promise<void> {
  await prisma.region.createMany({
    data: regionMaster,
    skipDuplicates: true,
  });
}

/**
 * 図鑑マスタデータの投入
 */
async function seedPokedexes(): Promise<void> {
  await prisma.pokedex.createMany({
    data: pokedexMaster,
    skipDuplicates: true,
  });
}

/**
 * タイプマスタデータの投入
 */
async function seedTypes(): Promise<void> {
  await prisma.type.createMany({
    data: typeMaster,
    skipDuplicates: true,
  });
}

/**
 * 全マスタデータの投入処理
 */
async function seedMasterData(): Promise<void> {
  await seedRegions();
  await seedPokedexes();
  await seedTypes();
  console.log('マスタデータ投入完了');
}

/**
 * マスタデータJSONファイルの読み込み
 */
function readPokemonMasterData(): PokemonMaster[] {
  const masterdataPath = path.join(dirname, 'pokemon-masterdata.json');
  return JSON.parse(fs.readFileSync(masterdataPath, 'utf-8')) as PokemonMaster[];
}

/**
 * フォーム名→フォームIDマッピングの生成
 */
function createFormNameToIdMap(): Record<string, number> {
  const formNameToId: Record<string, number> = {};
  for (const f of formMaster) {
    formNameToId[f.name_ja] = f.id;
    formNameToId[f.name_en] = f.id;
  }
  return formNameToId;
}

/**
 * フォームエントリデータの生成（ポケモンのフォーム情報から）
 */
function generateFormEntries(pokemonMasters: PokemonMaster[], formNameToId: Record<string, number>): FormEntryData[] {
  const formEntries = pokemonMasters
    .flatMap((p) =>
      p.forms.map((f) => {
        let formKey = f.name_ja;
        if (!formNameToId[formKey]) formKey = f.name_en;
        if (!formNameToId[formKey]) {
          console.warn('masterdata: invalid formId', { p, f, formKey });
          return null;
        }
        const formId = formNameToId[formKey];
        return {
          pokemonId: p.nationalNo,
          formId: formId,
          sprite_default: f.sprite_default ?? '',
          sprite_shiny: f.sprite_shiny ?? '',
          order: f.order,
        };
      }),
    )
    .filter((f): f is FormEntryData => !!f);

  return formEntries;
}

/**
 * ポケモンマスタとフォームエントリの投入
 */
async function seedPokemonData(pokemonMasters: PokemonMaster[]): Promise<void> {
  const formNameToId = createFormNameToIdMap();
  const formEntries = generateFormEntries(pokemonMasters, formNameToId);

  await prisma.pokemon.createMany({
    data: pokemonMasters.map((p) => ({
      id: p.nationalNo,
      name_ja: p.name_ja,
      name_kana: p.name_kana,
      name_en: p.name_en,
    })),
  });

  await prisma.formEntry.createMany({
    data: formEntries.map((f) => ({
      pokemon_id: f.pokemonId,
      form_id: f.formId,
      sprite_default: f.sprite_default,
      sprite_shiny: f.sprite_shiny,
      order: f.order,
    })),
  });

  console.log('pokemon・form_entries投入完了');
}

/**
 * 図鑑エントリデータの生成
 */
function generatePokedexEntries(
  pokemonMasters: PokemonMaster[],
  dbFormEntries: DbFormEntry[],
  formNameToId: Record<string, number>,
): PokedexEntryData[] {
  const pokedexEntries: PokedexEntryData[] = [];

  for (const p of pokemonMasters) {
    for (const region of p.regions) {
      for (const f of p.forms) {
        let formKey = f.name_ja;
        if (!formNameToId[formKey]) formKey = f.name_en;
        const formId = formNameToId[formKey];
        const entry = dbFormEntries.find(
          (e) => e.pokemon_id === p.nationalNo && e.form_id === formId && e.order === f.order,
        );
        if (!entry) {
          console.warn('pokedexEntry: formEntry not found', { p_id: p.nationalNo, formId, order: f.order });
          continue;
        }
        const pokedexId = pokedexSlugToId[region.slug] ?? 1;
        pokedexEntries.push({
          pokedexId,
          entryNumber: region.pokedex_entry_number,
          formEntryId: entry.id,
        });
      }
    }
  }

  return pokedexEntries;
}

/**
 * 図鑑エントリの投入
 */
async function seedPokedexEntries(pokemonMasters: PokemonMaster[]): Promise<void> {
  const dbFormEntries = await prisma.formEntry.findMany();
  const formNameToId = createFormNameToIdMap();
  const pokedexEntries = generatePokedexEntries(pokemonMasters, dbFormEntries, formNameToId);

  await prisma.pokedexEntry.createMany({
    data: pokedexEntries.map((e) => ({
      pokedex_id: e.pokedexId,
      entry_number: e.entryNumber,
      form_entry_id: e.formEntryId,
    })),
  });
}

/**
 * タイプエントリデータの生成
 */
function generateTypeEntries(
  pokemonMasters: PokemonMaster[],
  allPokedexEntries: DbPokedexEntry[],
  dbFormEntries: DbFormEntry[],
): TypeEntryData[] {
  const typeEntryData: TypeEntryData[] = [];

  for (const p of pokemonMasters) {
    for (const f of p.forms) {
      const pokedexEntry = allPokedexEntries.find(
        (e) =>
          e.form_entry_id &&
          dbFormEntries.some(
            (fe) => fe.id === e.form_entry_id && fe.pokemon_id === p.nationalNo && fe.order === f.order,
          ),
      );
      if (pokedexEntry) {
        for (const t of f.types) {
          const typeSlug = t;
          const typeId = typeSlugToId[typeSlug];
          if (!typeId) {
            console.warn('typeEntry: invalid type', { t, typeSlug, p, f });
            continue;
          }
          const formEntryId = dbFormEntries.find((fe) => fe.pokemon_id === p.nationalNo && fe.order === f.order)?.id;
          if (formEntryId) {
            typeEntryData.push({
              pokedexEntryId: pokedexEntry.id,
              typeId,
              formEntryId,
            });
          }
        }
      }
    }
  }

  return typeEntryData;
}

/**
 * タイプエントリの重複排除と投入
 */
async function seedTypeEntries(pokemonMasters: PokemonMaster[]): Promise<void> {
  const allPokedexEntries = await prisma.pokedexEntry.findMany();
  const dbFormEntries = await prisma.formEntry.findMany();
  const typeEntryData = generateTypeEntries(pokemonMasters, allPokedexEntries, dbFormEntries);

  // 重複排除
  const uniqueTypeEntryData = Array.from(
    new Map(typeEntryData.map((e) => [`${e.pokedexEntryId}_${e.typeId}`, e])).values(),
  );

  await prisma.typeEntry.createMany({
    data: uniqueTypeEntryData.map((e) => ({
      pokedex_entry_id: e.pokedexEntryId,
      type_id: e.typeId,
      form_entry_id: e.formEntryId,
    })),
  });

  console.log(`typeEntry投入完了: ${uniqueTypeEntryData.length}件`);
}

async function main() {
  await resetDatabase();
  await seedMasterData();

  const pokemonMasters = readPokemonMasterData();
  await seedPokemonData(pokemonMasters);
  await seedPokedexEntries(pokemonMasters);
  await seedTypeEntries(pokemonMasters);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
