import { DURATION_FORMAT_ORDER, DURATION_UNITIES_MAP } from './constants';

/**
 * Parses a duration string (e.g. `'1h'`, `'2 hours'`, `'500'`) into
 * milliseconds. Returns `null` when the input does not match a known
 * value/unit expression; callers decide how to surface that.
 *
 * @param input - The duration string to parse.
 * @returns The duration in milliseconds, or `null` if it cannot be parsed.
 */
export const getMillisecondsParse = (input: string): number | null => {
  const match = /^(-?\d+(?:\.\d+)?)(?:\s*([a-zA-Z]+))?$/i.exec(input);

  if (!match) {
    return null;
  }

  const [, value, unit] = match;
  const parsedValue = Number.parseFloat(value!);

  if (Number.isNaN(parsedValue)) {
    return null;
  }

  const key = unit ? unit.toLowerCase() : 'ms';
  const multiplier = DURATION_UNITIES_MAP.get(key);

  if (multiplier == null) {
    return null;
  }

  return parsedValue * multiplier;
};

/**
 * Formats a millisecond value into a human-readable duration string.
 *
 * @param input - The value in milliseconds.
 * @param long - When `true`, uses long unit names (e.g. `'1 hour'`).
 * @returns The formatted string, or `''` if `input` is not a finite number.
 */
export const getMillisecondsFormat = (input?: number, long?: boolean): string => {
  if (typeof input !== 'number' || !Number.isFinite(input)) {
    return '';
  }

  const sign = input < 0 ? '-' : '';
  const absolute = Math.abs(input);

  for (const { divisor = 0, limit = 0, long: longName, short } of DURATION_FORMAT_ORDER) {
    if (absolute < limit) {
      const count = Math.round(absolute / divisor);

      if (long) {
        return `${sign}${count} ${longName}${count !== 1 ? 's' : ''}`;
      }

      return `${sign}${count}${short}`;
    }
  }

  return '';
};
