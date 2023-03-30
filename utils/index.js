export const sortByDate = (a, b) => {
  return new Date(b.date) - new Date(a.date);
};

export const parseReadTime = (markdown) => {
  // Determine the number of words in the post content
  const wordCount = markdown.split(/\s+/g).length;
  // Assuming an average reading speed of 200 words per minute
  const wordsPerMinute = 200;
  // Calculate the estimated reading time in minutes
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}

export const parseMarkdown = (markdownText, char) => {
  const charLimit = char || 500;
  const htmlText = markdownText
    .toString()
    .replace(/^### (.*$)/gim, "")
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

// /* https://twitter.com/JoshWComeau/status/1334649422962192386 */ 
// export function getHeadings(source) {
//   // Get each line individually, and filter out anything that
//   // isn't a heading.
//   const headingLines = source
//     .split('\n')
//     .filter((line) => {
//       return line.match(/^###*\s/);
//     })
//   // Transform the string '## Some text' into an object
//   // with the shape '{ text: 'Some text', level: 2 }'
//   return headingLines.map((raw) => {
//       const text = raw.replace(/^###*\s/, '');
//       // I only care about h2 and h3.
//       // If I wanted more levels, I'd need to count the
//       // number of #s.
//       const level = raw.slice(0, 3) === '###' ? 3 : 2;
 
//       return { text, level };
//     });
 
//   return headingLines;
// }