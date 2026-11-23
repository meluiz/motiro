import { sum } from './sum';

/**
 * Calculates the arithmetic mean of a list of numbers.
 *
 * The values are summed with `sum`, using Kahan–Neumaier compensation, which
 * tracks the rounding error each addition discards and folds it back in. A plain
 * sum drifts once the running total grows far apart from the values being
 * added — summing `0.1` ten thousand times naively lands near `1000.0000000001`
 * rather than `1000`.
 *
 * @param values - The numbers to average. Must not be empty.
 * @returns The arithmetic mean.
 *
 * @throws {RangeError} If `values` is empty. The mean of nothing is undefined,
 *   and returning `0` would silently misreport an empty dataset as one centred
 *   on zero.
 *
 * @remarks
 * `NaN` propagates: a single `NaN` in the input makes the result `NaN`, since
 * it participates in the sum. Filter with `isNumber` from `@motiro/guard`
 * first when the input may be dirty.
 *
 * Mixing `Infinity` and `-Infinity` yields `NaN`, as their sum is undefined.
 *
 * Finite values whose total would overflow are scaled down first, so
 * `mean([Number.MAX_VALUE, Number.MAX_VALUE])` is `Number.MAX_VALUE` rather
 * than `Infinity`.
 *
 * @example
 * ```ts
 * mean([1, 2, 3, 4]);
 * // => 2.5
 *
 * mean([10]);
 * // => 10
 *
 * mean([-5, 5]);
 * // => 0
 *
 * mean([0.1, 0.2, 0.3]);
 * // => 0.2 (exactly, not 0.20000000000000004)
 * ```
 */
export const mean = (values: readonly number[]): number => {
  if (values.length === 0) {
    throw new RangeError('Cannot calculate the mean of an empty list');
  }

  const total = sum(values);

  if (Number.isFinite(total) || !values.every(Number.isFinite)) {
    return total / values.length;
  }

  // Finite values whose total overflows — two copies of Number.MAX_VALUE, say
  // — are scaled down before summing, so the mean itself stays representable.
  return sum(values.map((value) => value / values.length));
};
