import Parser from "rss-parser";
import { NextResponse } from "next/server";

const RSS_URL = "https://rss-proxy.onrender.com/letterboxd";

async function fetcher(url: string) {
  const parser = new Parser();
  const result = await parser.parseURL(url);
  return result;
}

function imageParser(htmlString: string): string {
  let imgLink = "";
  const searchTerm = `"/></p>`;
  const imgTagPosition = htmlString.indexOf(searchTerm);
  if (imgTagPosition !== -1) {
    const elements = htmlString.slice(14, imgTagPosition);
    imgLink = elements.replace("0-500-0-750", "0-200-0-300");
  }
  return imgLink;
}

export async function GET() {
  try {
    const response = await fetcher(RSS_URL);
    const { items } = response;

    const films = items.slice(0, 5).map((film: any) => ({
      image: imageParser(film.content),
      name: film.title,
      link: film.link,
    }));

    return NextResponse.json(films, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Films API error:', error);
    return NextResponse.json({ error: 'Failed to fetch films' }, { status: 500 });
  }
}