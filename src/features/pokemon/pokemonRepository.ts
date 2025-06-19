import { PrismaClient, Pokemon, PokedexEntry, TypeEntry } from '@/generated/prisma';

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
          where: { pokedex_id: pokedexId },
        },
        typeEntries: true,
      },
    });
  },

  // 名前で検索
  async findByName(name: string): Promise<Pokemon | null> {
    return prisma.pokemon.findFirst({
      where: {
        OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
      },
      include: {
        pokedexEntries: true,
        typeEntries: true,
      },
    });
  },

  // タイプで検索（複数タイプ対応）
  async findByTypes(typeIds: number[]): Promise<Pokemon[]> {
    return prisma.pokemon.findMany({
      where: {
        typeEntries: {
          some: {
            type_id: { in: typeIds },
          },
        },
      },
      include: {
        pokedexEntries: true,
        typeEntries: true,
      },
    });
  },

  // 図鑑カテゴリ・図鑑リスト取得
  async getPokedexMasterData(): Promise<{
    regionId: number;
    regionNameJa: string;
    pokedexes: { slug: string; nameJa: string }[];
  }[]> {
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
    offset: number
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
          where: { pokedex_id: pokedexId },
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
    offset = 0
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    return prisma.pokemon.findMany({
      where: {
        pokedexEntries: {
          some: { pokedex_id: pokedexId },
        },
        OR: [
          { name_ja: { contains: name } },
          { name_kana: { contains: name } },
          { name_en: { contains: name } },
        ],
      },
      include: {
        pokedexEntries: {
          where: { pokedex_id: pokedexId },
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
        OR: [
          { name_ja: { contains: name } },
          { name_kana: { contains: name } },
          { name_en: { contains: name } },
        ],
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
    offset = 0
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return [];
    // タイプ条件ロジック
    let typeCondition = {};
    if (type1 && type2 && type1 !== type2) {
      // 両方指定・異なる場合: 両方のタイプを持つ
      typeCondition = {
        AND: [
          { typeEntries: { some: { type_id: Number(type1) } } },
          { typeEntries: { some: { type_id: Number(type2) } } },
        ],
      };
    } else if (type1 || type2) {
      // どちらかのみ指定 or 同じ場合: そのタイプを持つ
      const t = Number(type1 || type2);
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
        pokedexEntries: { where: { pokedex_id: pokedexId } },
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
    type2: string
  ): Promise<number> {
    const pokedexId = await getPokedexIdBySlug(pokedexSlug);
    if (!pokedexId) return 0;
    let typeCondition = {};
    if (type1 && type2 && type1 !== type2) {
      typeCondition = {
        AND: [
          { typeEntries: { some: { type_id: Number(type1) } } },
          { typeEntries: { some: { type_id: Number(type2) } } },
        ],
      };
    } else if (type1 || type2) {
      const t = Number(type1 || type2);
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
};
