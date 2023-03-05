
import GithubSlugger from 'github-slugger'

type Heading = {
  text: string;
  level: number;
  id: string;
}

export function getHeadings(markdown: string): Heading[] {
   
  // Split the Markdown input into an array of lines
  const lines = markdown.split("\n");

  // Filter the lines to include only those that start with a hash character (#)
  const headings = lines.filter((line) => line.startsWith("#"));

  // Initialize an empty array to hold the results
  const result: Heading[] = [];

  // Loop over each heading line
  for (let i = 0; i < headings.length; i++) {
    const line = headings[i];

    // Use a regular expression to count the number of hash characters at the beginning of the line,
    // which indicates the heading level
    const level = line.match(/#+/g)?.[0].length || 0;

    // Use another regular expression to remove the hash characters and any leading whitespace,
    // as well as any Markdown links enclosed in square brackets and parentheses
    const text = line.replace(/#+\s+/g, "").replace(/\[(.*?)\]\(.*?\)/g, "$1");

    const slugger = new GithubSlugger()
    // Slugger the text
    
    const id = slugger.slug(text);
    // Add the result to the array
    result.push({ text, level, id });
  }

  // Return the array of results
  return result;
}