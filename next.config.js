/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Required for wagmi/viem in Next.js 14
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Image optimization for Web3 avatars and assets
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Allow all HTTPS images
    ],
  },
};

export default nextConfig;
