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
      {
        protocol: "https",
        hostname: "pfy-prod-products-mockup-media.s3.us-east-2.amazonaws.com",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
