import RSS from "rss";
import { allPosts, Post } from "contentlayer/generated";
import { sortByDate } from "../utils";
import CONFIG from "../config.js";

export async function getServerSideProps({ res }: any) {
  const feed = new RSS({
    title: CONFIG.TITLE,
    description: CONFIG.DESCRIPTION,
    feed_url: CONFIG.URL + `/rss.xml`,
    site_url: CONFIG.URL,
    managingEditor: CONFIG.AUTHOR_NAME,
    webMaster: CONFIG.AUTHOR_NAME,
    copyright: CONFIG.COPYRIGHT,
    language: CONFIG.LOCALE,
    pubDate: new Date().toLocaleString(),
    ttl: 60,
  });

  allPosts.sort(sortByDate).map((post) => ({
      title: post.title,
      description: post.body.raw,
      url: CONFIG.URL + `/${post.slug}`,
      date: post.date,
    }))
    .forEach((item) => {
      feed.item(item);
    });

  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=1200, stale-while-revalidate=600"
  );
  res.write(feed.xml({ indent: true }));
  res.end();

  return {
    props: {},
  };
}

export default function RSSFeed() {
  return null;
}

// writeFileSync("./public/rss.xml", feed.xml({ indent: true }));
