import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import { source } from '#/fumadocs/source';
import { application } from '@/configs/application';

export default function Layout(props: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      nav={{ title: application.name }}
      githubUrl={`https://github.com/${application.github.user}/${application.github.repo}`}
      {...props}
    />
  );
}
