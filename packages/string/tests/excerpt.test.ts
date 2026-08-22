import { describe, expect, it } from 'vitest';

import { excerpt } from '../src/excerpt';

describe('excerpt', () => {
  describe('character mode (default)', () => {
    it('cuts at the character limit and appends an ellipsis', () => {
      expect(excerpt('Lorem ipsum dolor', 11)).toBe('Lorem ipsum...');
    });

    it('uses a custom ellipsis', () => {
      expect(excerpt('Lorem ipsum', 5, { ellipsis: '…' })).toBe('Lorem…');
    });

    it('does not count HTML tags as visible characters', () => {
      expect(excerpt('<span>abcdef</span>', 5)).toBe('abcde...');
    });
  });

  describe('word mode', () => {
    it('cuts at the word limit and appends an ellipsis', () => {
      expect(excerpt('Lorem ipsum dolor', 2, { words: true })).toBe('Lorem ipsum...');
      expect(excerpt('one two three', 2, { words: true })).toBe('one two...');
    });

    it('trims the trailing gap before the ellipsis unless strict', () => {
      expect(excerpt('one   two   three', 2, { words: true, strict: false })).toBe('one...');
      expect(excerpt('one   two   three', 2, { words: true, strict: true })).toBe('one ...');
    });
  });

  describe('HTML stripping', () => {
    it('removes tags and comments, leaving plain text', () => {
      expect(excerpt('<p>Hello <!-- hidden --><b>world</b></p>', 20)).toBe('Hello world');
    });
  });

  describe('no truncation needed', () => {
    it('returns the input unchanged when it fits, with no ellipsis', () => {
      expect(excerpt('Hello', 5)).toBe('Hello');
      expect(excerpt('Hello', 10)).toBe('Hello');
    });
  });

  describe('edge cases', () => {
    it('returns an empty string for empty input or non-positive length', () => {
      expect(excerpt('', 10)).toBe('');
      expect(excerpt('Hello', 0)).toBe('');
      expect(excerpt('Hello', -3)).toBe('');
    });
  });
});
