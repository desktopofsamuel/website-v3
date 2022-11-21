import React, { useRef } from "react";
import Link from "next/link";
import { Button, Box, Flex, Grid, Heading, Text, useColorModeValue, HStack, } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import NextLink from "./NextLink";

export default function ListPortfolio({ data }: any) {
  const post = data;

  return (
    <NextLink href={`/work/${post.slug}/`} >
      <Grid border="1px solid" borderColor="border" p="8" borderRadius="2xl">
        <Box>
          <HStack>
          <Text variant="small" my="0">
            {post.category} - 
          </Text>
          <Text variant="small" my="0">
            {post.year}
          </Text></HStack>
          <Heading variant="heading">{post.subtitle}</Heading>
          <Text>{post.description}</Text>
        </Box>
          <NextImage src={post.cover} alt={post.title} />
      </Grid>
    </NextLink>
  );
}
