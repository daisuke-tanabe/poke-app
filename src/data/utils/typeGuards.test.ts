import { describe, it, expect } from 'vitest';

import { isNumber, isString, isObject, transformFormEntryData, transformPokedexEntry } from './typeGuards';

describe('typeGuards', () => {
  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('42')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(true)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for valid strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('0')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(42)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(true)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for valid objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
      expect(isObject([])).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('transformFormEntryData', () => {
    it('should transform valid form entry data correctly', () => {
      const mockData = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
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

      const result = transformFormEntryData(mockData);

      expect(result).toEqual({
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
        pokemon: {
          name_ja: 'ピカチュウ',
          name_en: 'Pikachu',
        },
        form: {
          name_ja: 'ピカチュウ',
          name_en: 'Pikachu',
        },
        typeEntries: [{ type: { slug: 'electric' } }],
      });
    });

    it('should return null for invalid data', () => {
      expect(transformFormEntryData(null)).toBe(null);
      expect(transformFormEntryData(undefined)).toBe(null);
      expect(transformFormEntryData('invalid')).toBe(null);
      expect(transformFormEntryData(42)).toBe(null);
    });

    it('should return null when required fields are missing', () => {
      const invalidData = {
        id: 'invalid', // should be number
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
      };

      expect(transformFormEntryData(invalidData)).toBe(null);
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalData = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
      };

      const result = transformFormEntryData(minimalData);

      expect(result).toEqual({
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
        pokemon: null,
        form: null,
        typeEntries: undefined,
      });
    });

    it('should filter out invalid type entries', () => {
      const dataWithInvalidTypes = {
        id: 1,
        pokemon_id: 25,
        order: 1,
        sprite_default: 'default.png',
        sprite_shiny: 'shiny.png',
        typeEntries: [
          { type: { slug: 'electric' } },
          { type: { slug: null } }, // invalid
          { invalid: 'data' }, // invalid
          { type: { slug: 'water' } },
        ],
      };

      const result = transformFormEntryData(dataWithInvalidTypes);

      expect(result?.typeEntries).toEqual([{ type: { slug: 'electric' } }, { type: { slug: 'water' } }]);
    });
  });

  describe('transformPokedexEntry', () => {
    it('should transform valid pokedex entry correctly', () => {
      const mockEntry = {
        entry_number: 25,
        formEntry: {
          id: 1,
          pokemon_id: 25,
          order: 1,
          sprite_default: 'default.png',
          sprite_shiny: 'shiny.png',
          pokemon: {
            name_ja: 'ピカチュウ',
            name_en: 'Pikachu',
          },
        },
      };

      const result = transformPokedexEntry(mockEntry);

      expect(result).toEqual({
        entry_number: 25,
        formEntry: {
          id: 1,
          pokemon_id: 25,
          order: 1,
          sprite_default: 'default.png',
          sprite_shiny: 'shiny.png',
          pokemon: {
            name_ja: 'ピカチュウ',
            name_en: 'Pikachu',
          },
          form: null,
          typeEntries: undefined,
        },
      });
    });

    it('should return null for invalid data', () => {
      expect(transformPokedexEntry(null)).toBe(null);
      expect(transformPokedexEntry(undefined)).toBe(null);
      expect(transformPokedexEntry('invalid')).toBe(null);
      expect(transformPokedexEntry(42)).toBe(null);
    });

    it('should return null when entry_number is missing or invalid', () => {
      const invalidEntry = {
        entry_number: 'invalid',
        formEntry: {
          id: 1,
          pokemon_id: 25,
          order: 1,
          sprite_default: 'default.png',
          sprite_shiny: 'shiny.png',
        },
      };

      expect(transformPokedexEntry(invalidEntry)).toBe(null);
    });

    it('should return null when formEntry is missing', () => {
      const entryWithoutForm = {
        entry_number: 25,
      };

      expect(transformPokedexEntry(entryWithoutForm)).toBe(null);
    });

    it('should return null when formEntry transformation fails', () => {
      const entryWithInvalidForm = {
        entry_number: 25,
        formEntry: {
          id: 'invalid', // invalid type
        },
      };

      expect(transformPokedexEntry(entryWithInvalidForm)).toBe(null);
    });
  });
});
