import { getTruncatedString } from './utils/helpers';

export type TruncateOptions = {
  /**
   * When `true`, the string is cut exactly at the character limit. When
   * `false`, trailing whitespace left by the cut is trimmed.
   *
   * @defaultValue `true`
   */
  strict?: boolean;

  /**
   * String appended to the result when truncation occurs.
   *
   * @defaultValue `'...'`
   */
  ellipsis?: string;
};

const DEFAULT_OPTIONS = {
  strict: true,
  ellipsis: '...',
} as const;

/**
 * Truncates a string to a maximum number of characters, preserving HTML tags
 * and appending an ellipsis when the string is actually shortened.
 *
 * Only visible text counts toward the limit — characters inside HTML tags are
 * never counted, and any tags left open by the cut are re-closed in order.
 *
 * @param input - The string to truncate.
 * @param length - The maximum number of visible characters to keep.
 * @param options - Truncation options. See {@link TruncateOptions}.
 * @returns The truncated string, with HTML tags preserved and an ellipsis
 *   appended when a cut occurred. Empty input or `length <= 0` yields `''`.
 *
 * @example
 * ```ts
 * truncate('Hello World', 5);
 * // => 'Hello...'
 *
 * truncate('<p>Hello <em>friend</em></p>', 10);
 * // => '<p>Hello <em>frie...</em></p>'
 * ```
 */
export const truncate = (input: string, length: number, options?: TruncateOptions): string => {
  const { strict, ellipsis } = { ...DEFAULT_OPTIONS, ...options };

  return getTruncatedString(input, length, {
    strict,
    ellipsis,
    tags: true,
    type: 'characters',
  });
};
