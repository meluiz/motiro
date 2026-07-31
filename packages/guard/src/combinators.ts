export type Guard<T> = (value: unknown) => value is T;

export type GuardType<G> = G extends Guard<infer T> ? T : never;

export type GuardShape = Record<PropertyKey, Guard<unknown>>;

export type InferShape<S extends GuardShape> = {
  [K in keyof S]: GuardType<S[K]>;
};

/**
 * Combines multiple guards into a union guard that passes if any of them pass.
 *
 * @param guards - The guards to combine.
 * @returns A guard that narrows to the union of the input guards' types.
 *
 * @example
 * ```ts
 * const isKey = isOneOf(isString, isNumber, isSymbol)
 * isKey('a') // => true
 * isKey(true) // => false
 * // narrows to string | number | symbol
 * ```
 */
export const isOneOf = <const G extends readonly Guard<unknown>[]>(...guards: G) => {
  return (value: unknown): value is GuardType<G[number]> => {
    for (const guard of guards) {
      if (guard(value)) {
        return true;
      }
    }

    return false;
  };
};

/**
 * Creates a guard for an array whose every element satisfies the given guard.
 *
 * @param guard - The guard applied to each element.
 * @returns A guard that narrows to `T[]`.
 *
 * @remarks
 * An empty array passes: there are no elements to violate the guard.
 *
 * @example
 * ```ts
 * const isStringArray = isArrayOf(isString)
 * isStringArray(['a', 'b']) // => true
 * isStringArray(['a', 1]) // => false
 * isStringArray([]) // => true
 * ```
 */
export const isArrayOf = <T>(guard: Guard<T>): Guard<T[]> => {
  return (value: unknown): value is T[] => {
    if (!Array.isArray(value)) {
      return false;
    }

    for (const item of value) {
      if (!guard(item)) {
        return false;
      }
    }

    return true;
  };
};

/**
 * Creates a guard that validates the shape of an object against a map of guards.
 *
 * @param shape - A map of keys to the guard each corresponding value must satisfy.
 * @returns A guard that narrows to the object type inferred from the shape.
 *
 * @remarks
 * Validation is non-exhaustive: extra keys on the value are ignored. Both string
 * and symbol keys in the shape are checked.
 *
 * @example
 * ```ts
 * const isPoint = isShape({ x: isNumber, y: isNumber })
 * isPoint({ x: 1, y: 2 }) // => true
 * isPoint({ x: 1, y: 2, z: 3 }) // => true (extra keys ignored)
 * isPoint({ x: 1 }) // => false
 * // narrows to { x: number; y: number }
 * ```
 */
export const isShape = <const S extends GuardShape>(shape: S): Guard<InferShape<S>> => {
  return (value: unknown): value is InferShape<S> => {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    for (const key of Reflect.ownKeys(shape)) {
      const guard = shape[key as keyof S];

      if (!guard) {
        continue;
      }

      if (!guard((value as Record<PropertyKey, unknown>)[key])) {
        return false;
      }
    }
    return true;
  };
};

/**
 * Creates a guard that passes when the value is strictly equal to one of the
 * given literals.
 *
 * @param values - The literal values to match against.
 * @returns A guard that narrows to the union of the literals.
 *
 * @example
 * ```ts
 * const isDirection = isLiteral('up', 'down', 'left', 'right')
 * isDirection('up') // => true
 * isDirection('back') // => false
 * // narrows to 'up' | 'down' | 'left' | 'right'
 * ```
 */
export const isLiteral = <
  const T extends readonly (string | number | boolean | bigint | null | undefined)[],
>(
  ...values: T
): Guard<T[number]> => {
  return (value: unknown): value is T[number] => {
    for (const literal of values) {
      if (value === literal) {
        return true;
      }
    }
    return false;
  };
};

/**
 * Creates a guard that checks whether a value is an instance of the given class.
 *
 * @param ctor - The constructor to check against.
 * @returns A guard that narrows to the instance type `T`.
 *
 * @example
 * ```ts
 * const isDate = isInstanceOf(Date)
 * isDate(new Date()) // => true
 * isDate('2020-01-01') // => false
 * ```
 */
export const isInstanceOf = <T>(ctor: new (...args: never[]) => T): Guard<T> => {
  return (value: unknown): value is T => {
    return value instanceof ctor;
  };
};

/**
 * Creates a guard for a non-empty array, optionally validating each element.
 *
 * @param guard - Optional guard applied to each element.
 * @returns A guard that narrows to the non-empty tuple type `[T, ...T[]]`.
 *
 * @remarks
 * Called without a guard, `T` cannot be inferred and defaults to `unknown`,
 * yielding `[unknown, ...unknown[]]`.
 *
 * @example
 * ```ts
 * isNonEmptyArray()([1]) // => true
 * isNonEmptyArray()([]) // => false
 *
 * const isNonEmptyStrings = isNonEmptyArray(isString)
 * isNonEmptyStrings(['a']) // => true
 * isNonEmptyStrings([1]) // => false
 * ```
 */
export const isNonEmptyArray = <T>(guard?: Guard<T>): Guard<[T, ...T[]]> => {
  return (value: unknown): value is [T, ...T[]] => {
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }
    if (guard === undefined) {
      return true;
    }
    for (const item of value) {
      if (!guard(item)) {
        return false;
      }
    }
    return true;
  };
};

/**
 * Negates a guard: the returned guard passes when the input guard fails.
 *
 * @param guard - The guard to negate.
 * @returns A guard that passes for values the input guard rejects.
 *
 * @remarks
 * Type narrowing on negation is weak against an `unknown` input: the complement
 * of a type within `unknown` is still effectively `unknown`, so the result is
 * typed as `Guard<unknown>`. It works as a runtime filter, but meaningful
 * exclusion narrowing only occurs when the input type is already a concrete
 * union.
 *
 * @example
 * ```ts
 * const isNotString = not(isString)
 * isNotString(1) // => true
 * isNotString('a') // => false
 * ```
 */
export const not = <T>(guard: Guard<T>): Guard<unknown> => {
  return (value: unknown): value is unknown => {
    return !guard(value);
  };
};

/**
 * Wraps a guard to also accept `undefined`.
 *
 * @param guard - The guard to make optional.
 * @returns A guard that narrows to `T | undefined`.
 *
 * @example
 * ```ts
 * const isMaybeString = optional(isString)
 * isMaybeString('a') // => true
 * isMaybeString(undefined) // => true
 * isMaybeString(null) // => false
 * ```
 */
export const optional = <T>(guard: Guard<T>): Guard<T | undefined> => {
  return (value: unknown): value is T | undefined => {
    return value === undefined || guard(value);
  };
};

/**
 * Wraps a guard to also accept `null`.
 *
 * @param guard - The guard to make nullable.
 * @returns A guard that narrows to `T | null`.
 *
 * @example
 * ```ts
 * const isNullableString = nullable(isString)
 * isNullableString('a') // => true
 * isNullableString(null) // => true
 * isNullableString(undefined) // => false
 * ```
 */
export const nullable = <T>(guard: Guard<T>): Guard<T | null> => {
  return (value: unknown): value is T | null => {
    return value === null || guard(value);
  };
};
