/**
 * Options defining the bounds applied by {@link clamp}.
 */
export type ClampOptions = {
  /**
   * Lower bound. When omitted, the value is not bounded from below.
   *
   * @defaultValue `undefined`
   */
  min?: number;

  /**
   * Upper bound. When omitted, the value is not bounded from above.
   *
   * @defaultValue `undefined`
   */
  max?: number;
};

/**
 * Restricts a number to the given bounds, returning the nearest value inside
 * the range.
 *
 * Both bounds are inclusive and independently optional: omitting `min` leaves
 * the value unbounded from below, omitting `max` unbounded from above, and
 * omitting both returns the value unchanged.
 *
 * @param value - The number to restrict.
 * @param limits - The bounds to apply. See {@link ClampOptions}.
 * @param limits.min - Inclusive lower bound.
 * @param limits.max - Inclusive upper bound.
 * @returns The value itself when it already sits within the bounds, otherwise
 *   the closest bound.
 *
 * @throws {RangeError} If both bounds are given and `min` is greater than `max`,
 *   since no value could satisfy the range, or if either bound is `NaN`, which
 *   would silently turn every result into `NaN`.
 *
 * @remarks
 * A `NaN` value is propagated rather than rejected: comparing it against either
 * bound yields `NaN`, so `clamp(NaN, { min: 0 })` returns `NaN`. Validate the input
 * with `isNumber` from `@motiro/guard` first when that matters.
 *
 * @example
 * ```ts
 * clamp(15, { min: 0, max: 10 });
 * // => 10
 *
 * clamp(-5, { min: 0, max: 10 });
 * // => 0
 *
 * clamp(5, { min: 0, max: 10 });
 * // => 5
 *
 * clamp(-5, { min: 0 });
 * // => 0
 *
 * clamp(42, {});
 * // => 42
 * ```
 */
export const clamp = (value: number, limits: ClampOptions): number => {
  const { min, max } = limits;

  if (Number.isNaN(min) || Number.isNaN(max)) {
    throw new RangeError('Bounds must not be NaN.');
  }

  if (min != null && max != null) {
    if (min > max) {
      throw new RangeError('Minimum value cannot be greater than maximum value.');
    }

    return Math.min(Math.max(value, min), max);
  }

  if (min != null) {
    return Math.max(value, min);
  }

  if (max != null) {
    return Math.min(value, max);
  }

  return value;
};
