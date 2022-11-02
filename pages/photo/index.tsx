import Layout from "components/Layout";
import { allPhotos, Photo } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "@/utils";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ListPortfolio from "@/components/ListPortfolio";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import NextLink from "@/components/NextLink";

const Fade = require('react-reveal/Fade')

export const getStaticProps: GetStaticProps<{
  photos: Photo[];
}> = () => {
  return {
    props: {
      photos: allPhotos,
    },
  };
};

export default function PhotoListPage({
  photos,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      title="Photography"
      description="Websites & apps portfolio with UI/UX design showcase"
    >
      <Heading variant="pagetitle">Photography</Heading>
      <Text>I’m greatly inspired by cities and stories within. Therefore I publish sets of photos according to cities that I have visited. More photos on my Instagram.</Text>

      <Text variant="small">Featured List</Text>
      <Heading variant="small">More Work</Heading>
      <Text>Check out some of my personal work & design projects.</Text>
      <SimpleGrid columns={2} spacing={2}>
      {photos
        .sort(sortByDate)
        .map((post) => (
          <NextLink href={`/photo/${post.slug}/`} key={post.slug}>
            <Box position="relative">
            <NextImage src={post.cover} width={500} height={500} alt={post.title}/>
            <Text position="absolute" bottom="0" left="16px" color="white" fontFamily="heading">{post.title}</Text></Box>
          </NextLink>
        ))}
        </SimpleGrid>
    </Layout>
  );
}
