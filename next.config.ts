const nextConfig = {
  ...(process.env.BUILD_STATIC === 'true' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '',
};

export default nextConfig;
