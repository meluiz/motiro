import { shouldCapitalize } from './utils/guards';
import {
  getCapitalizedToken,
  getCapitalizedWord,
  getFirstLetterIndex,
  getNoCaseString,
} from './utils/helpers';
import { getNormalizedWords } from './utils/helpers/normalization';
import { MAGIC_SPLIT_REGEX, TOKENS_REGEX } from './utils/regexes/split';

export type CaseOptions = {
  /**
   * List of characters or substrings to preserve exactly as-is during the case conversion.
   * By default, any character not matching the target case pattern may be transformed or removed.
   */
  keep?: string[] | undefined;

  /**
   * When `true`, strips out all characters not explicitly listed in `keep` or matched by the target case rules.
   * Defaults to `true`, enforcing strict removal of non-listed characters.
   */
  strict?: boolean | undefined;
};

/**
 * Capitalizes a normalized word while preserving any leading separator
 * (e.g. the `-` or `_` injected by `getNormalizedWords` via `prefix`),
 * which {@link getCapitalizedWord} would otherwise drop.
 */
const capitalizePreservingPrefix = (word: string): string => {
  // `getFirstLetterIndex` handles the global `MAGIC_SPLIT_REGEX` safely (via
  // `matchAll`), so there's no need to compile a throwaway regex per call.
  const letterIndex = getFirstLetterIndex(word, MAGIC_SPLIT_REGEX);

  const separator = word.slice(0, letterIndex);
  const firstChar = word.charAt(letterIndex).toUpperCase();
  const body = word.slice(letterIndex + 1).toLowerCase();

  return `${separator}${firstChar}${body}`;
};

/**
 * Converts a string to camelCase, joining words and capitalizing all except the first.
 *
 * @param input - The string to convert to camelCase.
 * @param options - Optional settings: `keep` for characters to preserve, `strict` for enforcing exact casing.
 * @returns The camelCase version of the input string.
 *
 * @example
 * ```ts
 * toCamelCase('hello world')
 * // => 'helloWorld'
 * ```
 */
export const toCamelCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, options);

  return words.reduce((previous, current, index) => {
    if (!current) {
      return previous;
    }

    const isFirstWord = index === 0;
    const isAllLowercase = !current.charAt(0).match(MAGIC_SPLIT_REGEX);

    const shouldLowercase = isFirstWord || isAllLowercase;

    const normal = shouldLowercase ? current.toLowerCase() : getCapitalizedWord(current);

    return `${previous}${normal}`;
  }, '');
};

/**
 * Converts a string to PascalCase, capitalizing the first letter of each word.
 *
 * @param input - The string to convert to PascalCase.
 * @param options - Optional settings for word handling.
 * @returns The PascalCase version of the input string.
 *
 * @example
 * ```ts
 * toPascalCase('hello world')
 * // => 'HelloWorld'
 * ```
 */
export const toPascalCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, options);

  return words.map((word) => getCapitalizedWord(word)).join('');
};

/**
 * Converts a string to kebab-case, joining words with hyphens.
 *
 * @param input - The string to convert to kebab-case.
 * @param options - Optional settings for word handling.
 * @returns The kebab-case version of the input string.
 *
 * @example
 * ```ts
 * toKebabCase('hello world')
 * // => 'hello-world'
 * ```
 */
export const toKebabCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '-' });
  return words.join('').toLowerCase();
};

/**
 * Converts a string to snake_case, joining words with underscores.
 *
 * @param input - The string to convert to snake_case.
 * @param options - Optional settings for word handling.
 * @returns The snake_case version of the input string.
 *
 * @example
 * ```ts
 * toSnakeCase('hello world')
 * // => 'hello_world'
 * ```
 */
export const toSnakeCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '_' });

  return words.join('').toLowerCase();
};

/**
 * Converts a string to space case, joining words with spaces.
 *
 * @param input - The string to convert to space case.
 * @param options - Optional settings for word handling.
 * @returns The space-separated version of the input string.
 *
 * @example
 * ```ts
 * toSpaceCase('hello-world')
 * // => 'hello world'
 * ```
 */
export const toSpaceCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: ' ' });

  return words.join('');
};

/**
 * Converts a string to dot.notation.case, joining words with dots.
 *
 * @param input - The string to convert to dot notation.
 * @param options - Optional settings for word handling.
 * @returns The dot.notation version of the input string.
 *
 * @example
 * ```ts
 * toDotNotationCase('hello world')
 * // => 'hello.world'
 * ```
 */
export const toDotNotationCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '.' });

  return words.join('');
};

/**
 * Converts a string to CONSTANT_CASE, joining words with underscores and uppercasing all letters.
 *
 * @param input - The string to convert to CONSTANT_CASE.
 * @param options - Optional settings for word handling.
 * @returns The CONSTANT_CASE version of the input string.
 *
 * @example
 * ```ts
 * toConstantCase('hello world')
 * // => 'HELLO_WORLD'
 * ```
 */
export const toConstantCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '_' });

  return words.join('').toUpperCase();
};

/**
 * Converts a string to Train-Case, capitalizing each word and joining with hyphens.
 *
 * @param input - The string to convert to Train-Case.
 * @param options - Optional settings for word handling.
 * @returns The Train-Case version of the input string.
 *
 * @example
 * ```ts
 * toTrainCase('hello world')
 * // => 'Hello-World'
 * ```
 */
export const toTrainCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '-' });

  return words.map((word) => capitalizePreservingPrefix(word)).join('');
};

/**
 * Converts a string to Ada_Case, capitalizing each word and joining with underscores.
 *
 * @param input - The string to convert to Ada_Case.
 * @param options - Optional settings for word handling.
 * @returns The Ada_Case version of the input string.
 *
 * @example
 * ```ts
 * toAdaCase('hello world')
 * // => 'Hello_World'
 * ```
 */
export const toAdaCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '_' });

  return words.map((word) => capitalizePreservingPrefix(word)).join('');
};

/**
 * Converts a string to COBOL-CASE, joining words with hyphens and uppercasing all letters.
 *
 * @param input - The string to convert to COBOL-CASE.
 * @param options - Optional settings for word handling.
 * @returns The COBOL-CASE version of the input string.
 *
 * @example
 * ```ts
 * toCobolCase('hello world')
 * // => 'HELLO-WORLD'
 * ```
 */
export const toCobolCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: '-' });

  return words.join('').toUpperCase();
};

/**
 * Converts a file path or string to path/case, ensuring segments are separated by '/'.
 *
 * @param input - The path or string to convert.
 * @param options - Optional settings for word handling.
 * @returns The path/case version of the input string.
 *
 * @example
 * ```ts
 * toPathCase('folder name file name')
 * // => 'folder/name/file/name'
 * ```
 */
export const toPathCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, options);

  return words.reduce((previous, current, index) => {
    const prefix = index === 0 || current.charAt(0) === '/' ? '' : '/';
    return `${previous}${prefix}${current}`;
  }, '');
};

/**
 * Converts a string to Capital Case, capitalizing each word and joining with spaces.
 *
 * @param input - The string to convert to Capital Case.
 * @param options - Optional settings for word handling.
 * @returns The Capital Case version of the input string.
 *
 * @example
 * ```ts
 * toCapitalCase('hello world')
 * // => 'Hello World'
 * ```
 */
export const toCapitalCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: ' ' });

  return words.map((word) => capitalizePreservingPrefix(word)).join('');
};

/**
 * Converts a string to lowercase, joining words with spaces.
 *
 * @param input - The string to convert.
 * @param options - Optional settings for word handling.
 * @returns The lowercase, space-joined version of the input string.
 *
 * @example
 * ```ts
 * toLowerCase('HelloWorld')
 * // => 'hello world'
 * ```
 */
export const toLowerCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: ' ' });
  return words.join('').toLowerCase();
};

/**
 * Converts a string to UPPERCASE, joining words with spaces.
 *
 * @param input - The string to convert.
 * @param options - Optional settings for word handling.
 * @returns The UPPERCASE, space-joined version of the input string.
 *
 * @example
 * ```ts
 * toUpperCase('Hello World')
 * // => 'HELLO WORLD'
 * ```
 */
export const toUpperCase = (input: string, options?: CaseOptions): string => {
  const words = getNormalizedWords(input, { ...options, prefix: ' ' });
  return words.join('').toUpperCase();
};

/**
 * Converts a string to Title Case, capitalizing main words according to English title capitalization rules.
 *
 * @param input - The string to convert to Title Case.
 * @returns The Title Case version of the input string.
 *
 * @example
 * ```ts
 * toTitleCase('an example of title case')
 * // => 'An Example of Title Case'
 * ```
 */
export const toTitleCase = (input: string): string => {
  let output = '';

  // TOKENS_REGEX is global; reset lastIndex so repeated calls are deterministic.
  TOKENS_REGEX.lastIndex = 0;

  let result = TOKENS_REGEX.exec(input);

  while (result !== null) {
    const token = result[0];
    const index = result.index;

    output += shouldCapitalize(token, index, input) ? getCapitalizedToken(token) : token;

    result = TOKENS_REGEX.exec(input);
  }

  return output;
};

/**
 * Converts a string to Sentence case, capitalizing the first character and lowercasing the rest.
 *
 * @param input - The string to convert to Sentence case.
 * @returns The Sentence case version of the input string.
 *
 * @example
 * ```ts
 * toSentenceCase('HELLO WORLD. this is a test.')
 * // => 'Hello world this is a test'
 * ```
 */
export const toSentenceCase = (input: string): string => {
  return getNoCaseString(input, (part, index) => {
    const lowerCased = part.toLowerCase();

    if (index === 0) {
      const firstChar = lowerCased.charAt(0).toUpperCase();
      const rest = lowerCased.slice(1);

      return `${firstChar}${rest}`;
    }

    return lowerCased;
  });
};

/**
 * Converts a string to no case, normalizing delimiters to single spaces.
 *
 * @param input - The string to convert.
 * @returns The no-case (space-separated) version of the input string.
 *
 * @example
 * ```ts
 * toNoCase('Hello-World_Test')
 * // => 'hello world test'
 * ```
 */
export const toNoCase = (input: string): string => {
  return getNoCaseString(input);
};
