/**
 * Matches a size expression: a signed decimal amount followed by an optional
 * unit, with optional whitespace around and between them. Capture group 1 is
 * the amount, group 2 the unit.
 */
export const SIZE_EXPRESSION_REGEX = /^\s*(-?\d+(?:\.\d+)?)\s*([a-z]+)?\s*$/i;
