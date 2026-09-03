# @motiro/core

## 0.1.0

### Minor Changes

- [`f3ff0f3`](https://github.com/meluiz/motiro/commit/f3ff0f3c740c727fb8452edeebdffa0f6391435d) Thanks [@meluiz](https://github.com/meluiz)! - Initial release of @motiro/core — the complete Motiro toolkit behind a single entry point.

  This package contains no logic of its own; it re-exports every `@motiro` package so you can install the whole toolkit as one dependency, or import a single domain via its subpath.

  Re-exports:

  - `@motiro/string` — string utilities (casing, truncation, slugs, interpolation, and more)
  - `@motiro/guard` — composable type guards and runtime validation
  - `@motiro/types` — type-level utilities, zero runtime
