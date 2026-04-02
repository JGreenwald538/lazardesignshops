/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
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

export default nextConfig;
