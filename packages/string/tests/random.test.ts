import { describe, expect, it } from 'vitest';

import { random } from '../src/random';

describe('random', () => {
  const withMathRandom = (value: number, run: () => void) => {
    const original = Math.random;
    Math.random = () => value;
    try {
      run();
    } finally {
      Math.random = original;
    }
  };

  it('returns a string of the requested length', () => {
    expect(random(64)).toHaveLength(64);
    expect(random(1)).toHaveLength(1);
  });

  it('draws from the given alphabet', () => {
    withMathRandom(0, () => {
      expect(random(4, 'abc')).toBe('aaaa');
    });
    withMathRandom(0, () => {
      expect(random(3, 'x')).toBe('xxx');
    });
  });

  it('uses only URL-safe characters by default', () => {
    expect(random(64)).toMatch(/^[A-Za-z0-9_-]{64}$/);
  });

  it('truncates a fractional length to a whole number of characters', () => {
    // Asking for 3.7 characters yields 3, not 4 — length is a count, so the
    // fractional part is dropped rather than rounded up.
    expect(random(3.7, 'a')).toBe('aaa');
    expect(random(3.2, 'a')).toBe('aaa');
  });

  describe('edge cases', () => {
    it('returns an empty string for non-positive lengths', () => {
      expect(random(0)).toBe('');
      expect(random(-1)).toBe('');
      expect(random(-5, 'abc')).toBe('');
    });

    it('returns an empty string for a non-positive length even with an empty alphabet', () => {
      expect(random(0, '')).toBe('');
    });

    it('throws a TypeError when generating from an empty alphabet', () => {
      expect(() => random(1, '')).toThrow(TypeError);
    });
  });
});
