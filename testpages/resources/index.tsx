import { NextPage } from "next";
import { Heading, Box, Text, HStack } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import Layout from "@/components/Layout";
import CardResourcesMain from "@/components/CardResourcesMain";
import Link from "next/link";
import NextLink from "@/components/NextLink";

type Props = {
  bookname: string;
  author: string;
  url?: string;
  description?: string;
  image: string;
};

const CardBook: React.FC<Props> = ({
  bookname,
  author,
  url,
  description,
  image,
}: Props) => {
  return (
    <NextLink href={url} target="_blank" variant="noeffect">
      <Box
        border="1px solid"
        borderColor="border"
        p="4"
        borderRadius="lg"
        width="200px"
      >
        <NextImage src={image} width={200}/>
        <Box my="4">
        <Heading fontSize="lg" m="0">{bookname}</Heading>
        <Text fontSize="sm" m="0">by {author}</Text>
        </Box>
      </Box>
    </NextLink>
  );
};

const ResourcesPage: NextPage = () => {
  return (
    <Layout title="Resources">
      <Heading variant="pagetitle">Resources</Heading>
      <CardResourcesMain />
      {/* <Box as="section">
      <Heading>Books</Heading>
      <HStack>
      <CardBook
        bookname="Don't Make Me Think"
        author="Steve Krug"
        image="https://m.media-amazon.com/images/I/51WS36aA2BL._SX387_BO1,204,203,200_.jpg"
      />
      <CardBook
        bookname="Don't Make Me Think"
        author="Steve Krug"
        image="https://m.media-amazon.com/images/I/51WS36aA2BL._SX387_BO1,204,203,200_.jpg"
      />
      <CardBook
        bookname="Don't Make Me Think"
        author="Steve Krug"
        image="https://m.media-amazon.com/images/I/51WS36aA2BL._SX387_BO1,204,203,200_.jpg"
      /></HStack></Box> */}
    </Layout>
  );
};

export default ResourcesPage;
