import { generate as DefaultImage } from 'fumadocs-ui/og/takumi';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'takumi-js/response';

import { getOpengraphUrl, source } from '#/fumadocs/source';
import { application } from '@/configs/application';

export const revalidate = false;

export const generateStaticParams = () => {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getOpengraphUrl(page).segments,
  }));
};

export const GET = async (_: Request, { params }: RouteContext<'/static/docs/[...slug]'>) => {
  const { slug } = await params;

  const page = source.getPage(slug.slice(0, -1));

  if (!page) {
    notFound();
  }

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      site={application.name}
      description={page.data.description}
    />,
    { width: 1200, height: 630, format: 'webp' },
  );
};
