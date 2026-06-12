import type { NextConfig } from "next";

if (!process.env.API_BASE_URL) {
  console.warn("[next.config] WARNING: API_BASE_URL is not set — API proxy rewrites will not work.");
}

const nextConfig: NextConfig = {
  async rewrites() {
    if (!process.env.API_BASE_URL) return [];
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${process.env.API_BASE_URL}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
