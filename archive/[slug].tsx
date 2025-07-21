import { allPosts, Post } from ".contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer2/hooks";
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
  VStack,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  UnorderedList,
  ListItem,
  HStack,
  SimpleGrid,
  Tag,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import { ArticleJsonLd } from "next-seo";
import { AUTHOR_NAME, URL } from "../config";
import { getHeadings } from "utils/getHeadings";
import ScrollspyNav from "react-scrollspy-nav";
import NextLink from "@/components/NextLink";
import slugger from "github-slugger";
import kebabCase from "lodash.kebabcase";
// import ListBlog from "@/components/ListBlog";
import { ArrowUpIcon } from "@chakra-ui/icons";

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
  baseStyle: {
    ul: {
      listStyle: "disc",
      listStylePosition: "inside",
      my: "2",
    },
    ol: {
      listStyle: "decimal",
      listStylePosition: "inside",
      my: "2",
    },
    li: {
      my: "2",
        a: {
          color: "primary.500",
          borderBottomWidth: "1px",
          borderBottomColor: "primary.500",
        },
    },
  },
});

export const getStaticPaths = () => {
  return {
    paths: allPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  post: Post;
  relatedPosts: Post[];
}> = async ({ params }) => {
  const post = allPosts.find((post) => post.slug === params?.slug);

  if (!post) {
    return { notFound: true };
  }

  // Get up to 3 posts that share the same tag as the current post
  let relatedPosts = allPosts
    .filter((p) => {
      const hasSharedTag = p.tags.some((tag) => post.tags.includes(tag));
      return hasSharedTag && p.slug !== post.slug;
    })
    .sort((a, b) => {
      // Sort related posts by the order of the tags in the current post
      const aIndex = post.tags.findIndex((tag) => a.tags.includes(tag));
      const bIndex = post.tags.findIndex((tag) => b.tags.includes(tag));
      return aIndex - bIndex;
    })
    .slice(0, 2);

  // If no related posts found, then find posts in the same category
  if (relatedPosts.length === 0) {
    relatedPosts = allPosts
      .filter((p) => p.category === post.category && p.slug !== post.slug)
      .slice(0, 2);
  }

  return { props: { post, relatedPosts } };
};

const components = {
  NextImage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
};

const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

function scrollToTop() {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function SinglePostPage({
  post,
  relatedPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  const headings = getHeadings(post.body.raw);
  const ids = headings.map((heading) => heading.id);

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
        publisherLogo={CONFIG.URL + CONFIG.OG_IMAGE}
        description={post.excerpt}
      />
      <NextSeo
        openGraph={{
          url: CONFIG.URL + `/` + post.slug + `/`,
          type: "article",
          article: {
            publishedTime: post.date,
            tags: post.tags,
            authors: [CONFIG.URL],
          },
          images: [
            {
              url: post.cover
                ? CONFIG.URL + post.cover
                : CONFIG.URL + CONFIG.OG_IMAGE,
            },
          ],
        }}
      />
      <Box position="fixed" bottom="2" right="2">
        <IconButton
          aria-label="Back to Top"
          icon={<ArrowUpIcon />}
          onClick={scrollToTop}
        >
          <NextLink href="#top" />
        </IconButton>
      </Box>
      <Box
        as="aside"
        display={{ base: "none", xl: "block" }}
        position="fixed"
        top="50%"
        right="1vw"
        transform="translateY(-50%)"
        marginLeft="36px"
        maxWidth="200px"
        fontFamily="heading"
        fontSize="xs"
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
                paddingLeft={`${2 + (heading.level - 1) * 1}`} 
                paddingBottom="2"
              >
                <NextLink href={`#${heading.id}`}>{heading.text}</NextLink>
              </ListItem>
            ))}
          </ScrollspyNav>
        </UnorderedList>
      </Box>
     
      <Article
        sx={{
          display: "block",
          position: "relative",
          maxWidth: "680px",
          overflow: "hidden",
          margin: "0 auto",

          "> *": {
            maxWidth: "800px",
            width: "100%",
          },

          h1: {
            fontSize: "4xl",
            lineHeight: "shorter",
            letterSpacing: "tight",
          },

          h2: {
            fontSize: "2xl",
            lineHeight: "shorter",
            letterSpacing: "tight",
          },
        }}
      >
       
        <VStack mt="36" pb="4">
          <Flex width="100%" direction="column">
            <Box display="inline-block">
              <Text variant="small" fontFamily="body" color="primary.500" >
              {post.category}
           
              </Text>
            </Box>
            <Heading as="h1" variant="title" lineHeight="shorter" >{post.title}</Heading >
            <Text fontSize="lg" color="secondarytext">
              {post.tldr}
            </Text>
            <HStack gap="2" borderTop=".5px solid" borderColor="border" pt="4">
            <Text variant="small" color="tertiarytext">{dayjs(post.date).format("MMMM DD, YYYY")} </Text><span>·</span>
            <Text variant="small" color="tertiarytext">{post.timetoread} min read</Text></HStack>
          </Flex>
        </VStack>

        <Box width="100%" position="relative" left="50%" transform="translateX(-50%)">
          <NextImage src={post.cover} alt={post.title} priority noeffect id="top" />
        </Box>
       
        <MDXContent components={components} />
        <HStack>
          {post.tags.map((tag) => (
            <NextLink
              key={tag}
              variant="noeffect"
              href={`/tags/${kebabCase(tag)}`}
            >
              <Tag>{tag}</Tag>
            </NextLink>
          ))}
        </HStack>
        {/* <Heading fontSize="lg">You might find these interestings</Heading>
        <SimpleGrid columns={3} gap={4}>
          {relatedPosts.slice(0, 3).map((post) => (
            <ListBlog key={post.slug} data={post} />
          ))}
        </SimpleGrid> */}
        {relatedPosts && (
        <Flex marginTop="10" flexDir="column" alignItems="center">
          <Text textAlign="center" variant="small">Read more</Text>
          {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 1, md: 6 }}>
            {relatedPosts.map((post) => (
              <ListBlog key={post.slug} data={post} small />
            ))}
          </SimpleGrid> */}
        </Flex>
      )}
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
