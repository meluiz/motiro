import { isObjectLike } from './objects';

/**
 * Checks whether a value is the empty string.
 *
 * @param value - The value to check.
 * @returns `true` if the value is `''`, otherwise `false`.
 *
 * @example
 * ```ts
 * isEmptyString('') // => true
 * isEmptyString(' ') // => false
 * isEmptyString(0) // => false
 * ```
 */
export const isEmptyString = (value: unknown): value is '' => {
  return value === '';
};

/**
 * Checks whether a value is an empty array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an array with no elements, otherwise `false`.
 *
 * @example
 * ```ts
 * isEmptyArray([]) // => true
 * isEmptyArray([1]) // => false
 * isEmptyArray({}) // => false
 * ```
 */
export const isEmptyArray = (value: unknown): value is [] => {
  return Array.isArray(value) && value.length === 0;
};

/**
 * Checks whether a value is an object with no own keys.
 *
 * @param value - The value to check.
 * @returns `true` if the value is object-like with no own string or symbol keys,
 * otherwise `false`.
 *
 * @remarks
 * Uses `Reflect.ownKeys`, so both string and symbol own keys count. Array-likes
 * pass through `isObjectLike`, so `[]` is NOT reported as empty; guard with
 * `isEmptyArray` first if you need to distinguish arrays from objects.
 *
 * @example
 * ```ts
 * isEmptyObject({}) // => true
 * isEmptyObject({ a: 1 }) // => false
 * isEmptyObject(null) // => false
 * ```
 */
export const isEmptyObject = (value: unknown): value is Record<PropertyKey, never> => {
  return isObjectLike(value) && Reflect.ownKeys(value).length === 0;
};
