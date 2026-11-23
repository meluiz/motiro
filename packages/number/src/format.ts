/**
 * Options controlling how {@link format} renders a number.
 *
 * Extends the native `Intl.NumberFormatOptions`, so every standard option —
 * `style`, `currency`, `minimumFractionDigits`, `notation` and the rest — is
 * accepted as-is.
 */
export type FormatOptions = Intl.NumberFormatOptions & {
  /**
   * BCP 47 locale tag, or a list of tags in order of preference. When omitted,
   * the runtime's default locale is used.
   *
   * @defaultValue `undefined`
   */
  locale?: string | readonly string[];
};

const formatters = new Map<string, Intl.NumberFormat>();

/**
 * Formats a number for display, following locale conventions for separators,
 * currency, percentages and compact notation.
 *
 * A thin wrapper over `Intl.NumberFormat` that caches formatter instances by
 * locale and options. Constructing a formatter is expensive relative to
 * formatting with one, so reusing it matters when the same format is applied
 * repeatedly — in a list, a table, or a render loop.
 *
 * @param value - The number to format.
 * @param options - Formatting options. See {@link FormatOptions}.
 * @returns The formatted number as a string.
 *
 * @throws {RangeError} If the locale tag is malformed, or if an option value is
 *   outside its accepted set — both raised by `Intl.NumberFormat` itself.
 * @throws {TypeError} If `style: 'currency'` is used without a `currency` code.
 *
 * @remarks
 * Output is locale-dependent and not stable across runtimes or ICU versions.
 * Never parse it back, compare it, or use it as a key — format at the display
 * boundary and keep the number itself everywhere else. The separators are also
 * often non-breaking spaces rather than regular ones, which surprises string
 * comparisons in tests.
 *
 * The formatter cache is unbounded. It is keyed by locale and options, so it
 * grows only with the number of distinct formats used, which is small and
 * fixed in practice. Avoid generating option objects with unbounded values —
 * a per-item `minimumFractionDigits` computed at runtime, for instance.
 *
 * `NaN` and `Infinity` are rendered rather than rejected, as their locale
 * representations (`'NaN'`, `'∞'`) are what `Intl` produces.
 *
 * @example
 * ```ts
 * format(1234567.891, { locale: 'pt-BR' });
 * // => '1.234.567,891'
 *
 * format(1234.5, { locale: 'pt-BR', style: 'currency', currency: 'BRL' });
 * // => 'R$ 1.234,50'
 *
 * format(0.256, { locale: 'en-US', style: 'percent', maximumFractionDigits: 1 });
 * // => '25.6%'
 *
 * format(1234567, { locale: 'en-US', notation: 'compact' });
 * // => '1.2M'
 *
 * format(42);
 * // => '42' (runtime default locale)
 * ```
 */
export const format = (value: number, options?: FormatOptions): string => {
  return getFormatter(options).format(value);
};

/**
 * Returns a cached formatter for the given options, creating one on first use.
 *
 * @param options - The formatting options, including the locale.
 * @returns The matching `Intl.NumberFormat` instance.
 */
const getFormatter = (options?: FormatOptions): Intl.NumberFormat => {
  const { locale, ...intlOptions } = options ?? {};
  const key = getCacheKey(locale, intlOptions);

  const cached = formatters.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const formatter = new Intl.NumberFormat(locale as string | string[] | undefined, intlOptions);

  formatters.set(key, formatter);

  return formatter;
};

/**
 * Builds a stable cache key from a locale and a set of options. Option keys are
 * sorted so that two objects with the same entries in a different order share
 * one cached formatter.
 *
 * @param locale - The requested locale or locales.
 * @param options - The native `Intl` options, without the locale.
 * @returns A string key unique to this combination.
 */
const getCacheKey = (
  locale: string | readonly string[] | undefined,
  options: Intl.NumberFormatOptions,
): string => {
  const tag = Array.isArray(locale) ? locale.join(',') : String(locale);
  const entries = Object.entries(options).sort(([a], [b]) => {
    return a < b ? -1 : 1;
  });

  return `${tag}|${JSON.stringify(entries)}`;
};
