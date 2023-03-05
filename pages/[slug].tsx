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
import {getHeadings} from "utils/getHeadings";
import ScrollspyNav from "react-scrollspy-nav";
import NextLink from "@/components/NextLink";
import slugger from "github-slugger";
import kebabCase from "lodash.kebabcase";

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
      <Image src={props.src} alt={props.alt} style={{ objectFit: "contain" }} />
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
  const ids = headings.map((heading) => heading.id);
  console.log(headings)

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
      <Article
        sx={{
          display: "block",
          position: "relative",
          maxWidth: "800px",
          overflow: "hidden",

          "h1, h2, h3, h4, h5, h6": {
            fontFamily: "fonts.heading",
            color: "colors.black",
            lineHeight: "short",
          },
        }}
      >
        <Box
        as="aside"
        display={{ base: "none", xl: "block" }}
        position="fixed"
        top="40vh"
        right="1vw"
        marginLeft="36px"
        maxWidth="250px"
        fontSize="sm"
        zIndex={100}
      >
        <UnorderedList listStyleType="none">
          <ScrollspyNav
            scrollTargetIds={ids}
            activeNavClass="is-active"
            scrollDuration="1000"
            headerBackground
            reference="top"
          >
            {headings.map((heading, index) => (
              <ListItem
                key={index}
                borderLeft="1px"
                borderColor="border"
                lineHeight="base"
                paddingLeft="2"
               paddingBottom="2"
              >
                <NextLink href={`#${heading.id}`}>
                  {heading.text}
                </NextLink>
              </ListItem>
            ))}
          </ScrollspyNav>
        </UnorderedList>
      </Box>
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
