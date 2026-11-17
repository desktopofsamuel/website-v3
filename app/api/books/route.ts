import { NextResponse } from "next/server";

export const runtime = "edge";

const RSS_URL = "https://oku.club/rss/collection/UfVaj";
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

const UPSTREAM_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://oku.club/",
};

function emptyBooks() {
  return NextResponse.json([], {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(block: string, name: string) {
  const escaped = name.replace(":", "\\:");
  const match = block.match(
    new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`)
  );
  return match ? decodeXml(match[1]) : "";
}

export async function GET() {
  try {
    const upstream = await fetch(RSS_URL, {
      headers: UPSTREAM_HEADERS,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      console.error(`Books RSS upstream error (${upstream.status})`);
      return emptyBooks();
    }

    const xml = await upstream.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    const books = items.slice(0, 4).map((item) => {
      const block = item[1] ?? "";
      return {
        name: tag(block, "title"),
        author: tag(block, "dc:creator"),
        link: tag(block, "link"),
        content: tag(block, "description"),
      };
    });

    return NextResponse.json(books, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    console.error("Books API error:", error);
    return emptyBooks();
  }
}
