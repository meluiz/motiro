/**
 * Capitalizes the first character of a string, leaving the rest unchanged.
 *
 * Only the first character is affected — the remainder of the string is
 * returned as-is (no lowercasing). An empty string returns an empty string.
 *
 * @typeParam T - The literal string type, preserved in the return type.
 * @param input - The string to capitalize.
 * @returns The input with its first character uppercased, typed as `Capitalize<T>`.
 *
 * @example
 *    capitalize("hello")   // => "Hello"
 *    capitalize("john")    // => "John"
 *    capitalize("")        // => ""
 *    capitalize("çeu")     // => "Çeu"
 */
export const capitalize = <T extends string>(input: T): Capitalize<T> => {
  if (!input) {
    return '' as Capitalize<T>;
  }

  return `${input.charAt(0).toUpperCase() ?? ''}${input.slice(1)}` as Capitalize<T>;
};
