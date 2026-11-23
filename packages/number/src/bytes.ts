import { getBytesFormat, getBytesParse } from './utils/helpers';

/**
 * Options controlling how {@link fromBytes} renders a size.
 */
export type BytesOptions = {
  /**
   * When `true`, uses binary units of 1024 (`KiB`, `MiB`) instead of decimal
   * units of 1000 (`KB`, `MB`).
   *
   * @defaultValue `false`
   */
  binary?: boolean;

  /**
   * How many decimal places to keep in the scaled value. Trailing zeros are
   * dropped, so this is a maximum rather than a fixed width. Fractional values
   * are truncated.
   *
   * @defaultValue `1`
   */
  decimals?: number;
};

/**
 * Parses a human-readable size into a number of bytes.
 *
 * The unit is matched case-insensitively and the space between number and unit
 * is optional, so `'1.5 KB'`, `'1.5kb'` and `'1.5 kB'` are equivalent. A value
 * with no unit is read as bytes. Binary units (`KiB`) are always 1024-based and
 * decimal units (`KB`) always 1000-based, regardless of how the string was
 * produced.
 *
 * @param input - The size expression to parse.
 * @returns The equivalent number of bytes.
 *
 * @throws {TypeError} If the string is not a valid size expression, or names a
 *   unit that is not recognised.
 *
 * @remarks
 * The result is not rounded to a whole byte: `'1.0005 KB'` yields `1000.5`.
 * Round it yourself when an integer count is required.
 *
 * Units are read as bytes whatever their case, so `'1 Mb'` is one megabyte,
 * not one megabit. Exponent notation (`'1e3'`), a leading `+` and a bare
 * leading dot (`'.5 KB'`) are rejected.
 *
 * @see {@link fromBytes} for the inverse.
 *
 * @example
 * ```ts
 * toBytes('1.5 KB');
 * // => 1500
 *
 * toBytes('1.5 KiB');
 * // => 1536
 *
 * toBytes('512mb');
 * // => 512000000
 *
 * toBytes('900');
 * // => 900
 * ```
 */
export const toBytes = (input: string): number => {
  return getBytesParse(input);
};

/**
 * Formats a byte count as a human-readable size.
 *
 * The value is scaled to the largest unit that leaves it above `1`, so `1536`
 * renders as `'1.5 KB'` rather than `'1536 B'`. Trailing zeros are dropped, so
 * `1000` renders as `'1 KB'` rather than `'1.0 KB'`. Bytes are never given
 * decimals, since a fraction of a byte is meaningless — fractional counts are
 * rounded to a whole byte first.
 *
 * @param bytes - The number of bytes to format.
 * @param options - Formatting options. See {@link BytesOptions}.
 * @returns The size as a string, with its unit.
 *
 * @throws {RangeError} If `bytes` is not finite, since it has no unit to scale
 *   into, or if `decimals` is outside `0` to `100`.
 *
 * @remarks
 * Decimal units (`KB` = 1000 bytes) are the default because that is what
 * operating systems, storage vendors and cloud providers report. Binary units
 * (`KiB` = 1024 bytes) are what memory and most file tooling actually measure —
 * pass `binary: true` when the number came from one of those, or the label will
 * misdescribe it.
 *
 * Negative values keep their sign, as byte counts are sometimes used as deltas.
 *
 * @see {@link toBytes} for the inverse.
 *
 * @example
 * ```ts
 * fromBytes(1536);
 * // => '1.5 KB'
 *
 * fromBytes(1536, { binary: true });
 * // => '1.5 KiB'
 *
 * fromBytes(500);
 * // => '500 B'
 *
 * fromBytes(1073741824, { decimals: 2 });
 * // => '1.07 GB'
 *
 * fromBytes(0);
 * // => '0 B'
 * ```
 */
export const fromBytes = (bytes: number, options?: BytesOptions): string => {
  const { binary = false, decimals = 1 } = options ?? {};
  return getBytesFormat(bytes, { binary, decimals });
};
