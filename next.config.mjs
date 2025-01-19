// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "media.jps.fyi",
          },
        ],
        destination: "https://www.jps.fyi/wall",
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "api.jps.fyi",
          },
        ],
        destination: "https://www.jps.fyi/wall",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "media.jps.fyi",
          },
        ],
        destination: "https://res.cloudinary.com/jaysella/:path*",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "api.jps.fyi",
          },
        ],
        destination: "/api/:path*",
      },
      {
        source: "/m/:path",
        destination: "https://res.cloudinary.com/jaysella/:path",
      },
    ];
  },
};

export default nextConfig;
