/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_NEXT_BASE_URL: process.env.PUBLIC_NEXT_BASE_URL,
    PUBLIC_NEXT_OOS_TOKEN: process.env.PUBLIC_NEXT_OOS_TOKEN,
  },
};

export default nextConfig;
