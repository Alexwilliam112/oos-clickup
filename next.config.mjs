/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_NEXT_BASE_URL: process.env.PUBLIC_NEXT_BASE_URL,
  },
};

export default nextConfig;
