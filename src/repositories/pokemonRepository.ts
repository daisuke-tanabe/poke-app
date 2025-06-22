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
    const regions = await prisma.region.findMany({
      include: {
        pokedexes: true,
      },
      orderBy: { id: 'asc' },
    });
    return regions.map((region) => ({
      id: region.id,
      nameJa: region.name_ja,
      nameEn: region.name_en,
      pokedexes: region.pokedexes.map((pokedex) => ({
        id: pokedex.id,
        slug: pokedex.slug,
        nameJa: pokedex.name_ja,
        nameEn: pokedex.name_en,
      })),
    }));
  },

  // 全タイプ一覧を取得
  async getAllTypes() {
    const types = await prisma.type.findMany({ orderBy: { id: 'asc' } });
    return types.map((type) => ({
      id: type.id,
      slug: type.slug,
      nameJa: type.name_ja,
      nameEn: type.name_en,
    }));
  },

  /**
   * 図鑑・タイプ・名前・ページ指定でポケモンリストと件数を取得
   * @param pokedexSlug 図鑑スラッグ
   * @param page ページ番号（1始まり）
   * @param pageSize 1ページあたり件数
   * @param name 名前検索
   * @param type1 タイプ1
   * @param type2 タイプ2
   */
  async getPokemonsWithTotal(
    pokedexSlug: string,
    page: number,
    pageSize: number = 20,
    name: string,
    type1: string,
    type2: string,
  ): Promise<{
    pokemons: {
      id: number;
      nameJa: string;
      nameEn: string;
      pokedexEntries: {
        id: number;
        entryNumber: number;
        pokedex: {
          id: number;
          slug: string;
          nameJa: string;
          nameEn: string;
        };
      }[];
      types: string[];
    }[];
    total: number;
  }> {
    const offset = (page - 1) * pageSize;
    // 検索条件を共通化
    const where = {
      pokedexEntries: {
        some: {
          pokedex: {
            slug: pokedexSlug,
          },
        },
      },
      OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
      AND: [type1, type2].reduce<
        {
          typeEntries: {
            some: {
              type: {
                slug: string;
              };
            };
          };
        }[]
      >((result, current) => {
        if (!current) return result;
        return [
          ...result,
          {
            typeEntries: {
              some: {
                type: {
                  slug: current,
                },
              },
            },
          },
        ];
      }, []),
    };

    const pokemons = await prisma.pokemon.findMany({
      where,
      include: {
        pokedexEntries: {
          include: {
            pokedex: true,
          },
        },
        typeEntries: {
          include: {
            type: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: pageSize,
    });

    // 検索条件をそのままcountにも適用
    const total = await prisma.pokemon.count({ where });

    return {
      pokemons: pokemons.map(({ id, name_en, name_ja, pokedexEntries, typeEntries }) => ({
        id,
        nameJa: name_ja,
        nameEn: name_en,
        pokedexEntries: pokedexEntries.map((entry) => ({
          id: entry.id,
          entryNumber: entry.entry_number,
          pokedex: {
            id: entry.pokedex.id,
            slug: entry.pokedex.slug,
            nameJa: entry.pokedex.name_ja,
            nameEn: entry.pokedex.name_en,
          },
        })),
        types: typeEntries.map(({ type }) => type.slug),
      })),
      total,
    };
  },
};
