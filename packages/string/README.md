# @motiro/string

> Fast, tree-shakeable string helpers — case conversion, trimming, padding, slugify, templating and more. Part of the Motiro utility toolkit.

[![npm version](https://img.shields.io/npm/v/@motiro/string.svg)](https://www.npmjs.com/package/@motiro/string)
[![license](https://img.shields.io/npm/l/@motiro/string.svg)](https://github.com/meluiz/motiro/blob/main/LICENSE)

A focused set of string utilities: seventeen case converters, HTML-aware truncation, plain-text excerpts, `{{ template }}` interpolation, URL slugify with locale support, human-readable duration formatting, and more. Everything is ESM-only, side-effect free, and fully tree-shakeable.

## Features

- 🔤 **Rich case conversion** — camel, pascal, kebab, snake, constant, title, sentence, train, cobol, ada, path, dot-notation, and more.
- ✂️ **Smart truncation** — `truncate` preserves and re-closes HTML tags; `excerpt` strips them for plain text.
- 🧬 **Templating** — `interpolate` resolves `{{ nested.keys }}` with escaping and custom delimiters.
- 🔗 **Slugify** — transliterates non-ASCII to URL-safe slugs, with per-locale overrides and an extendable charset.
- ⏱️ **Durations** — parse and format between milliseconds/seconds and human strings (`'1h'`, `'1 hour'`).
- 🌳 **Tree-shakeable** — import only what you use; zero dependencies.

## Installation

```sh
# bun
bun add @motiro/string

# npm
npm install @motiro/string

# pnpm
pnpm add @motiro/string

# yarn
yarn add @motiro/string
```

## Usage

```ts
import { toCamelCase, slug, truncate, interpolate, fromMilliseconds } from '@motiro/string';

toCamelCase('hello world'); // => 'helloWorld'

slug('Olá, coração', { locale: 'pt' }); // => 'ola-coracao'

truncate('<p>Hello <em>friend</em></p>', 10);
// => '<p>Hello <em>fr...</em></p>'

interpolate('hello {{ user.name }}', { user: { name: 'John' } });
// => 'hello John'

fromMilliseconds(3600000, true); // => '1 hour'
```

## API

### Capitalization

| Function | Description |
| --- | --- |
| `capitalize(input)` | Uppercases the first character, leaving the rest unchanged. Preserves the literal type as `Capitalize<T>`. |

### Case conversion

All converters accept an optional `CaseOptions` (`{ keep?: string[]; strict?: boolean }`) unless noted.

| Function | Example (`'hello world'`) |
| --- | --- |
| `toCamelCase` | `helloWorld` |
| `toPascalCase` | `HelloWorld` |
| `toKebabCase` | `hello-world` |
| `toSnakeCase` | `hello_world` |
| `toSpaceCase` | `hello world` |
| `toDotNotationCase` | `hello.world` |
| `toConstantCase` | `HELLO_WORLD` |
| `toTrainCase` | `Hello-World` |
| `toAdaCase` | `Hello_World` |
| `toCobolCase` | `HELLO-WORLD` |
| `toPathCase` | `hello/world` |
| `toCapitalCase` | `Hello World` |
| `toLowerCase` | `hello world` |
| `toUpperCase` | `HELLO WORLD` |
| `toTitleCase` | `Hello World` (English title rules; no options) |
| `toSentenceCase` | `Hello world` (no options) |
| `toNoCase` | `hello world` (no options) |

### Truncation & excerpts

| Function | Description |
| --- | --- |
| `truncate(input, length, options?)` | Truncates to `length` **visible** characters, preserving HTML tags and re-closing any left open. |
| `excerpt(input, length, options?)` | Strips HTML first, then cuts by characters (or words with `{ words: true }`). |

`TruncateOptions`: `{ strict?: boolean; ellipsis?: string }` — defaults `strict: true`, `ellipsis: '...'`.
`ExcerptOptions`: `{ strict?: boolean; ellipsis?: string; words?: boolean }` — defaults `strict: false`, `ellipsis: '...'`, `words: false`.

### Templating

| Function | Description |
| --- | --- |
| `interpolate(input, data, options?)` | Replaces `{{ key }}` placeholders with values from `data`. Supports nested dot paths (`{{ user.name }}`, `{{ items.0 }}`), `\{{ escaped }}` placeholders, and custom delimiters. |

`InterpolateOptions`: `{ fallback?: (key: string) => string; delimiters?: [open, close] }` — defaults to an empty-string fallback and `['{{', '}}']`.

### Slugify

| Member | Description |
| --- | --- |
| `slug(input, options?)` | Converts a string to a URL-friendly slug, transliterating non-ASCII characters. |
| `slug.create(options?)` | Returns a new slug function pre-configured with default options. |
| `slug.extend(charset)` | Extends the shared transliteration charset with custom entries. |

`SlugOptions`: `{ trim?: boolean; lower?: boolean; strict?: boolean; remove?: RegExp; locale?: Locale; separator?: string }`.
Supported locales: `bg`, `es`, `fr`, `it`, `de`, `nl`, `pt`, `sv`, `uk`, `vi`, `da`, `nb`.

```ts
slug('Hello, World!'); // => 'hello-world!'
slug('Hello, World!', { strict: true }); // => 'hello-world'

const upperSlug = slug.create({ lower: false, separator: '_' });
upperSlug('Hello World'); // => 'Hello_World'
```

### Durations

| Function | Description |
| --- | --- |
| `fromMilliseconds(input, long?)` | Formats milliseconds as `'1h'` (or `'1 hour'` when `long` is `true`). |
| `fromSeconds(input, long?)` | Formats seconds as a human-readable duration. |
| `toMilliseconds(input)` | Parses a duration (number or string like `'1h'` / `'2 hours'`) into milliseconds. Throws `TypeError` on invalid strings. |
| `toSeconds(input)` | Parses a duration into whole seconds (floored). Throws `TypeError` on invalid strings. |

### Miscellaneous

| Function | Description |
| --- | --- |
| `random(length, alphabet?)` | Generates a random string. **Not cryptographically secure** — uses `Math.random()`; use for non-sensitive values only. |
| `sentence(input, options?)` | Joins an array into a human-readable, Oxford-comma sentence (`'a, b, and c'`). |

`SentenceOptions`: `{ separator?: string; pairSeparator?: string; lastSeparator?: string }`.

### Exported types

```ts
import type {
  CaseOptions,
  DurationUnit,
  DurationUnitAnyCase,
  PrettyDuration,
  ExcerptOptions,
  InterpolateOptions,
  SentenceOptions,
  Slug,
  SlugBuilder,
  SlugOptions,
  TruncateOptions,
} from '@motiro/string';
```

## License

[MIT](https://github.com/meluiz/motiro/blob/main/LICENSE) © [meluiz](https://meluiz.com)
