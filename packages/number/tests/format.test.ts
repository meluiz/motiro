import { describe, expect, it } from 'vitest';

import { format } from '../src/format';

/**
 * Intl inserts non-breaking spaces between a currency symbol and its amount in
 * several locales. Normalizing them keeps assertions readable and stops the
 * suite breaking when the runtime's ICU data changes which space it uses.
 */
const normalize = (value: string): string => {
  return value.replace(/[\u00A0\u202F]/g, ' ');
};

describe('format', () => {
  describe('locale conventions', () => {
    it('uses the separators of the requested locale', () => {
      expect(normalize(format(1234567.891, { locale: 'pt-BR' }))).toBe('1.234.567,891');
      expect(normalize(format(1234567.891, { locale: 'en-US' }))).toBe('1,234,567.891');
    });

    it('accepts a list of locales in order of preference', () => {
      expect(normalize(format(1234.5, { locale: ['pt-BR', 'en-US'] }))).toBe(
        normalize(format(1234.5, { locale: 'pt-BR' })),
      );
    });

    it('falls back to the runtime locale when none is given', () => {
      expect(typeof format(42)).toBe('string');
      expect(format(42)).toContain('42');
    });
  });

  describe('native Intl options', () => {
    it('formats currency', () => {
      expect(
        normalize(format(1234.5, { locale: 'pt-BR', style: 'currency', currency: 'BRL' })),
      ).toBe('R$ 1.234,50');
    });

    it('formats percentages', () => {
      expect(
        normalize(
          format(0.256, { locale: 'en-US', style: 'percent', maximumFractionDigits: 1 }),
        ),
      ).toBe('25.6%');
    });

    it('formats compact notation', () => {
      expect(normalize(format(1234567, { locale: 'en-US', notation: 'compact' }))).toBe('1.2M');
    });

    it('honours fraction digit bounds', () => {
      expect(normalize(format(1.5, { locale: 'en-US', minimumFractionDigits: 3 }))).toBe(
        '1.500',
      );
    });
  });

  describe('formatter caching', () => {
    it('constructs one formatter for repeated calls with the same options', () => {
      // A combination no other test uses, so the cache starts cold for it.
      const options = { locale: 'de-DE', minimumFractionDigits: 4 } as const;
      const original = Intl.NumberFormat;
      let constructed = 0;

      // A Proxy rather than vi.spyOn, which does not forward `new` to the
      // real constructor and leaves the cache holding a mock.
      Intl.NumberFormat = new Proxy(original, {
        construct: (target, args) => {
          constructed += 1;
          return Reflect.construct(target, args);
        },
      });

      try {
        format(1, options);
        format(2, options);
        format(3, options);

        expect(constructed).toBe(1);
      } finally {
        Intl.NumberFormat = original;
      }
    });

    it('treats options given in a different order as the same format', () => {
      expect(format(0.5, { locale: 'en-US', style: 'percent' })).toBe(
        format(0.5, { style: 'percent', locale: 'en-US' }),
      );
    });

    it('keeps distinct formats apart', () => {
      expect(format(1234.5, { locale: 'pt-BR' })).not.toBe(format(1234.5, { locale: 'en-US' }));
    });
  });

  describe('edge cases', () => {
    it('renders non-finite values rather than rejecting them', () => {
      expect(format(Number.NaN, { locale: 'en-US' })).toBe('NaN');
      expect(format(Number.POSITIVE_INFINITY, { locale: 'en-US' })).toBe('∞');
    });

    it('renders zero and negatives', () => {
      expect(format(0, { locale: 'en-US' })).toBe('0');
      expect(normalize(format(-1234.5, { locale: 'en-US' }))).toBe('-1,234.5');
    });

    it('throws a TypeError for currency style without a currency code', () => {
      expect(() => format(1, { locale: 'en-US', style: 'currency' })).toThrow(TypeError);
    });

    it('throws a RangeError for a malformed locale tag', () => {
      expect(() => format(1, { locale: 'not a locale' })).toThrow(RangeError);
    });
  });
});
