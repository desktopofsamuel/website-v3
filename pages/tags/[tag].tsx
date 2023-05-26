import Layout from "components/Layout";
import { Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { NextPage } from "next";
import { sortByDate } from "@/utils";
import { Box, Grid, Heading, Text } from "@chakra-ui/react";
import ListBlogDetail from "@/components/ListBlogDetail";
import { allTags, postsWithTag } from "@/lib/content";

export const getStaticPaths = () => {
  const paths = allTags.map((tag) => tag.path);
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  tag: String;
}> = ({ params }: any) => {
  return {
    props: {
      posts: postsWithTag(params.tag),
      tag: params.tag,
    },
  };
};

export default function TagPage({
  tag,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Box>
        <Heading>{tag}</Heading>
        <Text display="inline">({posts.length})</Text>
      </Box>
      {posts?.sort(sortByDate).map((post) => (
        <ListBlogDetail key={post.slug} data={post} />
      ))}
    </Layout>
  );
}
