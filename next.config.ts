/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.rollingstone.com" },
      { protocol: "https", hostname: "www.fmn.dk" },
      { protocol: "https", hostname: "people.com" },
      { protocol: "https", hostname: "i.guim.co.uk" },
      { protocol: "https", hostname: "images.euronews.com" },
      { protocol: "https", hostname: "img.glavnoe.in.ua" },
      { protocol: "https", hostname: "www.gannett-cdn.com" },
      { protocol: "https", hostname: "www.reuters.com" },
      { protocol: "https", hostname: "prodgs-17455.kxcdn.com" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "img.olympics.com" },
      { protocol: "https", hostname: "www.railwaypro.com" },
      { protocol: "https", hostname: "tse4.mm.bing.net" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "telforcegroup.com" },
      { protocol: "https", hostname: "www.actualidadmotor.com" },
      { protocol: "https", hostname: "cnsd.gov.hk" },
      { protocol: "https", hostname: "heartland.org" },
      { protocol: "https", hostname: "www.thegatewaypundit.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

module.exports = nextConfig;