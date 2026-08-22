/**
 * Matches sequences of non-whitespace characters for simple splitting.
 */
export const SPACE_SPLIT_REGEX = /\S+/g;

/**
 * Comprehensive pattern to split text into words, numbers, and uppercase sequences,
 * including support for accented Latin and Cyrillic characters.
 *
 * Boundary rules match the change-case convention:
 * - lowercase→uppercase and acronym→word split (getHTTP → get, HTTP)
 * - digit→uppercase splits (user2FA → user2, FA); letter→digit does not (test123abc stays whole)
 * - ß, à-ÿ and Cyrillic are treated by case correctly
 */
export const MAGIC_SPLIT_REGEX =
  /[A-ZÀ-ÖØ-ÞА-Я]?[a-zß-öø-ÿа-я]+(?:[0-9]+[a-zß-öø-ÿа-я]+)*[0-9]*|[A-ZÀ-ÖØ-ÞА-Я]+(?![a-zß-öø-ÿа-я])[0-9]*|[0-9]+[a-zß-öø-ÿа-я]+(?:[0-9]+[a-zß-öø-ÿа-я]+)*[0-9]*|[0-9]+|[A-ZÀ-ÖØ-ÞА-Я][a-zß-öø-ÿа-я]*[0-9]*/g;

/**
 * Matches tokens (words or punctuation) including colons and dashes.
 */
export const TOKENS_REGEX = /[^\s:–—-]+|./g;

/**
 * Matches any whitespace character.
 */
export const WHITESPACE_REGEX = /\s/;
