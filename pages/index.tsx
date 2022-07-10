import Layout from "components/Layout";
import { allPosts, allWorks, Post, Work } from "contentlayer/generated";
import { Grid, Heading, Text, Button, SimpleGrid, Box, Stack } from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "@/utils";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ListBlog from "@/components/ListBlog";
import ListPortfolio from "@/components/ListPortfolio";
import NextImage from "@/components/NextImage";

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  works: Work[];
}> = () => {
  return {
    props: {
      posts: allPosts,
      works: allWorks,
    },
  };
};

export default function IndexPage({
  posts,
  works,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <h1>Desktop of Samuel</h1>
      <small>#01</small>
      <Heading>Interaction and Experience Design</Heading>
      <Text>
        Extensive experience delivering products in corporations and start-ups
      </Text>
      <Link href="/work">
        <Button>View Process</Button>
      </Link>
      {works
        .filter((post) => post.feature === true)
        .sort(sortByDate)
        .map((post) => (
          <ListPortfolio key={post.slug} data={post} />
        ))}
      <small>#02</small>
      <Heading>Notes on Design & Technology</Heading>
      <Text>I write about design, technology and productivity.</Text>
      <Link href="/blog">
        <Button>Read my blog</Button>
      </Link>
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={4}>
        {posts.sort(sortByDate).map((post) => (
          <ListBlog key={post.slug} data={post} />
        ))}
      </SimpleGrid>
      <small>#03</small>
      <Heading>Tools & Resources</Heading>
      <Text>
        Best resources and tools I have been using. Guide on getting started in
        design & code.
      </Text>
      <Link href="/resources">
        <Button>My awesome setup</Button>
      </Link>
      <Box  marginLeft="50%" width="100vw" style={{  'transform': "translateX(-50%)" }}>
      <Grid gridTemplateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr"}} >
        {posts.sort(sortByDate).slice(0,4).map((post) => (
          <Box key={post.slug}><NextImage src={post.cover} layout="fill"/></Box>
        ))}
      <Stack textAlign="center">
        <small>#04</small>
        <Heading>Through the lens</Heading>
        <Text>Sets of photos according to cities that I have visited.</Text>
        <Link href="/photo">
          <Button>My photos shot around the world</Button>
        </Link>
      </Stack>
      {posts.sort(sortByDate).slice(4,8).map((post) => (
          <Box key={post.slug}><NextImage src={post.cover} layout="fill"/></Box>
        ))}
      </Grid>
      </Box>
    </Layout>
  );
}
