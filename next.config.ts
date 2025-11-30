import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export - disables SSR, outputs to ./out */
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to succeed even if there are type errors
    // (useful when the repo includes non-web workspaces like Firebase Functions)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
