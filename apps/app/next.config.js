/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cloudflare-ipfs.com",
      "raw.githubusercontent.com",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
