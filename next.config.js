/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [],
    },
    typescript: {
        // Allow production builds to successfully complete even with type errors
        ignoreBuildErrors: true,
    },
    eslint: {
        // Allow production builds to successfully complete even with ESLint errors
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
