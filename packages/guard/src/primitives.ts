/**
 * Checks whether a value is a string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a string, otherwise `false`.
 *
 * @example
 * ```ts
 * isString('a') // => true
 * isString(1) // => false
 * ```
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Checks whether a value is a number, excluding `NaN`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a number and not `NaN`, otherwise `false`.
 *
 * @remarks
 * `NaN` is rejected by design, even though `typeof NaN === 'number'`. `Infinity`
 * passes; use `isNumberFinite` to also exclude infinities.
 *
 * @example
 * ```ts
 * isNumber(1) // => true
 * isNumber(NaN) // => false
 * isNumber('1') // => false
 * ```
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

/**
 * Checks whether a value is a boolean.
 *
 * @param value - The value to check.
 * @returns `true` if the value is strictly `true` or `false`, otherwise `false`.
 *
 * @example
 * ```ts
 * isBoolean(true) // => true
 * isBoolean(0) // => false
 * ```
 */
export const isBoolean = (value: unknown): value is boolean => {
  return value === true || value === false;
};

/**
 * Checks whether a value is a bigint.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a bigint, otherwise `false`.
 *
 * @example
 * ```ts
 * isBigInt(1n) // => true
 * isBigInt(1) // => false
 * ```
 */
export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint';
};

/**
 * Checks whether a value is a symbol.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a symbol, otherwise `false`.
 *
 * @example
 * ```ts
 * isSymbol(Symbol()) // => true
 * isSymbol('s') // => false
 * ```
 */
export const isSymbol = (value: unknown): value is symbol => {
  return typeof value === 'symbol';
};

/**
 * Checks whether a value is `null`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is strictly `null`, otherwise `false`.
 *
 * @remarks
 * Matches only `null`, not `undefined`. Use `isNil` to match both.
 *
 * @example
 * ```ts
 * isNull(null) // => true
 * isNull(undefined) // => false
 * ```
 */
export const isNull = (value: unknown): value is null => {
  return value === null;
};

/**
 * Checks whether a value is `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is strictly `undefined`, otherwise `false`.
 *
 * @remarks
 * Matches only `undefined`, not `null`. Use `isNil` to match both.
 *
 * @example
 * ```ts
 * isUndefined(undefined) // => true
 * isUndefined(null) // => false
 * ```
 */
export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

/**
 * Checks whether a value is `null` or `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 *
 * @example
 * ```ts
 * isNil(null) // => true
 * isNil(undefined) // => true
 * isNil(0) // => false
 * ```
 */
export const isNil = (value: unknown): value is null | undefined => {
  return value == null;
};

/**
 * Checks whether a value is neither `null` nor `undefined`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is defined, narrowing to `NonNullable<T>`.
 *
 * @remarks
 * Unlike the other primitive guards, this takes a typed input `T` so it narrows
 * away `null` and `undefined` in place — ideal as an array filter:
 * `values.filter(isDefined)` yields `NonNullable<T>[]`.
 *
 * @example
 * ```ts
 * isDefined(0) // => true
 * isDefined(null) // => false
 * [1, null, 2].filter(isDefined) // => [1, 2], typed number[]
 * ```
 */
export const isDefined = <T>(value: T): value is NonNullable<T> => {
  return value != null;
};
