import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
