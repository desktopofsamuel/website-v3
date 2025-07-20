import Layout from "components/Layout";
import { allPosts, Post } from "contentlayer/generated";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import type { NextPage } from "next";
import { sortByDate } from "@/utils";
import ListFeed from "@/components/ListFeed";
import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import ListBlogDetail from "@/components/ListBlogDetail";
import NextLink from "@/components/NextLink";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

// const Fade = require("react-reveal/Fade");

type Props = [
  fields: {
    fields: any;
    EntryName: string;
    Description: string;
  }
];

export default function FeedPage() {
  const { data: feedData } = useSWR<Props>("/api/feed", fetcher);
  return (
    <Layout
      title="Blog"
      description="A collection of posts I wrote about design process, technology and productivity."
    >
      <Heading variant="pagetitle">Feed</Heading>
      <UnorderedList margin="0">
        {feedData &&
          feedData.map((item: any, i: number) => (
            <ListFeed data={item} key={i} />
          ))}
      </UnorderedList>
    </Layout>
  );
}
