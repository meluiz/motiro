/**
 * Strips HTML tags.
 */
export const HTML_TAG_REGEX = /<\/?[^>]+(>|$)/gi;

/**
 * Removes HTML comments.
 */
export const HTML_COMMENT_REGEX = /<!--(.*?)-->/gs;

/**
 * Matches an HTML entity at the start of a string: named (`&amp;`), decimal
 * (`&#38;`) or hexadecimal (`&#x26;`). An entity represents a single visible
 * character and must never be split when truncating text.
 */
export const HTML_ENTITY_AT_START_REGEX = /^&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/i;
