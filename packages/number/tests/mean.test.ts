import { describe, expect, it } from 'vitest';

import { mean } from '../src/mean';

describe('mean', () => {
  describe('basic averages', () => {
    it.each([
      [[1, 2, 3, 4], 2.5],
      [[10], 10],
      [[-5, 5], 0],
      [[2, 2, 2], 2],
      [[1, 2, 3], 2],
    ] as const)('mean(%o) → %o', (values, expected) => {
      expect(mean(values)).toBe(expected);
    });
  });

  describe('floating-point accumulation', () => {
    it('does not drift when averaging many small values', () => {
      expect(mean(Array.from({ length: 10000 }, () => 0.1))).toBe(0.1);
    });

    it('averages a long alternating sequence to zero', () => {
      const values = Array.from({ length: 10000 }, (_, index) => {
        return index % 2 === 0 ? 0.1 : -0.1;
      });

      expect(mean(values)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('throws a RangeError for an empty list', () => {
      // The mean of nothing is undefined. Returning 0 would report an empty
      // dataset as one centred on zero, which is a different fact.
      expect(() => mean([])).toThrow(RangeError);
    });

    it('propagates NaN from any position', () => {
      expect(mean([1, Number.NaN, 3])).toBeNaN();
    });

    it('returns an infinity when one is present', () => {
      expect(mean([1, Number.POSITIVE_INFINITY])).toBe(Number.POSITIVE_INFINITY);
    });

    it('returns NaN when infinities of both signs are mixed', () => {
      expect(mean([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])).toBeNaN();
    });

    it('keeps small values that a larger one would swallow', () => {
      expect(mean([1e100, 3, -1e100])).toBe(1);
    });

    it('stays finite when the total of finite values would overflow', () => {
      expect(mean([Number.MAX_VALUE, Number.MAX_VALUE])).toBe(Number.MAX_VALUE);
      expect(mean([-Number.MAX_VALUE, -Number.MAX_VALUE])).toBe(-Number.MAX_VALUE);
    });

    it('accepts a readonly array', () => {
      const values = [2, 4] as const;
      expect(mean(values)).toBe(3);
    });
  });
});
