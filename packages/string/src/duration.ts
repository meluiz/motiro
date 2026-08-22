import { getMillisecondsFormat, getMillisecondsParse } from './utils/helpers';

export type DurationUnit =
  | 'Years'
  | 'Year'
  | 'Yrs'
  | 'Yr'
  | 'Y'
  | 'Weeks'
  | 'Week'
  | 'W'
  | 'Days'
  | 'Day'
  | 'D'
  | 'Hours'
  | 'Hour'
  | 'Hrs'
  | 'Hr'
  | 'H'
  | 'Minutes'
  | 'Minute'
  | 'Mins'
  | 'Min'
  | 'M'
  | 'Seconds'
  | 'Second'
  | 'Secs'
  | 'Sec'
  | 's'
  | 'Milliseconds'
  | 'Millisecond'
  | 'Msecs'
  | 'Msec'
  | 'Ms';

export type DurationUnitAnyCase =
  | DurationUnit
  | Uppercase<DurationUnit>
  | Lowercase<DurationUnit>;

export type PrettyDuration =
  | `${number}`
  | `${number}${DurationUnitAnyCase}`
  | `${number} ${DurationUnitAnyCase}`;

/**
 * Converts a number of milliseconds into a human-readable duration string.
 *
 * @param input - The number of milliseconds to format.
 * @param long - When `true`, uses the long format (e.g. `'1 hour'` instead of `'1h'`).
 * @returns A formatted duration string, or `''` if the input is not a finite number.
 *
 * @example
 * ```ts
 * fromMilliseconds(3600000);
 * // => '1h'
 *
 * fromMilliseconds(3600000, true);
 * // => '1 hour'
 * ```
 */
export const fromMilliseconds = (input: number, long?: boolean): PrettyDuration => {
  return getMillisecondsFormat(input, long) as PrettyDuration;
};

/**
 * Parses a duration expression into milliseconds.
 *
 * @param input - The duration to parse: a number (already in milliseconds) or a
 *   string expression such as `'1h'` or `'2 hours'`.
 * @returns The duration in milliseconds.
 * @throws {TypeError} If the string input is not a valid duration expression.
 *
 * @example
 * ```ts
 * toMilliseconds('1h');
 * // => 3600000
 *
 * toMilliseconds(500);
 * // => 500
 * ```
 */
export const toMilliseconds = (input: string | number): number => {
  if (typeof input === 'number') {
    return input;
  }

  const milliseconds = getMillisecondsParse(input);

  if (milliseconds == null) {
    throw new TypeError(`Invalid duration expression "${input}"`);
  }

  return milliseconds;
};

/**
 * Converts a number of seconds into a human-readable duration string.
 *
 * @param input - The number of seconds to format.
 * @param long - When `true`, uses the long format (e.g. `'1 minute'` instead of `'1m'`).
 * @returns A formatted duration string, or `''` if the input is not a finite number.
 *
 * @example
 * ```ts
 * fromSeconds(60);
 * // => '1m'
 *
 * fromSeconds(60, true);
 * // => '1 minute'
 * ```
 */
export const fromSeconds = (input: number, long?: boolean): PrettyDuration => {
  return getMillisecondsFormat(input * 1000, long) as PrettyDuration;
};

/**
 * Parses a duration expression into whole seconds.
 *
 * @param input - The duration to parse: a number (already in seconds) or a
 *   string expression such as `'2h'`.
 * @returns The duration in seconds, floored to an integer.
 * @throws {TypeError} If the string input is not a valid duration expression.
 *
 * @example
 * ```ts
 * toSeconds('2h');
 * // => 7200
 *
 * toSeconds(30);
 * // => 30
 * ```
 */
export const toSeconds = (input: string | number): number => {
  if (typeof input === 'number') {
    return Math.floor(input);
  }

  const milliseconds = getMillisecondsParse(input);

  if (milliseconds == null) {
    throw new TypeError(`Invalid duration expression "${input}"`);
  }

  return Math.floor(milliseconds / 1000);
};
