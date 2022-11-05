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
  Button,
  Box,
  Text,
  chakra,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import { ArticleJsonLd } from "next-seo";
import { AUTHOR_NAME, URL } from "../config";
import { getHeadings } from "utils";
import ScrollspyNav from "react-scrollspy-nav";
import NextLink from "@/components/NextLink";
import slugger from "github-slugger";
import kebabCase from "lodash.kebabcase";

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
        style={{ objectFit: "contain" }}
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

const components = {
  NextImage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
};

export default function SinglePostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  const headings = getHeadings(post.body.raw);
  const ids = headings.map((item: { text: string | undefined; }) => slugger.slug(kebabCase(item.text)))

  return (
    <Layout title={post.title} description={post.excerpt}>
      <ArticleJsonLd
        url={CONFIG.URL + `/` + post.slug}
        title={post.title}
        images={[`${CONFIG.URL}${post.cover}`]}
        datePublished={post.date}
        dateModified={post.date}
        authorName={AUTHOR_NAME}
        publisherName="Desktop Of Samuel"
        publisherLogo="https://www.example.com/photos/logo.jpg"
        description={post.excerpt}
      />
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

      <Box>
        <Heading variant="pagetitle">{post.title}</Heading>
        <Text variant="small">{dayjs(post.date).format("MMM DD, YYYY")}</Text>
      </Box>
      <Box
        display={{ base: "none", lg: "block" }}
        position="fixed"
        top="40vh"
        right="1vw"
        marginLeft="36px"
        maxWidth="250px"
        fontSize="sm"
        zIndex={100}
        
      >
        <UnorderedList listStyleType="none" >
        <ScrollspyNav
          scrollTargetIds={ids}
          offset={1000}
          activeNavClass="is-active"
          scrollDuration="1000"
          reference="top"
        >
            {headings.map((item: any) => (
              <ListItem key={item.text} borderLeft="1px" borderColor="border" paddingLeft="2">
                <NextLink href={`#${slugger.slug(kebabCase(item.text))}`}>
                  {item.text}
                </NextLink>
              </ListItem>
            ))}
          
        </ScrollspyNav>
        </UnorderedList>
      </Box>
      <Article
        sx={{
          display: "block",
          position: "relative",
          maxWidth: "800px",
          overflow: "hidden",

          nav: {
            display: "none",
            position: "fixed",
            padding: "4",
            top: "30%",
            right: "0",
            width: "250px",
          },

          "nav > ol > li": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "12px",
            margin: "4px 0px",
          },

          "h1, h2, h3, h4, h5, h6": {
            fontFamily: "fonts.heading",
            color: "colors.black",
            lineHeight: "short",
          },
        }}
      >
        <MDXContent components={components} />
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
