import { allPosts, allWorks, allPhotos } from "contentlayer/generated";
import { sortByDate } from "@/utils";
import { buildTagIndex, normalizeTag, postHasTag } from "@/lib/tags";

const filteredPosts = allPosts.filter((post) => post.page !== true && !post.draft).sort(sortByDate);

const filteredWorks = allWorks.filter((work) => !work.draft).sort(sortByDate);
const filteredFeaturedWorks = allWorks.filter((work) => work.feature === true && work.draft !== true).sort(sortByDate);

const filteredPhotos = allPhotos.filter((photo) => !photo.draft).sort(sortByDate);

const allTags = buildTagIndex(filteredPosts);

const allPostsList = filteredPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  tags: post.tags,
  description: post.description,
  cover: post.cover,
  category: post.category,
  date: post.date,
}));

const postsWithTag = (tag: string) =>
  allPostsList.filter((post) => postHasTag(post, tag));

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
