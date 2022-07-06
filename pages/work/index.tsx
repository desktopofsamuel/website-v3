import Layout from "components/Layout";
import { allWorks, Work } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "@/utils"
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

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
    <Layout>
      <h1>My Work</h1>
      <h2>Featured List</h2>
      {works.filter(post => post.feature === true).sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/work/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
       <h2>Blog List</h2>
      {works.filter(post => post.feature !== true).sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/work/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
    </Layout>
  );
}
