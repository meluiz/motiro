/**
 * Strips HTML tags.
 */
export const HTML_TAG_REGEX = /<\/?[^>]+(>|$)/gi;

/**
 * Removes HTML comments.
 */
export const HTML_COMMENT_REGEX = /<!--(.*?)-->/gs;
