import { describe, expect, it } from 'vitest';

import { interpolate } from '../src/interpolate';

const UNIT = { input: [0, 1], output: [0, 100] } as const;
const CURVE = { input: [0, 50, 100], output: [0, 10, 0] } as const;

describe('interpolate', () => {
  describe('within the range', () => {
    it.each([
      [0, 0],
      [0.25, 25],
      [0.5, 50],
      [1, 100],
    ] as const)(
      'interpolate(%o, { input: [0, 1], output: [0, 100] }) → %o',
      (value, expected) => {
        expect(interpolate(value, UNIT)).toBe(expected);
      },
    );

    it('maps the endpoints exactly', () => {
      expect(interpolate(0, UNIT)).toBe(0);
      expect(interpolate(1, UNIT)).toBe(100);
    });

    it('inverts the mapping when the output descends', () => {
      const ranges = { input: [0, 1], output: [100, 0] };

      expect(interpolate(0.25, ranges)).toBe(75);
      expect(interpolate(1, ranges)).toBe(0);
    });

    it('maps across ranges that do not start at zero', () => {
      expect(interpolate(15, { input: [10, 20], output: [-5, 5] })).toBe(0);
    });
  });

  describe('piecewise ranges', () => {
    it('interpolates within each segment independently', () => {
      expect(interpolate(25, CURVE)).toBe(5);
      expect(interpolate(75, CURVE)).toBe(5);
    });

    it('returns the same value at a shared segment boundary', () => {
      expect(interpolate(50, CURVE)).toBe(10);
    });

    it('follows a slope that changes direction between segments', () => {
      expect(interpolate(10, CURVE)).toBe(2);
      expect(interpolate(90, CURVE)).toBe(2);
    });
  });

  describe('extrapolation', () => {
    it('clamps to the nearest output bound by default', () => {
      expect(interpolate(2, UNIT)).toBe(100);
      expect(interpolate(-1, UNIT)).toBe(0);
    });

    it('keeps following the outermost slope when extending', () => {
      expect(interpolate(2, UNIT, { extrapolate: 'extend' })).toBe(200);
      expect(interpolate(-1, UNIT, { extrapolate: 'extend' })).toBe(-100);
    });

    it('extends along the outermost segment of a piecewise range, not the whole span', () => {
      expect(interpolate(150, CURVE, { extrapolate: 'extend' })).toBe(-10);
    });

    it('returns the input untouched when using identity', () => {
      expect(interpolate(2, UNIT, { extrapolate: 'identity' })).toBe(2);
      expect(interpolate(-1, UNIT, { extrapolate: 'identity' })).toBe(-1);
    });

    it('does not let identity affect values inside the range', () => {
      expect(interpolate(0.5, UNIT, { extrapolate: 'identity' })).toBe(50);
    });

    it.each(['clamp', 'extend', 'identity'] as const)(
      'maps the endpoints to their outputs with %o',
      (extrapolate) => {
        const ranges = { input: [0, 1], output: [10, 20] };

        expect(interpolate(0, ranges, { extrapolate })).toBe(10);
        expect(interpolate(1, ranges, { extrapolate })).toBe(20);
      },
    );

    it('extends below the range along the first segment', () => {
      expect(interpolate(-50, CURVE, { extrapolate: 'extend' })).toBe(-10);
    });
  });

  describe('edge cases', () => {
    it('throws a RangeError when the ranges have different lengths', () => {
      expect(() => interpolate(1, { input: [0, 1], output: [0, 1, 2] })).toThrow(RangeError);
    });

    it('throws a RangeError when there are fewer than two points', () => {
      expect(() => interpolate(1, { input: [0], output: [0] })).toThrow(RangeError);
      expect(() => interpolate(1, { input: [], output: [] })).toThrow(RangeError);
    });

    it('throws a RangeError when the input range is not strictly increasing', () => {
      expect(() => interpolate(1, { input: [0, 10, 5], output: [0, 1, 2] })).toThrow(
        RangeError,
      );
    });

    it('throws a RangeError on duplicated input points, which have no width', () => {
      expect(() => interpolate(1, { input: [0, 0, 1], output: [0, 1, 2] })).toThrow(RangeError);
    });

    it('throws a RangeError when either range has a hole', () => {
      // Typed as number[] because a sparse array is how a hole reaches the
      // function at runtime despite the signature.
      // biome-ignore lint/suspicious/noSparseArray: the hole is what is under test
      const sparse = [0, 1, , 3] as number[];

      expect(() => interpolate(1.5, { input: [0, 1, 2, 3], output: sparse })).toThrow(
        RangeError,
      );
      expect(() => interpolate(1.5, { input: sparse, output: [0, 1, 2, 3] })).toThrow(
        RangeError,
      );
    });

    it('accepts an output segment with no width', () => {
      expect(interpolate(0.5, { input: [0, 1], output: [5, 5] })).toBe(5);
    });

    it('propagates NaN rather than rejecting it', () => {
      expect(interpolate(Number.NaN, UNIT)).toBeNaN();
    });

    it('resolves infinities through the chosen strategy', () => {
      expect(interpolate(Number.POSITIVE_INFINITY, UNIT)).toBe(100);
      expect(interpolate(Number.NEGATIVE_INFINITY, UNIT)).toBe(0);
    });
  });
});
