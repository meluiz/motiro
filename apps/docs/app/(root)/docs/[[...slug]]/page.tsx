import type { Metadata } from 'next';

import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { notFound } from 'next/navigation';

import { getMarkdownUrl, getOpengraphUrl, source } from '#/fumadocs/source';
import { getMarkdownComponents } from '@/components/layout';
import { application } from '@/configs/application';

export const generateStaticParams = async () => {
  return source.generateParams();
};

export const generateMetadata = async (
  props: PageProps<'/docs/[[...slug]]'>,
): Promise<Metadata> => {
  const { params } = props;

  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getOpengraphUrl(page).url,
    },
  };
};

const Page = async (props: PageProps<'/docs/[[...slug]]'>) => {
  const { params } = props;

  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;
  const markdownUrl = getMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row items-center gap-2 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${application.github.user}/${application.github.repo}/blob/${application.github.branch}/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMarkdownComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
};

export default Page;
