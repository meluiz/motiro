# @motiro/number

> Fast, tree-shakeable number utilities for the Motiro toolkit — clamping, rounding, interpolation, ranges and formatting.

[![npm version](https://img.shields.io/npm/v/@motiro/number.svg)](https://www.npmjs.com/package/@motiro/number)
[![license](https://img.shields.io/npm/l/@motiro/number.svg)](https://github.com/meluiz/motiro/blob/main/LICENSE)

A focused set of number utilities: bounded and piecewise interpolation, rounding that gets `1.005` right, half-open ranges that do not drift with fractional steps, compensated sums and averages, cached locale formatting, and human-readable byte sizes. Everything is ESM-only, side-effect free, and fully tree-shakeable.

## Features

- 🎯 **Correct by default** — `round(1.005, 2)` is `1.01`, `range(1, 1.3, 0.1)` stops before `1.3`, and `sum` does not drift over long lists.
- 📈 **Interpolation** — `lerp` for two points, `interpolate` for piecewise curves with `clamp`, `extend` or `identity` extrapolation.
- 🌍 **Formatting** — a cached `Intl.NumberFormat` wrapper and `fromBytes` / `toBytes` for decimal (`KB`) and binary (`KiB`) sizes.
- 🚨 **Loud on bad configuration** — impossible bounds, zero steps or empty averages throw a `RangeError` instead of returning a silent wrong answer.
- 🌳 **Tree-shakeable** — import only what you use; zero dependencies.

## Installation

```sh
# bun
bun add @motiro/number

# npm
npm install @motiro/number

# pnpm
pnpm add @motiro/number

# yarn
yarn add @motiro/number
```

## Usage

```ts
import { clamp, round, interpolate, range, fromBytes, format } from '@motiro/number';

clamp(15, { min: 0, max: 10 }); // => 10

round(1.005, 2); // => 1.01

interpolate(75, { input: [0, 50, 100], output: [0, 10, 0] }); // => 5

range(0, 1, 0.25); // => [0, 0.25, 0.5, 0.75]

fromBytes(1536); // => '1.5 KB'

format(1234.5, { locale: 'pt-BR', style: 'currency', currency: 'BRL' }); // => 'R$ 1.234,50'
```

## API

### Bounds & rounding

| Function | Description |
| --- | --- |
| `clamp(value, limits)` | Restricts `value` to `{ min?, max? }`, both inclusive and independently optional. Throws `RangeError` when `min > max` or a bound is `NaN`. |
| `round(value, decimals?)` | Rounds to `decimals` places (default `0`), halfway values away from zero. Negative `decimals` round left of the point (`round(1234, -2)` → `1200`). Throws `RangeError` outside `-292..292`. |

`ClampOptions`: `{ min?: number; max?: number }`.

### Interpolation

| Function | Description |
| --- | --- |
| `lerp(start, end, t)` | Linear interpolation; `t` outside `0..1` extrapolates, never clamps. |
| `interpolate(value, ranges, options?)` | Maps `value` from `ranges.input` onto `ranges.output`, piecewise across every pair of neighbouring points. Throws `RangeError` when the ranges differ in length, hold fewer than two points, contain holes, or `input` is not strictly increasing. |

`InterpolateRanges`: `{ input: readonly number[]; output: readonly number[] }`.
`InterpolateOptions`: `{ extrapolate?: Extrapolate }` — defaults to `'clamp'`.
`Extrapolate`: `'clamp' | 'extend' | 'identity'` — pin to the nearest output, follow the outermost segment's slope, or return the value untouched.

```ts
interpolate(2, { input: [0, 1], output: [0, 100] }); // => 100
interpolate(2, { input: [0, 1], output: [0, 100] }, { extrapolate: 'extend' }); // => 200
interpolate(2, { input: [0, 1], output: [0, 100] }, { extrapolate: 'identity' }); // => 2
```

### Sequences & randomness

| Function | Description |
| --- | --- |
| `range(start, end, step?)` | Half-open range from `start` towards `end`; direction comes from the bounds, so `range(5, 0)` counts down. Throws `RangeError` for a zero step, `NaN` or infinite bounds. |
| `random(min, max, options?)` | Random integer with both bounds inclusive, or a float in `[min, max)` with `{ float: true }`. **Not cryptographically secure** — uses `Math.random()`. Throws `RangeError` for `min > max` or non-finite bounds. |

`RandomOptions`: `{ float?: boolean }` — defaults to `false`.

### Aggregation

| Function | Description |
| --- | --- |
| `sum(values)` | Adds a list with Kahan–Neumaier compensation; an empty list sums to `0`. |
| `mean(values)` | Arithmetic mean, compensated like `sum`. Throws `RangeError` for an empty list. |

```ts
sum([1e100, 1, -1e100]); // => 1, where a plain reduce gives 0
mean([1, 2, 3, 4]); // => 2.5
```

### Formatting

| Function | Description |
| --- | --- |
| `format(value, options?)` | Formats with `Intl.NumberFormat`, caching one formatter per locale and options. |
| `fromBytes(bytes, options?)` | Formats a byte count in the largest unit that keeps it at or above `1` (`1536` → `'1.5 KB'`). Throws `RangeError` for non-finite counts. |
| `toBytes(input)` | Parses a size such as `'1.5 KB'`, `'512mb'` or `'900'` into bytes. Throws `TypeError` on malformed input or an unknown unit. |

`FormatOptions`: every `Intl.NumberFormatOptions` field, plus `{ locale?: string | readonly string[] }`.
`BytesOptions`: `{ binary?: boolean; decimals?: number }` — defaults `binary: false` (`KB` = 1000), `decimals: 1`.

```ts
fromBytes(1536, { binary: true }); // => '1.5 KiB'
fromBytes(1073741824, { decimals: 2 }); // => '1.07 GB'
toBytes('1.5 KiB'); // => 1536
```

### Exported types

```ts
import type {
  BytesOptions,
  ClampOptions,
  Extrapolate,
  FormatOptions,
  InterpolateOptions,
  InterpolateRanges,
  RandomOptions,
} from '@motiro/number';
```

## License

[MIT](https://github.com/meluiz/motiro/blob/main/LICENSE) © [meluiz](https://meluiz.com)
