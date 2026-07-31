import type { MDXComponents } from 'mdx/types';

import defaultMdxComponents from 'fumadocs-ui/mdx';

export const getMarkdownComponents = (components?: MDXComponents) => {
  return {
    ...defaultMdxComponents,
    ...components,
  } satisfies MDXComponents;
};

export const useMDXComponents = getMarkdownComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMarkdownComponents>;
}
