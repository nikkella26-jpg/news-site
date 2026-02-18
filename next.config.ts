import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heartland.org", // 👈 Tillagd för din senaste bild
      },
      {
        protocol: "https",
        hostname: "cnsd.gov.hk",
      },
      {
        protocol: "https",
        hostname: "telforcegroup.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "www.actualidadmotor.com",
      },
      {
        protocol: "https",
        hostname: "*.mm.bing.net",
      },
      {
        protocol: "https",
        hostname: "www.bing.com",
      },
      {
        protocol: "https",
        hostname: "th.bing.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.rollingstone.com",
      },
      {
        protocol: "https",
        hostname: "www.fmn.dk",
      },
      {
        protocol: "https",
        hostname: "people.com",
      },
      {
        protocol: "https",
        hostname: "i.guim.co.uk",
      },
      {
        protocol: "https",
        hostname: "images.euronews.com",
      },
    ],
  },
};

export default nextConfig;