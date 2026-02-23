import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.aws.amazon.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
