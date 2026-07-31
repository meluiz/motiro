import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineDocs } from 'fumadocs-mdx/macro';

import { application } from '@/configs/application';

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: application.routes.docs,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const getOpengraphUrl = (page: (typeof source)['$inferPage']) => {
  const segments = [...page.slugs, 'opengraph.webp'];
  const pathname = [page.locale, ...application.routes.image.split('/'), ...segments]
    .filter(Boolean)
    .join('/');

  return {
    segments,
    url: `/${pathname}`,
  };
};

export const getMarkdownUrl = (page: (typeof source)['$inferPage']) => {
  const segments = [...page.slugs, 'content.md'];
  const pathname = [page.locale, ...application.routes.docs.split('/'), ...segments]
    .filter(Boolean)
    .join('/');

  return {
    segments,
    url: `/${pathname}`,
  };
};

export const getProcessedLLMText = async (page: (typeof source)['$inferPage']) => {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
};
