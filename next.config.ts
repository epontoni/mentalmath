import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '*.trycloudflare.com'
  ],
};

export default nextConfig;
