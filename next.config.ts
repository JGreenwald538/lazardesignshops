/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.printify.com",
        pathname: "/mockup/**",
      },
    ],
  },
};

module.exports = nextConfig;
