/**
 * Options controlling how {@link random} draws the value.
 */
export type RandomOptions = {
  /**
   * When `true`, returns a floating-point value in `[min, max)` instead of an
   * integer, and the bounds are used as given rather than narrowed to the
   * integers they contain.
   *
   * @defaultValue `false`
   */
  float?: boolean;
};

/**
 * Draws a random number between two bounds.
 *
 * By default the result is an integer and both bounds are inclusive, so
 * `random(1, 6)` covers all six faces of a die with equal probability.
 * Fractional bounds are narrowed inward to the integers they contain — `2.3`
 * becomes `3` as a lower bound, `5.8` becomes `5` as an upper bound. With
 * `float: true` the bounds are used as given and the range is `[min, max)`,
 * matching `Math.random()`.
 *
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @param options - Draw options. See {@link RandomOptions}.
 * @returns A random number within the bounds — an integer by default, a float
 *   when {@link RandomOptions.float} is `true`.
 *
 * @throws {RangeError} If either bound is `NaN` or infinite, if `min` is
 *   greater than `max`, or if integer mode is used and no integer exists
 *   between the bounds (e.g. `1.2` to `1.8`).
 *
 * @remarks
 * NOT cryptographically secure — uses `Math.random()`. Do not use for
 * passwords, tokens, OTPs, or any security-sensitive value.
 *
 * Note the asymmetry between the two modes: integer draws are inclusive at both
 * ends, float draws exclude `max`. This is deliberate — an inclusive integer
 * range is what callers expect from dice and indices, while an exclusive upper
 * bound is the established convention for floats.
 *
 * @see `random` from `@motiro/string` for random text rather than a number.
 *
 * @example
 * ```ts
 * random(1, 6);
 * // => e.g. 4
 *
 * random(0, 1);
 * // => 0 or 1
 *
 * random(0, 1, { float: true });
 * // => e.g. 0.38471
 *
 * random(-10, 10);
 * // => e.g. -3
 * ```
 */
export const random = (min: number, max: number, options?: RandomOptions): number => {
  const { float = false } = options ?? {};

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new RangeError('Bounds must be finite numbers.');
  }

  if (min > max) {
    throw new RangeError('Minimum value cannot be greater than maximum value.');
  }

  if (float) {
    return randomFloat(min, max);
  }

  // Narrow inward so the drawn integer is always within the original bounds.
  const lower = Math.ceil(min);
  const upper = Math.floor(max);

  if (lower > upper) {
    throw new RangeError('No integer exists between the given bounds.');
  }

  return lower + Math.floor(Math.random() * (upper - lower + 1));
};

/**
 * Draws a float in `[min, max)`, or `min` itself when the bounds are equal.
 *
 * @param min - The inclusive lower bound.
 * @param max - The exclusive upper bound.
 * @returns The drawn value.
 */
const randomFloat = (min: number, max: number): number => {
  if (min === max) {
    return min;
  }

  const draw = Math.random();
  const span = max - min;

  // A span wider than the largest double overflows to Infinity, so very wide
  // bounds are weighted separately instead — each term then stays finite.
  const value = Number.isFinite(span) ? min + draw * span : min * (1 - draw) + max * draw;

  // Rounding can carry a draw just below 1 onto `max` itself (5 + 0.99… * 5
  // is exactly 10). The true value lies in the gap below `max`, so it lands
  // on the nearest double there instead.
  return value < max ? value : previousDouble(max);
};

/**
 * Returns the largest double strictly below a finite value.
 *
 * @param value - A finite number.
 * @returns The adjacent double towards negative infinity.
 */
const previousDouble = (value: number): number => {
  if (value === 0) {
    return -Number.MIN_VALUE;
  }

  const buffer = new Float64Array([value]);
  const bits = new BigInt64Array(buffer.buffer);

  // Doubles are sign-magnitude, so stepping down means shrinking a positive
  // value's bits and growing a negative value's.
  bits[0] = (bits[0] ?? 0n) + (value > 0 ? -1n : 1n);

  return buffer[0] ?? value;
};
