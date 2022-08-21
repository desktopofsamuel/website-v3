import { allPosts, Post } from "contentlayer/generated";
import { unique } from "typescript-array-utils";
import kebabCase from "lodash.kebabcase";
import groupby from "lodash.groupby";





// All Unique Tags in Blog
const listOfTags: string[] = unique(allPosts.flatMap((post) => post.tags).sort());

{console.log(listOfTags)}

type answerProps = {
  name: string;
  path: string;
};

// allTags with name and
const allTags = listOfTags.map((tag) => ({
  name: tag,
  path: `/tags/${kebabCase(tag)}`,
}));

// All posts marked with a specific tag, convert from params to tag name
const postsWithTag = (tag: string): Post[] => {
  // Search for Tag Name by Static Path
  const object: answerProps = allTags.find(
    (o) => o.path === `/tags/${tag}`
  ) as any;
  const result = allPosts.filter((post) => post.tags.includes(object.name));
  return result;
};

export { allTags, postsWithTag };
