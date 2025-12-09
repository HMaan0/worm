import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  typedRoutes: true,
  reactCompiler: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "wallpapers.com" },
      { protocol: "https", hostname: "tinyurl.com" },
    ],
  },
};

export default nextConfig;
