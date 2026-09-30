import type { NextConfig } from "next";

// Site 100% estático (out/) para Cloudflare Pages: sem servidor, tudo client-side.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
