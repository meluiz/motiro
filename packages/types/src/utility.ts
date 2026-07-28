declare const brand: unique symbol;

/**
 * A value that may be `null` or `undefined`, in addition to `T`.
 *
 * @typeParam T - The underlying value type.
 *
 * @example
 * ```ts
 * declare function find(id: string): Nullable<User>;
 * // returns a User, null, or undefined
 * ```
 */
export type Nullable<T> = T | null | undefined;

/**
 * An alias for {@link Nullable}: a value that may be `null` or `undefined`.
 * Provided for readability when "maybe present" reads better than "nullable".
 *
 * @typeParam T - The underlying value type.
 *
 * @example
 * ```ts
 * type MaybeName = Maybe<string>;
 * // => string | null | undefined
 * ```
 */
export type Maybe<T> = T | null | undefined;

/**
 * Normalizes a possibly-`null` value to a `undefined`-based optional: strips
 * `null` and ensures `undefined` is allowed. Useful for bridging APIs that use
 * `null` with code that prefers `undefined`.
 *
 * @typeParam T - The underlying value type.
 *
 * @example
 * ```ts
 * type A = Optional<string | null>;
 * // => string | undefined
 *
 * type B = Optional<string>;
 * // => string | undefined
 * ```
 */
export type Optional<T> = Exclude<T, null> | undefined;

/**
 * Creates a nominal ("branded") type: a value structurally identical to `T` at
 * runtime, but treated as distinct by the type system. Prevents accidentally
 * mixing values that share a base type but mean different things — different
 * kinds of IDs, or units of measure.
 *
 * The brand is a phantom property that exists only at compile time, so a branded
 * value behaves as a plain `T` at runtime. Create branded values with a type
 * assertion, ideally inside a validating "smart constructor".
 *
 * @typeParam T - The underlying base type (e.g. `string`, `number`).
 * @typeParam B - A unique marker, usually a string literal naming the brand.
 *
 * @example
 * ```ts
 * type UserId = Branded<string, 'UserId'>;
 * type PostId = Branded<string, 'PostId'>;
 *
 * const toUserId = (raw: string): UserId => raw as UserId;
 *
 * declare function getUser(id: UserId): void;
 *
 * getUser(toUserId('u_1')); // ok
 * getUser('p_1' as PostId); // error: PostId is not a UserId
 * ```
 */
export type Branded<T, B> = T & { readonly [brand]: B };

/**
 * A string literal union that also accepts any other string, while preserving
 * autocomplete for the known literals. Solves the problem where `A | string`
 * collapses to just `string`, losing the suggestions for `A`.
 *
 * @typeParam Known - The literal union to suggest (e.g. `'sm' | 'lg'`).
 * @typeParam Base - The widening base type, usually `string`.
 *
 * @example
 * ```ts
 * type Size = LiteralUnion<'sm' | 'md' | 'lg', string>;
 * const a: Size = 'sm';     // suggested by autocomplete
 * const b: Size = 'custom'; // still allowed
 * ```
 */
export type LiteralUnion<Known extends Base, Base = string> =
  | Known
  | (Base & Record<never, never>);
