import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        types: string[];
        sprite: string;
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
          form: {
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
              form: { AND: typeFilters, ...(nameFilter.form ?? {}) },
            }
          : {}),
      },
      orderBy: { entry_number: 'asc' },
      include: {
        form: {
          include: {
            pokemon: true,
            typeEntries: { include: { type: true } },
          },
        },
      },
    }) as {
      entry_number: number;
      form: {
        id: number;
        pokemon_id: number;
        form_name: string;
        sprite: string;
        order: number;
        pokemon: {
          name_ja: string;
          name_en: string;
        };
        typeEntries: { type: { slug: string } }[];
      };
    }[];

    // ポケモンIDごとにグループ化し、フォームをネスト
    const grouped = allEntries.reduce(
      (acc: Record<
        number,
        {
          id: number;
          nameJa: string;
          nameEn: string;
          entryNumber: number;
          forms: { id: number; nameJa: string; types: string[]; sprite: string; order: number }[];
        }
      >, entry) => {
        const pokeId = entry.form.pokemon_id;
        if (!acc[pokeId]) {
          acc[pokeId] = {
            id: pokeId,
            nameJa: entry.form.pokemon.name_ja,
            nameEn: entry.form.pokemon.name_en,
            entryNumber: entry.entry_number, // 最初のエントリ番号を代表値とする
            forms: [],
          };
        }
        acc[pokeId].forms.push({
          id: entry.form.id,
          nameJa: entry.form.form_name,
          types: entry.form.typeEntries.map((te: { type: { slug: string } }) => te.type.slug),
          sprite: entry.form.sprite,
          order: entry.form.order,
        });
        acc[pokeId].forms.sort((a, b) => a.order - b.order);
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
