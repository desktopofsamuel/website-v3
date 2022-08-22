const { withContentlayer } = require("next-contentlayer");

/**
 * @type {import('next').NextConfig}
 */

module.exports = withContentlayer({
  images: {
    domains: ["i.scdn.co", "a.ltrbxd.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
});
