import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypePrism from "rehype-prism-plus";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkUnwrapImages from "remark-unwrap-images";
import kebabCase from "lodash.kebabcase";

export const Post = defineDocumentType(() => ({
  name: "Post",
  contentType: "mdx",
  // Location of Post source files (relative to `contentDirPath`)
  filePathPattern: "posts/**/*.mdx",
  // At the time of writing, we also have to define the `fields`
  // option to prevent an error on generation. We'll discuss
  // this option later. For now, we'll add an empty object.
  fields: {
    title: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    path: {
      type: "string",
      required: false,
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    feature: {
      type: "boolean",
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) =>
        post.path ? `${post.path}` : `${kebabCase(post.title)}`,
    },
  },
}));

export const Work = defineDocumentType(() => ({
  name: "Work",
  contentType: "mdx",
  // Location of Post source files (relative to `contentDirPath`)
  filePathPattern: "work/**/*.mdx",
  // At the time of writing, we also have to define the `fields`
  // option to prevent an error on generation. We'll discuss
  // this option later. For now, we'll add an empty object.
  fields: {
    title: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
      required: true,
    },
    path: {
      type: "string",
      required: false,
    },
    tags: {
      type: "list",
      of: { type: "string" },
    },
    feature: {
      type: "boolean",
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) =>
        post.path ? `${post.path}` : `${kebabCase(post.title)}`,
    },
  },
}));

export default makeSource({
  // Location of source files for all defined documentTypes
  contentDirPath: "content",
  documentTypes: [Post, Work],
  mdx: {
    remarkPlugins: [
      [remarkUnwrapImages],
    ],
    rehypePlugins: [
      [rehypePrism],
      [rehypeSlug],
      [rehypeAutolinkHeadings],
      [rehypeAccessibleEmojis],
    ],
  },
});
