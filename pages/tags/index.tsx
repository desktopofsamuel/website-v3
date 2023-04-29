import Layout from "@/components/Layout";
import { allTags } from "@/lib/content";
import { Heading, Text } from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import NextLink from "@/components/NextLink";

type allTagsProps = {
  name: string;
  path: string;
  count: number;
}

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
          tag: allTagsProps,
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
