import { describe, it, expect } from 'vitest';

import { searchParamsSchema } from './searchParamsSchema';

describe('searchParamsSchema', () => {
  describe('pokedex field', () => {
    it('should default to "national" when undefined', () => {
      const result = searchParamsSchema.parse({});
      expect(result.pokedex).toBe('national');
    });

    it('should accept valid string values', () => {
      const result = searchParamsSchema.parse({ pokedex: 'johto' });
      expect(result.pokedex).toBe('johto');
    });

    it('should accept empty string', () => {
      const result = searchParamsSchema.parse({ pokedex: '' });
      expect(result.pokedex).toBe('');
    });
  });

  describe('type1 field', () => {
    it('should default to empty string when undefined', () => {
      const result = searchParamsSchema.parse({});
      expect(result.type1).toBe('');
    });

    it('should accept valid string values', () => {
      const result = searchParamsSchema.parse({ type1: 'fire' });
      expect(result.type1).toBe('fire');
    });

    it('should accept empty string', () => {
      const result = searchParamsSchema.parse({ type1: '' });
      expect(result.type1).toBe('');
    });
  });

  describe('type2 field', () => {
    it('should default to empty string when undefined', () => {
      const result = searchParamsSchema.parse({});
      expect(result.type2).toBe('');
    });

    it('should accept valid string values', () => {
      const result = searchParamsSchema.parse({ type2: 'water' });
      expect(result.type2).toBe('water');
    });

    it('should accept empty string', () => {
      const result = searchParamsSchema.parse({ type2: '' });
      expect(result.type2).toBe('');
    });
  });

  describe('name field', () => {
    it('should default to empty string when undefined', () => {
      const result = searchParamsSchema.parse({});
      expect(result.name).toBe('');
    });

    it('should accept valid string values', () => {
      const result = searchParamsSchema.parse({ name: 'pikachu' });
      expect(result.name).toBe('pikachu');
    });

    it('should accept empty string', () => {
      const result = searchParamsSchema.parse({ name: '' });
      expect(result.name).toBe('');
    });
  });

  describe('page field', () => {
    it('should default to 1 when undefined', () => {
      const result = searchParamsSchema.parse({});
      expect(result.page).toBe(1);
    });

    it('should transform valid string numbers to number', () => {
      const result = searchParamsSchema.parse({ page: '5' });
      expect(result.page).toBe(5);
    });

    it('should accept "1" as minimum valid page', () => {
      const result = searchParamsSchema.parse({ page: '1' });
      expect(result.page).toBe(1);
    });

    it('should accept large page numbers', () => {
      const result = searchParamsSchema.parse({ page: '999' });
      expect(result.page).toBe(999);
    });

    it('should reject page "0"', () => {
      expect(() => {
        searchParamsSchema.parse({ page: '0' });
      }).toThrow();
    });

    it('should reject negative page numbers', () => {
      expect(() => {
        searchParamsSchema.parse({ page: '-1' });
      }).toThrow();
    });

    it('should reject non-numeric strings', () => {
      expect(() => {
        searchParamsSchema.parse({ page: 'abc' });
      }).toThrow();
    });

    it('should reject empty string for page', () => {
      expect(() => {
        searchParamsSchema.parse({ page: '' });
      }).toThrow();
    });

    it('should accept decimal numbers (parseInt truncates)', () => {
      const result = searchParamsSchema.parse({ page: '1.5' });
      expect(result.page).toBe(1);
    });

    it('should have correct error message for invalid page', () => {
      try {
        searchParamsSchema.parse({ page: '0' });
        expect.fail('Expected error to be thrown');
      } catch (error) {
        const zodError = error as { errors: { message: string }[] };
        expect(zodError.errors[0].message).toBe('ページ番号は1以上の整数である必要があります');
      }
    });
  });

  describe('complete object validation', () => {
    it('should parse valid complete object', () => {
      const input = {
        pokedex: 'johto',
        type1: 'fire',
        type2: 'flying',
        name: 'charizard',
        page: '2',
      };
      const result = searchParamsSchema.parse(input);
      expect(result).toEqual({
        pokedex: 'johto',
        type1: 'fire',
        type2: 'flying',
        name: 'charizard',
        page: 2,
      });
    });

    it('should parse object with mixed defined and undefined fields', () => {
      const input = {
        pokedex: 'kanto',
        type1: undefined,
        name: 'bulbasaur',
        page: '1',
      };
      const result = searchParamsSchema.parse(input);
      expect(result).toEqual({
        pokedex: 'kanto',
        type1: '',
        type2: '',
        name: 'bulbasaur',
        page: 1,
      });
    });

    it('should apply all defaults for empty object', () => {
      const result = searchParamsSchema.parse({});
      expect(result).toEqual({
        pokedex: 'national',
        type1: '',
        type2: '',
        name: '',
        page: 1,
      });
    });
  });
});
