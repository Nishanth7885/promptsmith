/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'standalone' so the Cashfree + auth API routes (which need Node runtime
  // and secret env vars) can run server-side. Pages still pre-render where
  // possible.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  // better-sqlite3 is a native Node addon. Webpack must not attempt to bundle
  // it. (Next 15 renames this to top-level `serverExternalPackages`.)
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

module.exports = nextConfig;
