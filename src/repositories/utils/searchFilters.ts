import type { SearchFilters, NameFilter, TypeFilter } from '../types';

/**
 * 検索条件を構築
 */
export function buildSearchFilters(pokedexId: number, name: string, type1: string, type2: string): SearchFilters {
  const typeFilters: TypeFilter[] = [type1, type2]
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ typeEntries: { some: { type: { slug } } } }));

  let nameFilter: NameFilter | undefined;
  if (name) {
    nameFilter = {
      formEntry: {
        pokemon: {
          OR: [{ name_ja: { contains: name } }, { name_kana: { contains: name } }, { name_en: { contains: name } }],
        },
      },
    };
  }

  return {
    pokedexId,
    nameFilter,
    typeFilters,
  };
}
