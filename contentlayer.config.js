import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypePrism from "rehype-prism-plus";
import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkUnwrapImages from "remark-unwrap-images";
import kebabCase from "lodash.kebabcase";
import { parseMarkdown, parseReadTime } from "./utils";
import toc from "@jsdevtools/rehype-toc";
import remarkGfm from "remark-gfm";

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
      required: true,
    },
    feature: {
      type: "boolean",
      required: false,
    },
    cover: {
      type: "string",
      required: false,
    },
    category: {
      type: "enum",
      options: ["Ctrl Alt Setup", "Design Journal"],
      default: "Design Journal",
    },
    draft: {
      type: "boolean",
      required: false,
    },
    tldr: {
      type: "string",
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) =>
        post.path ? `${post.path}` : `${kebabCase(post.title)}`,
    },
    excerpt: {
      type: "string",
      resolve: (post) =>
        post.tldr ? post.tldr : parseMarkdown(post.body.raw, 155),
    },
    description: {
      type: "string",
      resolve: (post) => parseMarkdown(post.body.raw, 300),
    },
    timetoread: {
      type: "number",
      resolve: (post) => parseReadTime(post.body.raw)
    }
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
    subtitle: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    year: {
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
    cover: {
      type: "string",
      required: false,
    },
    photo: {
      type: "string",
      required: false,
    },
    color: {
      type: "string",
      required: false,
    },
    url: {
      type: "string",
      required: false,
    },
    category: {
      type: "enum",
      options: ["UI/UX Design", "Web Design", "Brand Design"],
      default: "UI/UX Design",
    },
    draft: {
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
    excerpt: {
      type: "string",
      resolve: (post) => parseMarkdown(post.body.raw, 200),
    },
  },
}));

export const Photo = defineDocumentType(() => ({
  name: "Photo",
  contentType: "mdx",
  // Location of Post source files (relative to `contentDirPath`)
  filePathPattern: "photo/**/*.mdx",
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
    cover: {
      type: "string",
      required: false,
    },
    draft: {
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
    excerpt: {
      type: "string",
      resolve: (post) => parseMarkdown(post.body.raw, 155),
    },
    description: {
      type: "string",
      resolve: (post) => parseMarkdown(post.body.raw, 300),
    },
  },
}));

export default makeSource({
  // Location of source files for all defined documentTypes
  contentDirPath: "content",
  documentTypes: [Post, Work, Photo],
  mdx: {
    remarkPlugins: [
      [remarkGfm],
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
