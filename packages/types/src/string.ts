/**
 * A single uppercase ASCII letter, `'A'` through `'Z'`.
 *
 * @example
 * ```ts
 * const initial: UppercaseLetter = 'A';
 * ```
 */
export type UppercaseLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

/**
 * A single lowercase ASCII letter, `'a'` through `'z'`.
 *
 * @example
 * ```ts
 * const c: LowercaseLetter = 'z';
 * ```
 */
export type LowercaseLetter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

/**
 * A single ASCII letter, uppercase or lowercase.
 *
 * @example
 * ```ts
 * const c: Letter = 'K';
 * ```
 */
export type Letter = UppercaseLetter | LowercaseLetter;

/**
 * A single decimal digit character, `'0'` through `'9'`.
 *
 * @example
 * ```ts
 * const c: Digit = '7';
 * ```
 */
export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
 * A single alphanumeric ASCII character: a letter (either case) or a digit.
 *
 * @example
 * ```ts
 * const c: Alphanumeric = '9';
 * ```
 */
export type Alphanumeric = Letter | Digit;

/**
 * A single common whitespace character: space, tab, newline, or carriage return.
 *
 * @example
 * ```ts
 * const c: Whitespace = ' ';
 * ```
 */
export type Whitespace = ' ' | '\t' | '\n' | '\r';
