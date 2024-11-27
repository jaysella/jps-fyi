module.exports = {
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
