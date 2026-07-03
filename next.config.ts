import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in the user's home directory
  // makes Turbopack infer the wrong root. __dirname is this project's root.
  turbopack: {
    root: __dirname,
  },
  // Hide the on-screen dev route indicator (dev-only overlay, not part of the design).
  devIndicators: false,
};

export default nextConfig;
