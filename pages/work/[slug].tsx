import { allWorks, Work } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import Layout from "@/components/Layout";
import dayjs from "dayjs";

export const getStaticPaths = () => {
  return {
    paths: allWorks.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
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

export default function SinglePostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDXContent = useMDXComponent(post.body.code);
  return (
    <Layout>
      <p>Portfolio!</p>
      <h1>{post.title}</h1>
      <small>{dayjs(post.date).format("MMM DD, YYYY")}</small>
      <MDXContent />
    </Layout>
  );
}
