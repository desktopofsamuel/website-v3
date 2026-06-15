import matter from "gray-matter";
import type { PhotoFrontmatter, PhotoGridItem } from "./photo-mdx-generator";

export type ParsedPhotoMdx = {
  frontmatter: PhotoFrontmatter;
  intro: string;
  gridItems: PhotoGridItem[];
};

const GRID_ITEM_REGEX =
  /<GridItem([^>]*)>(?:!\[([^\]]*)\]\(([^)]+)\)|<img[^>]+src=["']([^"']+)["'][^>]*>)\s*<\/GridItem>/g;

const SIMPLE_GRID_REGEX = /<SimpleGrid[\s\S]*?<\/SimpleGrid>/;

function parseColSpan(attrs: string): 1 | 2 {
  return /colSpan=(?:"2"|\{2\}|2)/.test(attrs) ? 2 : 1;
}

function normalizeImageSrc(src: string): string {
  if (src.startsWith("/static/")) return src;
  if (src.startsWith("static/")) return `/${src}`;
  return src;
}

export function parseGridItemsFromMdx(body: string): PhotoGridItem[] {
  const gridMatch = body.match(SIMPLE_GRID_REGEX);
  if (!gridMatch) return [];

  const gridBlock = gridMatch[0];
  const items: PhotoGridItem[] = [];

  for (const match of gridBlock.matchAll(GRID_ITEM_REGEX)) {
    const src = normalizeImageSrc(match[3] || match[4] || "");
    if (!src) continue;

    items.push({
      src,
      colSpan: parseColSpan(match[1] ?? ""),
    });
  }

  return items;
}

export function parseIntroFromMdx(body: string): string {
  const gridIndex = body.search(SIMPLE_GRID_REGEX);
  if (gridIndex === -1) return body.trim();
  return body.slice(0, gridIndex).trim();
}

export function parsePhotoMdx(content: string): ParsedPhotoMdx {
  const { data, content: body } = matter(content);

  const frontmatter: PhotoFrontmatter = {
    title: String(data.title ?? ""),
    date: String(data.date ?? "").slice(0, 10),
    path: data.path ? String(data.path) : undefined,
    cover: data.cover ? String(data.cover) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    draft: data.draft === true,
  };

  return {
    frontmatter,
    intro: parseIntroFromMdx(body),
    gridItems: parseGridItemsFromMdx(body),
  };
}

export function isValidPhotoFilename(filename: string): boolean {
  return /^[\w-]+\.mdx$/.test(filename);
}
