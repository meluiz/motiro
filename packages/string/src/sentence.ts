/**
 * Options controlling the separators used by {@link sentence}.
 */
export type SentenceOptions = {
  /**
   * Separator used between items when there are more than two.
   *
   * @defaultValue `', '`
   */
  separator?: string;

  /**
   * Separator used between the two items of a pair.
   *
   * @defaultValue `' and '`
   */
  pairSeparator?: string;

  /**
   * Separator used before the last item when there are more than two.
   *
   * @defaultValue `', and '`
   */
  lastSeparator?: string;
};

const DEFAULT_OPTIONS = {
  separator: ', ',
  pairSeparator: ' and ',
  lastSeparator: ', and ',
} as const;

/**
 * Formats an array of values into a human-readable sentence.
 *
 * Joins the items with {@link SentenceOptions.separator}, using
 * {@link SentenceOptions.pairSeparator} for exactly two items and
 * {@link SentenceOptions.lastSeparator} before the final item when there are
 * more than two (Oxford-comma style by default).
 *
 * @param input - The values to join. Each item is coerced to a string.
 * @param options - Separator options. See {@link SentenceOptions}.
 * @returns The formatted sentence, or an empty string for an empty array.
 *
 * @example
 * ```ts
 * sentence(['apple', 'banana', 'cherry']);
 * // => 'apple, banana, and cherry'
 *
 * sentence(['apple', 'banana'], { pairSeparator: ' & ' });
 * // => 'apple & banana'
 *
 * sentence([]);
 * // => ''
 * ```
 */
export const sentence = (
  input: ReadonlyArray<string | number>,
  options?: SentenceOptions,
): string => {
  const { separator, lastSeparator, pairSeparator } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (input.length <= 2) {
    if (input.length === 0) {
      return '';
    }

    if (input.length === 1) {
      return String(input[0]);
    }

    return `${input[0]}${pairSeparator}${input[1]}`;
  }

  const allButLast = input.slice(0, -1).join(separator);
  const last = input[input.length - 1];

  return `${allButLast}${lastSeparator}${last}`;
};
