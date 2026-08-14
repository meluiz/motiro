import { getTruncatedString } from './utils/helpers';

/**
 * Options controlling how {@link excerpt} shortens the input.
 */
export type ExcerptOptions = {
  /**
   * When `true`, the string is cut exactly at the limit (words may be split).
   * When `false`, trailing whitespace left by the cut is trimmed.
   *
   * @defaultValue `false`
   */
  strict?: boolean;

  /**
   * String appended to the result when truncation occurs.
   *
   * @defaultValue `'...'`
   */
  ellipsis?: string;

  /**
   * When `true`, `length` is measured in words instead of characters.
   *
   * @defaultValue `false`
   */
  words?: boolean;
};

const DEFAULT_OPTIONS = {
  words: false,
  strict: false,
  ellipsis: '...',
} as const;

/**
 * Creates a plain-text excerpt of a string, limited to a number of characters
 * (or words), appending an ellipsis when the string is actually shortened.
 *
 * Unlike {@link truncate}, HTML tags and comments are stripped before the cut,
 * so the result is always plain text.
 *
 * @param input - The string to excerpt.
 * @param length - The maximum length, in characters by default or in words when
 *   {@link ExcerptOptions.words} is `true`.
 * @param options - Excerpt options. See {@link ExcerptOptions}.
 * @returns The excerpt as plain text, with an ellipsis appended when a cut
 *   occurred. Empty input or `length <= 0` yields `''`.
 *
 * @example
 * ```ts
 * excerpt('Lorem ipsum dolor sit amet', 11);
 * // => 'Lorem ipsum...'
 *
 * excerpt('Short text', 20);
 * // => 'Short text'
 *
 * excerpt('Lorem ipsum dolor sit amet', 2, { words: true });
 * // => 'Lorem ipsum...'
 * ```
 *
 * @category String
 */
export const excerpt = (input: string, length: number, options?: ExcerptOptions): string => {
  const { strict, ellipsis, words } = { ...DEFAULT_OPTIONS, ...options };

  if (!input || length <= 0) {
    return '';
  }

  return getTruncatedString(input, length, {
    strict,
    ellipsis,
    tags: false,
    type: words ? 'words' : 'characters',
  });
};
