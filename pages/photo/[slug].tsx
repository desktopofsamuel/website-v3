import { allPhotos, Photo } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "@/components/Layout";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";
import CONFIG from "../../config";
import { Wrap, WrapItem, Stack, SimpleGrid, Text, GridItem, Box, Heading} from "@chakra-ui/react"
import Image from 'next/image'

export const getStaticPaths = () => {
  return {
    paths: allPhotos.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  post: Photo;
}> = ({ params }) => {
  const post = allPhotos.find((post) => post.slug === params?.slug);

  if (!post) {
    return { notFound: true };
  }

  return { props: { post } };
};

const ResponsiveImage = (props: any) => (
  <Box 
    position="relative" 
    width="100%" 
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Image 
      alt={props.alt} 
      width={0}
      height={0}
      sizes="100vw"
      style={{ 
        width: "100%",
        height: "auto",
        objectFit: "contain"
      }} 
      src={props.src} 
      {...props}
    />
  </Box>
)

const components = {
  img: ResponsiveImage,
  SimpleGrid,
  GridItem,
}

export default function SinglePhotoPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  return (
    <Layout title={post.title} description={post.excerpt}>
        <NextSeo
        openGraph={{
          url: CONFIG.URL + `/photo/` + post.slug,
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
      <Heading variant="posttitle">{post.title}</Heading>
      <Text variant="small">{dayjs(post.date).format("MMM DD, YYYY")}</Text>
      <MDXContent components={components}/>
    </Layout>
  );
}
