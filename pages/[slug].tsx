import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "../components/Layout";
import Markdown from "markdown-to-jsx";
import dayjs from "dayjs";
import Image from "next/image";
import { NextSeo } from "next-seo";
import CONFIG from "../config";
import { useState, useEffect } from "react";
import {
  chakra,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";

// const NextImage = (props: any) => {
//   return (
//     <div style={{ width: "100%", height: "100%", position: "relative" }}>
//       <Image
//         src={props.src}
//         alt={props.alt}
//         layout="fill"
//         style={{ objectFit: "cover" }}
//         loading="lazy"
//       />
//     </div>
//   );
// };

const Img = (props: any) => {
  return (
    <div
      style={{
        width: "100%",
        objectFit: "contain",
        display: "block",
        position: "relative",
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};

const Article = chakra("article", {
  baseStyle: {},
});

export const getStaticPaths = () => {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  post: Post;
}> = ({ params }) => {
  const post = allPosts.find((post) => post.slug === params?.slug);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};

const containerStyle = {
  "* > img": {
    width: "100%",
    display: "inline-block",
  },
  display: "block",
  position: "relative",
  maxWidth: "800px",
  overflow: "hidden",

  "* > nav": {
    position: "absolute",
    top: "0",
    right: "0",
  },
};

export default function SinglePostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  return (
    <Layout title={post.title} description={post.excerpt}>
      <NextSeo
        openGraph={{
          url: CONFIG.URL + `/` + post.slug,
          type: "article",
          article: {
            publishedTime: post.date,
            tags: post.tags,
            authors: [CONFIG.URL],
          },
          // images: [
          //   {
          //     url: frontmatter.socialImage
          //       ? CONFIG.URL + frontmatter.socialImage
          //       : CONFIG.URL + CONFIG.OG_IMAGE,
          //   },
          // ],
        }}
      />
      <Heading>{post.title}</Heading>
      <small>{dayjs(post.date).format("MMM DD, YYYY")}</small>
      <Article
        sx={{
          display: "block",
          position: "relative",
          maxWidth: "800px",
          overflow: "hidden",

          "nav": {
          position: 'sticky',
          top: '0',
          right: '0',
          height: '200px',
          },
        }}
      >
        <MDXContent
          components={{
            NextImage,
            Alert,
            AlertIcon,
            AlertTitle,
            AlertDescription,
          }}
        />
      </Article>
      {/* <Markdown
        options={{
          wrapper: "article",
          overrides: { 
            img: NextImage
            p:
          },
        }}
      >
        {post.body.raw}
      </Markdown> */}
      {/* <div dangerouslySetInnerHTML={{ __html: post.body.html }} /> */}
    </Layout>
  );
}
