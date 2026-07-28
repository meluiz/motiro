# @motiro/string

## 0.1.1

### Patch Changes

- [`01d89e9`](https://github.com/meluiz/motiro/commit/01d89e99ae442c1ac764f237862f2f428ae4b9bc) Thanks [@meluiz](https://github.com/meluiz)! - Add build validation with publint and arethetypeswrong, extend shared tsconfig, and clean up tsdown config

## 0.1.0

### Minor Changes

- [`3de53b8`](https://github.com/meluiz/motiro/commit/3de53b813836a04d22760bf58499af0d0d1c3402) Thanks [@meluiz](https://github.com/meluiz)! - Initial release of @motiro/string — a collection of string utilities.

  Includes:

  - `capitalize` — capitalize the first letter of a string
  - `casing` — convert between casing styles (camel, snake, kebab, etc.)
  - `truncate` — truncate a string to a character limit, preserving HTML tags
  - `excerpt` — generate a plain-text excerpt (HTML stripped), by characters or words
  - `sentence` — join an array into a human-readable sentence
  - `slug` — convert a string into a URL-friendly slug, with locale support
  - `interpolate` — replace `{{ key }}` placeholders with values, with custom delimiters
  - `random` — generate a random string (non-cryptographic)
  - `duration` — format/parse durations (`fromMilliseconds`, `toMilliseconds`, `fromSeconds`, `toSeconds`)
