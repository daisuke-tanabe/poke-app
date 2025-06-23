import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 既存データを全削除（マスタは削除しない）
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.pokemonForm.deleteMany();
  await prisma.pokemon.deleteMany();
  console.log('全データ削除完了');

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

  // ポケモン20匹
  const pokemonCount = 20;
  const allPokemons = [];
  const allForms = [];
  let formId = 1;
  for (let i = 1; i <= pokemonCount; i++) {
    allPokemons.push({
      id: i,
      name_ja: `ポケモン${i}`,
      name_kana: `Pokemon${i}`,
      name_en: `Pokemon${i}`,
    });
    // 2フォーム（通常・アローラ）
    allForms.push({
      id: formId,
      pokemon_id: i,
      name_ja: '通常',
      form_name: '通常',
    });
    formId++;
    allForms.push({
      id: formId,
      pokemon_id: i,
      name_ja: 'アローラ',
      form_name: 'アローラ',
    });
    formId++;
  }
  await prisma.pokemon.createMany({ data: allPokemons });
  await prisma.pokemonForm.createMany({ data: allForms });
  console.log('pokemon・form投入完了');

  // 全国図鑑エントリ（各ポケモンの2フォームをentry_number=ポケモンidで登録）
  const nationalEntries = allForms.map((form, idx) => ({
    pokedex_id: 1,
    entry_number: Math.floor(idx / 2) + 1, // ポケモンごとに同じentry_number
    pokemon_form_id: form.id,
  }));
  await prisma.pokedexEntry.createMany({ data: nationalEntries });

  // タイプエントリ（各フォームに1つか2つタイプをランダム付与）
  const typeIds = [10, 20, 30, 40, 50, 60, 70, 80];
  const allPokedexEntries = await prisma.pokedexEntry.findMany();
  // pokedexEntryのfind条件修正
  const typeEntryData: { pokedex_entry_id: number; type_id: number; pokemon_form_id: number }[] = [];
  allForms.forEach((form) => {
    const pokedexEntry = allPokedexEntries.find((e) => e.pokemon_form_id === form.id && e.pokedex_id === 1);
    if (pokedexEntry) {
      const shuffled = [...typeIds].sort(() => 0.5 - Math.random());
      const typeCount = Math.random() < 0.5 ? 1 : 2;
      for (let t = 0; t < typeCount; t++) {
        typeEntryData.push({
          pokedex_entry_id: pokedexEntry.id,
          type_id: shuffled[t],
          pokemon_form_id: form.id,
        });
      }
    }
  });
  await prisma.typeEntry.createMany({ data: typeEntryData });
  console.log(`typeEntry投入完了: ${typeEntryData.length}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
