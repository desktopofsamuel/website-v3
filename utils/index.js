export const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

export const parseMarkdown = (markdownText, char) => {
  const charLimit = char || 500;
  const htmlText = markdownText
    // hide h3 title
    .toString()
    .replace(/^### (.*$)/gim, "")
    // hide h2 title
    .toString()
    .replace(/^## (.*$)/gim, "")
    // hide h1 title
    .toString()
    .replace(/^# (.*$)/gim, "")
    // replace italic to normal text
    .toString()
    .replace(/^\> (.*$)/gim, "$1")
    // replace bold to normal text
    .toString()
    .replace(/\*\*(.*)\*\*/gim, "$1")
    .toString()
    .replace(/\*(.*)\*/gim, "")
    .toString()
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "")
    .toString()
    .replace(/\[(.*?)\]\((.*?)\)/gim, "$1")
    .toString()
    .replace(/\n$/gim, "");

  return htmlText.trim().slice(0, charLimit);
}