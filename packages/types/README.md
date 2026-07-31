# @motiro/types

> Shared TypeScript utility types for the Motiro toolkit — type-level helpers with zero runtime footprint.

[![npm version](https://img.shields.io/npm/v/@motiro/types.svg)](https://www.npmjs.com/package/@motiro/types)
[![license](https://img.shields.io/npm/l/@motiro/types.svg)](https://github.com/meluiz/motiro/blob/main/LICENSE)

A curated collection of utility types: object transformers (`Merge`, `PartialDeep`, `Prettify`, …), string-character unions (`Letter`, `Digit`, …), numeric helpers, and general-purpose utilities like `Branded`, `LiteralUnion`, and `Nullable`. Types only — nothing ships to your bundle.

## Features

- 🧠 **Type-level only** — no runtime code, zero bundle impact.
- 🧱 **Object transformers** — deep/shallow partial & required, merge, prettify, writable, and more.
- 🔤 **String-character unions** — `Letter`, `Digit`, `Alphanumeric`, `Whitespace`, and casing variants.
- 🔢 **Numeric helpers** — `Numeric`, `Zero`, and the string-tolerant `NumberSafe`.
- 🏷️ **Nominal typing** — `Branded` for distinct IDs and units; `LiteralUnion` for autocomplete-preserving unions.

## Installation

```sh
# bun
bun add -D @motiro/types

# npm
npm install -D @motiro/types

# pnpm
pnpm add -D @motiro/types

# yarn
yarn add -D @motiro/types
```

## Usage

```ts
import type { Branded, Merge, PartialDeep, LiteralUnion } from '@motiro/types';

type UserId = Branded<string, 'UserId'>;
type PostId = Branded<string, 'PostId'>;
// UserId and PostId are not assignable to one another

type A = { id: number; name: string };
type B = { name: boolean };
type Merged = Merge<A, B>; // => { id: number; name: boolean }

type Config = { db: { host: string; port: number } };
type Draft = PartialDeep<Config>; // => { db?: { host?: string; port?: number } }

type Size = LiteralUnion<'sm' | 'md' | 'lg'>;
const a: Size = 'sm'; // suggested by autocomplete
const b: Size = 'xl'; // still allowed
```

## API

### Object

| Type | Description |
| --- | --- |
| `Dict<T = unknown>` | Plain string-keyed object with values of type `T`. |
| `Prettify<T>` | Flattens intersections/mapped types into a readable object (cosmetic). |
| `PrettifyDeep<T>` | Recursive `Prettify`, at every depth. |
| `PartialBy<T, K>` | Makes the selected keys `K` optional. |
| `PartialExcept<T, K>` | Makes everything optional except `K`. |
| `PartialDeep<T>` | Recursively optional at every depth. |
| `PartialNullable<T>` | Optional properties that also accept `null`. |
| `RequiredDeep<T>` | Recursively required at every depth. |
| `ValueOf<T>` | Union of all value types (the `keyof` counterpart). |
| `Writable<T>` | Removes `readonly` from all properties. |
| `Merge<T, U>` | Merges two objects; `U` wins on key overlap. |

### String

| Type | Description |
| --- | --- |
| `UppercaseLetter` | A single `'A'`–`'Z'`. |
| `LowercaseLetter` | A single `'a'`–`'z'`. |
| `Letter` | Any single ASCII letter. |
| `Digit` | A single `'0'`–`'9'`. |
| `Alphanumeric` | A letter or a digit. |
| `Whitespace` | `' '`, `'\t'`, `'\n'`, or `'\r'`. |

### Number

| Type | Description |
| --- | --- |
| `Numeric` | `number \| bigint`. |
| `Zero` | `0 \| 0n`. |
| `NumberSafe` | A number or a numeric-literal string (`` number | `${number}` ``). |

### Utility

| Type | Description |
| --- | --- |
| `Nullable<T>` | `T \| null \| undefined`. |
| `Maybe<T>` | Alias of `Nullable<T>`. |
| `Optional<T>` | Strips `null`, ensures `undefined` is allowed. |
| `Branded<T, B>` | Nominal ("branded") type distinct from its base `T`. |
| `LiteralUnion<Known, Base = string>` | Literal union that stays widenable while preserving autocomplete. |

## License

[MIT](https://github.com/meluiz/motiro/blob/main/LICENSE) © [meluiz](https://meluiz.com)
