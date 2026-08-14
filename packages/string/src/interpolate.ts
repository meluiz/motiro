import { hasOwnProp } from './utils/guards';

/**
 * Options controlling how {@link interpolate} handles missing keys.
 */
export type InterpolateOptions = {
  /**
   * Value substituted when a placeholder key cannot be resolved in `data`.
   * Receives the trimmed key so the caller can decide what to render.
   *
   * @defaultValue returns an empty string
   */
  fallback?: (key: string) => string;

  /**
   * The opening and closing delimiters that wrap a placeholder. Any characters
   * are allowed; regex metacharacters are escaped internally.
   *
   * @defaultValue `['{{', '}}']`
   */
  delimiters?: readonly [open: string, close: string];
};

const DEFAULT_OPTIONS = {
  fallback: (): string => '',
  delimiters: ['{{', '}}'] as const,
};

const DEFAULT_PATTERN = /(\\)?\{\{([\s\S]*?)\}\}/g;

/**
 * Replaces `{{key}}` placeholders in a string with values from `data`.
 *
 * Keys may reference nested properties using dot notation (e.g.
 * `{{ user.name }}`), including array indices (e.g. `{{ items.0 }}`). Whitespace
 * inside the braces is ignored. A placeholder escaped with a leading backslash
 * (`\{{ key }}`) is emitted literally, without its backslash and without
 * interpolation. Unresolved keys are replaced using
 * {@link InterpolateOptions.fallback} (an empty string by default).
 *
 * @param input - The template string containing placeholders.
 * @param data - The object providing values for the placeholders.
 * @param options - Interpolation options. See {@link InterpolateOptions}.
 * @returns A new string with all resolvable placeholders replaced.
 *
 * @example
 * ```ts
 * interpolate('hello {{ user.name }}', { user: { name: 'John' } });
 * // => 'hello John'
 *
 * interpolate('escaped: \\{{ users.0 }}', {});
 * // => 'escaped: {{ users.0 }}'
 *
 * interpolate('hi {{ missing }}', {});
 * // => 'hi '
 * ```
 */
export const interpolate = <T extends object>(
  input: string,
  data: T,
  options?: InterpolateOptions,
): string => {
  const { fallback, delimiters } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const pattern =
    delimiters === DEFAULT_OPTIONS.delimiters ||
    (delimiters[0] === '{{' && delimiters[1] === '}}')
      ? DEFAULT_PATTERN
      : buildPattern(delimiters[0], delimiters[1]);

  return input.replace(pattern, (match, escaped, rawKey) => {
    if (escaped) {
      return match.slice(1);
    }

    const key = String(rawKey).trim();
    const value = resolvePath(data, key);

    if (value == null) {
      return fallback(key);
    }

    return typeof value === 'string' ? value : String(value);
  });
};

/**
 * Escapes regex metacharacters so an arbitrary string can be embedded safely
 * inside a dynamically built pattern.
 *
 * @param value - The raw string to escape.
 * @returns The string with all regex metacharacters escaped.
 */
const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Builds the placeholder-matching pattern for a pair of delimiters. Capture
 * group 1 is the optional escaping backslash; group 2 is the raw key.
 *
 * @param open - The opening delimiter.
 * @param close - The closing delimiter.
 * @returns A global RegExp matching (optionally escaped) placeholders.
 */
const buildPattern = (open: string, close: string): RegExp => {
  const openSource = escapeRegExp(open);
  const closeSource = escapeRegExp(close);

  return new RegExp(`(\\\\)?${openSource}([\\s\\S]*?)${closeSource}`, 'g');
};

/**
 * Resolves a dot-separated path (e.g. `'user.name'`) against a value, walking
 * only own properties. Returns `undefined` if any segment is missing or the
 * current value is not a traversable object.
 *
 * @param source - The root value to resolve against.
 * @param path - The dot-separated key path.
 * @returns The resolved value, or `undefined` if the path cannot be followed.
 */
const resolvePath = (source: unknown, path: string): unknown => {
  const tokens = path.split('.');
  let current: unknown = source;

  for (const token of tokens) {
    if (current == null || typeof current !== 'object') {
      return undefined;
    }

    if (!hasOwnProp(current, token)) {
      return undefined;
    }

    current = current[token];
  }

  return current;
};
