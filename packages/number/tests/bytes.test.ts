import { describe, expect, it } from 'vitest';

import { fromBytes, toBytes } from '../src/bytes';

describe('fromBytes', () => {
  describe('decimal units', () => {
    it.each([
      [0, '0 B'],
      [500, '500 B'],
      [999, '999 B'],
      [1000, '1 KB'],
      [1536, '1.5 KB'],
      [1500000, '1.5 MB'],
    ] as const)('fromBytes(%o) → %o', (bytes, expected) => {
      expect(fromBytes(bytes)).toBe(expected);
    });

    it('scales to the largest unit that leaves the value above one', () => {
      expect(fromBytes(999)).toBe('999 B');
      expect(fromBytes(1000)).toBe('1 KB');
      expect(fromBytes(1000000)).toBe('1 MB');
    });

    it('moves into the next unit when rounding carries the value up to the base', () => {
      expect(fromBytes(999950)).toBe('1 MB');
      expect(fromBytes(999.6)).toBe('1 KB');
    });

    it('picks the right unit at exact powers of the base', () => {
      expect(fromBytes(1e15)).toBe('1 PB');
      expect(fromBytes(1e18)).toBe('1 EB');
    });
  });

  describe('binary units', () => {
    it.each([
      [1023, '1023 B'],
      [1024, '1 KiB'],
      [1536, '1.5 KiB'],
      [1048576, '1 MiB'],
    ] as const)('fromBytes(%o, { binary: true }) → %o', (bytes, expected) => {
      expect(fromBytes(bytes, { binary: true })).toBe(expected);
    });

    it('labels the same count differently from decimal mode', () => {
      expect(fromBytes(1536)).toBe('1.5 KB');
      expect(fromBytes(1536, { binary: true })).toBe('1.5 KiB');
    });

    it('moves into the next unit when rounding carries the value up to the base', () => {
      expect(fromBytes(1048575, { binary: true })).toBe('1 MiB');
    });
  });

  describe('precision', () => {
    it('keeps one decimal place by default', () => {
      expect(fromBytes(1234)).toBe('1.2 KB');
    });

    it('honours a custom precision', () => {
      expect(fromBytes(1073741824, { decimals: 2 })).toBe('1.07 GB');
      expect(fromBytes(1234, { decimals: 0 })).toBe('1 KB');
      expect(fromBytes(1234, { decimals: 3 })).toBe('1.234 KB');
    });

    it('drops trailing zeros rather than padding to the requested precision', () => {
      expect(fromBytes(1000)).toBe('1 KB');
      expect(fromBytes(2000, { decimals: 3 })).toBe('2 KB');
      expect(fromBytes(1500, { decimals: 3 })).toBe('1.5 KB');
    });

    it('never gives bytes a decimal part', () => {
      expect(fromBytes(500, { decimals: 2 })).toBe('500 B');
    });

    it('rounds a fractional count to a whole byte', () => {
      expect(fromBytes(0.5)).toBe('1 B');
      expect(fromBytes(0.4)).toBe('0 B');
      expect(fromBytes(1.6)).toBe('2 B');
    });

    it('truncates a fractional precision', () => {
      expect(fromBytes(1234, { decimals: 2.9 })).toBe('1.23 KB');
    });

    it('throws a RangeError for a precision outside 0 to 100', () => {
      expect(() => fromBytes(1500, { decimals: -1 })).toThrow(RangeError);
      expect(() => fromBytes(1500, { decimals: 101 })).toThrow(RangeError);
      expect(() => fromBytes(1500, { decimals: Number.NaN })).toThrow(RangeError);
    });

    it('accepts the extremes of the precision range', () => {
      expect(fromBytes(1500, { decimals: 0 })).toBe('2 KB');
      expect(() => fromBytes(1500, { decimals: 100 })).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('keeps the sign of a negative count', () => {
      expect(fromBytes(-1536)).toBe('-1.5 KB');
      expect(fromBytes(-500)).toBe('-500 B');
    });

    it('never prints a negative zero', () => {
      expect(fromBytes(-0)).toBe('0 B');
      expect(fromBytes(-0.3)).toBe('0 B');
    });

    it('stays in the largest unit rather than running past the table', () => {
      expect(fromBytes(1e21)).toBe('1000 EB');
    });

    it('throws a RangeError for non-finite counts', () => {
      expect(() => fromBytes(Number.NaN)).toThrow(RangeError);
      expect(() => fromBytes(Number.POSITIVE_INFINITY)).toThrow(RangeError);
      expect(() => fromBytes(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
    });
  });
});

describe('toBytes', () => {
  describe('decimal units', () => {
    it.each([
      ['1.5 KB', 1500],
      ['1 KB', 1000],
      ['512mb', 512000000],
      ['2 GB', 2000000000],
      ['900', 900],
      ['900 B', 900],
    ] as const)('toBytes(%o) → %o', (input, expected) => {
      expect(toBytes(input)).toBe(expected);
    });
  });

  describe('binary units', () => {
    it.each([
      ['1 KiB', 1024],
      ['1.5 KiB', 1536],
      ['1 MiB', 1048576],
      ['1 EiB', 1024 ** 6],
    ] as const)('toBytes(%o) → %o', (input, expected) => {
      expect(toBytes(input)).toBe(expected);
    });
  });

  describe('parsing tolerance', () => {
    it('matches units case-insensitively', () => {
      expect(toBytes('1kb')).toBe(toBytes('1 KB'));
      expect(toBytes('1Kb')).toBe(toBytes('1 KB'));
      expect(toBytes('1 kIb')).toBe(toBytes('1 KiB'));
    });

    it('accepts an optional space between amount and unit', () => {
      expect(toBytes('512mb')).toBe(toBytes('512 MB'));
    });

    it('ignores surrounding whitespace', () => {
      expect(toBytes('  1.5 KB  ')).toBe(1500);
    });

    it('reads a bare number as bytes', () => {
      expect(toBytes('42')).toBe(42);
    });

    it('accepts a negative amount', () => {
      expect(toBytes('-1.5 KB')).toBe(-1500);
    });

    it('reads a lowercase b as bytes, not bits', () => {
      expect(toBytes('1 Mb')).toBe(1000000);
    });
  });

  describe('edge cases', () => {
    it('does not round the result to a whole byte', () => {
      expect(toBytes('1.0005 KB')).toBe(1000.5);
    });

    it('throws a TypeError for a malformed expression', () => {
      expect(() => toBytes('')).toThrow(TypeError);
      expect(() => toBytes('KB')).toThrow(TypeError);
      expect(() => toBytes('1.5.5 KB')).toThrow(TypeError);
      expect(() => toBytes('abc')).toThrow(TypeError);
      expect(() => toBytes('1e3')).toThrow(TypeError);
      expect(() => toBytes('.5 KB')).toThrow(TypeError);
      expect(() => toBytes('+1 KB')).toThrow(TypeError);
    });

    it('is exact for decimal units, without multiplication error', () => {
      expect(toBytes('1.073741824 TB')).toBe(1073741824000);
      expect(toBytes('0.1 KB')).toBe(100);
    });

    it('throws a TypeError for an unknown unit', () => {
      expect(() => toBytes('1.5 XB')).toThrow(TypeError);
    });

    it('does not mistake inherited object properties for units', () => {
      expect(() => toBytes('1 constructor')).toThrow(TypeError);
      expect(() => toBytes('1 valueOf')).toThrow(TypeError);
      expect(() => toBytes('1 toString')).toThrow(TypeError);
    });
  });

  describe('round trip', () => {
    it.each([1000, 1500, 2000000, 1073741824000] as const)(
      'toBytes(fromBytes(%o)) preserves the value',
      (bytes) => {
        expect(toBytes(fromBytes(bytes, { decimals: 10 }))).toBe(bytes);
      },
    );
  });
});
