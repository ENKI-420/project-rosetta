/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable API routes
  experimental: {
    serverComponentsExternalPackages: ['net'],
  },
  // Server-side features require Node.js runtime
  serverRuntimeConfig: {
    chatmeshHost: process.env.CHATMESH_HOST || '127.0.0.1',
    chatmeshPort: process.env.CHATMESH_PORT || '7777',
  },
};

export default nextConfig;
