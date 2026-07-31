import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';

import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

const Layout = (props: LayoutProps<'/'>) => {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider {...props} />
      </body>
    </html>
  );
};

export default Layout;
