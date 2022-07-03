import Layout from "components/Layout";
import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { sortByDate } from "@/utils"

export const getStaticProps: GetStaticProps<{
  posts: Post[];
}> = () => {
  return {
    props: {
      posts: allPosts,
    },
  };
};

export default function PostListPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <h1>Blog</h1>
      <h2>Featured List</h2>
      {posts.filter(post => post.feature === true).sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
       <h2>Blog List</h2>
      {posts.sort(sortByDate).map((post) => (
        <div key={post.slug}>
          <p>
            <Link href={`/${post.slug}/`}>{post.title}</Link>
          </p>
        </div>
      ))}
    </Layout>
  );
}
