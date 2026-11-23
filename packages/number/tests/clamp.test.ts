import { describe, expect, it } from 'vitest';

import { clamp } from '../src/clamp';

describe('clamp', () => {
  describe('both bounds', () => {
    it.each([
      [15, 10],
      [-5, 0],
      [5, 5],
      [0, 0],
      [10, 10],
    ] as const)('clamp(%o, { min: 0, max: 10 }) → %o', (value, expected) => {
      expect(clamp(value, { min: 0, max: 10 })).toBe(expected);
    });

    it('treats both bounds as inclusive', () => {
      expect(clamp(0, { min: 0, max: 10 })).toBe(0);
      expect(clamp(10, { min: 0, max: 10 })).toBe(10);
    });

    it('pins every value to a single point when min equals max', () => {
      expect(clamp(-100, { min: 3, max: 3 })).toBe(3);
      expect(clamp(100, { min: 3, max: 3 })).toBe(3);
    });

    it('works with negative and fractional bounds', () => {
      expect(clamp(-0.5, { min: -2.5, max: -1.5 })).toBe(-1.5);
      expect(clamp(-3, { min: -2.5, max: -1.5 })).toBe(-2.5);
    });
  });

  describe('a single bound', () => {
    it('bounds only from below when max is omitted', () => {
      expect(clamp(-5, { min: 0 })).toBe(0);
      expect(clamp(1e9, { min: 0 })).toBe(1e9);
    });

    it('bounds only from above when min is omitted', () => {
      expect(clamp(15, { max: 10 })).toBe(10);
      expect(clamp(-1e9, { max: 10 })).toBe(-1e9);
    });

    it('treats an explicit undefined like an omitted bound', () => {
      expect(clamp(-5, { min: undefined, max: 10 })).toBe(-5);
      expect(clamp(15, { min: 0, max: undefined })).toBe(15);
    });
  });

  describe('no bounds', () => {
    it('returns the value unchanged', () => {
      expect(clamp(42, {})).toBe(42);
      expect(clamp(-42, {})).toBe(-42);
    });
  });

  describe('edge cases', () => {
    it('throws a RangeError when min is greater than max', () => {
      expect(() => clamp(5, { min: 10, max: 0 })).toThrow(RangeError);
    });

    it('throws a RangeError when a bound is NaN', () => {
      expect(() => clamp(5, { min: Number.NaN })).toThrow(RangeError);
      expect(() => clamp(5, { max: Number.NaN })).toThrow(RangeError);
      expect(() => clamp(5, { min: Number.NaN, max: 10 })).toThrow(RangeError);
    });

    it('propagates a NaN value rather than rejecting it', () => {
      expect(clamp(Number.NaN, { min: 0, max: 10 })).toBeNaN();
      expect(clamp(Number.NaN, { min: 0 })).toBeNaN();
      expect(clamp(Number.NaN, { max: 10 })).toBeNaN();
    });

    it('clamps infinities to the nearest bound', () => {
      expect(clamp(Number.POSITIVE_INFINITY, { min: 0, max: 10 })).toBe(10);
      expect(clamp(Number.NEGATIVE_INFINITY, { min: 0, max: 10 })).toBe(0);
    });

    it('accepts infinite bounds', () => {
      expect(clamp(5, { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY })).toBe(
        5,
      );
    });
  });
});
