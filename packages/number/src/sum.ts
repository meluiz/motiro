/**
 * Adds a list of numbers together.
 *
 * The values are summed with Kahan–Neumaier compensation, which tracks the
 * rounding error each addition discards and folds it back in at the end. A plain
 * `reduce` drifts once the running total grows far apart from the values being
 * added — summing `0.1` ten thousand times naively lands near
 * `1000.0000000001` rather than `1000`. Neumaier's variant also survives
 * values larger than the running total, so `sum([1e100, 1, -1e100])` is `1`
 * rather than `0`.
 *
 * @param values - The numbers to add.
 * @returns The total. An empty list sums to `0`.
 *
 * @remarks
 * Unlike `mean`, an empty list is not an error: zero is the identity for
 * addition and the correct total of nothing, whereas the average of nothing is
 * undefined.
 *
 * `NaN` propagates: a single `NaN` in the input makes the total `NaN`. Mixing
 * `Infinity` and `-Infinity` also yields `NaN`. Filter with `isNumber` from
 * `@motiro/guard` first when the input may be dirty.
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4]);
 * // => 10
 *
 * sum([0.1, 0.2]);
 * // => 0.30000000000000004 — see remarks below
 *
 * sum([]);
 * // => 0
 *
 * sum([-5, 5]);
 * // => 0
 * ```
 */
export const sum = (values: readonly number[]): number => {
  let total = 0;
  // Running compensation for the low-order bits lost to rounding.
  let compensation = 0;

  for (const value of values) {
    const next = total + value;

    // Neumaier's variant: the bits lost belong to whichever operand is
    // smaller, so the larger one is subtracted out first. Plain Kahan assumes
    // the running total is always the larger and loses the 1 in
    // `[1e100, 1, -1e100]`.
    compensation +=
      Math.abs(total) >= Math.abs(value) ? total - next + value : value - next + total;
    total = next;
  }

  // An infinite or NaN total has no low-order bits to restore, and folding the
  // compensation in would turn Infinity into NaN.
  if (!Number.isFinite(total)) {
    return total;
  }

  return total + compensation;
};
