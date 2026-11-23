import { describe, expect, it } from 'vitest';

import { range } from '../src/range';

describe('range', () => {
  describe('ascending', () => {
    it('includes start and excludes end', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
    });

    it('applies a custom step', () => {
      expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
      expect(range(1, 10, 3)).toEqual([1, 4, 7]);
    });

    it('spans negative and positive bounds', () => {
      expect(range(-3, 2)).toEqual([-3, -2, -1, 0, 1]);
    });
  });

  describe('descending', () => {
    it('counts down when end is below start', () => {
      expect(range(5, 0)).toEqual([5, 4, 3, 2, 1]);
    });

    it('ignores the sign of the step, taking direction from the bounds', () => {
      expect(range(5, 0, -1)).toEqual(range(5, 0, 1));
      expect(range(0, 5, -1)).toEqual(range(0, 5, 1));
    });

    it('applies a custom step downwards', () => {
      expect(range(10, 0, 3)).toEqual([10, 7, 4, 1]);
    });
  });

  describe('fractional steps', () => {
    it('produces the expected count and stops before end', () => {
      const values = range(0, 1, 0.1);

      expect(values).toHaveLength(10);
      expect(values[0]).toBe(0);
      expect(values[values.length - 1]).toBe(0.9);
    });

    it('never reaches or passes end', () => {
      for (const value of range(0, 1, 0.1)) {
        expect(value).toBeLessThan(1);
      }
    });

    it('is exact for steps representable as binary fractions', () => {
      expect(range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
    });

    it.each([
      [1, 1.3, 0.1, 3],
      [0, 2.1, 0.7, 3],
      [0, 0.3, 0.1, 3],
      [0, 0.7, 0.1, 7],
      [0, 1.2, 0.4, 3],
      [0, 1.1, 0.1, 11],
    ] as const)(
      'range(%o, %o, %o) excludes end despite rounding, yielding %o values',
      (start, end, step, count) => {
        expect(range(start, end, step)).toHaveLength(count);
      },
    );

    it('excludes end despite rounding when counting down', () => {
      expect(range(1.3, 1, 0.1)).toHaveLength(3);
    });

    it('still includes a final value that genuinely falls short of end', () => {
      expect(range(0, 1.05, 0.1)).toHaveLength(11);
    });
  });

  describe('empty and single-element results', () => {
    it('returns an empty array when start equals end', () => {
      expect(range(3, 3)).toEqual([]);
    });

    it('returns only start when the step overshoots end', () => {
      expect(range(0, 1, 5)).toEqual([0]);
    });
  });

  describe('edge cases', () => {
    it('throws a RangeError when the step is zero, which would never reach end', () => {
      expect(() => range(0, 5, 0)).toThrow(RangeError);
    });

    it('throws a RangeError when any argument is NaN', () => {
      expect(() => range(Number.NaN, 5)).toThrow(RangeError);
      expect(() => range(0, Number.NaN)).toThrow(RangeError);
      expect(() => range(0, 5, Number.NaN)).toThrow(RangeError);
    });

    it('throws a RangeError for an unbounded interval instead of hanging', () => {
      expect(() => range(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
      expect(() => range(Number.NEGATIVE_INFINITY, 0)).toThrow(RangeError);
    });

    it('returns only start when the step is infinite', () => {
      expect(range(0, 5, Number.POSITIVE_INFINITY)).toEqual([0]);
      expect(range(5, 0, Number.NEGATIVE_INFINITY)).toEqual([5]);
    });

    it('returns an empty array for an empty interval, even with an infinite step', () => {
      expect(range(3, 3, Number.POSITIVE_INFINITY)).toEqual([]);
    });

    it('throws a RangeError when the range is too long for an array', () => {
      expect(() => range(0, 2 ** 33)).toThrow(RangeError);
    });

    it('throws a RangeError when both bounds are the same infinity', () => {
      expect(() => range(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toThrow(
        RangeError,
      );
    });

    it('returns a new array on every call', () => {
      const first = range(0, 3);
      const second = range(0, 3);

      expect(first).toEqual(second);
      expect(first).not.toBe(second);
    });
  });
});
