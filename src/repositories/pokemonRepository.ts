import { PrismaClient, Pokemon, PokedexEntry, TypeEntry } from '@prisma/client';

const prisma = new PrismaClient();

async function getPokedexIdBySlug(slug: string): Promise<number | null> {
  const pokedex = await prisma.pokedex.findUnique({ where: { slug } });
  return pokedex ? pokedex.id : null;
}

export const pokemonRepository = {
  // 全国図鑑スラッグでポケモン一覧取得
  async findAllByPokedex(
    pokedexSlug: string,
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    return prisma.pokemon.findMany({
      include: {
        pokedexEntries: {
          // where句を削除し、全ての図鑑エントリを取得
          include: { pokedex: true },
        },
        typeEntries: true,
      },
    });
  },

  // 図鑑カテゴリ・図鑑リスト取得
  async getPokedexMasterData(): Promise<
    {
      regionId: number;
      regionNameJa: string;
      pokedexes: { slug: string; nameJa: string }[];
    }[]
  > {
    const regions = await prisma.region.findMany({
      include: {
        pokedexes: true,
      },
      orderBy: { id: 'asc' },
    });
    return regions.map((region) => ({
      regionId: region.id,
      regionNameJa: region.name_ja,
      pokedexes: region.pokedexes.map((p) => ({ slug: p.slug, nameJa: p.name_ja })),
    }));
  },

  // ページング対応: 図鑑スラッグでポケモン一覧取得
  async findAllByPokedexPaged(
    pokedexSlug: string,
    limit: number,
    offset: number,
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    return prisma.pokemon.findMany({
      where: {
        pokedexEntries: {
          some: { pokedex_id: pokedexId },
        },
      },
      include: {
        pokedexEntries: {
          // where句を削除し、全ての図鑑エントリを取得
          include: { pokedex: true },
        },
        typeEntries: true,
      },
      skip: offset,
      take: limit,
    });
  },

  // 図鑑スラッグごとのポケモン総数を取得
  async countByPokedex(pokedexSlug: string): Promise<number> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return 0;
    return prisma.pokemon.count({
      where: {
        pokedexEntries: {
          some: { pokedex_id: pokedexId },
        },
      },
    });
  },

  // 図鑑＋名前でAND検索
  async findByPokedexAndName(
    pokedexSlug: string,
    name: string,
    limit = 20,
    offset = 0,
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    return prisma.pokemon.findMany({
      where: {
        pokedexEntries: {
          some: { pokedex_id: pokedexId },
        },
        OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
      },
      include: {
        pokedexEntries: {
          // where句を削除し、全ての図鑑エントリを取得
          include: { pokedex: true },
        },
        typeEntries: true,
      },
      skip: offset,
      take: limit,
    });
  },

  // 図鑑＋名前でAND検索の件数取得
  async countByPokedexAndName(pokedexSlug: string, name: string): Promise<number> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return 0;
    return prisma.pokemon.count({
      where: {
        pokedexEntries: {
          some: { pokedex_id: pokedexId },
        },
        OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
      },
    });
  },

  // 図鑑＋名前＋タイプ1＋タイプ2でAND検索
  async findByPokedexAndNameAndTypes(
    pokedexSlug: string,
    name: string,
    type1: string,
    type2: string,
    limit = 20,
    offset = 0,
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    // タイプ条件ロジック
    let typeCondition = {};
    const isType1Valid = type1 && type1 !== 'all';
    const isType2Valid = type2 && type2 !== 'all';
    if (isType1Valid && isType2Valid && type1 !== type2) {
      // 両方指定・異なる場合: 両方のタイプを持つ
      typeCondition = {
        AND: [
          { typeEntries: { some: { type_id: Number(type1) } } },
          { typeEntries: { some: { type_id: Number(type2) } } },
        ],
      };
    } else if (isType1Valid || isType2Valid) {
      // どちらかのみ指定 or 同じ場合: そのタイプを持つ
      const t = Number(isType1Valid ? type1 : type2);
      typeCondition = { typeEntries: { some: { type_id: t } } };
    }
    return prisma.pokemon.findMany({
      where: {
        pokedexEntries: { some: { pokedex_id: pokedexId } },
        AND: [
          name
            ? {
                OR: [
                  { name_ja: { contains: name } },
                  { name_kana: { contains: name } },
                  { name_en: { contains: name } },
                ],
              }
            : {},
          typeCondition,
        ],
      },
      include: {
        pokedexEntries: { include: { pokedex: true } },
        typeEntries: true,
      },
      skip: offset,
      take: limit,
    });
  },

  // 図鑑＋名前＋タイプ1＋タイプ2でAND検索の件数取得
  async countByPokedexAndNameAndTypes(
    pokedexSlug: string,
    name: string,
    type1: string,
    type2: string,
  ): Promise<number> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return 0;
    // タイプ条件ロジック（findByPokedexAndNameAndTypesと統一）
    let typeCondition = {};
    const isType1Valid = type1 && type1 !== 'all';
    const isType2Valid = type2 && type2 !== 'all';
    if (isType1Valid && isType2Valid && type1 !== type2) {
      typeCondition = {
        AND: [
          { typeEntries: { some: { type_id: Number(type1) } } },
          { typeEntries: { some: { type_id: Number(type2) } } },
        ],
      };
    } else if (isType1Valid || isType2Valid) {
      const t = Number(isType1Valid ? type1 : type2);
      typeCondition = { typeEntries: { some: { type_id: t } } };
    }
    return prisma.pokemon.count({
      where: {
        pokedexEntries: { some: { pokedex_id: pokedexId } },
        AND: [
          name
            ? {
                OR: [
                  { name_ja: { contains: name } },
                  { name_kana: { contains: name } },
                  { name_en: { contains: name } },
                ],
              }
            : {},
          typeCondition,
        ],
      },
    });
  },

  // 全タイプ一覧を取得
  async getAllTypes() {
    return prisma.type.findMany({ orderBy: { id: 'asc' } });
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
    name: string = '',
    type1: string = '',
    type2: string = '',
  ): Promise<{ pokemons: (Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]; total: number }> {
    const offset = (page - 1) * pageSize;
    let pokemons, total;
    if (name || type1 || type2) {
      pokemons = await this.findByPokedexAndNameAndTypes(pokedexSlug, name, type1, type2, pageSize, offset);
      total = await this.countByPokedexAndNameAndTypes(pokedexSlug, name, type1, type2);
    } else {
      pokemons = await this.findAllByPokedexPaged(pokedexSlug, pageSize, offset);
      total = await this.countByPokedex(pokedexSlug);
    }
    return { pokemons, total };
  },
};
