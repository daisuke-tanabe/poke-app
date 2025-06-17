import { PrismaClient, Pokemon, PokedexEntry, TypeEntry } from '@/generated/prisma';

const prisma = new PrismaClient();

export const pokemonRepository = {
  // 全国図鑑IDでポケモン一覧取得
  async findAllByPokedex(
    pokedexId: number,
  ): Promise<(Pokemon & { pokedexEntries: PokedexEntry[]; typeEntries: TypeEntry[] })[]> {
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
};
