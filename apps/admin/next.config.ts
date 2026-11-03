import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Shared workspace packages ship raw TS/TSX, so Next compiles them
  transpilePackages: ["@b2c/ui", "@b2c/types", "@b2c/api-client", "@b2c/mock-data"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
