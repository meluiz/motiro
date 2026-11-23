/**
 * The most elements a JavaScript array can hold.
 */
const MAX_LENGTH = 2 ** 32 - 1;

/**
 * Generates an array of numbers over an interval.
 *
 * The range is half-open: `start` is included, `end` is not — matching
 * `Array.prototype.slice` and the convention most iteration APIs follow, so
 * `range(0, 3)` yields three items rather than four.
 *
 * The direction is inferred from the bounds. When `end` is below `start` the
 * range counts down, and a positive `step` is applied in that direction, so
 * `range(5, 0)` and `range(5, 0, 1)` produce the same descending list. Pass a
 * negative `step` only to be explicit; its sign is ignored either way.
 *
 * @param start - The first value, always included.
 * @param end - The bound to stop before, never included.
 * @param step - The distance between consecutive values. Its sign is ignored;
 *   direction comes from the bounds.
 * @returns An array of numbers from `start` towards `end`.
 *
 * @throws {RangeError} If `step` is zero, which would never reach `end`, if
 *   any argument is `NaN`, which leaves the length undefined, if a bound is
 *   infinite, or if the range would hold more values than an array allows.
 *
 * @remarks
 * Fractional steps accumulate floating-point error when added repeatedly, so
 * each value is computed as `start + index * step` rather than by successive
 * addition. `range(0, 1, 0.1)` therefore ends at `0.9` cleanly instead of
 * drifting past it. The count of values tolerates the same rounding error, so
 * `range(1, 1.3, 0.1)` stops at `1.2` even though `1.3 - 1` is not exactly
 * three steps of `0.1` in binary.
 *
 * A non-empty interval always includes `start`, even when `step` overshoots
 * `end` — an infinite `step` yields just `[start]`.
 *
 * The whole array is materialised up front. For very large intervals, or for
 * ranges consumed lazily, a generator is the better shape — this function
 * always allocates every value.
 *
 * @example
 * ```ts
 * range(0, 5);
 * // => [0, 1, 2, 3, 4]
 *
 * range(1, 10, 3);
 * // => [1, 4, 7]
 *
 * range(5, 0);
 * // => [5, 4, 3, 2, 1]
 *
 * range(0, 1, 0.25);
 * // => [0, 0.25, 0.5, 0.75]
 *
 * range(3, 3);
 * // => []
 * ```
 */
export const range = (start: number, end: number, step: number = 1): number[] => {
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(step)) {
    throw new RangeError('Range bounds and step must be numbers');
  }

  if (step === 0) {
    throw new RangeError('Step must not be zero');
  }

  const distance = Math.abs(end - start);

  if (!Number.isFinite(distance)) {
    throw new RangeError('Range bounds and step must produce a finite length');
  }

  const size = Math.abs(step);
  const length = distance === 0 ? 0 : Math.max(1, countSteps(distance / size));

  if (length > MAX_LENGTH) {
    throw new RangeError(`Range would hold ${length} values, more than an array allows`);
  }

  const direction = end < start ? -size : size;
  const values: number[] = new Array(length);

  // Written directly, since `0 * Infinity` is NaN when the step is infinite.
  if (length > 0) {
    values[0] = start;
  }

  for (let index = 1; index < length; index++) {
    // Computed from the origin rather than accumulated, so fractional steps
    // do not drift.
    values[index] = start + index * direction;
  }

  return values;
};

/**
 * Counts how many steps fit before the end of the interval, treating a ratio
 * within rounding error of a whole number as that whole number.
 *
 * Without the tolerance, `0.30000000000000004 / 0.1` — the distance of
 * `range(1, 1.3, 0.1)` — is `3.0000000000000004`, which rounds up to four
 * steps and puts `end` itself in the output.
 *
 * @param ratio - The distance divided by the step size.
 * @returns The number of values in the half-open range.
 */
const countSteps = (ratio: number): number => {
  const nearest = Math.round(ratio);

  if (Math.abs(ratio - nearest) <= nearest * Number.EPSILON * 4) {
    return nearest;
  }

  return Math.ceil(ratio);
};
