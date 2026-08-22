export type CapitalizeOptions = {
  /**
   * When `true`, keeps the rest of the string exactly as-is instead of
   * lowercasing it. Only the first character is uppercased either way.
   * Defaults to `false`.
   */
  preserveCase?: boolean | undefined;
};

/**
 * Capitalizes the first character of a string.
 *
 * The first character is always uppercased. By default the remainder is
 * lowercased; pass `preserveCase: true` to leave it unchanged. An empty
 * string returns an empty string.
 *
 * @typeParam T - The literal string type, preserved in the return type.
 * @param input - The string to capitalize.
 * @param options - Optional settings.
 * @param options.preserveCase - When `true`, keeps the rest of the string
 *   as-is instead of lowercasing it. Defaults to `false`.
 * @returns The input with its first character uppercased, typed as `Capitalize<T>`.
 *
 * @example
 *    capitalize("hello")                          // => "Hello"
 *    capitalize("HELLO")                          // => "Hello"
 *    capitalize("hELLO", { preserveCase: true })  // => "HELLO"
 *    capitalize("")                               // => ""
 *    capitalize("çeu")                            // => "Çeu"
 */
export const capitalize = <T extends string>(
  input: T,
  options?: CapitalizeOptions,
): Capitalize<T> => {
  const { preserveCase = false } = options ?? {};

  if (!input) {
    return '' as Capitalize<T>;
  }

  const firstChar = input.charAt(0).toUpperCase();
  const remainder = input.slice(1);

  return `${firstChar}${preserveCase ? remainder : remainder.toLowerCase()}` as Capitalize<T>;
};
