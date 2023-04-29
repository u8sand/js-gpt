/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'out/js-gpt',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/js-gpt' : undefined,
}

module.exports = nextConfig
