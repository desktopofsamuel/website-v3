import { getRecentlyPlayed } from "@/lib/spotify";

export default async function RecentlyPlayed(_, res) {
  const response = await getRecentlyPlayed();
  const { items } = await response.json();
  // console.log(items);

  const songs = items.slice(0, 1).map((song) => ({
    title: song.track.name,
    link: song.track.external_urls.spotify,
    artist: song.track.artists.map((_artist) => _artist.name).join(", "),
  }));

  return res.status(200).json(songs);
}
