# @motiro/core

The complete Motiro toolkit in a single dependency — small, well-typed,
tree-shakeable utilities for TypeScript.

`@motiro/core` re-exports every `@motiro` package behind one entry point. Import
what you need and bundlers drop the rest; nothing you don't reference ends up in
your build.

```ts
import { clamp, isString, toCamelCase } from "@motiro/core";
```

## Why Motiro

- **ESM-only, tree-shakeable.** One function per module, so a single import
  never drags the whole library in.
- **Honestly typed.** Strict TypeScript throughout, including
  `noUncheckedIndexedAccess`. The signature is the contract.
- **Small and pure.** Each function does one thing and returns a value; no
  hidden state, no surprise mutations.
- **No runtime type-checking in the utilities.** Validation lives in one place —
  `@motiro/guard` — instead of being duplicated across every function.

The name comes from _motirõ_, the Tupi root of _mutirão_: people coming
together to get work done.

## Install

```sh
bun add @motiro/core
```

```sh
npm install @motiro/core
```

> **ESM-only.** Requires a project that can import ES modules — Node 20.19+,
> 22.12+, or any modern bundler. There is no CommonJS build.

## Usage

Import everything from the root:

```ts
import { clamp, chunk, isNumber, slug } from "@motiro/core";
```

Or scope an import to a single domain — useful for smaller import graphs and
clearer intent:

```ts
import { clamp } from "@motiro/core/number";
import { slug } from "@motiro/core/string";
import { isNumber } from "@motiro/core/guard";
```

Both forms tree-shake identically. The domain subpath is purely organisational.

### Want an even smaller footprint?

`@motiro/core` is a convenience wrapper. If you only need one domain, depend on
that package directly and skip the others entirely:

```sh
bun add @motiro/number
```

```ts
import { clamp } from "@motiro/number/clamp";
```

## What's inside

`@motiro/core` bundles no logic of its own — it re-exports these packages, each
of which is also publishable and installable on its own:

| Package          | What it covers                                          |
| ---------------- | ------------------------------------------------------- |
| `@motiro/guard`  | Composable runtime type guards (`isString`, `isNumber`) |
| `@motiro/string` | Case conversion, trimming, padding, slugs, truncation   |
| `@motiro/types`  | Type-level utilities, zero runtime                      |

See each package's README for its full API.

## Conventions

A few things worth knowing before you reach for a function:

- **No input validation in the utilities.** `clamp(value, min, max)` trusts its
  types. If you're handling `unknown` data, narrow it with `@motiro/guard`
  first.
- **Configuration errors throw.** A utility throws a `RangeError` only when a
  _configuration_ argument is outside its supported domain — for example
  `clamp` with `min > max`. It never throws over the type of the main input.
- **Security-sensitive by default where the name implies it.** Functions whose
  name suggests randomness for tokens use `crypto.getRandomValues`. Any faster,
  non-cryptographic variant says so explicitly in its docs.

## Versioning

All `@motiro` packages are released together in lockstep — they always share the
same version. While the toolkit is in `0.x`, a breaking change bumps the minor
and features or fixes bump the patch. Standard SemVer applies from `1.0.0`.

## License

[MIT](https://github.com/meluiz/motiro) © [meluiz](https://meluiz.com)
