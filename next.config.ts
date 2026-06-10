import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://20.233.200.211:8001"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
