import { describe, expect, it } from 'vitest';

import { sum } from '../src/sum';

describe('sum', () => {
  describe('basic totals', () => {
    it.each([
      [[1, 2, 3, 4], 10],
      [[10], 10],
      [[-5, 5], 0],
      [[-1, -2, -3], -6],
      [[0, 0, 0], 0],
    ] as const)('sum(%o) → %o', (values, expected) => {
      expect(sum(values)).toBe(expected);
    });

    it('returns zero for an empty list, the identity for addition', () => {
      expect(sum([])).toBe(0);
    });
  });

  describe('floating-point accumulation', () => {
    it('does not drift when adding many small values', () => {
      expect(sum(Array.from({ length: 10000 }, () => 0.1))).toBe(1000);
    });

    it('does not drift over a long alternating sequence', () => {
      const values = Array.from({ length: 10000 }, (_, index) => {
        return index % 2 === 0 ? 0.1 : -0.1;
      });

      expect(sum(values)).toBe(0);
    });

    it('does not correct representation error, only accumulation error', () => {
      // 0.1 and 0.2 are each inexact as binary floats, and no summation
      // strategy recovers digits that were never there. Compensation fixes
      // drift across many additions, not the values themselves.
      expect(sum([0.1, 0.2])).toBe(0.30000000000000004);
    });

    it('keeps small values that a larger one would swallow', () => {
      // Plain Kahan assumes the running total is the larger operand and loses
      // the 1 here; Neumaier's variant recovers it.
      expect(sum([1e100, 1, -1e100])).toBe(1);
      expect(sum([1, 1e100, 1, -1e100])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('propagates NaN from any position', () => {
      expect(sum([1, Number.NaN, 3])).toBeNaN();
      expect(sum([Number.NaN])).toBeNaN();
    });

    it('returns an infinity when one is present', () => {
      expect(sum([1, Number.POSITIVE_INFINITY])).toBe(Number.POSITIVE_INFINITY);
      expect(sum([1, Number.NEGATIVE_INFINITY])).toBe(Number.NEGATIVE_INFINITY);
    });

    it('returns NaN when infinities of both signs are mixed', () => {
      expect(sum([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])).toBeNaN();
    });

    it('accepts a readonly array', () => {
      const values = [1, 2, 3] as const;
      expect(sum(values)).toBe(6);
    });
  });
});
