import { describe, expect, it } from 'vitest';

import * as number from '../src';

describe('public API', () => {
  it('exports every function from the package entry point', () => {
    expect(Object.keys(number).sort()).toEqual([
      'clamp',
      'format',
      'fromBytes',
      'interpolate',
      'lerp',
      'mean',
      'random',
      'range',
      'round',
      'sum',
      'toBytes',
    ]);
  });

  it.each(Object.entries(number))('exports %s as a function', (_, value) => {
    expect(typeof value).toBe('function');
  });
});
