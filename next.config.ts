import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        hostname: "flippant-wolf-920.eu-west-1.convex.cloud",
        protocol: "https",
        port: "",
      },
      {
        hostname: "grateful-mosquito-699.convex.cloud",
        protocol: "https",
        port: "",
      },
      {
        hostname: "lovable-bloodhound-237.convex.cloud",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;