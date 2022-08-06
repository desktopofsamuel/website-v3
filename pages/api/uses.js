import { getUsesEntries } from "@/lib/notion"

export default async function UsesEntries(_, res) {
  const response = await getUsesEntries();
  
  console.log(response)

  // const entries = items.map((item) => ({
  //   nameEn: item.properties.Link.title
  // }))

  return res.status(200).json({ response });
}

// const tracks = items.slice(0, 5).map((track) => ({
//   artist: track.artists.map((_artist) => _artist.name).join(", "),
//   songUrl: track.external_urls.spotify,
//   title: track.name,
// }));