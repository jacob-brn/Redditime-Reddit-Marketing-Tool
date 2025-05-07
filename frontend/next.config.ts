import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "styles.redditmedia.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.redditstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.thumbs.redditmedia.com",
        pathname: "/**",
      },
    ],
  },
  env: {
    // put your nextjs env variables here
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
