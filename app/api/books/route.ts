import Parser from "rss-parser";
import { NextResponse } from "next/server";

const RSS_URL = "https://rss-proxy.onrender.com/oku";

async function fetcher(url: string) {
  const parser = new Parser();
  const result = await parser.parseURL(url);
  return result;
}

export async function GET() {
  try {
    const response = await fetcher(RSS_URL);
    const { items } = response;

    const books = items.slice(0, 4).map((book: any) => ({
      name: book.title,
      author: book.creator,
      link: book.link,
      content: book.content,
    }));

    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Books API error:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}