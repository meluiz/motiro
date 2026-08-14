import {
  ALPHANUMERIC_PATTERN_REGEX,
  MAGIC_SPLIT_REGEX,
  NO_CASE_SPLIT_REGEXP,
  NO_CASE_STRIP_REGEXP,
} from '../regexes';
import { getFirstLetterIndex } from './words';

type NoCaseStringTransform = (part: string, index: number, parts: string[]) => string;

const DELIMITER = '\0';

const trimDelimiters = (input: string): string => {
  let start = 0;
  let end = input.length;

  while (input.charAt(start) === DELIMITER) start++;
  while (input.charAt(end - 1) === DELIMITER) end--;

  return input.slice(start, end);
};

/**
 * Converts a camel/Pascal/other-case `input` into a space-separated string.
 */
export const getNoCaseString = (
  input: string,
  transform: NoCaseStringTransform = (input) => input.toLowerCase(),
): string => {
  let delimited = input;

  for (const regex of NO_CASE_SPLIT_REGEXP) {
    delimited = delimited.replace(regex, `$1${DELIMITER}$2`);
  }

  delimited = delimited.replace(NO_CASE_STRIP_REGEXP, DELIMITER);
  const trimmed = trimDelimiters(delimited);

  return trimmed.split(DELIMITER).map(transform).join(' ');
};

/**
 * Capitalizes the first real letter of a word and lowercases the rest.
 */
export const getCapitalizedWord = (input: string, regex = MAGIC_SPLIT_REGEX): string => {
  const firstLetterIndex = getFirstLetterIndex(input, regex);

  const firstChar = input.charAt(firstLetterIndex).toUpperCase();
  const restOfWord = input.slice(firstLetterIndex + 1).toLowerCase();

  return `${firstChar}${restOfWord}`;
};

/**
 * Uppercases the first alphanumeric character in the string.
 */
export const getCapitalizedToken = (input: string): string => {
  return input.replace(ALPHANUMERIC_PATTERN_REGEX, (char) => char.toUpperCase());
};
