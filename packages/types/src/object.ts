/**
 * A plain object (dictionary) with string keys and values of type `T`.
 *
 * @typeParam T - The type of the values. Defaults to `unknown` for safety;
 *   pass an explicit type for stronger guarantees.
 *
 * @example
 * ```ts
 * const scores: Dict<number> = { alice: 10, bob: 8 };
 * ```
 */
export type Dict<T = unknown> = { [key: string]: T };

/**
 * Flattens an intersection or mapped type into a single, readable object type.
 *
 * Purely cosmetic at the type level: it forces the compiler to resolve the type
 * eagerly, so editor hovers show the final shape instead of a chain of
 * intersections. It has no effect on the runtime value.
 *
 * @typeParam T - The type to flatten.
 *
 * @example
 * ```ts
 * type Messy = { a: number } & { b: string };
 * type Clean = Prettify<Messy>;
 * // hover shows: { a: number; b: string }
 * ```
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Recursively flattens nested intersection and mapped types into clean object
 * types, at every depth. The deep counterpart of {@link Prettify}.
 *
 * Like `Prettify`, it is purely cosmetic and has no effect on the runtime
 * value — but it also resolves nested objects, not just the top level.
 * Functions and arrays are preserved as-is rather than being expanded.
 *
 * @typeParam T - The type to deeply flatten.
 *
 * @example
 * ```ts
 * type Nested = { a: number } & { b: { c: string } & { d: boolean } };
 *
 * type Shallow = Prettify<Nested>;
 * // => { a: number; b: { c: string } & { d: boolean } }  (b stays raw)
 *
 * type Deep = PrettifyDeep<Nested>;
 * // => { a: number; b: { c: string; d: boolean } }        (b flattened too)
 * ```
 */
export type PrettifyDeep<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]: PrettifyDeep<T[K]> } & {}
      : T;

/**
 * Makes the selected keys `K` of `T` optional, leaving the rest unchanged.
 *
 * @typeParam T - The source object type.
 * @typeParam K - The keys to make optional.
 *
 * @example
 * ```ts
 * type User = { id: number; name: string; email: string };
 * type Draft = PartialBy<User, 'email'>;
 * // => { id: number; name: string; email?: string }
 * ```
 */
export type PartialBy<T, K extends keyof T> = Prettify<Omit<T, K> & Partial<Pick<T, K>>>;

/**
 * Makes all properties optional except the selected keys `K`, which stay
 * required. The inverse of {@link PartialBy}.
 *
 * @typeParam T - The source object type.
 * @typeParam K - The keys to keep required.
 *
 * @example
 * ```ts
 * type User = { id: number; name: string; email: string };
 * type ById = PartialExcept<User, 'id'>;
 * // => { id: number; name?: string; email?: string }
 * ```
 */
export type PartialExcept<T, K extends keyof T> = Prettify<Partial<Omit<T, K>> & Pick<T, K>>;

/**
 * Recursively makes all properties optional, at every depth. The deep
 * counterpart of the built-in `Partial`. Functions and arrays are preserved.
 *
 * @typeParam T - The object type to make deeply optional.
 *
 * @example
 * ```ts
 * type Config = { db: { host: string; port: number } };
 * type Draft = PartialDeep<Config>;
 * // => { db?: { host?: string; port?: number } }
 * ```
 */
export type PartialDeep<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: PartialDeep<T[K]> }
      : T;

/**
 * Makes all properties optional and allows `null` as a value for each. Useful
 * for patch/update payloads where a field may be cleared.
 *
 * @typeParam T - The source object type.
 *
 * @example
 * ```ts
 * type Patch = PartialNullable<{ name: string; age: number }>;
 * // => { name?: string | null; age?: number | null }
 * ```
 */
export type PartialNullable<T> = { [K in keyof T]?: T[K] | null };

/**
 * Recursively makes all properties required, at every depth. The deep
 * counterpart of the built-in `Required`. Functions and arrays are preserved.
 *
 * @typeParam T - The object type to make deeply required.
 *
 * @example
 * ```ts
 * type Loose = { db?: { host?: string } };
 * type Strict = RequiredDeep<Loose>;
 * // => { db: { host: string } }
 * ```
 */
export type RequiredDeep<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]-?: RequiredDeep<T[K]> }
      : T;

/**
 * Extracts the union of all value types of an object. The value-level
 * counterpart of `keyof`.
 *
 * @typeParam T - The object type to read values from.
 *
 * @example
 * ```ts
 * type Sizes = { s: 1; m: 2; l: 3 };
 * type Value = ValueOf<Sizes>;
 * // => 1 | 2 | 3
 * ```
 */
export type ValueOf<T> = T[keyof T];

/**
 * Removes the `readonly` modifier from all properties of an object, producing a
 * mutable version. The inverse of the built-in `Readonly`. Shallow: nested
 * objects keep their own `readonly` modifiers.
 *
 * @typeParam T - The object type to make writable.
 *
 * @example
 * ```ts
 * type Frozen = { readonly id: number; readonly name: string };
 * type Mutable = Writable<Frozen>;
 * // => { id: number; name: string }
 *
 * const u: Mutable = { id: 1, name: 'x' };
 * u.id = 2; // ok
 * ```
 */
export type Writable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * Merges two object types, with the properties of `U` overriding those of `T`
 * when keys overlap. The result is flattened for readability.
 *
 * @typeParam T - The base object type.
 * @typeParam U - The object type whose properties take precedence.
 *
 * @example
 * ```ts
 * type A = { id: number; name: string };
 * type B = { name: boolean };
 * type Merged = Merge<A, B>;
 * // => { id: number; name: boolean }
 * ```
 */
export type Merge<T, U> = Prettify<Omit<T, keyof U> & U>;
