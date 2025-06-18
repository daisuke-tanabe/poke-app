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
};
