// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async rewrites() {
    return [
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
        source: "/m/:path",
        destination: "https://res.cloudinary.com/jaysella/:path",
      },
    ];
  },
};

export default nextConfig;
