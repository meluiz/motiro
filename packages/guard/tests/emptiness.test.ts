import { describe, expect, it } from 'vitest';

import { isEmptyArray, isEmptyObject, isEmptyString } from '../src/emptiness';

describe('emptiness', () => {
  describe('isEmptyString', () => {
    it.each([
      ['', true],
      [' ', false],
      ['a', false],
      [0, false],
      [null, false],
    ] as const)('isEmptyString(%o) → %s', (value, expected) => {
      expect(isEmptyString(value)).toBe(expected);
    });
  });

  describe('isEmptyArray', () => {
    it.each([
      [[], true],
      [[1], false],
      [{}, false],
      ['', false],
    ] as const)('isEmptyArray(%o) → %s', (value, expected) => {
      expect(isEmptyArray(value)).toBe(expected);
    });
  });

  describe('isEmptyObject', () => {
    it('is true for objects with no own string or symbol keys', () => {
      expect(isEmptyObject({})).toBe(true);
      expect(isEmptyObject(Object.create(null))).toBe(true);
      expect(isEmptyObject(new Date())).toBe(true);
    });

    it('is false when the object has any own key', () => {
      expect(isEmptyObject({ a: 1 })).toBe(false);
      expect(isEmptyObject({ [Symbol('s')]: 1 })).toBe(false);
    });

    it('is false for non-objects', () => {
      expect(isEmptyObject(null)).toBe(false);
      expect(isEmptyObject('')).toBe(false);
      expect(isEmptyObject(0)).toBe(false);
    });

    it('is false for an array, whose own "length" key counts', () => {
      // The JSDoc claims [] is reported as empty — it is NOT, because
      // Reflect.ownKeys([]) includes "length". This pins the real behavior;
      // the JSDoc @remarks should be corrected to match.
      expect(isEmptyObject([])).toBe(false);
    });
  });
});
