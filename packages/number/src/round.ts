/**
 * Rounds a number to a fixed number of decimal places.
 *
 * Scaling by a power of ten before rounding — the usual one-liner — is unsound,
 * because the scaled value may not be exactly representable. `1.005 * 100`
 * lands on `100.49999999999999`, so `Math.round` sends it down and `1.005`
 * rounds to `1` instead of `1.01`. This function scales through the number's
 * exponent notation instead, which sidesteps the multiplication entirely.
 *
 * Halfway values round away from zero, so `2.5` becomes `3` and `-2.5` becomes
 * `-3` — unlike `Math.round`, which rounds both towards positive infinity and
 * turns `-2.5` into `-2`.
 *
 * @param value - The number to round.
 * @param decimals - How many decimal places to keep. Negative values round to
 *   the left of the decimal point — `-2` rounds to the nearest hundred.
 *   Fractional values are truncated.
 * @returns The rounded number.
 *
 * @throws {RangeError} If `decimals` is outside `-292` to `292`, the range of
 *   exponents a `number` can represent.
 *
 * @remarks
 * The result is still a binary float and may not be exactly the decimal it
 * displays as. `round` fixes the rounding decision, not the representation —
 * for exact decimal arithmetic, money above all, use integers of the smallest
 * unit or a decimal library.
 *
 * `NaN` and infinities are returned unchanged, matching `Math.round`. Values
 * too large to hold the requested precision are returned unchanged as well,
 * since they have no digits there to round. Unlike `Math.round`, a negative
 * value that rounds to nothing yields `0` rather than `-0`.
 *
 * @example
 * ```ts
 * round(1.005, 2);
 * // => 1.01
 *
 * round(1.2345, 2);
 * // => 1.23
 *
 * round(2.5);
 * // => 3
 *
 * round(-2.5);
 * // => -3
 *
 * round(1234, -2);
 * // => 1200
 * ```
 */
export const round = (value: number, decimals: number = 0): number => {
  const places = Math.trunc(decimals);

  if (places < -292 || places > 292) {
    throw new RangeError('Decimals must be between -292 and 292.');
  }

  if (!Number.isFinite(value)) {
    return value;
  }

  const sign = value < 0 ? -1 : 1;
  const magnitude = Math.abs(value);

  // Shift through exponent notation rather than multiplying, so the scaled
  // value never picks up representation error of its own.
  const shifted = shift(magnitude, places);

  // Too large to hold at this precision, which also means it has no digits
  // left to round away.
  if (!Number.isFinite(shifted)) {
    return value;
  }

  const restored = shift(Math.round(shifted), -places);

  // Normalised so a negative value rounding to nothing yields `0`, not `-0`.
  return restored === 0 ? 0 : sign * restored;
};

/**
 * Moves a number's decimal point by the given number of places, by editing its
 * exponent rather than multiplying. Numbers that already print in exponent
 * notation (`1e21`, `1e-7`) have their exponent adjusted rather than gaining
 * a second one.
 *
 * @param value - A finite, non-negative number.
 * @param places - How many places to move the point; negative moves it left.
 * @returns The shifted number.
 */
const shift = (value: number, places: number): number => {
  const [mantissa, exponent = '0'] = String(value).split('e');

  return Number(`${mantissa}e${Number(exponent) + places}`);
};
