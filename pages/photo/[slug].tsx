import { allPhotos, Photo } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "@/components/Layout";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";
import CONFIG from "../../config";
import { SimpleGrid, GridItem} from "@chakra-ui/react"

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
      <h1>{post.title}</h1>
      <small>{dayjs(post.date).format("MMM DD, YYYY")}</small>
      <MDXContent components={{ SimpleGrid, GridItem }}/>
    </Layout>
  );
}
