/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.informatica.com" },
      { protocol: "https", hostname: "*.talend.com" },
      { protocol: "https", hostname: "*.collibra.com" },
      { protocol: "https", hostname: "*.ataccama.com" },
      { protocol: "https", hostname: "*.experian.com" },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
};

module.exports = nextConfig;
