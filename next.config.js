/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip static generation for auth-protected pages
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
