import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// print out the backend URL to verify it's being read correctly
console.log("Backend URL:", BACKEND_URL);

const nextConfig: NextConfig = {
  /* proxy settings */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },  
  turbopack: {
    root: __dirname, // ensures root = frontend folder
  },
};

export default nextConfig;
