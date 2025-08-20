import type { SearchFilters } from '../types';

/**
 * 検索条件を構築
 */
export function buildSearchFilters(pokedexId: number, name: string, type1: string, type2: string): SearchFilters {
  const typeFilters = [type1, type2].filter(Boolean).map((slug) => ({ typeEntries: { some: { type: { slug } } } }));

  const nameFilter = name
    ? {
        formEntry: {
          pokemon: {
            OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
          },
        },
      }
    : undefined;

  return {
    pokedexId,
    nameFilter,
    typeFilters,
  };
}
