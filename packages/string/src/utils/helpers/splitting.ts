import { hasEmptySpace } from '../guards';
import {
  HTML_COMMENT_REGEX,
  HTML_TAG_REGEX,
  MAGIC_SPLIT_REGEX,
  SPACE_SPLIT_REGEX,
} from '../regexes';
import { DEFAULT_OPTIONS, SELF_CLOSING_TAGS } from './constants';

/**
 * Finds the index of the first match of `regex` in `input`.
 */
export const getFirstLetterIndex = (input: string, regex: RegExp): number => {
  const match = input.matchAll(regex).next().value;
  return match?.index ?? 0;
};

/**
 * Chooses the appropriate regex for splitting into words:
 * - If there is any space, split on whitespace.
 * - Otherwise, use the "magic" pattern.
 */
export const getWordSplitRegex = (input: string): RegExp => {
  return hasEmptySpace(input) ? SPACE_SPLIT_REGEX : MAGIC_SPLIT_REGEX;
};

type WordsAndPrefixes = {
  parts: string[];
  prefixes: string[];
};

/**
 * Splits `input` by `regex`, capturing each match and the text before it.
 */
export const getWordsAndPrefixes = (input: string, regex: RegExp): WordsAndPrefixes => {
  const result: WordsAndPrefixes = { parts: [], prefixes: [] };
  const matches = input.matchAll(regex);

  let lastWordEndIndex = 0;

  for (const match of matches) {
    if (typeof match.index !== 'number') {
      continue;
    }

    const word = match[0];
    result.parts.push(word);

    const prefix = input.slice(lastWordEndIndex, match.index).trim();
    result.prefixes.push(prefix);

    lastWordEndIndex = match.index + word.length;
  }

  const tail = input.slice(lastWordEndIndex).trim();

  if (tail) {
    result.parts.push('');
    result.prefixes.push(tail);
  }

  return result;
};

/**
 * Strategy used to measure the truncation length.
 *
 * - `'words'`: `length` is a maximum number of words.
 * - `'paragraphs'`: `length` is a maximum number of newline-separated paragraphs.
 * - `'characters'`: `length` is a maximum number of visible text characters.
 */
type TruncateType = 'words' | 'paragraphs' | 'characters';

/**
 * Options controlling how a string is truncated.
 */
type TruncatedStringOptions = {
  /**
   * When `true`, the string is cut exactly at the limit. When `false`,
   * trailing whitespace produced by a word-boundary cut is trimmed.
   *
   * @defaultValue `true`
   */
  strict?: boolean;

  /**
   * Unit used to measure `length`.
   *
   * @defaultValue `'words'`
   */
  type?: TruncateType;

  /**
   * String appended (or injected before trailing closing tags) when the input
   * is actually truncated.
   *
   * @defaultValue `'...'`
   */
  ellipsis?: string;

  /**
   * When `true`, HTML tags are preserved and any tags left open by the cut are
   * re-closed. When `false`, tags and comments are stripped before truncation.
   *
   * @defaultValue `true`
   */
  tags?: boolean;
};

/**
 * Parser state while scanning the input character by character.
 *
 * Uses a `const enum` so the compiler inlines the numeric values, leaving no
 * runtime object behind.
 */
enum State {
  /** Scanning visible text (counts toward the limit). */
  Text,

  /** Inside a tag, reading its name (e.g. the `a` in `<a ...>`). */
  Tag,

  /** Inside a tag, past the name, reading its attributes. */
  Attributes,
}

/**
 * Resolved measurement mode, derived once from {@link TruncateType} so the hot
 * loop compares integers instead of running a regex per character.
 */
enum Mode {
  Words,
  Paragraphs,
  Characters,
}

/**
 * Void (self-closing) HTML elements that must never be pushed onto the open-tag
 * stack. Stored as a `Set` for O(1) membership checks.
 */
const SELF_CLOSING = new Set(SELF_CLOSING_TAGS);

/**
 * Truncates a string to a given length, optionally preserving well-formed HTML.
 *
 * This is the shared engine behind `truncate` and `excerpt`. It scans the input
 * as a small state machine so that, when {@link TruncatedStringOptions.tags} is
 * enabled, HTML tags are never split and any tags left open by the cut are
 * re-closed in the correct order.
 *
 * The measurement unit is controlled by {@link TruncatedStringOptions.type}:
 * words, paragraphs, or characters. Only visible text counts toward the
 * limit — characters inside tags are never counted.
 *
 * @param input - The source string to truncate.
 * @param length - The maximum length, expressed in the unit given by `type`.
 * @param options - Truncation options. See {@link TruncatedStringOptions}.
 * @returns The truncated string, trimmed, with the ellipsis appended when a cut
 *   actually occurred. Returns an empty string for empty input or `length <= 0`.
 *
 * @example
 * ```ts
 * getTruncatedString('The quick brown fox', 2)
 * // => 'The quick...'
 *
 * getTruncatedString('<p>Hello there friend</p>', 2, { type: 'words' })
 * // => '<p>Hello there...</p>'
 *
 * getTruncatedString('<b>Bold</b> text', 20, { tags: false })
 * // => 'Bold text'
 * ```
 */
export const getTruncatedString = (
  input: string,
  length: number,
  options?: TruncatedStringOptions,
): string => {
  if (!input || length <= 0) {
    return '';
  }

  // Spread onto a fresh object: never mutate the shared (readonly) defaults.
  const { type, tags, strict, ellipsis } = {
    ...DEFAULT_OPTIONS.TRUNCATED_STRING,
    ...options,
  };

  // Resolve the measurement mode once, before the loop.
  const mode =
    type === 'words' ? Mode.Words : type === 'paragraphs' ? Mode.Paragraphs : Mode.Characters;

  // When tags are disabled, strip comments and tags up front.
  let sentence = input.trim();

  if (!tags) {
    sentence = sentence.replace(HTML_COMMENT_REGEX, '').replace(HTML_TAG_REGEX, '');
  }

  let result = '';
  let tagName = '';
  let state: State = State.Text;

  const openTags: string[] = [];

  let words = 0;
  let paragraphs = 0;
  let characters = 0;
  let truncated = false;

  const len = sentence.length;
  let i = 0;

  loop: while (i < len) {
    const char = sentence.charAt(i);

    switch (char) {
      // Opening angle bracket: enter tag-name state (only when tags are kept).
      case '<': {
        if (tags) {
          state = State.Tag;
          tagName = '';
        }

        result += char;
        break;
      }

      // Closing angle bracket: finalize the current tag and update the stack.
      case '>': {
        if (tags && (state === State.Tag || state === State.Attributes)) {
          state = State.Text;

          const closing = tagName.charCodeAt(0) === 47; // '/'
          const name = (closing ? tagName.slice(1) : tagName).toLowerCase();

          if (closing) {
            // Only pop when the closing tag matches the top of the stack,
            // so malformed nesting can't misalign the stack.

            if (openTags[openTags.length - 1] === name) {
              openTags.pop();
            }
          } else if (!SELF_CLOSING.has(name)) {
            openTags.push(name);
          }
        }
        result += char;
        break;
      }

      // Space: either an attribute separator inside a tag, or a word boundary.
      case ' ': {
        // A space right after the tag name begins the attribute section.
        if (state === State.Tag) {
          state = State.Attributes;
          result += char;
          break;
        }

        if (state === State.Attributes) {
          result += char;
          break;
        }

        // Otherwise we are in text: this space is a word boundary.
        if (mode === Mode.Words) {
          words++;

          if (words >= length) {
            if (!strict) {
              result = result.trimEnd();
            }

            truncated = true;
            break loop;
          }
        }

        characters++;

        if (mode === Mode.Characters && characters >= length) {
          truncated = true;
          break loop;
        }

        result += char;
        break;
      }

      // Any other character.
      default: {
        if (state === State.Text) {
          characters++;
          result += char;

          if (mode === Mode.Characters && characters >= length) {
            truncated = true;
            break loop;
          }
        } else if (state === State.Tag) {
          // Still reading the tag name.
          tagName += char;
          result += char;
        } else {
          // Inside attributes: copy through without counting.
          result += char;
        }
        break;
      }
    }

    // Paragraph counting: a newline in text ends a paragraph.
    if (state === State.Text && mode === Mode.Paragraphs && char === '\n') {
      paragraphs++;

      if (paragraphs >= length) {
        truncated = true;
        break;
      }
    }

    i++;
  }

  // Re-close any tags left open by the cut, in reverse (LIFO) order.
  while (openTags.length > 0) {
    result += `</${openTags.pop()}>`;
  }

  // Append the ellipsis only when a real cut happened.
  if (truncated) {
    result = tags ? insertEllipsis(result, ellipsis) : result + ellipsis;
  }

  return result.trim();
};

/**
 * Inserts the ellipsis after the last piece of visible text, before any block
 * of trailing closing tags (e.g. turns `<p>Hi</p>` into `<p>Hi...</p>`).
 *
 * Avoids a global regex so there is no shared `lastIndex` state to reset.
 *
 * @param html - The truncated HTML string.
 * @param ellipsis - The ellipsis to insert.
 * @returns The HTML with the ellipsis placed inside the innermost trailing tag.
 */
const insertEllipsis = (html: string, ellipsis: string): string => {
  const trailingCloseTag = /<\/[a-z0-9]+>\s*$/i;

  // If the string doesn't end in a closing tag, just append.
  if (!trailingCloseTag.test(html)) {
    return `${html}${ellipsis}`;
  }

  // Walk back over the contiguous run of trailing closing tags to find the
  // point right after the last visible text.
  let cut = html.length;
  let head = html;

  while (trailingCloseTag.test(head)) {
    cut = head.search(trailingCloseTag);
    head = head.slice(0, cut);
  }

  return `${head}${ellipsis}${html.slice(cut)}`;
};
