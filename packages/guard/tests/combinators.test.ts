import { describe, expect, it } from 'vitest';

import {
  isArrayOf,
  isInstanceOf,
  isLiteral,
  isNonEmptyArray,
  isOneOf,
  isShape,
  not,
  nullable,
  optional,
} from '../src/combinators';
import { isNumber, isString } from '../src/primitives';

describe('combinators', () => {
  describe('isOneOf', () => {
    const isKey = isOneOf(isString, isNumber);

    it.each([
      ['a', true],
      [1, true],
      [true, false],
      [null, false],
    ] as const)('isOneOf(isString, isNumber)(%o) → %s', (value, expected) => {
      expect(isKey(value)).toBe(expected);
    });

    it('an empty set of guards rejects everything', () => {
      expect(isOneOf()('x')).toBe(false);
    });
  });

  describe('isArrayOf', () => {
    const isStrings = isArrayOf(isString);

    it.each([
      [['a', 'b'], true],
      [[], true],
      [['a', 1], false],
      ['ab', false],
    ] as const)('isArrayOf(isString)(%o) → %s', (value, expected) => {
      expect(isStrings(value)).toBe(expected);
    });

    it('nests with other combinators', () => {
      const isPoints = isArrayOf(isShape({ x: isNumber }));
      expect(isPoints([{ x: 1 }, { x: 2 }])).toBe(true);
      expect(isPoints([{ x: 1 }, { x: 'no' }])).toBe(false);
    });
  });

  describe('isShape (non-exhaustive)', () => {
    const isPoint = isShape({ x: isNumber, y: isNumber });

    it('validates present keys and ignores extras', () => {
      expect(isPoint({ x: 1, y: 2 })).toBe(true);
      expect(isPoint({ x: 1, y: 2, z: 3 })).toBe(true);
    });

    it('fails on a missing or mistyped key', () => {
      expect(isPoint({ x: 1 })).toBe(false);
      expect(isPoint({ x: 1, y: 'no' })).toBe(false);
    });

    it('rejects non-objects', () => {
      expect(isPoint(null)).toBe(false);
      expect(isPoint([])).toBe(false);
    });

    it('an empty shape accepts any object', () => {
      expect(isShape({})({ anything: 1 })).toBe(true);
    });

    it('checks symbol keys in the shape', () => {
      const id = Symbol('id');
      const guard = isShape({ [id]: isNumber });
      expect(guard({ [id]: 1 })).toBe(true);
      expect(guard({ [id]: 'no' })).toBe(false);
    });
  });

  describe('isLiteral', () => {
    const isDir = isLiteral('up', 'down');

    it.each([
      ['up', true],
      ['down', true],
      ['left', false],
      [1, false],
    ] as const)('isLiteral("up", "down")(%o) → %s', (value, expected) => {
      expect(isDir(value)).toBe(expected);
    });

    it('matches null and undefined literals', () => {
      const guard = isLiteral(null, undefined);
      expect(guard(null)).toBe(true);
      expect(guard(undefined)).toBe(true);
      expect(guard(0)).toBe(false);
    });
  });

  describe('isInstanceOf', () => {
    it('narrows to instances of the constructor, subclasses included', () => {
      const isErr = isInstanceOf(Error);
      expect(isErr(new TypeError())).toBe(true);
      expect(isErr(new Error())).toBe(true);
      expect(isErr('nope')).toBe(false);
    });
  });

  describe('isNonEmptyArray', () => {
    it('without a guard, checks only non-emptiness', () => {
      expect(isNonEmptyArray()([1])).toBe(true);
      expect(isNonEmptyArray()([])).toBe(false);
      expect(isNonEmptyArray()('ab')).toBe(false);
    });

    it('with a guard, also validates every element', () => {
      const isStrings = isNonEmptyArray(isString);
      expect(isStrings(['a'])).toBe(true);
      expect(isStrings(['a', 1])).toBe(false);
      expect(isStrings([])).toBe(false);
    });
  });

  describe('not', () => {
    const isNotString = not(isString);

    it.each([
      [1, true],
      [null, true],
      ['a', false],
    ] as const)('not(isString)(%o) → %s', (value, expected) => {
      expect(isNotString(value)).toBe(expected);
    });

    it('double negation round-trips', () => {
      expect(not(not(isString))('a')).toBe(true);
      expect(not(not(isString))(1)).toBe(false);
    });
  });

  describe('optional / nullable', () => {
    it('optional accepts undefined but not null', () => {
      const guard = optional(isString);
      expect(guard('a')).toBe(true);
      expect(guard(undefined)).toBe(true);
      expect(guard(null)).toBe(false);
    });

    it('nullable accepts null but not undefined', () => {
      const guard = nullable(isString);
      expect(guard('a')).toBe(true);
      expect(guard(null)).toBe(true);
      expect(guard(undefined)).toBe(false);
    });

    it('composes: optional(nullable(guard)) accepts both', () => {
      const guard = optional(nullable(isString));
      expect(guard(null)).toBe(true);
      expect(guard(undefined)).toBe(true);
      expect(guard('a')).toBe(true);
      expect(guard(1)).toBe(false);
    });
  });
});
