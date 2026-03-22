import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.globivaldetalles.com",
        pathname: "/storage/**",
      },
    ],
    // Serve large sizes for hero banners without excessive compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.globivaldetalles.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
