/**
 * Any numeric primitive: a `number` or a `bigint`.
 *
 * @example
 * ```ts
 * const a: Numeric = 42;
 * const b: Numeric = 42n;
 * ```
 */
export type Numeric = number | bigint;

/**
 * Zero as either a `number` or a `bigint` literal.
 *
 * @example
 * ```ts
 * const a: Zero = 0;
 * const b: Zero = 0n;
 * // const c: Zero = 1; // error
 * ```
 */
export type Zero = 0 | 0n;

/**
 * A number, or a string that TypeScript recognizes as a numeric literal.
 * Handy for values that may arrive as either (e.g. query params, form inputs).
 *
 * @remarks
 * The string side uses the `` `${number}` `` template, which is broader than it
 * looks: it accepts scientific notation (`'1e5'`), hex (`'0x1f'`), a trailing
 * dot (`'42.'`), and even leading whitespace (`'  42'`), while rejecting clearly
 * non-numeric strings (`'42abc'`, `'Infinity'`). Treat it as "plausibly numeric
 * string", not "strictly validated number" — validate at runtime if it matters.
 *
 * @example
 * ```ts
 * const a: NumberSafe = 42;
 * const b: NumberSafe = '42';
 * const c: NumberSafe = '3.14';
 * // const d: NumberSafe = '42abc'; // error
 * ```
 */
export type NumberSafe = number | `${number}`;
