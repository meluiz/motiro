import { notFound } from 'next/navigation';

import { getMarkdownUrl, getProcessedLLMText, source } from '#/fumadocs/source';

export const revalidate = false;

export const generateStaticParams = async () => {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getMarkdownUrl(page).segments,
  }));
};

export const GET = async (
  _: Request,
  { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>,
) => {
  const { slug } = await params;

  const page = source.getPage(slug?.slice(0, -1));

  if (!page) {
    notFound();
  }

  return new Response(await getProcessedLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
};
