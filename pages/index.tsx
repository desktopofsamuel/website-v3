import Layout from 'components/Layout'
import { allPosts, Post } from "contentlayer/generated"
import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export const getStaticProps: GetStaticProps<{
  posts: Post[]
}> = () => {
  return { props: { posts: allPosts } }
}

export default function PostListPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <h1>Blog</h1>
 
      {posts.map((post) => (
        <div key={post.slug}>
          <h2>
            <Link href={`/${post.slug}/`}>
              <a>{post.title}</a>
            </Link>
          </h2>
        </div>
      ))}
    </Layout>
  )
}