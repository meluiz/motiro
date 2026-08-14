const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';

/**
 * Generates a random string of the given length.
 *
 * By default, characters are drawn from a 64-character set: lowercase letters
 * (`a-z`), uppercase letters (`A-Z`), digits (`0-9`), underscore (`_`) and
 * hyphen (`-`). A custom `alphabet` may be provided.
 *
 * @remarks
 * NOT cryptographically secure — uses `Math.random()`. Do not use for
 * passwords, tokens, session IDs, or any security-sensitive value. It is meant
 * for non-sensitive uses such as temporary names, cache keys, or test fixtures.
 *
 * @param length - The number of characters to generate. Non-positive values
 *   return an empty string.
 * @param alphabet - The character set to draw from. Defaults to the
 *   64-character URL-safe set. Must not be empty.
 * @returns A random string of the requested length.
 *
 * @example
 * ```ts
 * random(8);
 * // => e.g. 'aG4_Kl9P'
 *
 * random(6, '0123456789');
 * // => e.g. '408315'
 *
 * random(0);
 * // => ''
 * ```
 */
export const random = (length: number, alphabet: string = CHARACTERS): string => {
  if (length <= 0) {
    return '';
  }

  if (!alphabet) {
    throw new TypeError('Alphabet must not be empty');
  }

  const size = alphabet.length;
  let result = '';

  for (let index = 0; index < length; index++) {
    result += alphabet.charAt(Math.floor(Math.random() * size));
  }

  return result;
};
