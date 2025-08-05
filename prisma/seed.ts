import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';

// __dirname polyfill for ESM
const dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

// 型定義（マスターデータ読み込み用）
type Region = {
  id: number;
  name_ja: string;
  name_en: string;
  slug: string;
};

type Pokedex = {
  id: number;
  region_id: number;
  name_ja: string;
  name_en: string;
  slug: string;
};

type Type = {
  id: number;
  name_ja: string;
  name_en: string;
  slug: string;
};

type Form = {
  id: number;
  name_ja: string;
  name_en: string;
};

// 統合型マスターデータの型定義
type TypeEntryNested = {
  id: number;
  type_id: number;
};

type PokedexEntryNested = {
  id: number;
  pokedex_id: number;
  entry_number: number;
  typeEntries: TypeEntryNested[];
};

type FormEntryNested = {
  id: number;
  form_id: number;
  sprite_default: string;
  sprite_shiny: string;
  order: number;
  pokedexEntries: PokedexEntryNested[];
};

type PokemonNested = {
  id: number;
  name_ja: string;
  name_kana: string;
  name_en: string;
  formEntries: FormEntryNested[];
};

// フラット型（Prisma投入用）
type Pokemon = {
  id: number;
  name_ja: string;
  name_kana: string;
  name_en: string;
};

type FormEntry = {
  id: number;
  pokemon_id: number;
  form_id: number;
  sprite_default: string;
  sprite_shiny: string;
  order: number;
};

type PokedexEntry = {
  id: number;
  pokedex_id: number;
  form_entry_id: number;
  entry_number: number;
};

type TypeEntry = {
  id: number;
  pokedex_entry_id: number;
  type_id: number;
  form_entry_id: number;
};

// マスターデータ読み込み関数
const loadMasterData = <T>(filename: string): T[] => {
  const filePath = path.join(dirname, 'masterdata', filename);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData) as T[];
};

// 統合ファイルからフラットデータを生成する関数
const flattenPokemonData = (nestedPokemons: PokemonNested[]) => {
  const pokemons: Pokemon[] = [];
  const formEntries: FormEntry[] = [];
  const pokedexEntries: PokedexEntry[] = [];
  const typeEntries: TypeEntry[] = [];

  nestedPokemons.forEach((pokemon) => {
    // Pokemon データ
    pokemons.push({
      id: pokemon.id,
      name_ja: pokemon.name_ja,
      name_kana: pokemon.name_kana,
      name_en: pokemon.name_en,
    });

    pokemon.formEntries.forEach((formEntry) => {
      // FormEntry データ
      formEntries.push({
        id: formEntry.id,
        pokemon_id: pokemon.id,
        form_id: formEntry.form_id,
        sprite_default: formEntry.sprite_default,
        sprite_shiny: formEntry.sprite_shiny,
        order: formEntry.order,
      });

      formEntry.pokedexEntries.forEach((pokedexEntry) => {
        // PokedexEntry データ
        pokedexEntries.push({
          id: pokedexEntry.id,
          pokedex_id: pokedexEntry.pokedex_id,
          form_entry_id: formEntry.id,
          entry_number: pokedexEntry.entry_number,
        });

        pokedexEntry.typeEntries.forEach((typeEntry) => {
          // TypeEntry データ
          typeEntries.push({
            id: typeEntry.id,
            pokedex_entry_id: pokedexEntry.id,
            type_id: typeEntry.type_id,
            form_entry_id: formEntry.id,
          });
        });
      });
    });
  });

  return { pokemons, formEntries, pokedexEntries, typeEntries };
};

async function main() {
  console.log('マスターデータ読み込み開始...');

  // マスターデータ読み込み
  const regions = loadMasterData<Region>('regions.json');
  const pokedexes = loadMasterData<Pokedex>('pokedexes.json');
  const types = loadMasterData<Type>('types.json');
  const forms = loadMasterData<Form>('forms.json');

  // 統合ファイルを読み込み、フラットデータに変換
  const nestedPokemons = loadMasterData<PokemonNested>('pokemons-all.json');
  const { pokemons, formEntries, pokedexEntries, typeEntries } = flattenPokemonData(nestedPokemons);

  console.log('既存データ削除開始...');

  // 既存データの削除（外部キー制約を考慮した順序で実行）
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.formEntry.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.form.deleteMany();
  await prisma.pokedex.deleteMany();
  await prisma.region.deleteMany();
  await prisma.type.deleteMany();

  console.log('マスターデータ投入開始...');

  // マスターデータ投入
  await prisma.region.createMany({ data: regions, skipDuplicates: true });
  await prisma.pokedex.createMany({ data: pokedexes, skipDuplicates: true });
  await prisma.type.createMany({ data: types, skipDuplicates: true });
  await prisma.form.createMany({ data: forms, skipDuplicates: true });
  await prisma.pokemon.createMany({ data: pokemons, skipDuplicates: true });
  await prisma.formEntry.createMany({ data: formEntries, skipDuplicates: true });
  await prisma.pokedexEntry.createMany({ data: pokedexEntries, skipDuplicates: true });
  await prisma.typeEntry.createMany({ data: typeEntries, skipDuplicates: true });

  console.log('マスターデータ投入完了');
  console.log(`- Regions: ${regions.length} 件`);
  console.log(`- Pokedexes: ${pokedexes.length} 件`);
  console.log(`- Types: ${types.length} 件`);
  console.log(`- Forms: ${forms.length} 件`);
  console.log(`- Pokemons: ${pokemons.length} 件`);
  console.log(`- FormEntries: ${formEntries.length} 件`);
  console.log(`- PokedexEntries: ${pokedexEntries.length} 件`);
  console.log(`- TypeEntries: ${typeEntries.length} 件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
