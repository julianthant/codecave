import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance Optimizations
  experimental: {
    // React 19 optimizations
    ppr: true, // Partial Prerendering for better streaming
    reactCompiler: true, // Enable React Compiler for automatic optimizations
    optimizeServerReact: true, // Optimize React tree shaking on server
    serverActions: {
      bodySizeLimit: "2mb", // Increase body size limit for better UX
    },
    turbo: {
      // Turbo optimizations
      memoryLimit: 1024,
    },
    webpackBuildWorker: true, // Use worker threads for webpack builds
    // Lazy loading optimizations
    scrollRestoration: true,
    serverComponentsExternalPackages: ["sharp", "three"],
  },

  // Image Optimizations
  images: {
    domains: ["api.placeholder.com", "localhost", "images.unsplash.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400, // 24 hours cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Compression and bundling
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Output optimization
  output: "standalone",
  
  // Performance monitoring
  analyticsId: process.env.VERCEL_ANALYTICS_ID,

  // Advanced caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },

  // Headers for performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=86400, stale-while-revalidate=43200",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Performance optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          ui: {
            name: "ui",
            test: /[\\/]components[\\/]ui[\\/]/,
            chunks: "all",
            priority: 30,
          },
        },
      },
    };

    // Tree shaking improvements
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    return config;
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: "/api/health",
        destination: "/api/healthcheck",
      },
    ];
  },
};

export default nextConfig;
