import { describe, it, expect } from 'vitest';

import { cn, findOrThrow, assertFound } from './utils';

describe('cn', () => {
  it('should merge classes correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle Tailwind conflicts using tailwind-merge', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('should handle conditional classes', () => {
    const isVisible = true;
    const isHidden = false;
    const result = cn('base-class', isVisible && 'conditional-class', isHidden && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle arrays and objects', () => {
    const result = cn(['class1', 'class2'], { class3: true, class4: false });
    expect(result).toBe('class1 class2 class3');
  });
});

describe('findOrThrow', () => {
  const testArray = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  it('should return the found element', () => {
    const result = findOrThrow(testArray, (item) => item.name === 'Bob');
    expect(result).toEqual({ id: 2, name: 'Bob' });
  });

  it('should throw default error when element not found', () => {
    expect(() => {
      findOrThrow(testArray, (item) => item.name === 'David');
    }).toThrow('No matching element found');
  });

  it('should throw custom error when element not found', () => {
    const customError = 'User not found';
    expect(() => {
      findOrThrow(testArray, (item) => item.name === 'David', customError);
    }).toThrow(customError);
  });

  it('should work with empty array', () => {
    expect(() => {
      findOrThrow([], () => true);
    }).toThrow('No matching element found');
  });

  it('should return first matching element when multiple matches exist', () => {
    const arrayWithDuplicates = [
      { id: 1, status: 'active' },
      { id: 2, status: 'active' },
      { id: 3, status: 'inactive' },
    ];
    const result = findOrThrow(arrayWithDuplicates, (item) => item.status === 'active');
    expect(result).toEqual({ id: 1, status: 'active' });
  });
});

describe('assertFound', () => {
  it('should not throw when value is defined', () => {
    const value = 'test';
    expect(() => assertFound(value)).not.toThrow();
  });

  it('should throw default error when value is undefined', () => {
    expect(() => {
      assertFound(undefined);
    }).toThrow('値が見つかりません');
  });

  it('should throw custom error when value is undefined', () => {
    const customError = 'Custom error message';
    expect(() => {
      assertFound(undefined, customError);
    }).toThrow(customError);
  });

  it('should work with null values (should not throw)', () => {
    const value = null;
    expect(() => assertFound(value)).not.toThrow();
  });

  it('should work with falsy values except undefined', () => {
    expect(() => assertFound(0)).not.toThrow();
    expect(() => assertFound('')).not.toThrow();
    expect(() => assertFound(false)).not.toThrow();
  });

  it('should work with objects and arrays', () => {
    expect(() => assertFound({})).not.toThrow();
    expect(() => assertFound([])).not.toThrow();
  });
});
