/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Proxy API/auth to backend when accessed via frontend directly (e.g. localhost:3000)
    const backend = process.env.BACKEND_URL || 'http://url-service:3001';
    return [
      { source: '/api/:path*', destination: `${backend}/api/:path*` },
      { source: '/auth/:path*', destination: `${backend}/auth/:path*` },
      { source: '/graphql', destination: `${backend}/graphql` },
    ];
  },
};

module.exports = nextConfig;

