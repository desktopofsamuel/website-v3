import { getCurrentlyPlaying } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await getCurrentlyPlaying();
    
    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const songLink = song.item.external_urls.spotify;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");

    return NextResponse.json({
      isPlaying,
      title,
      songLink,
      artist,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Currently playing API error:', error);
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }
}