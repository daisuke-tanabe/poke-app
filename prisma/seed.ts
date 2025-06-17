import { PrismaClient } from '../src/generated/prisma';
const prisma = new PrismaClient();

async function main() {
  // 既存データを全削除
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.type.deleteMany();
  await prisma.pokedex.deleteMany();
  await prisma.region.deleteMany();

  // 地方
  await prisma.region.createMany({
    data: [
      { id: 1, name_ja: '全国', name_en: 'Global' },
      { id: 10, name_ja: 'カントー', name_en: 'Kanto' },
    ],
  });
  // 図鑑
  await prisma.pokedex.createMany({
    data: [
      { id: 1, region_id: 1, name_ja: '全国', name_en: 'National' },
      { id: 10, region_id: 10, name_ja: 'カントー', name_en: 'Kanto' },
    ],
  });
  // タイプ
  await prisma.type.createMany({
    data: [
      { id: 10, name_ja: 'ノーマル', name_en: 'Normal' },
      { id: 20, name_ja: 'ほのお', name_en: 'Fire' },
      { id: 30, name_ja: 'みず', name_en: 'Water' },
      { id: 50, name_ja: 'くさ', name_en: 'Grass' },
      { id: 120, name_ja: 'むし', name_en: 'Bug' },
    ],
  });
  // ポケモン10匹
  await prisma.pokemon.createMany({
    data: [
      { id: 1, name_ja: 'フシギダネ', name_kana: 'Fushigidane', name_en: 'Bulbasaur', height: 0.7, weight: 6.9 },
      { id: 2, name_ja: 'フシギソウ', name_kana: 'Fushigisou', name_en: 'Ivysaur', height: 1.0, weight: 13.0 },
      { id: 3, name_ja: 'フシギバナ', name_kana: 'Fushigibana', name_en: 'Venusaur', height: 2.0, weight: 100.0 },
      { id: 4, name_ja: 'ヒトカゲ', name_kana: 'Hitokage', name_en: 'Charmander', height: 0.6, weight: 8.5 },
      { id: 5, name_ja: 'リザード', name_kana: 'Lizardo', name_en: 'Charmeleon', height: 1.1, weight: 19.0 },
      { id: 6, name_ja: 'リザードン', name_kana: 'Lizardon', name_en: 'Charizard', height: 1.7, weight: 90.5 },
      { id: 7, name_ja: 'ゼニガメ', name_kana: 'Zenigame', name_en: 'Squirtle', height: 0.5, weight: 9.0 },
      { id: 8, name_ja: 'カメール', name_kana: 'Kameil', name_en: 'Wartortle', height: 1.0, weight: 22.5 },
      { id: 9, name_ja: 'カメックス', name_kana: 'Kamex', name_en: 'Blastoise', height: 1.6, weight: 85.5 },
      { id: 10, name_ja: 'キャタピー', name_kana: 'Caterpie', name_en: 'Caterpie', height: 0.3, weight: 2.9 },
    ],
  });
  // 図鑑エントリ
  await prisma.pokedexEntry.createMany({
    data: [
      { pokemon_id: 1, pokedex_id: 1, entry_number: 1 },
      { pokemon_id: 2, pokedex_id: 1, entry_number: 2 },
      { pokemon_id: 3, pokedex_id: 1, entry_number: 3 },
      { pokemon_id: 4, pokedex_id: 1, entry_number: 4 },
      { pokemon_id: 5, pokedex_id: 1, entry_number: 5 },
      { pokemon_id: 6, pokedex_id: 1, entry_number: 6 },
      { pokemon_id: 7, pokedex_id: 1, entry_number: 7 },
      { pokemon_id: 8, pokedex_id: 1, entry_number: 8 },
      { pokemon_id: 9, pokedex_id: 1, entry_number: 9 },
      { pokemon_id: 10, pokedex_id: 1, entry_number: 10 },
    ],
  });
  // タイプエントリ
  await prisma.typeEntry.createMany({
    data: [
      { pokemon_id: 1, type_id: 50, entry_number: 1 }, // くさ
      { pokemon_id: 1, type_id: 10, entry_number: 2 }, // ノーマル
      { pokemon_id: 2, type_id: 50, entry_number: 1 },
      { pokemon_id: 3, type_id: 50, entry_number: 1 },
      { pokemon_id: 4, type_id: 20, entry_number: 1 }, // ほのお
      { pokemon_id: 5, type_id: 20, entry_number: 1 },
      { pokemon_id: 6, type_id: 20, entry_number: 1 },
      { pokemon_id: 7, type_id: 30, entry_number: 1 }, // みず
      { pokemon_id: 8, type_id: 30, entry_number: 1 },
      { pokemon_id: 9, type_id: 30, entry_number: 1 },
      { pokemon_id: 10, type_id: 120, entry_number: 1 }, // むし
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
