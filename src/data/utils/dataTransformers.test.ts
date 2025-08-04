import { describe, it, expect } from 'vitest';

import { convertToFormData, groupEntriesByPokemon, paginateAndFormatResults } from './dataTransformers';

import type { FormEntryWithRelations, PokedexEntryWithRelations, PokemonWithFormsAndOrder } from '../types';

describe('dataTransformers', () => {
  describe('convertToFormData', () => {
    it('should convert form entry to form data correctly', () => {
      const formEntry: FormEntryWithRelations = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'pikachu-default.png',
        sprite_shiny: 'pikachu-shiny.png',
        pokemon: {
          name_ja: 'ピカチュウ',
          name_en: 'Pikachu',
        },
        form: {
          name_ja: 'ピカチュウ',
          name_en: 'Pikachu',
        },
        typeEntries: [{ type: { slug: 'electric' } }],
      };

      const result = convertToFormData(formEntry);

      expect(result).toEqual({
        id: 1,
        nameJa: 'ピカチュウ',
        nameEn: 'Pikachu',
        types: ['electric'],
        spriteDefault: 'pikachu-default.png',
        spriteShiny: 'pikachu-shiny.png',
        order: 1,
      });
    });

    it('should handle missing optional fields gracefully', () => {
      const formEntry: FormEntryWithRelations = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
      };

      const result = convertToFormData(formEntry);

      expect(result).toEqual({
        id: 1,
        nameJa: '',
        nameEn: '',
        types: [],
        spriteDefault: 'default.png',
        spriteShiny: 'shiny.png',
        order: 1,
      });
    });

    it('should deduplicate types correctly', () => {
      const formEntry: FormEntryWithRelations = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
        typeEntries: [
          { type: { slug: 'electric' } },
          { type: { slug: 'electric' } }, // duplicate
          { type: { slug: 'flying' } },
        ],
      };

      const result = convertToFormData(formEntry);

      expect(result.types).toEqual(['electric', 'flying']);
    });

    it('should handle multiple types correctly', () => {
      const formEntry: FormEntryWithRelations = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
        typeEntries: [{ type: { slug: 'fire' } }, { type: { slug: 'flying' } }],
      };

      const result = convertToFormData(formEntry);

      expect(result.types).toEqual(['fire', 'flying']);
    });
  });

  describe('groupEntriesByPokemon', () => {
    it('should group entries by pokemon correctly', () => {
      const entries: PokedexEntryWithRelations[] = [
        {
          entry_number: 25,
          formEntry: {
            id: 1,
            pokemon_id: 25,
            order: 1,
            sprite_default: 'pikachu-default.png',
            sprite_shiny: 'pikachu-shiny.png',
            pokemon: {
              name_ja: 'ピカチュウ',
              name_en: 'Pikachu',
            },
            form: {
              name_ja: 'ピカチュウ',
              name_en: 'Pikachu',
            },
            typeEntries: [{ type: { slug: 'electric' } }],
          },
        },
      ];

      const result = groupEntriesByPokemon(entries);

      expect(result).toEqual({
        25: {
          id: 25,
          nameJa: 'ピカチュウ',
          nameEn: 'Pikachu',
          entryNumber: 25,
          forms: [
            {
              id: 1,
              nameJa: 'ピカチュウ',
              nameEn: 'Pikachu',
              types: ['electric'],
              spriteDefault: 'pikachu-default.png',
              spriteShiny: 'pikachu-shiny.png',
              order: 1,
              regionId: undefined,
            },
          ],
        },
      });
    });

    it('should handle multiple forms for same pokemon', () => {
      const entries: PokedexEntryWithRelations[] = [
        {
          entry_number: 25,
          formEntry: {
            id: 1,
            pokemon_id: 25,
            order: 2,
            sprite_default: 'pikachu-form2.png',
            sprite_shiny: 'pikachu-form2-shiny.png',
            pokemon: {
              name_ja: 'ピカチュウ',
              name_en: 'Pikachu',
            },
            form: {
              name_ja: 'フォーム2',
              name_en: 'Form 2',
            },
            typeEntries: [{ type: { slug: 'electric' } }],
          },
        },
        {
          entry_number: 25,
          formEntry: {
            id: 2,
            pokemon_id: 25,
            order: 1,
            sprite_default: 'pikachu-form1.png',
            sprite_shiny: 'pikachu-form1-shiny.png',
            pokemon: {
              name_ja: 'ピカチュウ',
              name_en: 'Pikachu',
            },
            form: {
              name_ja: 'フォーム1',
              name_en: 'Form 1',
            },
            typeEntries: [{ type: { slug: 'electric' } }],
          },
        },
      ];

      const result = groupEntriesByPokemon(entries);

      expect(result[25].forms).toHaveLength(2);
      // フォームはorder順にソートされる
      expect(result[25].forms[0].order).toBe(1);
      expect(result[25].forms[1].order).toBe(2);
    });

    it('should skip entries with null formEntry', () => {
      const entries: PokedexEntryWithRelations[] = [
        {
          entry_number: 25,
          formEntry: null,
        },
      ];

      const result = groupEntriesByPokemon(entries);

      expect(result).toEqual({});
    });

    it('should handle empty entries array', () => {
      const result = groupEntriesByPokemon([]);

      expect(result).toEqual({});
    });

    it('should prioritize regional forms when regionId is provided', () => {
      const entries: PokedexEntryWithRelations[] = [
        {
          entry_number: 103,
          formEntry: {
            id: 1,
            pokemon_id: 103,
            order: 1,
            sprite_default: 'exeggutor-normal.png',
            sprite_shiny: 'exeggutor-normal-shiny.png',
            pokemon: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
            },
            form: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
              region: { id: 1, name_ja: '全国', name_en: 'Global', slug: 'global' },
            },
            typeEntries: [{ type: { slug: 'grass' } }, { type: { slug: 'psychic' } }],
          },
        },
        {
          entry_number: 103,
          formEntry: {
            id: 2,
            pokemon_id: 103,
            order: 2,
            sprite_default: 'exeggutor-alola.png',
            sprite_shiny: 'exeggutor-alola-shiny.png',
            pokemon: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
            },
            form: {
              name_ja: 'アローラのすがた',
              name_en: 'Alolan Form',
              region: { id: 70, name_ja: 'アローラ', name_en: 'Alola', slug: 'alola' },
            },
            typeEntries: [{ type: { slug: 'grass' } }, { type: { slug: 'dragon' } }],
          },
        },
      ];

      // アローラ地方の図鑑で検索した場合
      const result = groupEntriesByPokemon(entries, 70);

      expect(result[103].forms).toHaveLength(2);
      // アローラフォームが先頭に来る
      expect(result[103].forms[0].nameJa).toBe('アローラのすがた');
      expect(result[103].forms[1].nameJa).toBe('ナッシー');
    });

    it('should maintain order when no regional forms match', () => {
      const entries: PokedexEntryWithRelations[] = [
        {
          entry_number: 103,
          formEntry: {
            id: 1,
            pokemon_id: 103,
            order: 1,
            sprite_default: 'exeggutor-normal.png',
            sprite_shiny: 'exeggutor-normal-shiny.png',
            pokemon: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
            },
            form: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
              region: { id: 1, name_ja: '全国', name_en: 'Global', slug: 'global' },
            },
            typeEntries: [],
          },
        },
        {
          entry_number: 103,
          formEntry: {
            id: 2,
            pokemon_id: 103,
            order: 2,
            sprite_default: 'exeggutor-alola.png',
            sprite_shiny: 'exeggutor-alola-shiny.png',
            pokemon: {
              name_ja: 'ナッシー',
              name_en: 'Exeggutor',
            },
            form: {
              name_ja: 'アローラのすがた',
              name_en: 'Alolan Form',
              region: { id: 70, name_ja: 'アローラ', name_en: 'Alola', slug: 'alola' },
            },
            typeEntries: [],
          },
        },
      ];

      // カントー地方の図鑑で検索した場合（region_id = 1）
      const result = groupEntriesByPokemon(entries, 1);

      expect(result[103].forms).toHaveLength(2);
      // 通常のorder順を維持
      expect(result[103].forms[0].order).toBe(1);
      expect(result[103].forms[1].order).toBe(2);
    });
  });

  describe('paginateAndFormatResults', () => {
    const mockGrouped: Record<number, PokemonWithFormsAndOrder> = {
      1: {
        id: 1,
        nameJa: 'フシギダネ',
        nameEn: 'Bulbasaur',
        entryNumber: 1,
        forms: [
          {
            id: 1,
            nameJa: 'フシギダネ',
            nameEn: 'Bulbasaur',
            types: ['grass', 'poison'],
            spriteDefault: 'bulbasaur.png',
            spriteShiny: 'bulbasaur-shiny.png',
            order: 1,
          },
        ],
      },
      2: {
        id: 2,
        nameJa: 'フシギソウ',
        nameEn: 'Ivysaur',
        entryNumber: 2,
        forms: [
          {
            id: 2,
            nameJa: 'フシギソウ',
            nameEn: 'Ivysaur',
            types: ['grass', 'poison'],
            spriteDefault: 'ivysaur.png',
            spriteShiny: 'ivysaur-shiny.png',
            order: 1,
          },
        ],
      },
      3: {
        id: 3,
        nameJa: 'フシギバナ',
        nameEn: 'Venusaur',
        entryNumber: 3,
        forms: [
          {
            id: 3,
            nameJa: 'フシギバナ',
            nameEn: 'Venusaur',
            types: ['grass', 'poison'],
            spriteDefault: 'venusaur.png',
            spriteShiny: 'venusaur-shiny.png',
            order: 1,
          },
        ],
      },
    };

    it('should paginate results correctly', () => {
      const result = paginateAndFormatResults(mockGrouped, 1, 2);

      expect(result.total).toBe(3);
      expect(result.pokemons).toHaveLength(2);
      expect(result.pokemons[0].id).toBe(1);
      expect(result.pokemons[1].id).toBe(2);
    });

    it('should handle second page correctly', () => {
      const result = paginateAndFormatResults(mockGrouped, 2, 2);

      expect(result.total).toBe(3);
      expect(result.pokemons).toHaveLength(1);
      expect(result.pokemons[0].id).toBe(3);
    });

    it('should remove order property from forms', () => {
      const result = paginateAndFormatResults(mockGrouped, 1, 1);

      expect(result.pokemons[0].forms[0]).not.toHaveProperty('order');
      expect(result.pokemons[0].forms[0]).toEqual({
        id: 1,
        nameJa: 'フシギダネ',
        nameEn: 'Bulbasaur',
        types: ['grass', 'poison'],
        spriteDefault: 'bulbasaur.png',
        spriteShiny: 'bulbasaur-shiny.png',
      });
    });

    it('should handle empty grouped data', () => {
      const result = paginateAndFormatResults({}, 1, 10);

      expect(result).toEqual({
        pokemons: [],
        total: 0,
      });
    });

    it('should handle page beyond available data', () => {
      const result = paginateAndFormatResults(mockGrouped, 10, 10);

      expect(result.total).toBe(3);
      expect(result.pokemons).toEqual([]);
    });

    it('should handle page size larger than total data', () => {
      const result = paginateAndFormatResults(mockGrouped, 1, 10);

      expect(result.total).toBe(3);
      expect(result.pokemons).toHaveLength(3);
    });
  });
});
