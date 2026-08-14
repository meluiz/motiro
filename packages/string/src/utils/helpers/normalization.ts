import { hasEmptySpace } from '../guards';
import { getWordSplitRegex, getWordsAndPrefixes } from './words';

const EMPTY_KEEP: string[] = [];

const escapeCharacterClass = (input: string): string => input.replace(/[\\\]^-]/g, '\\$&');

/**
 * Trims and normalizes a string to the given Unicode form.
 */
const getNormalizedText = (
  input: string,
  form: 'NFC' | 'NFD' | 'NFKC' | 'NFKD' = 'NFC',
): string => {
  return input.trim().normalize(form);
};

type NormalizedWordsOptions = {
  keep?: string[] | undefined;
  prefix?: string | undefined;
  strict?: boolean | undefined;
};

/**
 * Splits `input` into normalized words according to `options`.
 */
export const getNormalizedWords = (
  input: string,
  options: NormalizedWordsOptions = {},
): string[] => {
  if (!input) {
    return [];
  }

  const prefix = options.prefix ?? '';
  const keep = options.keep ?? EMPTY_KEEP;
  const strict = options.strict ?? true;
  const escapedKeep = escapeCharacterClass(keep.join(''));
  const disallowedCharacters = strict
    ? new RegExp(`[^a-zA-ZØßø0-9${escapedKeep}]`, 'g')
    : undefined;
  const disallowedPrefix = keep.length ? new RegExp(`[^${escapedKeep}]`, 'g') : undefined;

  const normal = getNormalizedText(input);
  const regex = getWordSplitRegex(normal);

  const { parts, prefixes } = getWordsAndPrefixes(normal, regex);

  const hasSpaces = hasEmptySpace(normal);

  const processed = parts.map((part, idx) => {
    const originalPrefix = prefixes[idx] || '';

    let currentPart = part;
    let currentPrefix = originalPrefix;

    if (strict) {
      currentPart = getNormalizedText(currentPart, 'NFD').replace(disallowedCharacters!, '');

      if (!keep.length) {
        currentPrefix = '';
      }
    }

    if (keep.length && currentPrefix) {
      currentPrefix = getNormalizedText(currentPrefix).replace(disallowedPrefix!, '');
    }

    if (idx === 0) {
      return `${currentPrefix}${currentPart}`;
    }

    if (!hasSpaces) {
      return `${currentPrefix || prefix}${currentPart}`;
    }

    if (!currentPrefix && prefix === ' ') {
      return ` ${currentPart}`;
    }

    return `${currentPrefix || prefix}${currentPart}`;
  });

  return processed.filter(Boolean);
};
