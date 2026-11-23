import { describe, expect, it } from 'vitest';

import { round } from '../src/round';

describe('round', () => {
  describe('decimal places', () => {
    it.each([
      [1.2345, 2, 1.23],
      [1.2355, 2, 1.24],
      [1.5, 0, 2],
      [1.4, 0, 1],
      // biome-ignore lint/suspicious/noApproximativeNumericConstant: test fixture for decimal rounding, not a stand-in for Math.PI
      [3.14159, 3, 3.142],
    ] as const)('round(%o, %o) → %o', (value, decimals, expected) => {
      expect(round(value, decimals)).toBe(expected);
    });

    it('rounds to whole numbers when no precision is given', () => {
      expect(round(1.7)).toBe(2);
      expect(round(1.2)).toBe(1);
    });

    it('leaves a value that already fits untouched', () => {
      expect(round(1.5, 2)).toBe(1.5);
      expect(round(42, 2)).toBe(42);
    });

    it('truncates a fractional precision to a whole number of places', () => {
      expect(round(1.2345, 2.9)).toBe(round(1.2345, 2));
    });
  });

  describe('scaling accuracy', () => {
    // These are the cases the naive `Math.round(v * 10 ** d) / 10 ** d` gets
    // wrong: the scaled value is not exactly representable, so the rounding
    // decision is made against the wrong number.
    it.each([
      [1.005, 2, 1.01],
      [2.675, 2, 2.68],
      [1.015, 2, 1.02],
      [8.575, 2, 8.58],
    ] as const)('round(%o, %o) → %o', (value, decimals, expected) => {
      expect(round(value, decimals)).toBe(expected);
    });

    it('still rounds down when the value is genuinely below the halfway point', () => {
      expect(round(1.0049999, 2)).toBe(1);
    });
  });

  describe('sign handling', () => {
    it('rounds halfway values away from zero, symmetrically', () => {
      expect(round(2.5)).toBe(3);
      expect(round(-2.5)).toBe(-3);
    });

    it('keeps magnitudes equal for opposite signs', () => {
      expect(round(-1.005, 2)).toBe(-1.01);
      expect(round(-1.2345, 2)).toBe(-1.23);
    });
  });

  describe('negative precision', () => {
    it('rounds to the left of the decimal point', () => {
      expect(round(1234, -2)).toBe(1200);
      expect(round(1250, -2)).toBe(1300);
      expect(round(1234, -3)).toBe(1000);
    });
  });

  describe('edge cases', () => {
    it('returns non-finite values unchanged', () => {
      expect(round(Number.NaN, 2)).toBeNaN();
      expect(round(Number.POSITIVE_INFINITY, 2)).toBe(Number.POSITIVE_INFINITY);
      expect(round(Number.NEGATIVE_INFINITY, 2)).toBe(Number.NEGATIVE_INFINITY);
    });

    it('rounds values small enough to be written in exponential notation', () => {
      expect(round(1e-7, 2)).toBe(0);
      expect(round(0.000000123, 3)).toBe(0);
      expect(round(1.5e-7, 7)).toBe(2e-7);
    });

    it('rounds values large enough to be written in exponential notation', () => {
      expect(round(1e21, 2)).toBe(1e21);
      expect(round(1.5e21, 0)).toBe(1.5e21);
      expect(round(1e21, -2)).toBe(1e21);
    });

    it('rounds the smallest subnormal to zero', () => {
      expect(round(5e-324, 2)).toBe(0);
    });

    it('returns values too large for the requested precision unchanged', () => {
      expect(round(1e300, 10)).toBe(1e300);
      expect(round(Number.MAX_VALUE, 2)).toBe(Number.MAX_VALUE);
    });

    it('never returns a negative zero', () => {
      expect(Object.is(round(-0.4), 0)).toBe(true);
      expect(Object.is(round(-0.001, 2), 0)).toBe(true);
      expect(Object.is(round(-0), 0)).toBe(true);
    });

    it('returns zero unchanged', () => {
      expect(round(0, 2)).toBe(0);
    });

    it('throws a RangeError for a precision beyond the representable range', () => {
      expect(() => round(1, 293)).toThrow(RangeError);
      expect(() => round(1, -293)).toThrow(RangeError);
    });

    it('accepts the extremes of the representable range', () => {
      expect(() => round(1, 292)).not.toThrow();
      expect(() => round(1, -292)).not.toThrow();
    });
  });
});
