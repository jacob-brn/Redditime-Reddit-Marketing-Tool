import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";

const projectDir = path.resolve(process.cwd(), "..");
const { combinedEnv } = loadEnvConfig(projectDir);

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
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || combinedEnv.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || combinedEnv.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;
