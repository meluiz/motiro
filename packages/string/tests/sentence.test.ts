import { describe, expect, it } from 'vitest';

import { sentence } from '../src/sentence';

describe('sentence', () => {
  describe('default separators (Oxford comma, matches Intl.ListFormat)', () => {
    it('returns an empty string for an empty array', () => {
      expect(sentence([])).toBe('');
    });

    it('returns the sole item unchanged for a single value', () => {
      expect(sentence(['apple'])).toBe('apple');
    });

    it('joins a pair with "and", no comma', () => {
      expect(sentence(['apple', 'banana'])).toBe('apple and banana');
    });

    it('joins three or more with a serial comma before the last', () => {
      expect(sentence(['apple', 'banana', 'cherry'])).toBe('apple, banana, and cherry');
      expect(sentence(['a', 'b', 'c', 'd'])).toBe('a, b, c, and d');
    });
  });

  describe('value coercion', () => {
    it('coerces numeric values to strings', () => {
      expect(sentence([1, 2, 3])).toBe('1, 2, and 3');
      expect(sentence([42])).toBe('42');
      expect(sentence([0])).toBe('0');
    });

    it('keeps empty-string items in place', () => {
      expect(sentence(['a', '', 'c'])).toBe('a, , and c');
    });
  });

  describe('custom separators', () => {
    it('applies separator and lastSeparator to lists of three or more', () => {
      expect(sentence([1, 2, 3], { separator: ' / ', lastSeparator: ' & ' })).toBe('1 / 2 & 3');
    });

    it('applies pairSeparator only to a pair', () => {
      expect(sentence(['a', 'b'], { pairSeparator: ' + ' })).toBe('a + b');
    });

    it('does not apply pairSeparator to lists of three or more', () => {
      expect(sentence(['a', 'b', 'c'], { pairSeparator: ' + ' })).toBe('a, b, and c');
    });

    it('does not apply separator to a pair', () => {
      expect(sentence(['a', 'b'], { separator: ' / ' })).toBe('a and b');
    });
  });
});
