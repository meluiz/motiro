# @motiro/core

## 0.1.1

### Patch Changes

- [#11](https://github.com/meluiz/motiro/pull/11) [`61956c2`](https://github.com/meluiz/motiro/commit/61956c23625486db04d8fe996cea044c73a539d1) Thanks [@meluiz](https://github.com/meluiz)! - Re-export `@motiro/number`, available from the root entry point and the new `@motiro/core/number` subpath.

  `@motiro/number` and `@motiro/string` both export `interpolate` and `random`, so the root now exports each under a suffixed alias: `interpolateNumber` / `interpolateString`, `randomNumber` / `randomString`, and `InterpolateNumberOptions` / `InterpolateStringOptions` for the options types. The unsuffixed `interpolate`, `random` and `InterpolateOptions` stay bound to `@motiro/string`, so existing imports keep working. The domain subpaths keep the original names.

- Updated dependencies [[`61956c2`](https://github.com/meluiz/motiro/commit/61956c23625486db04d8fe996cea044c73a539d1)]:
  - @motiro/number@0.1.0

## 0.1.0

### Minor Changes

- [`f3ff0f3`](https://github.com/meluiz/motiro/commit/f3ff0f3c740c727fb8452edeebdffa0f6391435d) Thanks [@meluiz](https://github.com/meluiz)! - Initial release of @motiro/core — the complete Motiro toolkit behind a single entry point.

  This package contains no logic of its own; it re-exports every `@motiro` package so you can install the whole toolkit as one dependency, or import a single domain via its subpath.

  Re-exports:

  - `@motiro/string` — string utilities (casing, truncation, slugs, interpolation, and more)
  - `@motiro/guard` — composable type guards and runtime validation
  - `@motiro/types` — type-level utilities, zero runtime
