import { assert, describe, it } from 'vitest';

import { interpolate } from '../src/interpolate';

describe('interpolate', () => {
  it('replaces top-level and nested values', () => {
    assert.equal(interpolate('Hello {{name}}', { name: 'Jane' }), 'Hello Jane');
    assert.equal(
      interpolate('{{ user.name }} has {{items.0}} item', {
        user: { name: 'Jane' },
        items: [2],
      }),
      'Jane has 2 item',
    );
  });

  it('stringifies non-string values', () => {
    assert.equal(interpolate('{{active}} {{count}}', { active: false, count: 0 }), 'false 0');
  });

  it('uses fallback for null and missing values', () => {
    const fallback = (key: string) => `[missing:${key}]`;
    assert.equal(
      interpolate('{{value}} {{other}}', { value: null }, { fallback }),
      '[missing:value] [missing:other]',
    );
  });

  it('supports custom delimiters', () => {
    assert.equal(
      interpolate('Hello [[name]]', { name: 'Jane' }, { delimiters: ['[[', ']]'] }),
      'Hello Jane',
    );
  });

  it('preserves escaped placeholders', () => {
    assert.equal(interpolate('Hello \\{{name}}', { name: 'Jane' }), 'Hello {{name}}');
  });

  it('only traverses own properties', () => {
    const inherited = Object.create({ secret: 'hidden' });
    assert.equal(interpolate('{{secret}}', inherited), '');
  });
});
