import { getCurrentlyPlaying } from "@/lib/spotify";

export default async function CurrentPlaying(_, res) {
  const response = await getCurrentlyPlaying ();
  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false });
  }

  const song = await response.json();
  // console.log(song.item.images);

  const isPlaying = song.is_playing;
  const title = song.item.name;
  const songLink = song.item.external_urls.spotify;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  // const songImage = song.item.images.map(({_image}) => _image.url).join(", ");

  return res.status(200).json({
    isPlaying,
    title,
    songLink,
    artist,
    // songImage,
  });
}
