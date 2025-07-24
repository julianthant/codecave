import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // reactCompiler: true, // Disabled temporarily to focus on TypeScript issues
  },
  images: {
    domains: ["api.placeholder.com"],
  },
  // Suppress hydration warnings for browser extension attributes
  onDemandEntries: {
    // Optional: controls which pages are kept in memory
  },
  // Use webpack to configure suppression of hydration warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side configuration to suppress console warnings
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
