/**
 * Linearly interpolates between two values.
 *
 * `t` is the position along the interval: `0` returns `start`, `1` returns
 * `end`, and `0.5` returns the midpoint. Values outside `0..1` extrapolate
 * along the same slope rather than being clamped, so `t = 2` overshoots `end`
 * by the full interval and `t = -1` undershoots `start`.
 *
 * @param start - The value at `t = 0`.
 * @param end - The value at `t = 1`.
 * @param t - The interpolation position, normally between `0` and `1`.
 * @returns The interpolated value.
 *
 * @remarks
 * Computed as `start + (end - start) * t`, which is exact at `t = 0` but may
 * land a bit off `end` at `t = 1` for values far apart in magnitude. The
 * alternative, `start * (1 - t) + end * t`, is exact at both ends but loses
 * monotonicity in between — values can briefly move backwards as `t` rises.
 * The first is the better trade for animation, where the endpoints are usually
 * held explicitly and smoothness matters more.
 *
 * This is the two-point case of `interpolate`, spelled out for readability.
 * Reach for `interpolate` when you need more than two points, or clamping.
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5);
 * // => 50
 *
 * lerp(10, 20, 0);
 * // => 10
 *
 * lerp(0, 100, 2);
 * // => 200 (extrapolates, never clamped)
 *
 * lerp(100, 0, 0.25);
 * // => 75 (descending works the same)
 * ```
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};
