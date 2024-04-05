/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/csc-324-sga-assisting-tool',
  assetPrefix: '/csc-324-sga-assisting-tool/',
};

export default nextConfig;
