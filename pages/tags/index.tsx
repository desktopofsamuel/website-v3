import Layout from "@/components/Layout";
import { allTags } from "@/lib/content";
import { Flex, Box, GridItem, Heading, Text, Grid, SimpleGrid } from "@chakra-ui/react";
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
      tags: allTags.sort((a, b) => b.count - a.count).filter(tag => tag.count > 1),
    },
  };
};

export default function TagListPage({ tags }: any) {
  return (
    <Layout>
      <Heading variant="pagetitle">Tags</Heading>
      <SimpleGrid columns={3} gap="8">
      {tags.map(
        (
          tag: allTagsProps,
          i: number
        ) => (
          <GridItem key={i} display="flex" justifyContent="space-between">
          <NextLink href={tag.path}>
            <Text margin="0">
              {tag.name}
            </Text>
          </NextLink>
          <Text variant="small">({tag.count})</Text></GridItem>
        )
      )}
      </SimpleGrid>
    </Layout>
  );
}
