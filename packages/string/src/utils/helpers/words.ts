import { hasEmptySpace } from '../guards';
import { MAGIC_SPLIT_REGEX, SPACE_SPLIT_REGEX } from '../regexes';

/**
 * Finds the index of the first match while preserving a shared regex state.
 */
export const getFirstLetterIndex = (input: string, regex: RegExp): number => {
  const lastIndex = regex.lastIndex;
  regex.lastIndex = 0;
  const index = regex.exec(input)?.index ?? 0;
  regex.lastIndex = lastIndex;
  return index;
};

/**
 * Chooses the appropriate regex for splitting an input into words.
 */
export const getWordSplitRegex = (input: string): RegExp => {
  return hasEmptySpace(input) ? SPACE_SPLIT_REGEX : MAGIC_SPLIT_REGEX;
};

type WordsAndPrefixes = {
  parts: string[];
  prefixes: string[];
};

/**
 * Splits an input into words and the separators that precede them.
 */
export const getWordsAndPrefixes = (input: string, regex: RegExp): WordsAndPrefixes => {
  const parts: string[] = [];
  const prefixes: string[] = [];
  let lastWordEndIndex = 0;

  for (const match of input.matchAll(regex)) {
    const index = match.index;
    const word = match[0];

    parts.push(word);
    prefixes.push(input.slice(lastWordEndIndex, index).trim());
    lastWordEndIndex = index + word.length;
  }

  const tail = input.slice(lastWordEndIndex).trim();

  if (tail) {
    parts.push('');
    prefixes.push(tail);
  }

  return { parts, prefixes };
};
