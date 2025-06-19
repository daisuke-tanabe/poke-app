import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 既存データを全削除
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.type.deleteMany();
  await prisma.pokedex.deleteMany();
  await prisma.region.deleteMany();
  console.log('全データ削除完了');

  // regions投入
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
  });
  console.log('regions投入完了');

  // pokedexes投入
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
  await prisma.pokedex.createMany({ data: pokedexes });
  console.log('pokedexes投入完了');

  // types投入
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
  });
  console.log('types投入完了');

  // ポケモン個体を一意に生成（例：100匹）
  const pokemonCount = 100;
  const allPokemons = Array.from({ length: pokemonCount }).map((_, i) => ({
    id: i + 1,
    name_ja: `ポケモン${i + 1}`,
    name_kana: `Pokemon${i + 1}`,
    name_en: `Pokemon${i + 1}`,
    height: 1.0 + ((i + 1) % 5) * 0.1,
    weight: 10.0 + ((i + 1) % 5) * 2,
  }));
  await prisma.pokemon.createMany({ data: allPokemons });
  console.log(`pokemon投入完了: ${allPokemons.length}件`);

  // 各ポケモンに全国図鑑＋1つ以上の地方図鑑をランダムで割り当て
  const localPokedexIds = pokedexes.filter(p => p.id !== 1).map(p => p.id);
  const allPokedexEntries = allPokemons.flatMap((p, i) => {
    // 1〜3個の地方図鑑にランダムで所属
    const shuffled = [...localPokedexIds].sort(() => 0.5 - Math.random());
    const belongCount = Math.floor(Math.random() * 3) + 1; // 1〜3
    const belongLocal = shuffled.slice(0, belongCount);
    // 全国図鑑＋地方図鑑
    return [
      { pokemon_id: p.id, pokedex_id: 1, entry_number: i + 1 },
      ...belongLocal.map((pid, idx) => ({
        pokemon_id: p.id,
        pokedex_id: pid,
        entry_number: idx + 1,
      })),
    ];
  });
  await prisma.pokedexEntry.createMany({ data: allPokedexEntries });
  console.log(`pokedexEntry投入完了: ${allPokedexEntries.length}件`);

  // タイプエントリ（全ポケモンにランダムで1つか2つタイプを付与）
  const typeIds = [10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180];
  const allTypeEntries = allPokemons.flatMap((p) => {
    const shuffled = [...typeIds].sort(() => 0.5 - Math.random());
    const typeCount = Math.random() < 0.5 ? 1 : 2;
    return Array.from({ length: typeCount }).map((_, t) => ({
      pokemon_id: p.id,
      type_id: shuffled[t],
      entry_number: t + 1,
    }));
  });
  await prisma.typeEntry.createMany({ data: allTypeEntries });
  console.log(`typeEntry投入完了: ${allTypeEntries.length}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
