<<<<<<< HEAD
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
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
>>>>>>> b612106939ae29de5fb6a19248cc08766ff0575f
