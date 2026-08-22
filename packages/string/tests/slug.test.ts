import { assert, describe, it } from 'vitest';

import { slug } from '../src/slug';

describe('slug', () => {
  it('transliterates and separates words', () => {
    assert.equal(slug('Olá, coração'), 'ola-coracao');
    assert.equal(slug('Hello World'), 'hello-world');
  });

  it('supports locale-specific mappings', () => {
    assert.equal(slug('Äpfel & Öl', { locale: 'de' }), 'aepfel-und-oel');
  });

  it('supports strict mode and custom separators', () => {
    assert.equal(slug('Hello, World!', { strict: true }), 'hello-world');
    assert.equal(slug('Hello World', { separator: '_', lower: false }), 'Hello_World');
  });

  it('supports trimming and custom removal patterns', () => {
    assert.equal(slug('  Hello World  ', { trim: false, separator: '_' }), '_hello_world_');
    assert.equal(slug('hello@world', { remove: /@/g }), 'helloworld');
  });

  it('creates preconfigured slug functions', () => {
    const upperSlug = slug.create({ lower: false, separator: '_' });
    assert.equal(upperSlug('Hello World'), 'Hello_World');
  });

  it('extends the shared character mapping', () => {
    slug.extend({ '☕': 'coffee' });
    assert.equal(slug('I ☕ TypeScript'), 'i-coffee-typescript');
  });

  it('handles empty input', () => {
    assert.equal(slug(''), '');
  });
});
