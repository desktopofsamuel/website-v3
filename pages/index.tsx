import Layout from "components/Layout";
import {
  allPhotos,
  allPosts,
  allWorks,
  Post,
  Work,
  Photo,
} from "contentlayer/generated";
import {
  Grid,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Box,
  Flex,
  VStack,
  HStack,
} from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "../utils";
import type { NextPage } from "next";
import { useRef } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ListBlog from "@/components/ListBlog";
import ListPortfolio from "@/components/ListPortfolio";
import Image from "next/image";
import CardBook from "@/components/CardBook";
import CardCurrentlyPlaying from "@/components/CardCurrentlyPlaying";
import CardMusic from "@/components/CardMusic";
import CardFilms from "@/components/CardFilms";
import NextLink from "@/components/NextLink";
import NextImage from "@/components/NextImage";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Fade = require("react-reveal/Fade");

export const getStaticProps: GetStaticProps<{
  posts: Post[];
  works: Work[];
  photos: Photo[];
}> = () => {
  return {
    props: {
      posts: allPosts.sort(sortByDate).slice(0, 4),
      works: allWorks.filter((post) => post.feature === true && post.draft !== true).sort(sortByDate),
      photos: allPhotos.sort(sortByDate).slice(0, 8),
    },
  };
};

export default function IndexPage({
  posts,
  works,
  photos,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
    // keywords="Samuel Wong, Hong Kong, UI, UX, User Interface Design, User Experience Design, Product Design, Design Thinking, Product Development, Brand Design"
    >
      <Head>
        <meta
          name="follow.it-verification-code"
          content="aYHmMlGswgxauPT7REPs"
        />
      </Head>
      <Flex
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="baseline"
      >
        <Heading variant="pagetitle" as="h1">
          Desktop of Samuel
        </Heading>
      </Flex>
      <Text color="secondarytext">
        Full-stack UI/UX designer crafting websites & mobile applications with
        bespoke experience.
      </Text>
      <SimpleGrid columns={2} row={2} gap={4}>
        <CardBook />
        <CardMusic />
        <CardCurrentlyPlaying />
        <CardFilms />
      </SimpleGrid>
      <Box my="8">
        <Heading variant="title">Interaction and Experience Design</Heading>
        <Text>
          Extensive experience delivering products in corporations and start-ups
        </Text>

        <Link href="/work" legacyBehavior>
          <Button>View Process</Button>
        </Link>
        <Fade bottom>
          {works.map((post) => (
            <ListPortfolio key={post.slug} data={post} />
          ))}
        </Fade>
      </Box>

      <Heading variant="title">Notes on Design & Technology</Heading>
      <Text>I write about design, technology and productivity.</Text>
      <Link href="/blog" legacyBehavior>
        <Button>Read my blog</Button>
      </Link>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {posts.map((post) => (
          <ListBlog key={post.slug} data={post} />
        ))}
      </SimpleGrid>
      <Box my="8">
        <Heading variant="title">Tools & Resources</Heading>
        <Text>
          Best resources and tools I have been using. Guide on getting started
          in design & code.
        </Text>
        <Link href="/resources" legacyBehavior>
          <Button>My awesome setup</Button>
        </Link>
      </Box>
      <Box
        marginLeft="50%"
        width="calc(100vw - 20px)"
        style={{ transform: "translateX(-50%)" }}
      >
        <Grid
          gridTemplateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          }}
        >
          {photos.slice(0, 4).map((post) => (
            <Link href={`/photo/${post.slug}`} key={post.slug} legacyBehavior>
              <Box role="group" overflow="hidden" position="relative">
                {/* <Image src={post.cover} alt={post.title} w="300px" h="200px" layout="fill" objectFit="cover"/> */}
                <NextImage
                  src={post.cover}
                  alt={post.title}
                  // layout="raw"
                  transition="0.5s all ease-in-out"
                  _groupHover={{ transform: "scale(1.05)" }}
                />
              </Box>
            </Link>
          ))}
          <VStack p="8" justifyContent="center">
            <Heading fontSize="2xl">Through the lens</Heading>
            <Text>Sets of photos according to cities that I have visited.</Text>
            <Link href="/photo" legacyBehavior>
              <Button>My photos shot around the world</Button>
            </Link>
          </VStack>
          {photos.slice(4, 8).map((post) => (
            <Link href={`/photo/${post.slug}`} key={post.slug} legacyBehavior>
              <Box role="group" overflow="hidden">
                <NextImage
                  src={post.cover}
                  alt={post.title}
                  layotu="fill"
                  transition="0.5s all ease-in-out"
                  _groupHover={{ transform: "scale(1.05)" }}
                />
              </Box>
            </Link>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
