import { describe, expect, it } from 'vitest';

import { capitalize } from '../src/capitalize';

describe('capitalize', () => {
  describe('default (lowercases the rest)', () => {
    it.each([
      ['hello WORLD', 'Hello world'],
      ['HELLO', 'Hello'],
      ['hELLo', 'Hello'],
      ['john doe', 'John doe'],
      ['çeu', 'Çeu'],
      ['a', 'A'],
      ['Z', 'Z'],
      ['1ABC', '1abc'],
      [' hELLO', ' hello'],
      ['', ''],
    ])('capitalize(%j) → %j', (input, expected) => {
      expect(capitalize(input)).toBe(expected);
    });

    it('treats undefined and empty options as default', () => {
      expect(capitalize('aB', undefined)).toBe('Ab');
      expect(capitalize('aB', {})).toBe('Ab');
    });
  });

  describe('preserveCase: true', () => {
    it.each([
      ['hello WORLD', 'Hello WORLD'],
      ['hELLO', 'HELLO'],
      ['iPhone', 'IPhone'],
      ['çeu', 'Çeu'],
      ['1ABC', '1ABC'],
      ['', ''],
    ])('capitalize(%j, { preserveCase: true }) → %j', (input, expected) => {
      expect(capitalize(input, { preserveCase: true })).toBe(expected);
    });
  });

  describe('idempotence', () => {
    it.each(['hello WORLD', 'çeu', '1ABC', ''])('capitalize is idempotent for %j', (input) => {
      expect(capitalize(capitalize(input))).toBe(capitalize(input));
    });
  });

  describe('unicode edge cases', () => {
    it('does not corrupt an astral-plane first character', () => {
      expect(capitalize('𝒳yz')).toBe('𝒳yz');
    });

    it('handles case expansion on the first character', () => {
      expect(capitalize('ﬀx')).toBe('FFx');
    });

    it('is locale-independent by design', () => {
      expect(capitalize('istanbul')).toBe('Istanbul');
    });
  });
});
