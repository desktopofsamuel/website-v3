import { getTopTracks } from "@/lib/spotify";
import { createSpotifyResponse } from "@/lib/spotify-route";

const CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=120";

export async function GET() {
  return createSpotifyResponse({
    label: "Top tracks",
    request: getTopTracks,
    fallback: { tracks: [] },
    cacheControl: CACHE_CONTROL,
    parse: (data) => {
      const items = (data as { items?: any[] }).items;
      if (!items?.length) return null;

      return {
        tracks: items.slice(0, 5).map((track) => ({
          artist: track.artists.map((artist: { name: string }) => artist.name).join(", "),
          songUrl: track.external_urls.spotify,
          title: track.name,
        })),
      };
    },
  });
}
