import { isPlainObjectTag } from './utils/helpers';

/**
 * Checks whether a value is object-like: a non-null object.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an object and not `null`, otherwise `false`.
 *
 * @remarks
 * Arrays and other exotic objects pass. Use `isObject` to exclude arrays, or
 * `isPlainObject` to accept only plain objects.
 *
 * @example
 * ```ts
 * isObjectLike({}) // => true
 * isObjectLike([]) // => true
 * isObjectLike(null) // => false
 * ```
 */
export const isObjectLike = (value: unknown): value is Record<PropertyKey, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * Checks whether a value is a non-null object that is not an array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is object-like and not an array, otherwise `false`.
 *
 * @remarks
 * Class instances, `Date`, `Map`, and similar still pass. Use `isPlainObject`
 * to accept only plain objects.
 *
 * @example
 * ```ts
 * isObject({}) // => true
 * isObject([]) // => false
 * isObject(new Date()) // => true
 * ```
 */
export const isObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  return isObjectLike(value) && !Array.isArray(value);
};

/**
 * Checks whether a value is a plain object.
 *
 * @param value - The value to check.
 * @returns `true` for object literals, `Object.create(null)`, and instances of
 * the `Object` constructor, otherwise `false`.
 *
 * @remarks
 * Excludes class instances, arrays, and other exotic objects. `Object.create(null)`
 * passes despite having no prototype.
 *
 * @example
 * ```ts
 * isPlainObject({}) // => true
 * isPlainObject(Object.create(null)) // => true
 * isPlainObject(new Date()) // => false
 * ```
 */
export const isPlainObject = (value: unknown): value is Record<PropertyKey, unknown> => {
  return isPlainObjectTag(value);
};

/**
 * Checks whether a value is an array.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an array, otherwise `false`.
 *
 * @example
 * ```ts
 * isArray([1, 2]) // => true
 * isArray('ab') // => false
 * ```
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Checks whether a value is callable (a function).
 *
 * @param value - The value to check.
 * @returns `true` if the value is a function, otherwise `false`.
 *
 * @example
 * ```ts
 * isFunction(() => {}) // => true
 * isFunction(class {}) // => true
 * isFunction({}) // => false
 * ```
 */
export const isFunction = (value: unknown): value is (...args: never[]) => unknown => {
  return typeof value === 'function';
};

/**
 * Checks whether a value is a `Date` instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Date`, otherwise `false`.
 *
 * @remarks
 * Does not check validity: a `Date` built from an invalid input still passes.
 * Cross-realm dates (from another frame) fail the `instanceof` check.
 *
 * @example
 * ```ts
 * isDate(new Date()) // => true
 * isDate('2020-01-01') // => false
 * ```
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

/**
 * Checks whether a value is a `RegExp` instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `RegExp`, otherwise `false`.
 *
 * @example
 * ```ts
 * isRegExp(/x/) // => true
 * isRegExp('x') // => false
 * ```
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};

/**
 * Checks whether a value is an `Error` instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an `Error` (or a subclass), otherwise `false`.
 *
 * @example
 * ```ts
 * isError(new TypeError()) // => true
 * isError({ message: 'x' }) // => false
 * ```
 */
export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

/**
 * Checks whether a value is a native `Promise`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Promise`, otherwise `false`.
 *
 * @remarks
 * Only native promises pass. To accept any thenable (custom promise-likes), use
 * `isThenable`.
 *
 * @example
 * ```ts
 * isPromise(Promise.resolve()) // => true
 * isPromise({ then() {} }) // => false
 * ```
 */
export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return value instanceof Promise;
};

/**
 * Checks whether a value is thenable: an object with a callable `then` method.
 *
 * @param value - The value to check.
 * @returns `true` if the value is object-like with a `then` function, otherwise `false`.
 *
 * @remarks
 * Broader than `isPromise`: any custom promise-like passes. It does not verify
 * spec-compliant behavior, only the presence of a `then` method.
 *
 * @example
 * ```ts
 * isThenable(Promise.resolve()) // => true
 * isThenable({ then() {} }) // => true
 * isThenable({}) // => false
 * ```
 */
export const isThenable = <T = unknown>(value: unknown): value is PromiseLike<T> => {
  return isObjectLike(value) && typeof (value as { then?: unknown }).then === 'function';
};

/**
 * Checks whether a value is a `Map`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Map`, otherwise `false`.
 *
 * @example
 * ```ts
 * isMap(new Map()) // => true
 * isMap({}) // => false
 * ```
 */
export const isMap = <K = unknown, V = unknown>(value: unknown): value is Map<K, V> => {
  return value instanceof Map;
};

/**
 * Checks whether a value is a `Set`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `Set`, otherwise `false`.
 *
 * @example
 * ```ts
 * isSet(new Set()) // => true
 * isSet([]) // => false
 * ```
 */
export const isSet = <T = unknown>(value: unknown): value is Set<T> => {
  return value instanceof Set;
};

/**
 * Checks whether a value is a `WeakMap`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `WeakMap`, otherwise `false`.
 *
 * @example
 * ```ts
 * isWeakMap(new WeakMap()) // => true
 * isWeakMap(new Map()) // => false
 * ```
 */
export const isWeakMap = <K extends object = object, V = unknown>(
  value: unknown,
): value is WeakMap<K, V> => {
  return value instanceof WeakMap;
};

/**
 * Checks whether a value is a `WeakSet`.
 *
 * @param value - The value to check.
 * @returns `true` if the value is a `WeakSet`, otherwise `false`.
 *
 * @example
 * ```ts
 * isWeakSet(new WeakSet()) // => true
 * isWeakSet(new Set()) // => false
 * ```
 */
export const isWeakSet = <T extends object = object>(value: unknown): value is WeakSet<T> => {
  return value instanceof WeakSet;
};
