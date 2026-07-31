import { llms } from 'fumadocs-core/source';

import { source } from '#/fumadocs/source';

export const revalidate = false;

export const GET = () => {
  const content = llms(source).index();
  return new Response(content);
};
