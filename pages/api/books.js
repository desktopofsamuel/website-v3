import Parser from "rss-parser";

const RSS_URL = "https://damp-lowlands-80262.herokuapp.com/oku";

function fetcher(url) {
  let parser = new Parser();
  const result = parser.parseURL(url);
  console.log(result);
  return result;
}

export default async function Book(_, res) {
  const response = await fetcher(RSS_URL);
  const { items } = await response;

  const books = items.slice(0, 4).map((book) => ({
    name: book.title,
    author: book.creator,
    link: book.link,
    content: book.content,
  }));

  return res.status(200).json(books);
}
