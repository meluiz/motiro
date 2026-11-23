import { SIZE_EXPRESSION_REGEX } from '../regexes';

/**
 * Unit symbols ordered by magnitude, indexed by their power of the base.
 */
const DECIMAL_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'] as const;
const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'] as const;

/**
 * The base and power of every known unit, keyed by lowercased symbol. Binary
 * and decimal units are kept in one table since their symbols never collide.
 *
 * A `Map` rather than an object literal, so that inherited names such as
 * `constructor` or `valueOf` are never mistaken for units.
 */
const UNIT_SCALES = new Map<string, { base: 1000 | 1024; power: number }>([
  ...DECIMAL_UNITS.map((unit, power) => [unit.toLowerCase(), { base: 1000, power }] as const),
  ...BINARY_UNITS.slice(1).map(
    (unit, index) => [unit.toLowerCase(), { base: 1024, power: index + 1 }] as const,
  ),
]);

/**
 * The widest precision `Number.prototype.toFixed` accepts.
 */
const MAX_DECIMALS = 100;

/**
 * Options accepted when formatting a byte count.
 */
export type BytesFormatOptions = {
  /** Use 1024-based binary units instead of 1000-based decimal ones. */
  binary: boolean;
  /** Decimal places kept in the scaled value. */
  decimals: number;
};

/**
 * Parses a size expression into a number of bytes. The unit is matched
 * case-insensitively and defaults to bytes when absent.
 *
 * @param input - The size expression, such as '1.5 KB'.
 * @returns The equivalent number of bytes.
 * @throws {TypeError} If the expression is malformed or names an unknown unit.
 */
export const getBytesParse = (input: string): number => {
  const match = SIZE_EXPRESSION_REGEX.exec(input);

  if (match === null || match[1] === undefined) {
    throw new TypeError(`Invalid size expression "${input}"`);
  }

  const amount = match[1];
  const symbol = match[2] ?? 'b';
  const scale = UNIT_SCALES.get(symbol.toLowerCase());

  if (scale === undefined) {
    throw new TypeError(`Unknown size unit "${symbol}" in "${input}"`);
  }

  // Decimal units shift through exponent notation, so '1.073741824 TB' lands
  // on the exact count instead of picking up the error of `amount * 1e12`.
  if (scale.base === 1000) {
    return Number(`${amount}e${scale.power * 3}`);
  }

  return Number(amount) * scale.base ** scale.power;
};

/**
 * Formats a byte count, scaling it to the largest unit that leaves the value
 * at or above one. Bytes are emitted without decimals and trailing zeros are
 * dropped from the scaled value.
 *
 * @param bytes - The number of bytes.
 * @param options - How to scale and round the value.
 * @returns The scaled value followed by its unit symbol.
 * @throws {RangeError} If the byte count is not finite, or if `decimals` is
 *   outside `0` to `100`.
 */
export const getBytesFormat = (bytes: number, options: BytesFormatOptions): string => {
  const { binary } = options;
  const decimals = Math.trunc(options.decimals);

  if (!Number.isFinite(bytes)) {
    throw new RangeError('Bytes must be a finite number.');
  }

  if (!(decimals >= 0 && decimals <= MAX_DECIMALS)) {
    throw new RangeError(`Decimals must be between 0 and ${MAX_DECIMALS}.`);
  }

  const base = binary ? 1024 : 1000;
  const units = binary ? BINARY_UNITS : DECIMAL_UNITS;
  const lastExponent = units.length - 1;

  // A fraction of a byte is meaningless, so the count is made whole first.
  const whole = Math.round(Math.abs(bytes));
  const sign = bytes < 0 && whole !== 0 ? '-' : '';

  if (whole < base) {
    return `${sign}${whole} B`;
  }

  // Compared against exact powers rather than derived from `Math.log`, whose
  // quotient lands just below the integer for counts like 1e15. Capped so
  // counts beyond the largest unit keep scaling into it rather than running
  // off the end of the table.
  let exponent = 1;

  while (exponent < lastExponent && whole >= base ** (exponent + 1)) {
    exponent += 1;
  }

  let scaled = Number((whole / base ** exponent).toFixed(decimals));

  // Rounding can carry the value up to the base itself — 999 950 bytes would
  // read '1000 KB' — so it moves into the next unit instead.
  if (scaled >= base && exponent < lastExponent) {
    exponent += 1;
    scaled = Number((whole / base ** exponent).toFixed(decimals));
  }

  const unit = units[exponent] ?? units[lastExponent];

  return `${sign}${scaled} ${unit}`;
};
