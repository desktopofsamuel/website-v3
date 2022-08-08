import Layout from "components/Layout";
import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { NextPage } from "next";
import { sortByDate } from "@/utils";
import ListBlog from "@/components/ListBlog";
import { Button, Center, Grid, Heading, Text } from "@chakra-ui/react";
import ListBlogDetail from "@/components/ListBlogDetail";
import NextLink from "@/components/NextLink";

const Fade = require("react-reveal/Fade");

export const getStaticProps: GetStaticProps<{
  posts: Post[];
}> = () => {
  return {
    props: {
      posts: allPosts,
    },
  };
};

export default function BlogListPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <Heading variant="pagetitle">Blog</Heading>
      <p>
        A collection of posts I wrote about design process, technology and
        productivity.
      </p>
      <Text variant="small">Featured posts</Text>
      <Grid gridTemplateColumns={{ sm: "1fr", md: "1fr 1fr" }} gap="4">
        <Fade bottom>
          {posts
            .filter((post) => post.feature === true)
            .sort(sortByDate)
            .map((post) => (
              <ListBlog key={post.slug} data={post} />
            ))}
        </Fade>
      </Grid>
      <Text variant="small">All posts</Text>
      <Fade bottom>
        {posts
          .filter((post) => post.feature !== true)
          .sort(sortByDate)
          .slice(0, 6)
          .map((post) => (
            <ListBlogDetail key={post.slug} data={post} />
          ))}
        <Center>
          <Button>
            <NextLink href="/blog/page/2" variant="noeffect">View More</NextLink>
          </Button>
        </Center>
      </Fade>
    </Layout>
  );
}
