import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reduces double-mount in dev; can help avoid WebGL context churn
  reactStrictMode: false,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default nextConfig;
