import { describe, expect, it } from 'vitest';

import { fromMilliseconds, fromSeconds, toMilliseconds, toSeconds } from '../src/duration';

describe('duration', () => {
  describe('fromMilliseconds', () => {
    it('formats using the largest single unit, short form', () => {
      expect(fromMilliseconds(500)).toBe('500ms');
      expect(fromMilliseconds(1000)).toBe('1s');
      expect(fromMilliseconds(60_000)).toBe('1m');
      expect(fromMilliseconds(3_600_000)).toBe('1h');
    });

    it('formats using the long form, pluralizing correctly', () => {
      expect(fromMilliseconds(3_600_000, true)).toBe('1 hour');
      expect(fromMilliseconds(7_200_000, true)).toBe('2 hours');
      expect(fromMilliseconds(60_000, true)).toBe('1 minute');
    });

    // Single-unit output is ROUNDED, not composed (ms-style). These cases pin
    // that behavior — none of the "exact multiple" cases above would catch a
    // regression from round() to floor().
    it('rounds to a single unit rather than composing', () => {
      expect(fromMilliseconds(90_000)).toBe('2m'); // 1m30s rounds up
      expect(fromMilliseconds(3_660_000)).toBe('1h'); // 1h1m drops the minute
      expect(fromMilliseconds(1500)).toBe('2s'); // 1.5s rounds up
    });

    it('preserves the sign for negative durations', () => {
      expect(fromMilliseconds(-1_000)).toBe('-1s');
      expect(fromMilliseconds(-3_600_000, true)).toBe('-1 hour');
    });

    it('returns an empty string for non-finite input', () => {
      expect(fromMilliseconds(Number.NaN)).toBe('');
      expect(fromMilliseconds(Number.POSITIVE_INFINITY)).toBe('');
      expect(fromMilliseconds(Number.NEGATIVE_INFINITY)).toBe('');
    });
  });

  describe('fromSeconds', () => {
    it('formats a seconds value using short and long units', () => {
      expect(fromSeconds(60)).toBe('1m');
      expect(fromSeconds(60, true)).toBe('1 minute');
      expect(fromSeconds(3600)).toBe('1h');
    });
  });

  describe('toMilliseconds', () => {
    it('parses value + unit expressions', () => {
      expect(toMilliseconds('1.5h')).toBe(5_400_000);
      expect(toMilliseconds('2h')).toBe(7_200_000);
      expect(toMilliseconds('500ms')).toBe(500);
    });

    it('is case-insensitive and tolerates whitespace', () => {
      expect(toMilliseconds('2 HOURS')).toBe(7_200_000);
      expect(toMilliseconds('2   hours')).toBe(7_200_000);
    });

    it('treats a numeric input as milliseconds and passes it through', () => {
      expect(toMilliseconds(250)).toBe(250);
      expect(toMilliseconds(0)).toBe(0);
    });

    it('throws a TypeError on unparseable expressions', () => {
      expect(() => toMilliseconds('later')).toThrow(TypeError);
      expect(() => toMilliseconds('10 fortnights')).toThrow(TypeError);
    });
  });

  describe('toSeconds', () => {
    it('parses expressions and floors to whole seconds', () => {
      expect(toSeconds('2h')).toBe(7_200);
      expect(toSeconds('1500ms')).toBe(1); // 1.5s floored
      expect(toSeconds('0.4s')).toBe(0); // sub-second floored away
    });

    // A numeric input is treated as a seconds value. The "whole seconds"
    // contract (see JSDoc) must hold regardless of input form, so a fractional
    // number is floored too. This is the one case the current implementation
    // fails — it returns the number unfloored.
    it('treats a numeric input as seconds, floored to whole seconds', () => {
      expect(toSeconds(30)).toBe(30);
      expect(toSeconds(0)).toBe(0);
      expect(toSeconds(1.5)).toBe(1);
    });

    it('throws a TypeError on unparseable expressions', () => {
      expect(() => toSeconds('10 fortnights')).toThrow(TypeError);
    });
  });
});
