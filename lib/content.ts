import { allPosts, allWorks, allPhotos, Post, Work, Photo } from "contentlayer/generated";
import { unique } from "typescript-array-utils";
import kebabCase from "lodash.kebabcase";
import { sortByDate } from "@/utils";

// Filter out posts where page === true (these are page content, not blog posts)
const filteredPosts = allPosts.filter((post) => post.page !== true).sort(sortByDate);

// Filter and sort work projects
const filteredWorks = allWorks.filter((work) => !work.draft).sort(sortByDate);
const filteredFeaturedWorks = allWorks.filter((work) => work.feature === true && work.draft !== true).sort(sortByDate);

// Filter and sort photos
const filteredPhotos = allPhotos.filter((photo) => !photo.draft).sort(sortByDate);

// All tags used by blog posts
const listOfTags = unique(filteredPosts.flatMap((post) => post.tags));

type answerProps = {
  name: string;
  path: string;
};

// allTags with name and
const allTags = listOfTags.map((tag) => ({
  name: tag,
  path: `/tags/${kebabCase(tag)}`,
  count: filteredPosts.reduce((count, post) => count + (post.tags.includes(tag) ? 1 : 0), 0)
}));

const allPostsList = filteredPosts.map((post) => ({
  slug: post.slug,
  title: post.title,
  tags: post.tags,
  description: post.description,
  cover: post.cover,
  category: post.category,
  date: post.date,
}));

// All posts marked with a specific tag, convert from params to tag name
const postsWithTag = (tag: string): any => {
  // Search for Tag Name by Static Path
  const object: answerProps = allTags.find(
    (o) => o.path === `/tags/${tag}`
  ) as any;
  const results = allPostsList.filter((post) => post.tags.includes(object.name));
  // const filteredResults = results.map((post) => ({
  //   slug: post.slug,
  //   title: post.title,
  //   description: post.description,
  //   cover: post.cover,
  //   category: post.category,
  //   date: post.date,
  // }));
  // console.log(filteredResults);
  return results;
};

export { allTags, postsWithTag, allPostsList, filteredPosts, filteredWorks, filteredFeaturedWorks, filteredPhotos };
