# @motiro/number

## 0.1.0

### Minor Changes

- [#11](https://github.com/meluiz/motiro/pull/11) [`61956c2`](https://github.com/meluiz/motiro/commit/61956c23625486db04d8fe996cea044c73a539d1) Thanks [@meluiz](https://github.com/meluiz)! - Initial release of @motiro/number — a collection of number utilities.

  Includes:

  - `clamp` — restrict a number to optional, inclusive `min` / `max` bounds
  - `round` — round to a number of decimal places, halfway away from zero, without the `1.005` scaling error
  - `lerp` — linear interpolation between two values, extrapolating outside `0..1`
  - `interpolate` — piecewise mapping between paired input and output ranges, with `clamp`, `extend` or `identity` extrapolation
  - `range` — half-open numeric range in either direction, free of drift with fractional steps
  - `random` — random integer (both bounds inclusive) or float in `[min, max)` (non-cryptographic)
  - `sum`, `mean` — compensated (Kahan–Neumaier) total and arithmetic mean
  - `format` — locale-aware formatting over a cached `Intl.NumberFormat`
  - `fromBytes`, `toBytes` — format and parse human-readable sizes in decimal (`KB`) or binary (`KiB`) units
  - `BytesOptions`, `ClampOptions`, `Extrapolate`, `FormatOptions`, `InterpolateOptions`, `InterpolateRanges`, `RandomOptions` — option and range types
