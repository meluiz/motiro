import { describe, expect, it } from 'vitest';

import { lerp } from '../src/lerp';

describe('lerp', () => {
  describe('within the interval', () => {
    it.each([
      [0, 0],
      [0.25, 25],
      [0.5, 50],
      [0.75, 75],
      [1, 100],
    ] as const)('lerp(0, 100, %o) → %o', (t, expected) => {
      expect(lerp(0, 100, t)).toBe(expected);
    });

    it('returns the endpoints exactly', () => {
      expect(lerp(10, 20, 0)).toBe(10);
      expect(lerp(10, 20, 1)).toBe(20);
    });

    it('interpolates downwards when end is below start', () => {
      expect(lerp(100, 0, 0.25)).toBe(75);
    });

    it('interpolates across negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it('returns the value itself when both ends are equal', () => {
      expect(lerp(5, 5, 0.3)).toBe(5);
    });
  });

  describe('outside the interval', () => {
    it('extrapolates rather than clamping', () => {
      expect(lerp(0, 100, 2)).toBe(200);
      expect(lerp(0, 100, -1)).toBe(-100);
    });
  });

  describe('edge cases', () => {
    it('propagates NaN', () => {
      expect(lerp(0, 100, Number.NaN)).toBeNaN();
      expect(lerp(Number.NaN, 100, 0.5)).toBeNaN();
    });

    it('does not throw for any finite input', () => {
      expect(() => lerp(0, 100, 99)).not.toThrow();
      expect(() => lerp(100, 0, -99)).not.toThrow();
    });
  });
});
