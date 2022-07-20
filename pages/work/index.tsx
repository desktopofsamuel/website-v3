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
import { Heading, Text } from "@chakra-ui/react";

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

      <Text variant="small">Featured List</Text>
      <Fade bottom>
        {works
          .filter((post) => post.feature === true)
          .sort(sortByDate)
          .map((post) => (
            <ListPortfolio key={post.slug} data={post} />
          ))}
      </Fade>
      <Heading variant="small">More Work</Heading>
      <Text>Check out some of my personal work & design projects.</Text>
      {works
        .filter((post) => post.feature !== true)
        .sort(sortByDate)
        .map((post) => (
          <div key={post.slug}>
            <p>
              <Link href={`/work/${post.slug}/`}>{post.title}</Link>
            </p>
          </div>
        ))}
    </Layout>
  );
}
