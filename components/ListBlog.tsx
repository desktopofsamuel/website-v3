import React, { useRef } from "react";
import NextLink from "@/components/NextLink";
import { Box, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";

export default function ListBlog({ data, small }: any) {
  const post = data;

  return (
    <NextLink href={`/${post.slug}/`} variant="noeffect">
      <Box marginY="4" cursor="pointer">
        <NextImage src={post.cover} alt={post.title} />
        <Heading variant={small ? "subtitle" : "heading"} my="4">
          {post.title}
        </Heading>
        <Text
          fontSize={small ? "sm" : "md"}
        >
          {post.excerpt}
        </Text>
      </Box>
    </NextLink>
  );
}
