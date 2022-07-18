import { getTopArtists } from "@/lib/spotify";

export default async function TopArtist(_, res) {
  const response = await getTopArtists();
  const { items } = await response.json();

  const artists = items.slice(0, 4).map((artist) => ({
    name: artist.name,
    image: artist.images[0].url,
    link: artist.external_urls.spotify,
  }));

  return res.status(200).json(artists);
}
