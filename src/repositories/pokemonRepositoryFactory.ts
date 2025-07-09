import { groupEntriesByPokemon, paginateAndFormatResults } from './utils/dataTransformers';
import { buildSearchFilters } from './utils/searchFilters';
import { transformPokedexEntry } from './utils/typeGuards';

import type {
  RegionWithPokedexes,
  TypeInfo,
  SearchParams,
  SearchResult,
  SearchFilters,
  PokedexEntryWithRelations,
  DatabaseRegion,
  DatabasePokedex,
  DatabaseType,
  DatabasePokedexEntry,
  IPokemonRepository,
} from './types';

// Prismaクライアント型定義
type PrismaRegionOperations = {
  findMany: (args?: {
    include?: { pokedexes?: boolean };
    orderBy?: { id?: 'asc' | 'desc' };
  }) => Promise<DatabaseRegion[]>;
};

type PrismaTypeOperations = {
  findMany: (args?: { orderBy?: { id?: 'asc' | 'desc' } }) => Promise<DatabaseType[]>;
};

type PrismaPokedexOperations = {
  findUnique: (args: { where: { slug: string } }) => Promise<DatabasePokedex | null>;
};

type PrismaPokedexEntryOperations = {
  findMany: (args: {
    where: Record<string, unknown>;
    orderBy?: { entry_number?: 'asc' | 'desc' };
    include?: {
      formEntry?: {
        include?: {
          pokemon?: boolean;
          form?: boolean;
          typeEntries?: { include?: { type?: boolean } };
        };
      };
    };
  }) => Promise<DatabasePokedexEntry[]>;
};

type PrismaClientType = {
  region: PrismaRegionOperations;
  type: PrismaTypeOperations;
  pokedex: PrismaPokedexOperations;
  pokedexEntry: PrismaPokedexEntryOperations;
};

/**
 * Pokemon Repository Factory
 * 依存性注入でテスタビリティを向上
 */
export function createPokemonRepository(prismaClient: PrismaClientType): IPokemonRepository {
  return {
    /**
     * 地方別の図鑑リスト取得
     */
    async listRegionsWithPokedexes(): Promise<RegionWithPokedexes[]> {
      const regions = await prismaClient.region.findMany({
        include: {
          pokedexes: true,
        },
        orderBy: { id: 'asc' },
      });

      return regions.map((region) => ({
        id: region.id,
        nameJa: region.name_ja,
        nameEn: region.name_en,
        pokedexes: (region.pokedexes ?? []).map((pokedex) => ({
          id: pokedex.id,
          slug: pokedex.slug,
          nameJa: pokedex.name_ja,
          nameEn: pokedex.name_en,
        })),
      }));
    },

    /**
     * 全タイプ一覧を取得
     */
    async listAllTypes(): Promise<TypeInfo[]> {
      const types = await prismaClient.type.findMany({ orderBy: { id: 'asc' } });
      return types.map((type) => ({
        id: type.id,
        slug: type.slug,
        nameJa: type.name_ja,
        nameEn: type.name_en,
      }));
    },

    /**
     * 指定図鑑のポケモンエントリを検索（検索・ページング対応）
     */
    async searchPokedexEntriesWithForms(params: SearchParams): Promise<SearchResult> {
      // 図鑑存在チェック
      const pokedex = await prismaClient.pokedex.findUnique({
        where: { slug: params.pokedexSlug },
      });
      if (!pokedex) throw new Error('Pokedex not found');

      // 検索条件を構築
      const filters = buildSearchFilters(pokedex.id, params.name, params.type1, params.type2);

      // 図鑑エントリを取得
      const entries = await this.findPokedexEntries(filters);

      // ポケモンごとにグループ化
      const grouped = groupEntriesByPokemon(entries);

      // ページネーション処理
      return paginateAndFormatResults(grouped, params.page, params.pageSize);
    },

    /**
     * 検索条件に基づいて図鑑エントリを取得
     */
    async findPokedexEntries(filters: SearchFilters): Promise<PokedexEntryWithRelations[]> {
      const whereClause: Record<string, unknown> = {
        pokedex_id: filters.pokedexId,
      };

      if (filters.nameFilter) {
        Object.assign(whereClause, filters.nameFilter);
      }

      if (filters.typeFilters.length > 0) {
        whereClause.AND = filters.typeFilters;
      }

      const entries = await prismaClient.pokedexEntry.findMany({
        where: whereClause,
        orderBy: { entry_number: 'asc' },
        include: {
          formEntry: {
            include: {
              pokemon: true,
              form: true,
              typeEntries: { include: { type: true } },
            },
          },
        },
      });

      // 型安全なデータ変換
      return entries.map(transformPokedexEntry).filter((entry): entry is PokedexEntryWithRelations => entry !== null);
    },
  };
}
