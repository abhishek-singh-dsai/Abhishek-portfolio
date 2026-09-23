// Static export so the site can be hosted anywhere (GitHub Pages, Netlify, Vercel, S3...).
// BASE_PATH is set by the GitHub Pages workflow when the site lives at user.github.io/<repo>.
const basePath = process.env.BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
  // Let the dev server work on 127.0.0.1 as well as localhost.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
};

export default nextConfig;
