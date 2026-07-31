import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { application } from '@/configs/application';

const Layout = (props: LayoutProps<'/'>) => {
  return (
    <HomeLayout
      nav={{ title: application.name }}
      githubUrl={`https://github.com/${application.github.user}/${application.github.repo}`}
      {...props}
    />
  );
};

export default Layout;
