import Layout from "components/Layout";
import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { NextPage } from "next";
import { sortByDate } from "@/utils";
import ListBlog from "@/components/ListBlog";
import ListFeed from "@/components/ListFeed";
import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import ListBlogDetail from "@/components/ListBlogDetail";
import NextLink from "@/components/NextLink";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

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
  // const { data: feedData } = useSWR<Props>("/api/feed", fetcher);
  return (
    <Layout
      title="Blog"
      description="A collection of posts I wrote about design process, technology and productivity."
    >
      <Heading variant="pagetitle">Blog</Heading>
      <Text>
        A collection of posts I wrote about design process, technology and
        productivity.
      </Text>
      {/* <Text variant="small">Feed</Text>
      <UnorderedList margin="0">
      {feedData && feedData.map((item: any, i: number) => (
         <ListFeed data={item} key={i} />
      ))}</UnorderedList> */}
      <Text variant="small">Featured posts</Text>
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4">
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
            <NextLink href="/blog/page/2">View More</NextLink>
          </Button>
        </Center>
      </Fade>
    </Layout>
  );
}
