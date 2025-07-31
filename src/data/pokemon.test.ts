/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { prisma } from '@/lib/prisma';

import { searchPokedexEntriesWithForms, listAllTypes, listRegionsWithPokedexes } from './pokemon';

import type { PokedexEntryWithRelations } from './types';

// Next.jsキャッシュ関数のモック
vi.mock('next/cache', () => ({
  unstable_cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
  cache: vi.fn((fn: (...args: unknown[]) => unknown) => fn),
}));

// Prismaのモック
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pokedex: {
      findUnique: vi.fn(),
    },
    type: {
      findMany: vi.fn(),
    },
    region: {
      findMany: vi.fn(),
    },
    pokedexEntry: {
      findMany: vi.fn(),
    },
  },
}));

// ユーティリティ関数のモック
vi.mock('./utils/dataTransformers', () => ({
  groupEntriesByPokemon: vi.fn(),
  paginateAndFormatResults: vi.fn(),
}));

vi.mock('./utils/searchFilters', () => ({
  buildSearchFilters: vi.fn(),
}));

vi.mock('./utils/typeGuards', () => ({
  transformPokedexEntry: vi.fn(),
}));

describe('pokemon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchPokedexEntriesWithForms', () => {
    const mockSearchParams = {
      pokedexSlug: 'national',
      page: 1,
      pageSize: 20,
      name: 'ピカチュウ',
      type1: 'electric',
      type2: '',
    };

    it('should search pokedex entries successfully', async () => {
      const mockPokedex = {
        id: 1,
        slug: 'national',
        name_ja: '全国図鑑',
        name_en: 'National Dex',
        region_id: 1,
      };
      const mockEntries = [
        {
          id: 1,
          pokedex_id: 1,
          form_entry_id: 1,
          entry_number: 25,
          formEntry: {
            id: 1,
            pokemon_id: 25,
            form_id: 1,
            order: 1,
            sprite_default: 'pikachu.png',
            sprite_shiny: 'pikachu-shiny.png',
            pokemon: {
              id: 25,
              name_ja: 'ピカチュウ',
              name_en: 'Pikachu',
              name_kana: 'ピカチュウ',
            },
          },
        },
      ];
      const mockGrouped = {
        25: {
          id: 25,
          nameJa: 'ピカチュウ',
          nameEn: 'Pikachu',
          entryNumber: 25,
          forms: [],
        },
      };
      const mockResult = {
        pokemons: [mockGrouped[25]],
        total: 1,
      };

      const mockFindUnique = vi.mocked(prisma.pokedex.findUnique);
      const mockFindMany = vi.mocked(prisma.pokedexEntry.findMany);
      mockFindUnique.mockResolvedValue(mockPokedex);
      mockFindMany.mockResolvedValue(mockEntries);

      const { groupEntriesByPokemon } = await import('./utils/dataTransformers');
      const { paginateAndFormatResults } = await import('./utils/dataTransformers');
      const { buildSearchFilters } = await import('./utils/searchFilters');
      const { transformPokedexEntry } = await import('./utils/typeGuards');

      vi.mocked(buildSearchFilters).mockReturnValue({
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
        typeFilters: [{ typeEntries: { some: { type: { slug: 'electric' } } } }],
      });

      vi.mocked(transformPokedexEntry).mockReturnValue(mockEntries[0] as PokedexEntryWithRelations);
      vi.mocked(groupEntriesByPokemon).mockReturnValue(mockGrouped);
      vi.mocked(paginateAndFormatResults).mockReturnValue(mockResult);

      const result = await searchPokedexEntriesWithForms(mockSearchParams);

      expect(result).toEqual(mockResult);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { slug: 'national' },
      });
    });

    it('should throw error when pokedex is not found', async () => {
      const mockFindUnique = vi.mocked(prisma.pokedex.findUnique);
      mockFindUnique.mockResolvedValue(null);

      await expect(searchPokedexEntriesWithForms(mockSearchParams)).rejects.toThrow('Pokedex not found');
    });

    it('should handle empty search results', async () => {
      const mockPokedex = {
        id: 1,
        slug: 'national',
        name_ja: '全国図鑑',
        name_en: 'National Dex',
        region_id: 1,
      };
      const mockFindUnique = vi.mocked(prisma.pokedex.findUnique);
      const mockFindMany = vi.mocked(prisma.pokedexEntry.findMany);
      mockFindUnique.mockResolvedValue(mockPokedex);
      mockFindMany.mockResolvedValue([]);

      const { groupEntriesByPokemon } = await import('./utils/dataTransformers');
      const { paginateAndFormatResults } = await import('./utils/dataTransformers');
      const { buildSearchFilters } = await import('./utils/searchFilters');
      const { transformPokedexEntry } = await import('./utils/typeGuards');

      vi.mocked(buildSearchFilters).mockReturnValue({
        pokedexId: 1,
        nameFilter: undefined,
        typeFilters: [],
      });

      vi.mocked(transformPokedexEntry).mockReturnValue(null);
      vi.mocked(groupEntriesByPokemon).mockReturnValue({});
      vi.mocked(paginateAndFormatResults).mockReturnValue({
        pokemons: [],
        total: 0,
      });

      const result = await searchPokedexEntriesWithForms(mockSearchParams);

      expect(result).toEqual({
        pokemons: [],
        total: 0,
      });
    });
  });

  describe('listAllTypes', () => {
    it('should return all types correctly', async () => {
      const mockTypes = [
        { id: 1, slug: 'normal', name_ja: 'ノーマル', name_en: 'Normal' },
        { id: 2, slug: 'fire', name_ja: 'ほのお', name_en: 'Fire' },
        { id: 3, slug: 'water', name_ja: 'みず', name_en: 'Water' },
      ];

      const mockFindMany = vi.mocked(prisma.type.findMany);
      mockFindMany.mockResolvedValue(mockTypes);

      const result = await listAllTypes();

      expect(result).toEqual([
        { id: 1, slug: 'normal', nameJa: 'ノーマル', nameEn: 'Normal' },
        { id: 2, slug: 'fire', nameJa: 'ほのお', nameEn: 'Fire' },
        { id: 3, slug: 'water', nameJa: 'みず', nameEn: 'Water' },
      ]);

      expect(mockFindMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });

    it('should handle empty types result', async () => {
      const mockFindMany = vi.mocked(prisma.type.findMany);
      mockFindMany.mockResolvedValue([]);

      const result = await listAllTypes();

      expect(result).toEqual([]);
    });
  });

  describe('listRegionsWithPokedexes', () => {
    it('should return regions with pokedexes correctly', async () => {
      const mockRegions = [
        {
          id: 1,
          name_ja: 'カントー',
          name_en: 'Kanto',
          slug: 'kanto',
          pokedexes: [
            { id: 1, slug: 'national', name_ja: '全国図鑑', name_en: 'National Dex', region_id: 1 },
            { id: 2, slug: 'kanto', name_ja: 'カントー図鑑', name_en: 'Kanto Dex', region_id: 1 },
          ],
        },
        {
          id: 2,
          name_ja: 'ジョウト',
          name_en: 'Johto',
          slug: 'johto',
          pokedexes: [{ id: 3, slug: 'johto', name_ja: 'ジョウト図鑑', name_en: 'Johto Dex', region_id: 2 }],
        },
      ];

      const mockFindMany = vi.mocked(prisma.region.findMany);
      mockFindMany.mockResolvedValue(mockRegions);

      const result = await listRegionsWithPokedexes();

      expect(result).toEqual([
        {
          id: 1,
          nameJa: 'カントー',
          nameEn: 'Kanto',
          pokedexes: [
            { id: 1, slug: 'national', nameJa: '全国図鑑', nameEn: 'National Dex' },
            { id: 2, slug: 'kanto', nameJa: 'カントー図鑑', nameEn: 'Kanto Dex' },
          ],
        },
        {
          id: 2,
          nameJa: 'ジョウト',
          nameEn: 'Johto',
          pokedexes: [{ id: 3, slug: 'johto', nameJa: 'ジョウト図鑑', nameEn: 'Johto Dex' }],
        },
      ]);

      expect(mockFindMany).toHaveBeenCalledWith({
        include: {
          pokedexes: true,
        },
        orderBy: { id: 'asc' },
      });
    });

    it('should handle regions without pokedexes', async () => {
      const mockRegions = [
        {
          id: 1,
          name_ja: 'カントー',
          name_en: 'Kanto',
          slug: 'kanto',
          pokedexes: null,
        },
      ];

      const mockFindMany = vi.mocked(prisma.region.findMany);
      mockFindMany.mockResolvedValue(mockRegions);

      const result = await listRegionsWithPokedexes();

      expect(result).toEqual([
        {
          id: 1,
          nameJa: 'カントー',
          nameEn: 'Kanto',
          pokedexes: [],
        },
      ]);
    });

    it('should handle empty regions result', async () => {
      const mockFindMany = vi.mocked(prisma.region.findMany);
      mockFindMany.mockResolvedValue([]);

      const result = await listRegionsWithPokedexes();

      expect(result).toEqual([]);
    });
  });
});
