import { allPosts, Post } from "contentlayer/generated";
import { unique } from "typescript-array-utils";
import kebabCase from "lodash.kebabcase";

// All tags used by blog posts
const listOfTags = unique(allPosts.flatMap((post) => post.tags));

type answerProps = {
  name: string;
  path: string;
};

// allTags with name and
const allTags = listOfTags.map((tag) => ({
  name: tag,
  path: `/tags/${kebabCase(tag)}`,
  count: allPosts.reduce((count, post) => count + (post.tags.includes(tag) ? 1 : 0), 0)
}));

const allPostsList = allPosts.map((post) => ({
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

export { allTags, postsWithTag, allPostsList };
