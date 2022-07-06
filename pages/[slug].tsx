import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "../components/Layout";
import Markdown from "markdown-to-jsx";
import dayjs from "dayjs";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    <div style={{ width: "100%", objectFit: "contain", display: "block", position: "relative" }}>
      <Image
        src={props.src}
        alt={props.alt}
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};

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
  '* > img': {
    width: "100%",
    display: "inline-block",
  },
  display: "block",
  maxWidth: "800px",
  overflow: "hidden",
};

export default function SinglePostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  return (
    <Layout>
      <h1>{post.title}</h1>
      <small>{dayjs(post.date).format("MMM DD, YYYY")}</small>
      <article style={containerStyle}>
        <MDXContent components={{ Img }} />
      </article>
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
