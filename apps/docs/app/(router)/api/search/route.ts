import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '#/fumadocs/source';

export const { GET } = createFromSource(source);
