import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

export default withMDX({
  serverExternalPackages: ['@takumi-rs/core'],
  reactStrictMode: true,
});
