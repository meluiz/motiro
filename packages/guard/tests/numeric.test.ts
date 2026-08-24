import { describe, expect, it } from 'vitest';

import {
  isInteger,
  isNegative,
  isNumberFinite,
  isPositive,
  isSafeInteger,
  isZero,
} from '../src/numeric';

describe('numeric', () => {
  describe('isInteger', () => {
    it.each([
      [3, true],
      [3.0, true],
      [-3, true],
      [0, true],
      [-0, true],
      [3.5, false],
      [Number.NaN, false],
      [Infinity, false],
      ['3', false],
    ] as const)('isInteger(%o) → %s', (value, expected) => {
      expect(isInteger(value)).toBe(expected);
    });
  });

  describe('isSafeInteger', () => {
    it.each([
      [9007199254740991, true],
      [9007199254740992, false],
      [2 ** 53, false],
      [1.5, false],
      [Infinity, false],
    ] as const)('isSafeInteger(%o) → %s', (value, expected) => {
      expect(isSafeInteger(value)).toBe(expected);
    });
  });

  describe('isNumberFinite (no coercion, excludes NaN and infinities)', () => {
    it.each([
      [1, true],
      [-1.5, true],
      [0, true],
      [Infinity, false],
      [-Infinity, false],
      [Number.NaN, false],
      ['1', false],
    ] as const)('isNumberFinite(%o) → %s', (value, expected) => {
      expect(isNumberFinite(value)).toBe(expected);
    });
  });

  describe('isPositive (zero and NaN excluded, Infinity allowed)', () => {
    it.each([
      [1, true],
      [0.001, true],
      [Infinity, true],
      [0, false],
      [-0, false],
      [-1, false],
      [Number.NaN, false],
      ['1', false],
    ] as const)('isPositive(%o) → %s', (value, expected) => {
      expect(isPositive(value)).toBe(expected);
    });
  });

  describe('isNegative (zero and NaN excluded, -Infinity allowed)', () => {
    it.each([
      [-1, true],
      [-0.001, true],
      [-Infinity, true],
      [0, false],
      [-0, false],
      [1, false],
      [Number.NaN, false],
    ] as const)('isNegative(%o) → %s', (value, expected) => {
      expect(isNegative(value)).toBe(expected);
    });
  });

  describe('isZero (matches 0 and -0, not 0n)', () => {
    it.each([
      [0, true],
      [-0, true],
      [1, false],
      [0.0001, false],
      [Number.NaN, false],
      ['0', false],
    ] as const)('isZero(%o) → %s', (value, expected) => {
      expect(isZero(value)).toBe(expected);
    });

    it('does not match the bigint zero', () => {
      expect(isZero(0n)).toBe(false);
    });
  });
});
