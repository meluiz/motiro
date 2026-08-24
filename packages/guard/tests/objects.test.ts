import { describe, expect, it } from 'vitest';

import {
  isArray,
  isDate,
  isError,
  isFunction,
  isMap,
  isObject,
  isObjectLike,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isThenable,
  isWeakMap,
  isWeakSet,
} from '../src/objects';

describe('objects', () => {
  describe('isObjectLike (non-null object; arrays pass)', () => {
    it.each([
      [{}, true],
      [[], true],
      [new Date(), true],
      [null, false],
      [1, false],
      ['x', false],
      [() => {}, false],
    ] as const)('isObjectLike(%o) → %s', (value, expected) => {
      expect(isObjectLike(value)).toBe(expected);
    });
  });

  describe('isObject (excludes arrays; keeps exotic objects)', () => {
    it.each([
      [{}, true],
      [new Date(), true],
      [[], false],
      [null, false],
      [1, false],
    ] as const)('isObject(%o) → %s', (value, expected) => {
      expect(isObject(value)).toBe(expected);
    });

    it('accepts a null-prototype object', () => {
      expect(isObject(Object.create(null))).toBe(true);
    });
  });

  describe('isPlainObject', () => {
    class Foo {}

    it('accepts object literals, null-proto objects and Object instances', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    it('rejects arrays, class instances and exotic objects', () => {
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Foo())).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(Object.create({}))).toBe(false);
      expect(isPlainObject(null)).toBe(false);
    });
  });

  describe('isArray', () => {
    it.each([
      [[], true],
      [[1], true],
      ['ab', false],
      [{}, false],
    ] as const)('isArray(%o) → %s', (value, expected) => {
      expect(isArray(value)).toBe(expected);
    });
  });

  describe('isFunction (accepts functions and classes)', () => {
    it('recognizes callables', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(class {})).toBe(true);
      expect(isFunction(function* () {})).toBe(true);
      expect(isFunction({})).toBe(false);
    });
  });

  describe('instance guards', () => {
    it('isDate / isRegExp / isError', () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate('2020-01-01')).toBe(false);
      expect(isRegExp(/x/)).toBe(true);
      expect(isRegExp('/x/')).toBe(false);
      expect(isError(new TypeError())).toBe(true);
      expect(isError({ message: 'x' })).toBe(false);
    });

    it('isMap / isSet / isWeakMap / isWeakSet do not cross-match', () => {
      expect(isMap(new Map())).toBe(true);
      expect(isMap(new WeakMap())).toBe(false);
      expect(isSet(new Set())).toBe(true);
      expect(isSet(new WeakSet())).toBe(false);
      expect(isWeakMap(new WeakMap())).toBe(true);
      expect(isWeakMap(new Map())).toBe(false);
      expect(isWeakSet(new WeakSet())).toBe(true);
      expect(isWeakSet(new Set())).toBe(false);
    });
  });

  describe('isPromise vs isThenable', () => {
    it('isPromise accepts only native promises (and subclasses)', () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      // biome-ignore lint/suspicious/noThenProperty: test
      expect(isPromise({ then() {} })).toBe(false);
      expect(isPromise(null)).toBe(false);
    });

    it('isThenable accepts any object with a callable then', () => {
      expect(isThenable(Promise.resolve())).toBe(true);
      // biome-ignore lint/suspicious/noThenProperty: test
      expect(isThenable({ then() {} })).toBe(true);
      // biome-ignore lint/suspicious/noThenProperty: test
      expect(isThenable({ then: 1 })).toBe(false);
      expect(isThenable({})).toBe(false);
      expect(isThenable(null)).toBe(false);
    });
  });
});
