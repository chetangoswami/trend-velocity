import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Medusa backend URL for API calls
  env: {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  },

  // Image optimization for product images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.onrender.com",
      },
    ],
  },
};

export default nextConfig;
