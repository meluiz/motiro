/**
 * How values outside the input range are handled.
 *
 * - `'clamp'`: pins the result to the nearest end of the output range.
 * - `'extend'`: keeps interpolating along the outermost segment's slope.
 * - `'identity'`: returns the input value untouched.
 */
export type Extrapolate = 'clamp' | 'extend' | 'identity';

/**
 * The paired ranges mapped by {@link interpolate}.
 */
export type InterpolateRanges = {
  /**
   * The source range. Must have at least two entries, the same length as
   * `output`, and be strictly increasing.
   */
  readonly input: readonly number[];

  /**
   * The target range each `input` entry maps to. Needs no particular order —
   * a decreasing output inverts the mapping.
   */
  readonly output: readonly number[];
};

/**
 * Options controlling how {@link interpolate} handles out-of-range values.
 */
export type InterpolateOptions = {
  /**
   * Strategy applied when `value` falls outside the input range. See
   * {@link Extrapolate}.
   *
   * @defaultValue `'clamp'`
   */
  extrapolate?: Extrapolate;
};

type Segment = {
  inMin: number;
  inMax: number;
  outMin: number;
  outMax: number;
};

/**
 * Maps a number from one range onto another, interpolating linearly between
 * the matching points.
 *
 * The ranges are read as paired points: `input[i]` maps to `output[i]`. With
 * more than two points the mapping is piecewise — each pair of neighbours
 * forms its own segment with its own slope, which is what lets a single call
 * describe a curve rather than a straight line.
 *
 * Values outside the input range are resolved by
 * {@link InterpolateOptions.extrapolate}, which clamps to the nearest output
 * bound by default. The endpoints themselves are inside the range and always
 * map to their paired output, whatever the strategy.
 *
 * @param value - The number to map.
 * @param ranges - The paired input and output ranges. See {@link InterpolateRanges}.
 * @param options - Interpolation options. See {@link InterpolateOptions}.
 * @returns The interpolated value in the output range.
 *
 * @throws {RangeError} If the ranges have different lengths, hold fewer than
 *   two points, contain holes, or if `input` is not strictly increasing —
 *   equal or descending points leave a segment with no width to interpolate
 *   across.
 *
 * @remarks
 * `NaN` is propagated rather than rejected, matching `clamp`: it belongs to no
 * segment and compares `false` against every bound, so `interpolate(NaN, ...)`
 * returns `NaN`. Validate with `isNumber` from `@motiro/guard` first when that
 * matters.
 *
 * `output` is deliberately unconstrained — it may descend, repeat values, or
 * change direction between segments. Only `input` needs to be ordered, since
 * it is what locates the segment.
 *
 * @example
 * ```ts
 * interpolate(0.5, { input: [0, 1], output: [0, 100] });
 * // => 50
 *
 * interpolate(2, { input: [0, 1], output: [0, 100] });
 * // => 100 (clamped)
 *
 * interpolate(2, { input: [0, 1], output: [0, 100] }, { extrapolate: 'extend' });
 * // => 200
 *
 * interpolate(2, { input: [0, 1], output: [0, 100] }, { extrapolate: 'identity' });
 * // => 2
 *
 * interpolate(75, { input: [0, 50, 100], output: [0, 10, 0] });
 * // => 5 (piecewise: rises then falls)
 * ```
 */
export const interpolate = (
  value: number,
  ranges: InterpolateRanges,
  options?: InterpolateOptions,
): number => {
  const { extrapolate = 'clamp' } = options ?? {};

  validateRanges(ranges);

  const { input, output } = ranges;
  const lastIndex = input.length - 1;

  // `validateRanges` has ruled out holes, so every index is populated.
  const firstInput = input[0] as number;
  const lastInput = input[lastIndex] as number;
  const firstOutput = output[0] as number;
  const lastOutput = output[lastIndex] as number;

  // The endpoints belong to the range, so they map to their output even when
  // the strategy for values beyond them is 'identity'.
  if (value === firstInput) {
    return firstOutput;
  }

  if (value === lastInput) {
    return lastOutput;
  }

  if (value < firstInput) {
    return extrapolateOutside(value, extrapolate, firstOutput, 0, ranges);
  }

  if (value > lastInput) {
    return extrapolateOutside(value, extrapolate, lastOutput, lastIndex - 1, ranges);
  }

  const segment = findSegment(value, ranges);

  if (segment === undefined) {
    // Unreachable for a validated range, except for NaN, which belongs to no
    // segment and is propagated rather than rejected.
    return Number.NaN;
  }

  return interpolateSegment(value, segment);
};

/**
 * Resolves a value that sits outside the input range, according to the chosen
 * extrapolation strategy.
 *
 * @param value - The out-of-range value.
 * @param extrapolate - The strategy to apply.
 * @param bound - The output value at the nearest end of the range.
 * @param segmentIndex - Index of the outermost segment, used by `'extend'`.
 * @param ranges - The paired ranges.
 * @returns The resolved value.
 */
const extrapolateOutside = (
  value: number,
  extrapolate: Extrapolate,
  bound: number,
  segmentIndex: number,
  ranges: InterpolateRanges,
): number => {
  if (extrapolate === 'identity') {
    return value;
  }

  if (extrapolate === 'extend') {
    const segment = segmentAt(segmentIndex, ranges);

    if (segment !== undefined) {
      return interpolateSegment(value, segment);
    }
  }

  return bound;
};

/**
 * Checks the ranges hold enough strictly increasing points to interpolate.
 *
 * @param ranges - The paired ranges to validate.
 * @throws {RangeError} If the lengths differ, there are fewer than two points,
 *   or `input` is not strictly increasing.
 */
const validateRanges = (ranges: InterpolateRanges): void => {
  const { input, output } = ranges;

  if (input.length !== output.length) {
    throw new RangeError(
      `Input (length: ${input.length}) and output (length: ${output.length}) must be the same length`,
    );
  }

  if (input.length < 2) {
    throw new RangeError(
      `Input must contain at least two elements for interpolation, received ${input.length}`,
    );
  }

  for (let index = 0; index < input.length; index++) {
    if (input[index] === undefined || output[index] === undefined) {
      throw new RangeError('Input and output ranges must not contain holes');
    }
  }

  for (let index = 0; index < input.length - 1; index++) {
    const current = input[index] as number;
    const next = input[index + 1] as number;

    if (current >= next) {
      throw new RangeError(
        `Input must be strictly increasing, but index ${index} (${current}) is not below index ${index + 1} (${next})`,
      );
    }
  }
};

/**
 * Builds the segment starting at the given index.
 *
 * @param index - Index of the segment's lower point.
 * @param ranges - The paired ranges.
 * @returns The segment, or `undefined` if either point is missing.
 */
const segmentAt = (index: number, ranges: InterpolateRanges): Segment | undefined => {
  const { input, output } = ranges;

  const inMin = input[index];
  const inMax = input[index + 1];
  const outMin = output[index];
  const outMax = output[index + 1];

  if (
    inMin === undefined ||
    inMax === undefined ||
    outMin === undefined ||
    outMax === undefined
  ) {
    return undefined;
  }

  return { inMin, inMax, outMin, outMax };
};

/**
 * Finds the segment containing a value.
 *
 * @param value - The value to locate.
 * @param ranges - The paired ranges.
 * @returns The enclosing segment, or `undefined` if none contains the value.
 */
const findSegment = (value: number, ranges: InterpolateRanges): Segment | undefined => {
  for (let index = 0; index < ranges.input.length - 1; index++) {
    const segment = segmentAt(index, ranges);

    if (segment === undefined) {
      continue;
    }

    if (value >= segment.inMin && value <= segment.inMax) {
      return segment;
    }
  }

  return undefined;
};

/**
 * Interpolates a value linearly across a single segment.
 *
 * @param value - The value to map.
 * @param segment - The segment to interpolate across.
 * @returns The mapped value.
 */
const interpolateSegment = (value: number, segment: Segment): number => {
  const { inMin, inMax, outMin, outMax } = segment;
  const ratio = (value - inMin) / (inMax - inMin);

  return outMin + ratio * (outMax - outMin);
};
