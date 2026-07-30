import { getRecentlyPlayed } from "@/lib/spotify";
import { createSpotifyResponse } from "@/lib/spotify-route";

const CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=120";

export async function GET() {
  return createSpotifyResponse({
    label: "Recently played",
    request: getRecentlyPlayed,
    fallback: [],
    cacheControl: CACHE_CONTROL,
    parse: (data) => {
      const items = (data as { items?: any[] }).items;
      if (!items?.length) return null;

      return items.slice(0, 1).map((song) => ({
        title: song.track.name,
        link: song.track.external_urls.spotify,
        artist: song.track.artists.map((artist: { name: string }) => artist.name).join(", "),
      }));
    },
  });
}
