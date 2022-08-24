import React, { useRef } from "react";
import Link from "next/link";
import { Box, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";

export default function ListBlog({ data }: any) {
  const post = data;

  return (
    <Link href={`/${post.slug}/`}>
      <Box marginY="4" cursor="pointer">
        <NextImage src={post.cover} alt={post.title} />
        <Heading variant="heading" my="4">
          {post.title}
        </Heading>
        <Text>{post.excerpt}</Text>
      </Box>
    </Link>
  );
}
