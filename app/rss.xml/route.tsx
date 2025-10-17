import { NextResponse } from "next/server";
import RSS from "rss";
import { filteredPosts } from "@/lib/content";
import { sortByDate } from "../../utils";
import CONFIG from "../../config.js";

export async function GET() {
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

  filteredPosts
    .sort(sortByDate)
    .forEach((post) => {
      feed.item({
        title: post.title,
        description: post.body.raw,
        url: CONFIG.URL + `/${post.slug}`,
        date: post.date,
      });
    });

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=1200, stale-while-revalidate=600",
    },
  });
}
