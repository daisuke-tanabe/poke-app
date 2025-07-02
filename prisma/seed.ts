import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';

// __dirname polyfill for ESM
const dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function main() {
  // 既存データを全削除（マスタも削除）
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.formEntry.deleteMany();
  await prisma.form.deleteMany();
  await prisma.pokemon.deleteMany();
  // フォーム種別マスタ再投入
  const formMaster = [
    { id: 1, name_ja: '通常', name_en: 'Normal' },
    { id: 2, name_ja: 'メガシンカ', name_en: 'Mega' },
    { id: 3, name_ja: 'メガシンカX', name_en: 'Mega X' },
    { id: 4, name_ja: 'メガシンカY', name_en: 'Mega Y' },
    { id: 5, name_ja: 'アローラのすがた', name_en: 'Alolan Form' },
    { id: 6, name_ja: 'ガラルのすがた', name_en: 'Galarian Form' },
  ];
  await prisma.form.createMany({ data: formMaster, skipDuplicates: true });
  console.log('全データ削除・formマスタ再投入完了');

  // 全リージョン
  await prisma.region.createMany({
    data: [
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
    ],
    skipDuplicates: true,
  });
  // 全図鑑
  const pokedexes = [
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
  await prisma.pokedex.createMany({ data: pokedexes, skipDuplicates: true });
  // 全タイプ
  await prisma.type.createMany({
    data: [
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
    ],
    skipDuplicates: true,
  });
  console.log('マスタデータ投入完了');

  // --- マスタデータJSONから投入 ---
  // タイプslug→idマップ
  const typeSlugToId = {
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

  // JSONファイル読み込み
  const masterdataPath = path.join(dirname, 'pokemon-masterdata.json');
  // 型安全にパース
  const allPokemons = JSON.parse(fs.readFileSync(masterdataPath, 'utf-8')) as PokemonMaster[];
  // form_entries投入用: name_ja/name_en→form_idマップ
  const formNameToId: Record<string, number> = {};
  for (const f of formMaster) {
    formNameToId[f.name_ja] = f.id;
    formNameToId[f.name_en] = f.id;
  }

  // masterdata.jsonの形式に合わせてformエントリを生成

  type PokemonForm = {
    name_ja: string;
    name_en: string;
    sprite_default: string;
    sprite_shiny: string;
    order: number;
    types: string[];
  };
  type PokemonRegion = { slug: string; pokedex_entry_number: number };
  type PokemonMaster = {
    nationalNo: number;
    name_ja: string;
    name_kana: string;
    name_en: string;
    forms: PokemonForm[];
    regions: PokemonRegion[];
  };

  const allPokemonsTyped: PokemonMaster[] = allPokemons;
  const allFormEntries = allPokemonsTyped
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
    .filter(
      (f): f is { pokemonId: number; formId: number; sprite_default: string; sprite_shiny: string; order: number } =>
        !!f,
    );
  await prisma.pokemon.createMany({
    data: allPokemonsTyped.map((p) => ({
      id: p.nationalNo,
      name_ja: p.name_ja,
      name_kana: p.name_kana,
      name_en: p.name_en,
    })),
  });
  await prisma.formEntry.createMany({
    data: allFormEntries.map((f) => ({
      pokemon_id: f.pokemonId,
      form_id: f.formId,
      sprite_default: f.sprite_default,
      sprite_shiny: f.sprite_shiny,
      order: f.order,
    })),
  });
  console.log('pokemon・form_entries投入完了');

  // formEntry投入後、DBから全formEntryを取得し、pokemon_id, form_id, orderでマッピング

  const dbFormEntries = await prisma.formEntry.findMany();
  // pokedexEntries投入用: 各formsの(pokemon_id, form_id, order)→form_entry_idを解決
  type PokedexEntry = { pokedexId: number; entryNumber: number; formEntryId: number };
  const pokedexEntries: PokedexEntry[] = [];
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
  for (const p of allPokemonsTyped) {
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
  await prisma.pokedexEntry.createMany({
    data: pokedexEntries.map((e) => ({
      pokedex_id: e.pokedexId,
      entry_number: e.entryNumber,
      form_entry_id: e.formEntryId,
    })),
  });

  // タイプエントリ投入
  const allPokedexEntries = await prisma.pokedexEntry.findMany();
  type TypeEntry = { pokedexEntryId: number; typeId: number; formEntryId: number };
  const typeEntryData: TypeEntry[] = [];
  for (const p of allPokemonsTyped) {
    for (const f of p.forms) {
      // pokedexEntryを取得
      const pokedexEntry = allPokedexEntries.find(
        (e) =>
          e.form_entry_id &&
          dbFormEntries.some(
            (fe) => fe.id === e.form_entry_id && fe.pokemon_id === p.nationalNo && fe.order === f.order,
          ),
      );
      if (pokedexEntry) {
        for (const t of f.types) {
          // typesはslug前提
          const typeSlug = t;
          const typeId = typeSlugToId[typeSlug as keyof typeof typeSlugToId];
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
