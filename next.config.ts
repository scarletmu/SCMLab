import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scarletmu.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
