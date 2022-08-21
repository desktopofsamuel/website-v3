const withPlugins = require('next-compose-plugins')
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const { withContentlayer } = require("next-contentlayer");

/**
 * @type {import('next').NextConfig}
 */

const NextConfig = {
  images: {
    domains: ["i.scdn.co", "a.ltrbxd.com"],
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

module.exports = withPlugins(
  [withContentlayer, withBundleAnalyzer],
  NextConfig
);
