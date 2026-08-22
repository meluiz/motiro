import { describe, expect, it } from 'vitest';

import { truncate } from '../src/truncate';

describe('truncate', () => {
  describe('plain text', () => {
    it('cuts at the visible-character limit and appends an ellipsis', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('uses a custom ellipsis', () => {
      expect(truncate('Hello World', 5, { ellipsis: '…' })).toBe('Hello…');
    });
  });

  describe('HTML handling', () => {
    it('preserves tags and re-closes the ones left open by the cut', () => {
      expect(truncate('<p>Hello <em>friend</em></p>', 10)).toBe(
        '<p>Hello <em>frie...</em></p>',
      );
    });

    it('re-closes nested tags in order', () => {
      expect(truncate('<div><p>Hello world friend</p></div>', 8)).toBe(
        '<div><p>Hello wo...</p></div>',
      );
    });

    it('does not count tags as visible characters', () => {
      expect(truncate('<strong>Hello</strong>', 5)).toBe('<strong>Hello</strong>');
    });

    it('does not push self-closing tags onto the open-tag stack', () => {
      expect(truncate('a<br>bcdefgh', 5)).toBe('a<br>bcde...');
    });

    it('counts an HTML entity as a single visible character and never splits it', () => {
      expect(truncate('a &amp; b c d', 6)).toBe('a &amp; b...');
    });
  });

  describe('length handling', () => {
    it('truncates a fractional length to a whole number of characters', () => {
      expect(truncate('abcdefghij', 5.7)).toBe('abcde...');
    });
  });

  describe('no truncation needed', () => {
    it('returns the input unchanged when it fits, with no ellipsis', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
      expect(truncate('Hello', 10)).toBe('Hello');
    });
  });

  describe('edge cases', () => {
    it('returns an empty string for empty input or non-positive length', () => {
      expect(truncate('', 10)).toBe('');
      expect(truncate('Hello', 0)).toBe('');
      expect(truncate('Hello', -3)).toBe('');
    });
  });
});
