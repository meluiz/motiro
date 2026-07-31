# Motiro

> Explore a versatile assortment of helper utility functions.

Motiro is a family of small, focused TypeScript utilities for everyday work — validating values, reshaping strings, and sharpening your types. Instead of one big dependency, each concern ships as its own package under the `@motiro` scope, so you install only what you need. Everything is ESM-only, side-effect free, fully tree-shakeable, and typed to the letter.

## Why Motiro

- 🎯 **Focused** — each package does one thing well; pick and choose.
- 🌳 **Tree-shakeable** — import a single helper and bundle only that.
- 🧠 **Type-first** — precise narrowing, inferred shapes, and zero-runtime type helpers.
- 📦 **Zero dependencies** — nothing but the utilities themselves.
- ⚡ **Modern** — ESM, TypeScript, and current tooling throughout.

## Quick start

Install the package you need:

```sh
# bun
bun add @motiro/string @motiro/guard
bun add -D @motiro/types

# npm
npm install @motiro/string @motiro/guard
npm install -D @motiro/types
```

Then import just the helpers you use:

```ts
import { slug, toCamelCase } from '@motiro/string';
import { isShape, isString, isNumber, optional } from '@motiro/guard';
import type { Branded, Merge } from '@motiro/types';

// @motiro/string — reshape text
slug('Olá, coração', { locale: 'pt' }); // => 'ola-coracao'
toCamelCase('hello world'); // => 'helloWorld'

// @motiro/guard — validate at runtime, narrow at compile time
const isUser = isShape({
  id: isNumber,
  name: isString,
  email: optional(isString),
});

if (isUser(payload)) {
  // payload is { id: number; name: string; email: string | undefined }
}

// @motiro/types — sharpen your types
type UserId = Branded<string, 'UserId'>;
type Merged = Merge<{ id: number; name: string }, { name: boolean }>;
// => { id: number; name: boolean }
```

## Packages

### [`@motiro/string`](./packages/string)

Fast, tree-shakeable string helpers. Seventeen case converters (camel, pascal, kebab, snake, constant, title, sentence, and more), HTML-aware `truncate` and plain-text `excerpt`, `{{ template }}` interpolation, URL `slug` with locale support, and human-readable duration parsing/formatting.

```ts
import { truncate, interpolate, fromMilliseconds } from '@motiro/string';

truncate('<p>Hello <em>friend</em></p>', 10); // => '<p>Hello <em>fr...</em></p>'
interpolate('hi {{ user.name }}', { user: { name: 'John' } }); // => 'hi John'
fromMilliseconds(3600000, true); // => '1 hour'
```

### [`@motiro/guard`](./packages/guard)

Composable type guards and runtime validation. Small, well-typed predicates for primitives, numbers, objects, and built-ins — plus combinators (`isOneOf`, `isArrayOf`, `isShape`, `not`, `optional`, `nullable`) for building larger validators from smaller ones.

```ts
import { isArrayOf, isString, isDefined } from '@motiro/guard';

isArrayOf(isString)(['a', 'b']); // => true
[1, null, 2].filter(isDefined); // => number[]
```

### [`@motiro/types`](./packages/types)

Shared TypeScript utility types with zero runtime footprint. Object transformers (`Merge`, `PartialDeep`, `Prettify`, `Writable`), string-character unions (`Letter`, `Digit`, `Alphanumeric`), numeric helpers (`Numeric`, `NumberSafe`), and nominal-typing tools (`Branded`, `LiteralUnion`).

```ts
import type { PartialDeep, LiteralUnion } from '@motiro/types';

type Draft = PartialDeep<{ db: { host: string; port: number } }>;
// => { db?: { host?: string; port?: number } }

type Size = LiteralUnion<'sm' | 'md' | 'lg'>; // autocompletes, still accepts any string
```

Each package has its own README with the full API reference — follow the links above.

## Requirements

- An ESM-capable environment (Node.js, Bun, Deno, or a modern bundler).
- TypeScript 5+ recommended for the best typing experience.

## License

[MIT](./LICENSE) © [meluiz](https://meluiz.com)
