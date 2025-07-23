import { getTopArtists } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getTopArtists();
    const { items } = await response.json();

    const artists = items.slice(0, 4).map((artist: any) => ({
      name: artist.name,
      image: artist.images[0].url,
      link: artist.external_urls.spotify,
    }));

    return NextResponse.json(artists, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Top artists API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}