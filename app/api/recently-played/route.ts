import { getRecentlyPlayed } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getRecentlyPlayed();
    const { items } = await response.json();

    const songs = items.slice(0, 1).map((song: any) => ({
      title: song.track.name,
      link: song.track.external_urls.spotify,
      artist: song.track.artists.map((_artist: any) => _artist.name).join(", "),
    }));

    return NextResponse.json(songs, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Recently played API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}