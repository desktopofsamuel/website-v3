import { getCurrentlyPlaying, SpotifyAuthError } from "@/lib/spotify";
import { NextResponse } from "next/server";

const NOT_PLAYING = { isPlaying: false };

export async function GET() {
  try {
    const response = await getCurrentlyPlaying();

    if (response.status === 204 || !response.ok) {
      if (!response.ok && response.status !== 204) {
        const error = await response.text();
        console.error(`Currently playing Spotify API error (${response.status}):`, error);
      }

      return NextResponse.json(NOT_PLAYING, {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
    }

    const song = await response.json();

    if (!song?.item) {
      return NextResponse.json(NOT_PLAYING);
    }

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item.name,
      songLink: song.item.external_urls.spotify,
      artist: song.item.artists.map((artist: { name: string }) => artist.name).join(", "),
    }, {
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      console.error("Currently playing auth error:", error.message);
    } else {
      console.error("Currently playing API error:", error);
    }

    return NextResponse.json(NOT_PLAYING);
  }
}
