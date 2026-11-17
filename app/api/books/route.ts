import Parser from "rss-parser";
import { NextResponse } from "next/server";

const RSS_URL = "https://rss-proxy.onrender.com/oku";
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

function emptyBooks() {
  return NextResponse.json([], {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

export async function GET() {
  try {
    const upstream = await fetch(RSS_URL, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      const body = await upstream.text();
      console.error(
        `Books RSS upstream error (${upstream.status}):`,
        body.slice(0, 300)
      );
      return emptyBooks();
    }

    const xml = await upstream.text();
    const parser = new Parser();
    const result = await parser.parseString(xml);
    const items = Array.isArray(result.items) ? result.items : [];

    const books = items.slice(0, 4).map((book) => ({
      name: book.title,
      author: book.creator,
      link: book.link,
      content: book.content,
    }));

    return NextResponse.json(books, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch (error) {
    console.error("Books API error:", error);
    return emptyBooks();
  }
}
