import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cc-west-usa.oss-us-west-1.aliyuncs.com" },
      { protocol: "https", hostname: "*.oss-us-west-1.aliyuncs.com" },
      { protocol: "https", hostname: "img.cjdropshipping.com" },
    ],
  },
  serverExternalPackages: ["@whiskeysockets/baileys", "pino"],
}

export default nextConfig
