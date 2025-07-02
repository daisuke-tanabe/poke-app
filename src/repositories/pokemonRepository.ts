import { prisma } from '@/lib/prisma';

export const pokemonRepository = {
  // 地方別の図鑑リスト取得
  async getAllRegionsWithPokedexes(): Promise<
    {
      id: number;
      nameJa: string;
      nameEn: string;
      pokedexes: {
        id: number;
        slug: string;
        nameJa: string;
        nameEn: string;
      }[];
    }[]
  > {
    // Prismaの戻り値型を明示
    const regions = await prisma.region.findMany({
      include: {
        pokedexes: true,
      },
      orderBy: { id: 'asc' },
    });
    return regions.map(
      (region: {
        id: number;
        name_ja: string;
        name_en: string;
        pokedexes: {
          id: number;
          slug: string;
          name_ja: string;
          name_en: string;
        }[];
      }) => ({
        id: region.id,
        nameJa: region.name_ja,
        nameEn: region.name_en,
        pokedexes: region.pokedexes.map((pokedex) => ({
          id: pokedex.id,
          slug: pokedex.slug,
          nameJa: pokedex.name_ja,
          nameEn: pokedex.name_en,
        })),
      }),
    );
  },

  // 全タイプ一覧を取得
  async getAllTypes() {
    const types = await prisma.type.findMany({ orderBy: { id: 'asc' } });
    return types.map((type: { id: number; slug: string; name_ja: string; name_en: string }) => ({
      id: type.id,
      slug: type.slug,
      nameJa: type.name_ja,
      nameEn: type.name_en,
    }));
  },

  /**
   * 指定図鑑のエントリをentry_number順で取得し、ポケモン・フォーム・タイプをネストして返す（検索・ページング対応）
   *
   * 先にfindUniqueで図鑑(slug)の存在チェックを行う理由：
   * - slugが不正な場合は明示的にエラーを返したい（エントリ0件との区別）
   * - findMany/catchではslug不正は検知できず、空配列になるだけ
   * - APIとして「slug不正は400/404、エントリ0件は空配列」など明確に分けたい場合に有効
   */
  async getPokedexEntriesWithForms(
    pokedexSlug: string,
    page: number,
    pageSize: number,
    name: string,
    type1: string,
    type2: string,
  ): Promise<{
    pokemons: {
      id: number;
      nameJa: string;
      nameEn: string;
      entryNumber: number;
      forms: {
        id: number;
        nameJa: string;
        nameEn: string;
        types: string[];
        spriteDefault: string;
        spriteShiny: string;
      }[];
    }[];
    total: number;
  }> {
    // slug存在チェック（なければ明示的にエラー）
    const pokedex = await prisma.pokedex.findUnique({ where: { slug: pokedexSlug } });
    if (!pokedex) throw new Error('Pokedex not found');
    const skip = (page - 1) * pageSize;

    // 検索条件
    const typeFilters = [type1, type2].filter(Boolean).map((slug) => ({
      typeEntries: { some: { type: { slug } } },
    }));
    const nameFilter = name
      ? {
          formEntry: {
            pokemon: {
              OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
            },
          },
        }
      : {};

    // 図鑑エントリを全件取得
    const allEntries = await prisma.pokedexEntry.findMany({
      where: {
        pokedex_id: pokedex.id,
        ...nameFilter,
        ...(typeFilters.length
          ? {
              AND: typeFilters,
            }
          : {}),
      },
      orderBy: { entry_number: 'asc' },
      include: {
        formEntry: {
          include: {
            pokemon: true,
            form: true,
            typeEntries: { include: { type: true } },
          },
        },
        // sprite_default, sprite_shinyはformEntry直下なので追加でselect
      },
    });

    // ポケモンIDごとにグループ化し、フォームをネスト（camelCaseへリネーム）
    const grouped = allEntries.reduce(
      (
        acc: Record<
          number,
          {
            id: number;
            nameJa: string;
            nameEn: string;
            entryNumber: number;
            forms: {
              id: number;
              nameJa: string;
              nameEn: string;
              types: string[];
              spriteDefault: string;
              spriteShiny: string;
              order: number;
            }[];
          }
        >,
        entry,
      ) => {
        const fe = entry.formEntry;
        if (!fe) return acc;
        // 型定義上snake_caseのみ許容されているため、snake_caseで統一
        const pokemonId = fe.pokemon_id;
        if (!acc[pokemonId]) {
          acc[pokemonId] = {
            id: pokemonId,
            nameJa: fe.pokemon?.name_ja ?? '',
            nameEn: fe.pokemon?.name_en ?? '',
            entryNumber: entry.entry_number, // snake_caseで統一
            forms: [],
          };
        }
        // spriteDefault, spriteShiny: camelCase/snake_case両対応だが、現状snake_caseのみ
        const spriteDefault =
          entry.formEntry && ('spriteDefault' in entry.formEntry || 'sprite_default' in entry.formEntry)
            ? ((entry.formEntry as { spriteDefault?: string; sprite_default?: string }).spriteDefault ??
              (entry.formEntry as { sprite_default?: string }).sprite_default ??
              '')
            : '';
        const spriteShiny =
          entry.formEntry && ('spriteShiny' in entry.formEntry || 'sprite_shiny' in entry.formEntry)
            ? ((entry.formEntry as { spriteShiny?: string; sprite_shiny?: string }).spriteShiny ??
              (entry.formEntry as { sprite_shiny?: string }).sprite_shiny ??
              '')
            : '';
        acc[pokemonId].forms.push({
          id: fe.id,
          nameJa: fe.form?.name_ja ?? '',
          nameEn: fe.form?.name_en ?? '',
          types: (fe.typeEntries ?? []).map((te: { type: { slug: string } }) => te.type.slug),
          spriteDefault,
          spriteShiny,
          order: fe.order,
        });
        acc[pokemonId].forms.sort((a, b) => a.order - b.order);
        return acc;
      },
      {},
    );

    // orderを返却前に除去
    const allPokemons = Object.values(grouped).map((p) => ({
      ...p,
      forms: p.forms.map(({ order, ...rest }) => rest),
    }));
    const pagedPokemons = allPokemons.slice(skip, skip + pageSize);
    return { pokemons: pagedPokemons, total: allPokemons.length };
  },
};
