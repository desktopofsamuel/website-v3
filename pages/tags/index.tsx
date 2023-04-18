import Layout from "@/components/Layout";
import { allTags } from "@/lib/content";
import { Heading, Text } from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import NextLink from "@/components/NextLink";

export const getStaticProps: GetStaticProps<{
  tags: any;
}> = ({ params }: any) => {
  return {
    props: {
      tags: allTags.sort((a, b) => b.count - a.count),
    },
  };
};

export default function TagListPage({ tags }: any) {
  return (
    <Layout>
      <Heading variant="pagetitle">Tags</Heading>
      {tags.map(
        (
          tag: {
            count: number;
            path: string;
            name: string;
          },
          i: number
        ) => (
          <NextLink href={tag.path} key={i}>
            <Text>
              {tag.name} {`(${tag.count})`}
            </Text>
          </NextLink>
        )
      )}
    </Layout>
  );
}
