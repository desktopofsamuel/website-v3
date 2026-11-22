import kebabCase from "lodash.kebabcase";

export const normalizeTag = (tag: string): string => kebabCase(tag);

export type TagInfo = {
  name: string;
  path: string;
  slug: string;
  count: number;
};

export function buildTagIndex(posts: { tags: string[] }[]): TagInfo[] {
  const tagBySlug = new Map<string, TagInfo>();
  for (const post of posts) {
    const seenInPost = new Set<string>();
    for (const rawTag of post.tags) {
      const slug = normalizeTag(rawTag);
      if (!slug || seenInPost.has(slug)) continue;
      seenInPost.add(slug);
      const existing = tagBySlug.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        tagBySlug.set(slug, {
          name: rawTag,
          path: `/tags/${slug}`,
          slug,
          count: 1,
        });
      }
    }
  }
  return Array.from(tagBySlug.values());
}

export function postHasTag(post: { tags: string[] }, tag: string): boolean {
  const slug = normalizeTag(tag);
  return post.tags.some((t) => normalizeTag(t) === slug);
}
