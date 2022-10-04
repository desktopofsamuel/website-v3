const CONFIG = require("./config");

export default {
  titleTemplate: `%s | ${CONFIG.TITLE}`,
  defaultTitle: CONFIG.TITLE,
  description: CONFIG.DESCRIPTION,
  url: CONFIG.URL,
  openGraph: {
    title: "Desktop of Samuel",
    description: "UI/UX 設計師，談談科技、Gadget心得。",
    url: CONFIG.URL,
    images: [
      {
        url: CONFIG.URL + CONFIG.OG_IMAGE,
      },
    ],
    type: "website",
    locale: CONFIG.LOCALE,
    site_name: CONFIG.TITLE,
    publisher: CONFIG.TITLE,
  },
  twitter: {
    handle: "@desktopofsamuel",
    site: "@desktopofsamuel",
    cardType: "summary_large_image",
  },
  additionalLinkTags: [
    {
      rel: "icon",
      href: "https://desktopofsamuel.com/favicon.png",
    },
    {
      rel: "apple-touch-icon",
      href: "https://desktopofsamuel.com/touch-icon-ipad.jpg",
      sizes: "76x76",
    },
  ],
};
