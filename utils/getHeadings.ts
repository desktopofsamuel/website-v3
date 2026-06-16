import GithubSlugger from "github-slugger";

type Heading = {
  text: string;
  level: number;
  id: string;
};

export function getHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings = lines.filter((line) => line.startsWith("#"));
  const result: Heading[] = [];
  const slugger = new GithubSlugger();

  for (const line of headings) {
    const level = line.match(/#+/g)?.[0].length || 0;
    const text = line
      .replace(/#+\s+/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .trim();

    result.push({ text, level, id: slugger.slug(text) });
  }

  return result;
}
