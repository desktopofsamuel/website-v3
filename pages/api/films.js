import Parser from "rss-parser";

const RSS_URL = "https://rss-proxy.onrender.com/letterboxd";

function fetcher(url) {
  let parser = new Parser();
  const result = parser.parseURL(url);
  console.log(result);
  return result;
}

/* Custom function to parse Letterboxd image size */
function imageParser(htmlString) {
  let imgLink = null;
  const searchTerm = `\"/></p>`;
  const imgTagPosition = htmlString.indexOf(searchTerm);
  const elements = htmlString.slice(14, imgTagPosition); // Delete string after the img tag
  imgLink = elements.replace("0-500-0-750", "0-200-0-300"); // Load a smaller image
  return imgLink;
}

export default async function Film(_, res) {
  const response = await fetcher(RSS_URL);
  const { items } = await response;

  const films = items.slice(0, 5).map((film) => ({
    image: imageParser(film.content),
    name: film.title,
    link: film.link,
  }));

  return res.status(200).json(films);
}
