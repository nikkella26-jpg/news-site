/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.euronews.com",
      },
      {
        protocol: "https",
        hostname: "img.olympics.com",
      },
    ],
  },
};

module.exports = nextConfig;