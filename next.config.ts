import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['next-mdx-remote'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tohdpgpcclierhllsmum.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/image-bucket/**', // '/files/**' 패턴으로 시작하는 모든 경로 허용
      },
    ],
  },

  async redirects() {
    return [
      // Root now serves the blog landing — preserve old /blog backlinks.
      { source: '/blog', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
