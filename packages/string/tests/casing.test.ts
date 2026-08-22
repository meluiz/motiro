import { describe, expect, it } from 'vitest';

import {
  toAdaCase,
  toCamelCase,
  toCapitalCase,
  toCobolCase,
  toConstantCase,
  toDotNotationCase,
  toKebabCase,
  toLowerCase,
  toNoCase,
  toPascalCase,
  toPathCase,
  toSentenceCase,
  toSnakeCase,
  toSpaceCase,
  toTitleCase,
  toTrainCase,
  toUpperCase,
} from '../src/casing';

describe('case conversion (change-case spec)', () => {
  const input = 'hello world';

  it('converts to camelCase', () => {
    expect(toCamelCase(input)).toBe('helloWorld');
    expect(toCamelCase('XMLHttpRequest')).toBe('xmlHttpRequest');
    expect(toCamelCase('')).toBe('');
  });

  it('converts to PascalCase', () => {
    expect(toPascalCase(input)).toBe('HelloWorld');
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
  });

  it('converts to separated lowercase cases', () => {
    expect(toKebabCase(input)).toBe('hello-world');
    expect(toSnakeCase(input)).toBe('hello_world');
    expect(toSpaceCase('hello-world')).toBe('hello world');
    expect(toDotNotationCase(input)).toBe('hello.world');
    expect(toPathCase(input)).toBe('hello/world');
  });

  it('converts to separated uppercase cases', () => {
    expect(toConstantCase(input)).toBe('HELLO_WORLD');
    expect(toCobolCase(input)).toBe('HELLO-WORLD');
  });

  it('converts to capitalized separated cases', () => {
    expect(toTrainCase(input)).toBe('Hello-World');
    expect(toAdaCase(input)).toBe('Hello_World');
    expect(toCapitalCase(input)).toBe('Hello World');
  });

  it('normalizes words before converting their case', () => {
    expect(toLowerCase('HelloWorld')).toBe('hello world');
    expect(toUpperCase('HelloWorld')).toBe('HELLO WORLD');
    expect(toNoCase('XMLHttpRequest')).toBe('xml http request');
    expect(toSentenceCase('XMLHttpRequest')).toBe('Xml http request');
  });

  it('applies English title-case rules', () => {
    expect(toTitleCase('an example of title case')).toBe('An Example of Title Case');
  });

  describe('treats existing separators as word boundaries', () => {
    it('splits on mixed separators instead of removing them', () => {
      expect(toSnakeCase('foo_bar-baz qux')).toBe('foo_bar_baz_qux');
      expect(toCamelCase('foo_bar-baz qux')).toBe('fooBarBazQux');
      expect(toKebabCase('foo_bar-baz qux')).toBe('foo-bar-baz-qux');
    });

    it('splits case boundaries around digits', () => {
      expect(toCamelCase('user2FA')).toBe('user2Fa');
      expect(toKebabCase('user2FA config')).toBe('user2-fa-config');
      expect(toSnakeCase('v2 config')).toBe('v2_config');
    });
  });

  describe('preserves diacritics (does not strip accents)', () => {
    it('keeps accented characters through conversion', () => {
      expect(toConstantCase('ação rápida')).toBe('AÇÃO_RÁPIDA');
      expect(toSnakeCase('ação rápida')).toBe('ação_rápida');
    });
  });

  describe('toPathCase separator handling', () => {
    it('treats an embedded slash as a word boundary', () => {
      expect(toPathCase('folder/name file')).toBe('folder/name/file');
    });
  });

  describe('keep / strict options', () => {
    it('preserves requested characters across converters', () => {
      expect(toKebabCase('hello@world', { keep: ['@'] })).toBe('hello@world');
      expect(toSnakeCase('hello@world', { keep: ['@'] })).toBe('hello@world');
      expect(toCamelCase('hello@world', { keep: ['@'] })).toBe('hello@world');
    });

    it('does not leak options into later calls', () => {
      expect(toKebabCase('hello@world', { strict: false })).toBe('hello@world');
      expect(toKebabCase('hello@world')).toBe('hello-world');
    });
  });

  describe('empty string', () => {
    it.each([
      ['toCamelCase', toCamelCase],
      ['toPascalCase', toPascalCase],
      ['toKebabCase', toKebabCase],
      ['toSnakeCase', toSnakeCase],
      ['toSpaceCase', toSpaceCase],
      ['toDotNotationCase', toDotNotationCase],
      ['toPathCase', toPathCase],
      ['toConstantCase', toConstantCase],
      ['toCobolCase', toCobolCase],
      ['toTrainCase', toTrainCase],
      ['toAdaCase', toAdaCase],
      ['toCapitalCase', toCapitalCase],
      ['toLowerCase', toLowerCase],
      ['toUpperCase', toUpperCase],
      ['toTitleCase', toTitleCase],
      ['toSentenceCase', toSentenceCase],
      ['toNoCase', toNoCase],
    ] as const)('%s returns an empty string', (_name, callback) => {
      expect(callback('')).toBe('');
    });
  });
});
