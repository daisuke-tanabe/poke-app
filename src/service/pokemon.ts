import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { prisma } from '@/shared/lib';

import { groupEntriesByPokemon, paginateAndFormatResults } from './utils/dataTransformers';
import { buildSearchFilters } from './utils/searchFilters';
import { transformPokedexEntry } from './utils/typeGuards';

import type { SearchParams, SearchResult, PokedexEntryWithRelations, TypeInfo, RegionWithPokedexes } from './types';

/**
 * 図鑑取得用のPrismaクエリ（Request Memoization対応）
 */
const findPokedexBySlug = cache(async (slug: string) => {
  return await prisma.pokedex.findUnique({
    where: { slug },
    include: {
      region: true,
    },
  });
});

/**
 * 全タイプ取得用のPrismaクエリ（Request Memoization対応）
 */
const findAllTypes = cache(async () => {
  return await prisma.type.findMany({ orderBy: { id: 'asc' } });
});

/**
 * 全地方と図鑑取得用のPrismaクエリ（Request Memoization対応）
 */
const findAllRegionsWithPokedexes = cache(async () => {
  return await prisma.region.findMany({
    include: {
      pokedexes: true,
    },
    orderBy: { id: 'asc' },
  });
});

/**
 * 図鑑エントリ検索用のRequest Memoization対応関数
 */
const findPokedexEntries = cache(
  async (
    pokedexId: number,
    name: string | null,
    type1: string | null,
    type2: string | null,
  ): Promise<PokedexEntryWithRelations[]> => {
    // 検索条件を構築
    const filters = buildSearchFilters(pokedexId, name ?? '', type1 ?? '', type2 ?? '');

    const whereClause: Record<string, unknown> = {
      pokedex_id: filters.pokedexId,
    };

    // 名前フィルタを追加
    if (filters.nameFilter) {
      whereClause.formEntry = filters.nameFilter.formEntry;
    }

    // タイプフィルタを追加
    if (filters.typeFilters.length > 0) {
      whereClause.AND = filters.typeFilters;
    }

    const entries = await prisma.pokedexEntry.findMany({
      where: whereClause,
      orderBy: { entry_number: 'asc' },
      include: {
        formEntry: {
          include: {
            pokemon: true,
            form: {
              include: {
                region: true,
              },
            },
            typeEntries: { include: { type: true } },
          },
        },
      },
    });

    return entries.map(transformPokedexEntry).filter((entry): entry is PokedexEntryWithRelations => entry !== null);
  },
);

/**
 * 指定図鑑のポケモンエントリを検索（検索・ページング対応）
 */
export async function searchPokedexEntriesWithForms(params: SearchParams): Promise<SearchResult> {
  return await unstable_cache(
    async (): Promise<SearchResult> => {
      // 図鑑存在チェック
      const pokedex = await findPokedexBySlug(params.pokedexSlug);
      if (!pokedex) throw new Error('Pokedex not found');

      // 図鑑エントリを取得（プリミティブパラメータで直接呼び出し）
      const entries = await findPokedexEntries(pokedex.id, params.name, params.type1, params.type2);

      // ポケモンごとにグループ化（地方IDを渡す）
      const grouped = groupEntriesByPokemon(entries, pokedex.region?.id);

      // ページネーション処理
      return paginateAndFormatResults(grouped, params.page, params.pageSize);
    },
    [
      'pokemon-search',
      params.pokedexSlug,
      params.page.toString(),
      params.pageSize.toString(),
      params.name || '',
      params.type1 || '',
      params.type2 || '',
    ],
    {
      revalidate: 3600,
      tags: ['pokemon-search'],
    },
  )();
}

/**
 * 全タイプ一覧を取得
 */
export function listAllTypes() {
  return unstable_cache(
    async (): Promise<TypeInfo[]> => {
      const types = await findAllTypes();
      return types.map((type) => ({
        id: type.id,
        slug: type.slug,
        nameJa: type.name_ja,
        nameEn: type.name_en,
      }));
    },
    ['pokemon-types'],
    {
      revalidate: false, // タイプは変更されないため
    },
  )();
}

/**
 * 地方別の図鑑リスト取得
 */
export function listRegionsWithPokedexes() {
  return unstable_cache(
    async (): Promise<RegionWithPokedexes[]> => {
      const regions = await findAllRegionsWithPokedexes();

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
    ['pokemon-regions'],
    {
      revalidate: false, // 地方は変更されないため
    },
  )();
}
