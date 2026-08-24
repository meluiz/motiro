import { describe, expect, it } from 'vitest';

import {
  isBigInt,
  isBoolean,
  isDefined,
  isNil,
  isNull,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from '../src/primitives';

describe('primitives', () => {
  describe('isString', () => {
    it.each([
      ['a', true],
      ['', true],
      [1, false],
      [true, false],
      [null, false],
      [{}, false],
    ] as const)('isString(%o) → %s', (value, expected) => {
      expect(isString(value)).toBe(expected);
    });

    it('rejects a boxed String object', () => {
      expect(isString(new String('a'))).toBe(false);
    });
  });

  describe('isNumber', () => {
    // NaN is excluded by design; Infinity passes (use isNumberFinite to exclude it).
    it.each([
      [1, true],
      [0, true],
      [-1.5, true],
      [Infinity, true],
      [-Infinity, true],
      [Number.NaN, false],
      ['1', false],
      [1n, false],
      [null, false],
    ] as const)('isNumber(%o) → %s', (value, expected) => {
      expect(isNumber(value)).toBe(expected);
    });

    it('rejects a boxed Number object', () => {
      expect(isNumber(new Number(1))).toBe(false);
    });
  });

  describe('isBoolean', () => {
    it.each([
      [true, true],
      [false, true],
      [0, false],
      [1, false],
      ['true', false],
      [null, false],
    ] as const)('isBoolean(%o) → %s', (value, expected) => {
      expect(isBoolean(value)).toBe(expected);
    });

    it('rejects a boxed Boolean object', () => {
      expect(isBoolean(new Boolean(true))).toBe(false);
    });
  });

  describe('isBigInt', () => {
    it.each([
      [1n, true],
      [BigInt(9), true],
      [1, false],
      ['1', false],
    ] as const)('isBigInt(%o) → %s', (value, expected) => {
      expect(isBigInt(value)).toBe(expected);
    });
  });

  describe('isSymbol', () => {
    it('matches unique and global symbols only', () => {
      expect(isSymbol(Symbol('x'))).toBe(true);
      expect(isSymbol(Symbol.for('x'))).toBe(true);
      expect(isSymbol('x')).toBe(false);
    });
  });

  describe('isNull', () => {
    it.each([
      [null, true],
      [undefined, false],
      [0, false],
      ['', false],
    ] as const)('isNull(%o) → %s', (value, expected) => {
      expect(isNull(value)).toBe(expected);
    });
  });

  describe('isUndefined', () => {
    it.each([
      [undefined, true],
      [null, false],
      [0, false],
    ] as const)('isUndefined(%o) → %s', (value, expected) => {
      expect(isUndefined(value)).toBe(expected);
    });
  });

  describe('isNil (null or undefined)', () => {
    it.each([
      [null, true],
      [undefined, true],
      [0, false],
      ['', false],
      [false, false],
      [Number.NaN, false],
    ] as const)('isNil(%o) → %s', (value, expected) => {
      expect(isNil(value)).toBe(expected);
    });
  });

  describe('isDefined (neither null nor undefined)', () => {
    it.each([
      [0, true],
      ['', true],
      [false, true],
      [Number.NaN, true],
      [null, false],
      [undefined, false],
    ] as const)('isDefined(%o) → %s', (value, expected) => {
      expect(isDefined(value)).toBe(expected);
    });

    it('narrows away null and undefined in a filter', () => {
      expect([1, null, 2, undefined].filter(isDefined)).toEqual([1, 2]);
    });
  });
});
