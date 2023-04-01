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
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import { ArticleJsonLd } from "next-seo";
import { AUTHOR_NAME, URL } from "../config";
import { getHeadings } from "utils/getHeadings";
import ScrollspyNav from "react-scrollspy-nav";
import NextLink from "@/components/NextLink";
import slugger from "github-slugger";
import kebabCase from "lodash.kebabcase";
import ListBlog from "@/components/ListBlog";

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
  relatedPosts: Post[];
}> = async ({ params }) => {
  const post = allPosts.find((post) => post.slug === params?.slug);

  if (!post) {
    return { notFound: true };
  }

  // Get up to 3 posts that share the same category as the current post
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

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

export default function SinglePostPage({
  post,
  relatedPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  const headings = getHeadings(post.body.raw);
  const ids = headings.map((heading) => heading.id);
  // const relatedPosts = allPosts.filter(
  //   (p) => p.slug !== post.slug && post.tags.some((tag) => p.tags.includes(tag))
  // );

  // // Return early if no related posts found
  // if (relatedPosts.length === 0) {
  //   return null;
  // }

  // {
  //   console.log(post.tags);
  // }
  // {
  //   console.log(relatedPosts);
  // }

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
      <Box
        as="aside"
        display={{ base: "none", xl: "block" }}
        position="fixed"
        top="50%"
        right="1vw"
        transform="translateY(-50%)"
        marginLeft="36px"
        maxWidth="200px"
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
                paddingLeft="2"
                paddingBottom="2"
              >
                <NextLink href={`#${heading.id}`}>{heading.text}</NextLink>
              </ListItem>
            ))}
          </ScrollspyNav>
        </UnorderedList>
      </Box>
      <NextImage src={post.cover} />
      <Article
        sx={{
          display: "block",
          position: "relative",
          maxWidth: "800px",
          overflow: "hidden",
          margin: "0 auto",

          "> *": {
            maxWidth: "800px",
          },
        }}
      >
        <VStack pb="4">
          <Flex width="100%" direction="column">
            <Box display="inline-block">
              <Text variant="small" color="secondarytext">
                {dayjs(post.date).format("MMM DD, YYYY")} · posted in{" "}
                {post.category} · {post.timetoread} min read
              </Text>
            </Box>
            <Heading lineHeight="short">{post.title}</Heading>
            <Text fontSize="lg" fontFamily="heading" color="secondarytext">
              {post.tldr}
            </Text>
          </Flex>
        </VStack>

        <MDXContent components={components} />
        <HStack>
          {post.tags.map((tag) => (
            <NextLink
              key={tag}
              variant="noeffect"
              href={`/tags/${kebabCase(tag)}`}
            >
              <Tag variant="outline">{tag}</Tag>
            </NextLink>
          ))}
        </HStack>
        {/* <Heading fontSize="lg">You might find these interestings</Heading>
        <SimpleGrid columns={3} gap={4}>
          {relatedPosts.slice(0, 3).map((post) => (
            <ListBlog key={post.slug} data={post} />
          ))}
        </SimpleGrid> */}
      </Article>
      {relatedPosts && (
        <>
          <Text fontFamily="heading" fontStyle="bold">
            Related articles you might like
          </Text>
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6}>
            {relatedPosts.map((post) => (
              <ListBlog key={post.slug} data={post} small />
            ))}
          </SimpleGrid>
        </>
      )}

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
