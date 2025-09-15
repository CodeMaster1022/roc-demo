import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: Also disable TypeScript checking during builds if needed
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
