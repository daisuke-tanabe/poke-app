import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 既存データを全削除（マスタも削除）
  await prisma.typeEntry.deleteMany();
  await prisma.pokedexEntry.deleteMany();
  await prisma.form.deleteMany();
  await prisma.pokemon.deleteMany();
  // フォーム種別マスタ再投入
  const formMaster = [
    { id: 1, name_ja: '通常', name_en: 'Normal' },
    { id: 2, name_ja: 'メガシンカ', name_en: 'Mega' },
    { id: 3, name_ja: 'アローラ', name_en: 'Alola' },
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/bulbasaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/bulbasaur-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/ivysaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/ivysaur-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur-shiny.png',
          types: ['grass', 'poison'],
        },
        {
          id: 7,
          name_ja: 'メガシンカ',
          name_en: 'Mega',
          order: 2,
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur-mega.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur-mega-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-shiny.png',
          types: ['fire'],
        },
        {
          id: 11,
          name_ja: 'アローラ',
          name_en: 'Alola',
          order: 2,
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-alola.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-alola-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/bulbasaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/bulbasaur-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/ivysaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/ivysaur-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/venusaur-shiny.png',
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
          sprite_default: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-alola.png',
          sprite_shiny: 'http://127.0.0.1:54321/storage/v1/object/public/pokemon/sprites/vulpix-alola-shiny.png',
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
    ...nationalPokemons
      .flatMap((p) =>
        p.forms.map((f) => {
          // form_idはformMasterのname_ja/name_enのみ許容
          let formKey = f.name_ja;
          if (!formNameToId[formKey]) formKey = f.name_en;
          if (!formNameToId[formKey]) {
            console.warn('nationalPokemons: invalid formId', { p, f, formKey });
            return null;
          }
          const formId = formNameToId[formKey];
          console.log('nationalPokemons: resolved formId', { p_id: p.id, formKey, formId });
          return {
            pokemon_id: p.id,
            form_id: formId,
            sprite_default: f.sprite_default,
            sprite_shiny: f.sprite_shiny,
            order: f.order,
          };
        }),
      )
      .filter(Boolean)
      .map((f) => f!),
    ...kitakamiPokemons
      .flatMap((p) =>
        p.forms.map((f) => {
          let formKey = f.name_ja;
          if (!formNameToId[formKey]) formKey = f.name_en;
          if (!formNameToId[formKey]) {
            console.warn('kitakamiPokemons: invalid formId', { p, f, formKey });
            return null;
          }
          const formId = formNameToId[formKey];
          console.log('kitakamiPokemons: resolved formId', { p_id: p.id, formKey, formId });
          return {
            pokemon_id: p.id,
            form_id: formId,
            sprite_default: f.sprite_default ?? '',
            sprite_shiny: f.sprite_shiny ?? '',
            order: f.order,
          };
        }),
      )
      .filter(
        (f) =>
          Boolean(f) &&
          !nationalPokemons.some((np) => np.id === f!.pokemon_id && np.forms.some((nf) => nf.order === f!.order)),
      )
      .map((f) => f!),
    ...blueberryPokemons
      .flatMap((p) =>
        p.forms.map((f) => {
          let formKey = f.name_ja;
          if (!formNameToId[formKey]) formKey = f.name_en;
          if (!formNameToId[formKey]) {
            console.warn('blueberryPokemons: invalid formId', { p, f, formKey });
            return null;
          }
          const formId = formNameToId[formKey];
          console.log('blueberryPokemons: resolved formId', { p_id: p.id, formKey, formId });
          return {
            pokemon_id: p.id,
            form_id: formId,
            sprite_default: f.sprite_default ?? '',
            sprite_shiny: f.sprite_shiny ?? '',
            order: f.order,
          };
        }),
      )
      .filter(
        (f) =>
          Boolean(f) &&
          !nationalPokemons.some((np) => np.id === f!.pokemon_id && np.forms.some((nf) => nf.order === f!.order)) &&
          !kitakamiPokemons.some((kp) => kp.id === f!.pokemon_id && kp.forms.some((kf) => kf.order === f!.order)),
      )
      .map((f) => f!),
  ];
  await prisma.pokemon.createMany({
    data: allPokemons.map((p) => ({ id: p.id, name_ja: p.name_ja, name_kana: p.name_kana, name_en: p.name_en })),
  });
  await prisma.formEntry.createMany({ data: allFormEntries });
  console.log('pokemon・form_entries投入完了');

  // formEntry投入後、DBから全formEntryを取得し、pokemon_id, form_id, orderでマッピング
  const dbFormEntries = await prisma.formEntry.findMany();
  // pokedexEntries投入用: 各formsの(pokemon_id, form_id, order)→form_entry_idを解決
  const pokedexEntries: { pokedex_id: number; entry_number: number; form_entry_id: number }[] = [];
  for (const group of [
    { src: nationalPokemons, pokedexId: 1 },
    { src: kitakamiPokemons, pokedexId: 101 },
    { src: blueberryPokemons, pokedexId: 102 },
  ]) {
    for (const p of group.src) {
      for (const f of p.forms) {
        // formIdを再計算
        let formKey = f.name_ja;
        if (!formNameToId[formKey]) formKey = f.name_en;
        const formId = formNameToId[formKey];
        const entry = dbFormEntries.find((e) => e.pokemon_id === p.id && e.form_id === formId && e.order === f.order);
        if (!entry) {
          console.warn('pokedexEntry: formEntry not found', { p_id: p.id, formId, order: f.order });
          continue;
        }
        pokedexEntries.push({
          pokedex_id: group.pokedexId,
          entry_number: p.entry_number,
          form_entry_id: entry.id,
        });
      }
    }
  }
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
