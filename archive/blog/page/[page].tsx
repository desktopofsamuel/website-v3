import Layout from "@/components/Layout";
import React from "react";
import { allPosts, Post } from "contentlayer/generated";
import { allPostsList } from "@/lib/content";
import ListBlog from "@/components/ListBlog";
import { Heading, SimpleGrid } from "@chakra-ui/react";
import { sortByDate } from "@/utils";
import Pagination from "@/components/Pagination";
import { GetStaticProps } from "next/types";
import { POSTS_PER_PAGE } from "../../../config"

export async function getStaticPaths() {
  const numPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  let paths = [];
  for (let i = 1; i <= numPages; i++) {
    paths.push({
      params: { page: i.toString() },
    });
  }

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  numPages: number;
  currentPage: number;
}> = ({ params }: any) => {
  const page = parseInt((params && params.page) || 1);
  const pageIndex = page - 1;
  const posts = allPosts
    .sort(sortByDate)
    .slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);
  const numPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return {
    props: {
      posts: posts,
      numPages,
      currentPage: page,
    },
  };
};

export default function BlogPaginatedPage({
  posts,
  numPages,
  currentPage,
}: {
  posts: Post[];
  numPages: number;
  currentPage: number;
}) {
  return (
    <Layout title={`All blog posts - ${currentPage} of ${numPages}`}>
      <Heading>
        All blog posts - {currentPage} of {numPages}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {posts.map((post) => (
          <ListBlog key={post.slug} data={post} />
        ))}
      </SimpleGrid>
      <Pagination currentPage={currentPage} numPages={numPages} />
    </Layout>
  );
}
