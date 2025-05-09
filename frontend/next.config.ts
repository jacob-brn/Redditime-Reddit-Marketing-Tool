import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
};

export default nextConfig;
