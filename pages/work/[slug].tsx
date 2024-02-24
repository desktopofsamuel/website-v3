import { allWorks, Work } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "@/components/Layout";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";
import CONFIG from "../../config";
import NextImage from "@/components/NextImage";
import {
  chakra,
  Heading,
  Box,
  VStack,
  Flex,
  Text,
  SimpleGrid,
  UnorderedList,
  ListItem,
  Tag,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  HStack,
} from "@chakra-ui/react";

const Article = chakra("article", {
  baseStyle: {},
});

const Fullbleed = chakra("div", {
  baseStyle: {},
});

export const getStaticPaths = () => {
  return {
    paths: allWorks.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

const components = {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
};

export const getStaticProps: GetStaticProps<{
  post: Work;
}> = ({ params }) => {
  const post = allWorks.find((post) => post.slug === params?.slug);

  if (!post) {
    return { notFound: true };
  }
  return { props: { post } };
};

export default function SingleWorkPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);

  return (
    <Layout title={`${post.subtitle}`} description={post.excerpt}>
      <NextSeo
        openGraph={{
          url: CONFIG.URL + `/work/` + post.slug,
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
        <VStack pb="4" marginTop="16">
          <Flex direction="column">
            <Heading fontSize="2xl" lineHeight="short">
              {post.title}
            </Heading>
            <Text fontSize="lg" fontFamily="heading" color="secondarytext">
              {post.description}
            </Text>
          </Flex>
          <NextImage src={post.cover} id="top" />
        </VStack>
        <Fullbleed
        // sx={{
        //   width: "100vw!important",
        //   position: "relative",
        //   left: "50%",
        //   right: "50%",
        //   marginLeft: "-50vw",
        //   marginRight: "-50vw",
        //   backgroundColor: "gray.200",
        // }}
        ></Fullbleed>
        <Box px="16">
        <MDXContent components={components} /></Box>
        <SimpleGrid columns={2} row={2} gap="8" pt="8">
          <Box display="inline-block">
            <Text variant="small" color="secondarytext" my="0">
              role
            </Text>
            <Text fontFamily="heading" fontSize="2xl" my="0">{post.role}</Text>
          </Box>

          <Box>
            <Text variant="small" color="secondarytext" my="0">
              Industry
            </Text>
            <Box>
              <Text fontFamily="heading" fontSize="2xl" my="0" lineHeight="short">{post.tags?.join(", ")}</Text>
            </Box>
          </Box>
          {post.year ? (
            <Box>
              <Text variant="small" color="secondarytext" my="0">
                Timeframe
              </Text>
              <Text fontFamily="heading" fontSize="2xl" my="0" >{post.year}</Text>
            </Box>
          ) : (
            ""
          )}
          {post.platform ? (
            <Box display="inline-block">
              <Text variant="small" color="secondarytext" my="0">
                Platforms
              </Text>
              <Text fontFamily="heading" fontSize="2xl" my="0">{post.platform}</Text>
            </Box>
          ) : (
            ""
          )}
        </SimpleGrid>
        <Text variant="small" color="secondarytext" mt="20">
          Last update on {dayjs(post.date).format("MMM DD, YYYY")}
        </Text>
      </Article>
    </Layout>
  );
}
