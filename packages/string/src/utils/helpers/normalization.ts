import { hasEmptySpace } from '../guards';
import { getWordSplitRegex, getWordsAndPrefixes } from './words';

const EMPTY_KEEP: string[] = [];

// Letter ranges kept in sync with MAGIC_SPLIT_REGEX (Latin + accented + Cyrillic).
// ß (U+00DF) and à-ÿ are lowercase; À-Þ and А-Я are uppercase.
const LETTER_RANGES = 'a-zA-ZÀ-ÖØ-Þß-öø-ÿА-Яа-я';

// Separators that always act as word boundaries when present in the input.
const BOUNDARY_SEPARATORS = ['_', '-', '/', '.', '\\', ':'];

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
  const disallowedPrefix = keep.length ? new RegExp(`[^${escapedKeep}]`, 'g') : undefined;
  const disallowedCharacters = strict
    ? new RegExp(`[^${LETTER_RANGES}0-9${escapedKeep}]`, 'g')
    : undefined;

  // Existing separators must become word boundaries, not be silently dropped.
  // Convert any that aren't explicitly kept into spaces before splitting.
  const separatorsToKeep = new Set(keep);
  const boundarySeparators = BOUNDARY_SEPARATORS.filter(
    (character) => !separatorsToKeep.has(character),
  );

  let normal = getNormalizedText(input);

  if (boundarySeparators.length) {
    const boundaryClass = escapeCharacterClass(boundarySeparators.join(''));
    normal = normal.replace(new RegExp(`[${boundaryClass}]+`, 'g'), ' ').trim();
  }

  const regex = getWordSplitRegex();

  const { parts, prefixes } = getWordsAndPrefixes(normal, regex);

  const hasSpaces = hasEmptySpace(normal);

  const processed = parts.map((part, idx) => {
    const originalPrefix = prefixes[idx] || '';

    let currentPart = part;
    let currentPrefix = originalPrefix;

    if (strict) {
      currentPart = getNormalizedText(currentPart, 'NFC').replace(disallowedCharacters!, '');

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
