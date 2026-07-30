import { getTopArtists } from "@/lib/spotify";
import { createSpotifyResponse } from "@/lib/spotify-route";

const CACHE_CONTROL = "public, s-maxage=30, stale-while-revalidate=120";

export async function GET() {
  return createSpotifyResponse({
    label: "Top artists",
    request: getTopArtists,
    fallback: [],
    cacheControl: CACHE_CONTROL,
    parse: (data) => {
      const items = (data as { items?: any[] }).items;
      if (!items?.length) return null;

      return items.slice(0, 4).map((artist) => ({
        name: artist.name,
        image: artist.images[0]?.url,
        link: artist.external_urls.spotify,
      }));
    },
  });
}
