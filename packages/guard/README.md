# @motiro/guard

> Composable TypeScript type guards and runtime validation for the Motiro toolkit — small, well-typed predicates you can compose.

[![npm version](https://img.shields.io/npm/v/@motiro/guard.svg)](https://www.npmjs.com/package/@motiro/guard)
[![license](https://img.shields.io/npm/l/@motiro/guard.svg)](https://github.com/meluiz/motiro/blob/main/LICENSE)

A collection of small, focused type guards that narrow `unknown` values at runtime while giving you precise TypeScript types. Every guard is fully tree-shakeable, has zero dependencies, and pairs with a set of combinators (`isOneOf`, `isArrayOf`, `isShape`, `optional`, …) for building larger validators out of small pieces.

## Features

- 🎯 **Precise narrowing** — every guard is a `value is T` predicate, so TypeScript narrows correctly.
- 🧩 **Composable** — combine primitives with `isOneOf`, `isArrayOf`, `isShape`, `not`, `optional`, and `nullable`.
- 🌳 **Tree-shakeable** — import only what you use; ESM-only, side-effect free.
- 📦 **Zero dependencies** — nothing but the guards themselves.
- 🔒 **Type-safe by default** — inputs are `unknown`; you decide what passes.

## Installation

```sh
# bun
bun add @motiro/guard

# npm
npm install @motiro/guard

# pnpm
pnpm add @motiro/guard

# yarn
yarn add @motiro/guard
```

## Usage

```ts
import { isString, isNumber, isDefined, isShape, isArrayOf, optional } from '@motiro/guard';

isString('hello'); // => true
isNumber(NaN); // => false, NaN is rejected by design

// Filter out null/undefined, keeping the narrowed type
[1, null, 2, undefined].filter(isDefined); // => number[]

// Validate the shape of an object
const isUser = isShape({
  id: isNumber,
  name: isString,
  email: optional(isString),
});

if (isUser(payload)) {
  // payload is { id: number; name: string; email: string | undefined }
}

// Validate arrays element by element
const isStringArray = isArrayOf(isString);
isStringArray(['a', 'b']); // => true
```

## API

### Primitives

| Guard | Narrows to | Notes |
| --- | --- | --- |
| `isString(value)` | `string` | |
| `isNumber(value)` | `number` | Rejects `NaN`; `Infinity` passes. |
| `isBoolean(value)` | `boolean` | Strictly `true` / `false`. |
| `isBigInt(value)` | `bigint` | |
| `isSymbol(value)` | `symbol` | |
| `isNull(value)` | `null` | |
| `isUndefined(value)` | `undefined` | |
| `isNil(value)` | `null \| undefined` | Matches both. |
| `isDefined(value)` | `NonNullable<T>` | Ideal as an array filter. |

### Numeric

| Guard | Narrows to | Notes |
| --- | --- | --- |
| `isInteger(value)` | `number` | No fractional part. |
| `isSafeInteger(value)` | `number` | Within `[-(2^53 - 1), 2^53 - 1]`. |
| `isNumberFinite(value)` | `number` | Excludes `Infinity` and `NaN`; no coercion. |
| `isPositive(value)` | `number` | `> 0`. |
| `isNegative(value)` | `number` | `< 0`. |
| `isZero(value)` | `0` | Matches `-0` too. |

### Objects & built-ins

| Guard | Narrows to | Notes |
| --- | --- | --- |
| `isObjectLike(value)` | `Record<PropertyKey, unknown>` | Any non-null object (arrays included). |
| `isObject(value)` | `Record<PropertyKey, unknown>` | Non-null object, excludes arrays. |
| `isPlainObject(value)` | `Record<PropertyKey, unknown>` | Object literals & `Object.create(null)` only. |
| `isArray(value)` | `unknown[]` | |
| `isFunction(value)` | `(...args) => unknown` | |
| `isDate(value)` | `Date` | Validity not checked. |
| `isRegExp(value)` | `RegExp` | |
| `isError(value)` | `Error` | Subclasses included. |
| `isPromise(value)` | `Promise<T>` | Native promises only. |
| `isThenable(value)` | `PromiseLike<T>` | Any object with a callable `then`. |
| `isMap(value)` | `Map<K, V>` | |
| `isSet(value)` | `Set<T>` | |
| `isWeakMap(value)` | `WeakMap<K, V>` | |
| `isWeakSet(value)` | `WeakSet<T>` | |

### Emptiness

| Guard | Narrows to | Notes |
| --- | --- | --- |
| `isEmptyString(value)` | `''` | |
| `isEmptyArray(value)` | `[]` | |
| `isEmptyObject(value)` | `Record<PropertyKey, never>` | Counts own string & symbol keys. |

### Combinators

| Combinator | Returns | Description |
| --- | --- | --- |
| `isOneOf(...guards)` | `Guard<union>` | Passes if any guard passes (union narrowing). |
| `isArrayOf(guard)` | `Guard<T[]>` | Array whose every element satisfies `guard`. Empty array passes. |
| `isNonEmptyArray(guard?)` | `Guard<[T, ...T[]]>` | Non-empty array, optionally validating each element. |
| `isShape(shape)` | `Guard<InferShape<S>>` | Validates an object against a map of guards. Extra keys ignored. |
| `isLiteral(...values)` | `Guard<T[number]>` | Strict equality against literal values. |
| `isInstanceOf(ctor)` | `Guard<T>` | `value instanceof ctor`. |
| `not(guard)` | `Guard<unknown>` | Passes when the input guard fails. |
| `optional(guard)` | `Guard<T \| undefined>` | Also accepts `undefined`. |
| `nullable(guard)` | `Guard<T \| null>` | Also accepts `null`. |

### Exported types

```ts
import type { Guard, GuardType, GuardShape, InferShape } from '@motiro/guard';
```

- `Guard<T>` — `(value: unknown) => value is T`.
- `GuardType<G>` — extracts `T` from a `Guard<T>`.
- `GuardShape` — `Record<PropertyKey, Guard<unknown>>`.
- `InferShape<S>` — the object type inferred from a `GuardShape`.

## License

[MIT](https://github.com/meluiz/motiro/blob/main/LICENSE) © [meluiz](https://meluiz.com)
