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
import Fade from "react-reveal/Fade";

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
      <h1>Portfolio</h1>
      <p>Selected websites and apps showcase since 2015.</p>

      <h2>Featured List</h2>
      <Fade bottom>
        {works
          .filter((post) => post.feature === true)
          .sort(sortByDate)
          .map((post) => (
            <ListPortfolio key={post.slug} data={post} />
          ))}
      </Fade>
      <h2>More Work</h2>
      <p>Check out some of my personal work & design projects.</p>
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
