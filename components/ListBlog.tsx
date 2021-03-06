import React, { useRef } from "react";
import Link from "next/link";
import { Box, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";

export default function ListBlog({ data }: any) {
  const post = data;

  return (
    <Link href={`/${post.slug}/`}>
      <Box marginY="10" cursor="pointer">
        <Box position="relative" width="fit-content">
          <NextImage src={post.cover} alt={post.title} />
        </Box>
        <Heading variant="heading" my="0">{post.title}</Heading>
        <Text>{post.excerpt}</Text>
      </Box>
    </Link>
  );
}
