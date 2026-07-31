/**
 * Checks whether a value is an integer.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number with no fractional part, otherwise `false`.
 *
 * @example
 * ```ts
 * isInteger(3) // => true
 * isInteger(3.5) // => false
 * isInteger('3') // => false
 * ```
 */
export const isInteger = (value: unknown): value is number => {
  return Number.isInteger(value);
};

/**
 * Checks whether a value is a safe integer.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an integer within the safe range, otherwise `false`.
 *
 * @remarks
 * A safe integer can be represented exactly as an IEEE-754 double and no other
 * integer rounds to it — the range `[-(2^53 - 1), 2^53 - 1]`.
 *
 * @example
 * ```ts
 * isSafeInteger(9007199254740991) // => true
 * isSafeInteger(9007199254740992) // => false
 * ```
 */
export const isSafeInteger = (value: unknown): value is number => {
  return Number.isSafeInteger(value);
};

/**
 * Checks whether a value is a finite number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number that is neither infinite nor `NaN`,
 * otherwise `false`.
 *
 * @remarks
 * Unlike the global `isFinite`, this does not coerce: a numeric string returns
 * `false`.
 *
 * @example
 * ```ts
 * isNumberFinite(1) // => true
 * isNumberFinite(Infinity) // => false
 * isNumberFinite('1') // => false
 * ```
 */
export const isNumberFinite = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

/**
 * Checks whether a value is a positive number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number greater than zero, otherwise `false`.
 *
 * @remarks
 * `NaN` is rejected. Zero is not positive, so `0` returns `false`.
 *
 * @example
 * ```ts
 * isPositive(1) // => true
 * isPositive(0) // => false
 * isPositive(-1) // => false
 * ```
 */
export const isPositive = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value) && value > 0;
};

/**
 * Checks whether a value is a negative number.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number less than zero, otherwise `false`.
 *
 * @remarks
 * `NaN` is rejected. Zero is not negative, so `0` returns `false`.
 *
 * @example
 * ```ts
 * isNegative(-1) // => true
 * isNegative(0) // => false
 * isNegative(1) // => false
 * ```
 */
export const isNegative = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value) && value < 0;
};

/**
 * Checks whether a value is exactly zero.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `0`, otherwise `false`.
 *
 * @remarks
 * Matches `-0` as well, since `-0 === 0`. Narrows to the literal type `0`.
 *
 * @example
 * ```ts
 * isZero(0) // => true
 * isZero(-0) // => true
 * isZero(1) // => false
 * ```
 */
export const isZero = (value: unknown): value is 0 => {
  return value === 0;
};
