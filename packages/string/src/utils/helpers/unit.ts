const YEAR = 365.25 * 86400e3;

const UNIT_MS: Record<string, number> = {
  ms: 1,
  msec: 1,
  msecs: 1,
  millisecond: 1,
  milliseconds: 1,
  s: 1e3,
  sec: 1e3,
  secs: 1e3,
  second: 1e3,
  seconds: 1e3,
  m: 60e3,
  min: 60e3,
  mins: 60e3,
  minute: 60e3,
  minutes: 60e3,
  h: 3600e3,
  hr: 3600e3,
  hrs: 3600e3,
  hour: 3600e3,
  hours: 3600e3,
  d: 86400e3,
  day: 86400e3,
  days: 86400e3,
  w: 7 * 86400e3,
  wk: 7 * 86400e3,
  wks: 7 * 86400e3,
  week: 7 * 86400e3,
  weeks: 7 * 86400e3,
  y: YEAR,
  yr: YEAR,
  yrs: YEAR,
  year: YEAR,
  years: YEAR,
};

const FORMAT_UNITS = [
  ['ms', 'millisecond', 1e3, 1],
  ['s', 'second', 60e3, 1e3],
  ['m', 'minute', 3600e3, 60e3],
  ['h', 'hour', 86400e3, 3600e3],
  ['d', 'day', YEAR, 86400e3],
  ['y', 'year', Number.POSITIVE_INFINITY, YEAR],
] as const;

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
  const multiplier = UNIT_MS[key];

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

  for (const [short, longName, limit, divisor] of FORMAT_UNITS) {
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
