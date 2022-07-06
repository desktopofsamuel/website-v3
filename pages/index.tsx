import Layout from "components/Layout";
import { allPosts, allWorks, Post, Work } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { sortByDate } from "@/utils"
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

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
      <h2>Blog List</h2>
      {posts.sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
      <h2>Work List</h2>
      {works.sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/work/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
    </Layout>
  );
}
