import type { SearchFilters, NameFilter, TypeFilter } from '../types';

/**
 * タイプスラッグ配列からフィルタを構築
 */
function buildTypeFilters(types: string[]): TypeFilter[] {
  return types.filter(Boolean).map((slug) => ({ typeEntries: { some: { type: { slug } } } }));
}

/**
 * 名前からフィルタを構築
 */
function buildNameFilter(name: string): NameFilter | undefined {
  if (!name) {
    return undefined;
  }

  return {
    formEntry: {
      pokemon: {
        OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
      },
    },
  };
}

/**
 * 検索条件を構築
 */
export function buildSearchFilters(pokedexId: number, name: string, type1: string, type2: string): SearchFilters {
  const typeFilters = buildTypeFilters([type1, type2]);
  const nameFilter = buildNameFilter(name);

  return {
    pokedexId,
    nameFilter,
    typeFilters,
  };
}
