import { describe, expect, it } from 'vitest';

import { random } from '../src/random';

/**
 * Runs a block with Math.random pinned to a fixed value, restoring the original
 * afterwards even if the block throws.
 */
const withMathRandom = (value: number, run: () => void) => {
  const original = Math.random;
  Math.random = () => value;
  try {
    run();
  } finally {
    Math.random = original;
  }
};

/** The largest value Math.random can return. */
const ALMOST_ONE = 1 - Number.EPSILON / 2;

describe('random', () => {
  describe('integer mode', () => {
    it('stays within the bounds across many draws', () => {
      for (let index = 0; index < 1000; index++) {
        const value = random(1, 6);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(6);
      }
    });

    it('always returns an integer', () => {
      for (let index = 0; index < 100; index++) {
        expect(Number.isInteger(random(0, 100))).toBe(true);
      }
    });

    it('can reach both bounds, which are inclusive', () => {
      withMathRandom(0, () => {
        expect(random(1, 6)).toBe(1);
      });
      withMathRandom(ALMOST_ONE, () => {
        expect(random(1, 6)).toBe(6);
      });
    });

    it('returns the value itself when min equals max', () => {
      expect(random(7, 7)).toBe(7);
    });

    it('handles negative ranges', () => {
      withMathRandom(0, () => {
        expect(random(-10, -5)).toBe(-10);
      });
      withMathRandom(ALMOST_ONE, () => {
        expect(random(-10, -5)).toBe(-5);
      });
    });

    it('narrows fractional bounds inward to the integers they contain', () => {
      withMathRandom(0, () => {
        expect(random(2.3, 5.8)).toBe(3);
      });
      withMathRandom(ALMOST_ONE, () => {
        expect(random(2.3, 5.8)).toBe(5);
      });
    });

    it('eventually produces every value in a small range', () => {
      const seen = new Set<number>();

      for (let index = 0; index < 10000; index++) {
        seen.add(random(1, 3));
      }

      expect(seen).toEqual(new Set([1, 2, 3]));
    });
  });

  describe('float mode', () => {
    it('stays within the bounds across many draws', () => {
      for (let index = 0; index < 1000; index++) {
        const value = random(0, 1, { float: true });
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('returns min exactly at the bottom of the draw', () => {
      withMathRandom(0, () => {
        expect(random(5, 10, { float: true })).toBe(5);
      });
    });

    it('excludes max, unlike integer mode', () => {
      withMathRandom(ALMOST_ONE, () => {
        expect(random(5, 10, { float: true })).toBeLessThan(10);
      });
    });

    it('lands just below max when rounding would carry the draw onto it', () => {
      withMathRandom(ALMOST_ONE, () => {
        const value = random(5, 10, { float: true });

        expect(value).toBeLessThan(10);
        expect(value).toBeGreaterThan(9.999999999);
      });
    });

    it('excludes max for negative and zero upper bounds', () => {
      withMathRandom(ALMOST_ONE, () => {
        expect(random(-10, -5, { float: true })).toBeLessThan(-5);
        expect(random(-1, 0, { float: true })).toBeLessThan(0);
      });
    });

    it('stays finite for bounds whose span overflows', () => {
      withMathRandom(0.5, () => {
        expect(random(-Number.MAX_VALUE, Number.MAX_VALUE, { float: true })).toBe(0);
      });
      withMathRandom(ALMOST_ONE, () => {
        const value = random(-Number.MAX_VALUE, Number.MAX_VALUE, { float: true });

        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeLessThan(Number.MAX_VALUE);
      });
    });

    it('returns the value itself when min equals max', () => {
      expect(random(5, 5, { float: true })).toBe(5);
    });

    it('uses the bounds as given, without narrowing them', () => {
      withMathRandom(0, () => {
        expect(random(2.3, 5.8, { float: true })).toBe(2.3);
      });
    });
  });

  describe('edge cases', () => {
    it('throws a RangeError when min is greater than max', () => {
      expect(() => random(10, 0)).toThrow(RangeError);
      expect(() => random(10, 0, { float: true })).toThrow(RangeError);
    });

    it('throws a RangeError when no integer exists between the bounds', () => {
      expect(() => random(1.2, 1.8)).toThrow(RangeError);
    });

    it('throws a RangeError when a bound is NaN', () => {
      expect(() => random(Number.NaN, 5)).toThrow(RangeError);
      expect(() => random(0, Number.NaN, { float: true })).toThrow(RangeError);
    });

    it('throws a RangeError when a bound is infinite', () => {
      expect(() => random(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
      expect(() => random(Number.NEGATIVE_INFINITY, 0, { float: true })).toThrow(RangeError);
    });

    it('allows the same fractional bounds in float mode', () => {
      expect(() => random(1.2, 1.8, { float: true })).not.toThrow();
    });
  });
});
