import { allPosts, allWorks, allPhotos } from "contentlayer/generated";
import kebabCase from "lodash.kebabcase";
import { sortByDate } from "@/utils";

// Filter out posts where page === true (these are page content, not blog posts) and draft posts
const filteredPosts = allPosts.filter((post) => post.page !== true && !post.draft).sort(sortByDate);

// Filter and sort work projects
const filteredWorks = allWorks.filter((work) => !work.draft).sort(sortByDate);
const filteredFeaturedWorks = allWorks.filter((work) => work.feature === true && work.draft !== true).sort(sortByDate);

// Filter and sort photos
const filteredPhotos = allPhotos.filter((photo) => !photo.draft).sort(sortByDate);

// Tags in frontmatter are entered inconsistently (e.g. "Design", "design",
// "Design Journal"). Normalize to a kebab-case slug so equivalent tags collapse
// into a single canonical tag for grouping, counting, and routing.
const normalizeTag = (tag: string): string => kebabCase(tag);

type TagInfo = {
  name: string;
  path: string;
  slug: string;
  count: number;
};

// Build the tag list grouped by normalized slug. Within a single post, tags are
// de-duped by slug so a post is never counted twice for the same tag. The first
// raw label seen for a slug is kept as the display name.
const tagBySlug = new Map<string, TagInfo>();
for (const post of filteredPosts) {
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

const allTags = Array.from(tagBySlug.values());

const allPostsList = filteredPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  tags: post.tags,
  description: post.description,
  cover: post.cover,
  category: post.category,
  date: post.date,
}));

// All posts carrying a given tag, matched by normalized slug so the incoming
// route param (already kebab-case) lines up with however the tag was written.
const postsWithTag = (tag: string) => {
  const slug = normalizeTag(tag);
  return allPostsList.filter((post) =>
    post.tags.some((t) => normalizeTag(t) === slug)
  );
};

// Number of posts carrying a given tag (normalized). Use this everywhere a tag
// count is shown so counts stay consistent with the tag pages.
const countPostsWithTag = (tag: string): number => postsWithTag(tag).length;

export {
  allTags,
  postsWithTag,
  countPostsWithTag,
  normalizeTag,
  allPostsList,
  filteredPosts,
  filteredWorks,
  filteredFeaturedWorks,
  filteredPhotos,
};
