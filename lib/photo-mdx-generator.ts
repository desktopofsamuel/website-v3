export type PhotoGridItem = {
  src: string;
  colSpan: 1 | 2;
};

export type PhotoFrontmatter = {
  title: string;
  date: string;
  path?: string;
  cover?: string;
  tags?: string[];
  draft?: boolean;
};

function gridItemAttributes(item: PhotoGridItem): string {
  if (item.colSpan === 2) {
    return " colSpan={2}";
  }
  return "";
}

export function generateGridItemMdx(item: PhotoGridItem): string {
  const imageRef = `![](${item.src})`;
  return `  <GridItem${gridItemAttributes(item)}>${imageRef}</GridItem>`;
}

export function generateGridMdx(items: PhotoGridItem[]): string {
  if (items.length === 0) {
    return "";
  }

  const rows = items.map(generateGridItemMdx).join("\n");
  return `<SimpleGrid columns={2} gap={4}>\n${rows}\n</SimpleGrid>`;
}

export function generateFrontmatter(fields: PhotoFrontmatter): string {
  const lines: string[] = ["---"];

  if (fields.path) {
    lines.push(`path: "${fields.path}"`);
  }

  lines.push(`title: "${fields.title}"`);
  lines.push(`date: "${fields.date}"`);

  if (fields.cover) {
    lines.push(`cover: "${fields.cover}"`);
  }

  if (fields.tags && fields.tags.length > 0) {
    lines.push(`tags: [${fields.tags.map((t) => `"${t}"`).join(", ")}]`);
  }

  if (fields.draft) {
    lines.push(`draft: true`);
  }

  lines.push("---");
  return lines.join("\n");
}

export function generateFullMdx(
  frontmatter: PhotoFrontmatter,
  intro: string,
  items: PhotoGridItem[],
): string {
  const parts: string[] = [generateFrontmatter(frontmatter), ""];

  const trimmedIntro = intro.trim();
  if (trimmedIntro) {
    parts.push(trimmedIntro, "");
  }

  const grid = generateGridMdx(items);
  if (grid) {
    parts.push(grid);
  }

  return parts.join("\n").trimEnd() + "\n";
}

export function suggestCover(items: PhotoGridItem[]): string | undefined {
  const fullWidth = items.find((item) => item.colSpan === 2);
  if (fullWidth) return fullWidth.src;
  return items[0]?.src;
}
