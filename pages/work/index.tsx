import Layout from "components/Layout";
import { allWorks, Work } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "@/utils";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import ListPortfolio from "@/components/ListPortfolio";
import { Grid, Heading, Text } from "@chakra-ui/react";
import ListPortfolioSmall from "@/components/ListPortfolioSmall";

const Fade = require('react-reveal/Fade')

export const getStaticProps: GetStaticProps<{
  works: Work[];
}> = () => {
  return {
    props: {
      works: allWorks,
    },
  };
};

  export default function WorkListPage({
  works,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout
      title="Portfolio"
      description="Websites & apps portfolio with UI/UX design showcase"
    >
      <Heading variant="pagetitle">Portfolio</Heading>
      <Text>Selected websites and apps showcase since 2015.</Text>
      <Fade bottom>
        {works
          .filter((post) => post.feature === true && post.draft !== true)
          .sort(sortByDate)
          .map((post) => (
            <ListPortfolio key={post.slug} data={post} />
          ))}
      </Fade>
      <Heading variant="small">Side Projects</Heading>
      <Grid gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr"}} gap="4">
      <Fade bottom>
      {works
        .filter((post) => post.feature !== true && post.draft !== true)
        .sort(sortByDate)
        .map((post) => (
          <ListPortfolioSmall key={post.slug} data={post}/>
        ))}
         </Fade>
        </Grid>
    </Layout>
  );
}
