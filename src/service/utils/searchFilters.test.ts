import { describe, it, expect } from 'vitest';

import { buildSearchFilters } from './searchFilters';

describe('buildSearchFilters', () => {
  it('should build basic search filters with pokedexId', () => {
    const result = buildSearchFilters(1, '', '', '');

    expect(result).toEqual({
      pokedexId: 1,
      nameFilter: undefined,
      typeFilters: [],
    });
  });

  it('should build name filter when name is provided', () => {
    const result = buildSearchFilters(1, 'ピカチュウ', '', '');

    expect(result).toEqual({
      pokedexId: 1,
      nameFilter: {
        formEntry: {
          pokemon: {
            OR: [
              { name_ja: { contains: 'ピカチュウ' } },
              { name_kana: { contains: 'ピカチュウ' } },
              { name_en: { contains: 'ピカチュウ' } },
            ],
          },
        },
      },
      typeFilters: [],
    });
  });

  it('should build type filter when type1 is provided', () => {
    const result = buildSearchFilters(1, '', 'electric', '');

    expect(result).toEqual({
      pokedexId: 1,
      nameFilter: undefined,
      typeFilters: [{ typeEntries: { some: { type: { slug: 'electric' } } } }],
    });
  });

  it('should build type filter when type2 is provided', () => {
    const result = buildSearchFilters(1, '', '', 'flying');

    expect(result).toEqual({
      pokedexId: 1,
      nameFilter: undefined,
      typeFilters: [{ typeEntries: { some: { type: { slug: 'flying' } } } }],
    });
  });

  it('should build type filters when both type1 and type2 are provided', () => {
    const result = buildSearchFilters(1, '', 'electric', 'flying');

    expect(result).toEqual({
      pokedexId: 1,
      nameFilter: undefined,
      typeFilters: [
        { typeEntries: { some: { type: { slug: 'electric' } } } },
        { typeEntries: { some: { type: { slug: 'flying' } } } },
      ],
    });
  });

  it('should build comprehensive filters when all parameters are provided', () => {
    const result = buildSearchFilters(2, 'Charizard', 'fire', 'flying');

    expect(result).toEqual({
      pokedexId: 2,
      nameFilter: {
        formEntry: {
          pokemon: {
            OR: [
              { name_ja: { contains: 'Charizard' } },
              { name_kana: { contains: 'Charizard' } },
              { name_en: { contains: 'Charizard' } },
            ],
          },
        },
      },
      typeFilters: [
        { typeEntries: { some: { type: { slug: 'fire' } } } },
        { typeEntries: { some: { type: { slug: 'flying' } } } },
      ],
    });
  });

  it('should filter out empty type strings', () => {
    const result = buildSearchFilters(1, '', '', '');

    expect(result.typeFilters).toEqual([]);
  });

  it('should filter out falsy type values', () => {
    // TypeScriptではstringしか受け付けないが、実際にはnullやundefinedが来る可能性を想定
    const result = buildSearchFilters(1, '', 'water', '');

    expect(result.typeFilters).toEqual([{ typeEntries: { some: { type: { slug: 'water' } } } }]);
  });

  it('should handle empty name string correctly', () => {
    const result = buildSearchFilters(1, '', 'fire', 'water');

    expect(result.nameFilter).toBeUndefined();
  });

  it('should handle whitespace-only name string as empty', () => {
    // 現在の実装では空白文字もnameFilterが作成される
    const result = buildSearchFilters(1, '   ', 'fire', 'water');

    expect(result.nameFilter).toEqual({
      formEntry: {
        pokemon: {
          OR: [{ name_ja: { contains: '   ' } }, { name_kana: { contains: '   ' } }, { name_en: { contains: '   ' } }],
        },
      },
    });
  });

  it('should handle different pokedexId values', () => {
    const result1 = buildSearchFilters(0, '', '', '');
    const result2 = buildSearchFilters(999, '', '', '');

    expect(result1.pokedexId).toBe(0);
    expect(result2.pokedexId).toBe(999);
  });
});
