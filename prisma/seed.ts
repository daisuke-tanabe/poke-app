import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // フォーム種別マスタ投入
  const formMaster = [
    { id: 1, name_ja: '通常', name_en: 'Normal' },
    { id: 2, name_ja: '色違い', name_en: 'Shiny' },
    { id: 3, name_ja: 'メガシンカ', name_en: 'Mega' },
    { id: 4, name_ja: '色違いメガシンカ', name_en: 'Shiny Mega' },
    { id: 5, name_ja: 'アローラ', name_en: 'Alola' },
    { id: 6, name_ja: '色違いアローラ', name_en: 'Shiny Alola' },
  ];
  await prisma.form.createMany({ data: formMaster, skipDuplicates: true });
  // 既存データを全削除（マスタは削除しない）
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.form.deleteMany();
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

  // --- サンプルデータ投入 ---
  // タイプslug→idマップ
  const typeSlugToId = {
    grass: 50,
    poison: 80,
    fire: 20,
    ice: 60,
  };

  // 全国図鑑
  const nationalPokemons = [
    {
      id: 1,
      name_ja: 'フシギダネ',
      name_kana: 'フシギダネ',
      name_en: 'Bulbasaur',
      entry_number: 1,
      forms: [
        {
          id: 1,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/1.png',
          types: ['grass', 'poison'],
        },
        {
          id: 2,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/1-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 2,
      name_ja: 'フシギソウ',
      name_kana: 'フシギソウ',
      name_en: 'Ivysaur',
      entry_number: 2,
      forms: [
        {
          id: 3,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/2.png',
          types: ['grass', 'poison'],
        },
        {
          id: 4,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/2-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 3,
      name_ja: 'フシギバナ',
      name_kana: 'フシギバナ',
      name_en: 'Venusaur',
      entry_number: 3,
      forms: [
        {
          id: 5,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3.png',
          types: ['grass', 'poison'],
        },
        {
          id: 6,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3-s.png',
          types: ['grass', 'poison'],
        },
        {
          id: 7,
          name_ja: 'メガシンカ',
          name_en: 'Mega',
          order: 3,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3-m.png',
          types: ['grass', 'poison'],
        },
        {
          id: 8,
          name_ja: '色違いメガシンカ',
          name_en: 'Shiny Mega',
          order: 4,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3-m-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 4,
      name_ja: 'ロコン',
      name_kana: 'ロコン',
      name_en: 'Vulpix',
      entry_number: 4,
      forms: [
        {
          id: 9,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37.png',
          types: ['fire'],
        },
        {
          id: 10,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-s.png',
          types: ['fire'],
        },
        {
          id: 11,
          name_ja: 'アローラ',
          name_en: 'Alola',
          order: 3,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-alola.png',
          types: ['ice'],
        },
        {
          id: 12,
          name_ja: '色違いアローラ',
          name_en: 'Shiny Alola',
          order: 4,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-alola-s.png',
          types: ['ice'],
        },
      ],
    },
  ];

  // キタカミ図鑑
  const kitakamiPokemons = [
    {
      id: 4,
      name_ja: 'ロコン',
      name_kana: 'ロコン',
      name_en: 'Vulpix',
      entry_number: 1,
      forms: [
        {
          id: 9,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37.png',
          types: ['fire'],
        },
        {
          id: 10,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-s.png',
          types: ['fire'],
        },
      ],
    },
  ];

  // ブルーベリー図鑑
  const blueberryPokemons = [
    {
      id: 1,
      name_ja: 'フシギダネ',
      name_kana: 'フシギダネ',
      name_en: 'Bulbasaur',
      entry_number: 1,
      forms: [
        {
          id: 1,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/1.png',
          types: ['grass', 'poison'],
        },
        {
          id: 2,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/1-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 2,
      name_ja: 'フシギソウ',
      name_kana: 'フシギソウ',
      name_en: 'Ivysaur',
      entry_number: 2,
      forms: [
        {
          id: 3,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/2.png',
          types: ['grass', 'poison'],
        },
        {
          id: 4,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/2-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 3,
      name_ja: 'フシギバナ',
      name_kana: 'フシギバナ',
      name_en: 'Venusaur',
      entry_number: 3,
      forms: [
        {
          id: 5,
          name_ja: '通常',
          name_en: 'Normal',
          order: 1,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3.png',
          types: ['grass', 'poison'],
        },
        {
          id: 6,
          name_ja: '色違い',
          name_en: 'Shiny',
          order: 2,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/3-s.png',
          types: ['grass', 'poison'],
        },
      ],
    },
    {
      id: 4,
      name_ja: 'ロコン',
      name_kana: 'ロコン',
      name_en: 'Vulpix',
      entry_number: 3,
      forms: [
        {
          id: 11,
          name_ja: 'アローラ',
          name_en: 'Alola',
          order: 3,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-alola.png',
          types: ['ice'],
        },
        {
          id: 12,
          name_ja: '色違いアローラ',
          name_en: 'Shiny Alola',
          order: 4,
          sprite: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/37-alola-s.png',
          types: ['ice'],
        },
      ],
    },
  ];

  // ---投入処理---
  // ポケモン・フォーム投入（重複しないよう一意化）
  const allPokemons = [
    ...nationalPokemons,
    ...kitakamiPokemons.filter((k) => !nationalPokemons.some((n) => n.id === k.id)),
    ...blueberryPokemons.filter(
      (b) => !nationalPokemons.some((n) => n.id === b.id) && !kitakamiPokemons.some((k) => k.id === b.id),
    ),
  ];
  // form_entries投入用: name_ja/name_en→form_idマップ
  const formNameToId: Record<string, number> = {};
  for (const f of formMaster) {
    formNameToId[f.name_ja] = f.id;
    formNameToId[f.name_en] = f.id;
  }

  const allFormEntries = [
    ...nationalPokemons.flatMap((p) =>
      p.forms.map((f) => ({
        pokemon_id: p.id,
        form_id: formNameToId[f.name_ja] ?? formNameToId[f.name_en],
        sprite: f.sprite,
        order: f.order,
        id: f.id,
      })),
    ),
    ...kitakamiPokemons
      .flatMap((p) =>
        p.forms.map((f) => ({
          pokemon_id: p.id,
          form_id: formNameToId[f.name_ja] ?? formNameToId[f.name_en],
          sprite: f.sprite,
          order: f.order,
          id: f.id,
        })),
      )
      .filter((f) => !nationalPokemons.some((np) => np.forms.some((nf) => nf.id === f.id))),
    ...blueberryPokemons
      .flatMap((p) =>
        p.forms.map((f) => ({
          pokemon_id: p.id,
          form_id: formNameToId[f.name_ja] ?? formNameToId[f.name_en],
          sprite: f.sprite,
          order: f.order,
          id: f.id,
        })),
      )
      .filter(
        (f) =>
          !nationalPokemons.some((np) => np.forms.some((nf) => nf.id === f.id)) &&
          !kitakamiPokemons.some((kp) => kp.forms.some((kf) => kf.id === f.id)),
      ),
  ];
  await prisma.pokemon.createMany({
    data: allPokemons.map((p) => ({ id: p.id, name_ja: p.name_ja, name_kana: p.name_kana, name_en: p.name_en })),
  });
  await prisma.formEntry.createMany({ data: allFormEntries });
  console.log('pokemon・form_entries投入完了');

  // 図鑑エントリ投入
  const pokedexEntries = [
    ...nationalPokemons
      .map((p) =>
        p.forms.map((f) => ({
          pokedex_id: 1,
          entry_number: p.entry_number,
          form_entry_id: f.id,
        })),
      )
      .flat(),
    ...kitakamiPokemons
      .map((p) =>
        p.forms.map((f) => ({
          pokedex_id: 101,
          entry_number: p.entry_number,
          form_entry_id: f.id,
        })),
      )
      .flat(),
    ...blueberryPokemons
      .map((p) =>
        p.forms.map((f) => ({
          pokedex_id: 102,
          entry_number: p.entry_number,
          form_entry_id: f.id,
        })),
      )
      .flat(),
  ];
  await prisma.pokedexEntry.createMany({ data: pokedexEntries });

  // タイプエントリ投入
  const allPokedexEntries = await prisma.pokedexEntry.findMany();
  const typeEntryData = [];
  for (const p of [...nationalPokemons, ...kitakamiPokemons, ...blueberryPokemons]) {
    for (const f of p.forms) {
      const entry = allPokedexEntries.find(
        (e) =>
          e.form_entry_id === f.id &&
          ((e.pokedex_id === 1 && nationalPokemons.some((np) => np.id === p.id)) ||
            (e.pokedex_id === 101 && kitakamiPokemons.some((kp) => kp.id === p.id)) ||
            (e.pokedex_id === 102 && blueberryPokemons.some((bp) => bp.id === p.id))),
      );
      if (entry) {
        for (const t of f.types) {
          typeEntryData.push({
            pokedex_entry_id: entry.id,
            type_id: typeSlugToId[t as keyof typeof typeSlugToId],
            form_entry_id: f.id,
          });
        }
      }
    }
  }
  // 重複排除
  const uniqueTypeEntryData = Array.from(
    new Map(typeEntryData.map((e) => [`${e.pokedex_entry_id}_${e.type_id}`, e])).values(),
  );
  await prisma.typeEntry.createMany({ data: uniqueTypeEntryData });
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
