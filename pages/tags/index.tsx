import Layout from "@/components/Layout";
import { allTags } from "@/lib/content";
import { Heading, Text } from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

export const getStaticProps: GetStaticProps<{
  tags: any
}> = ({ params }: any) => {
  return {
    props: {
      tags: allTags,
    },
  };
};

export default function TagListPage({ tags }:any ) {
  return (
    <Layout>
      <Heading variant="pagetitle">Tags</Heading>
      {tags.map((tag: { path: string, name: string }, i: number) => (
        <Link href={tag.path} key={i}>
          <Text>{tag.name}</Text>
        </Link>
      ))}
    </Layout>
  );
}
