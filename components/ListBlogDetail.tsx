import React, { useRef } from "react";
import Link from "next/link";
import { Box, Grid, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import dayjs from "dayjs";

export default function ListBlogDetail({ data }: any) {
  const post = data;

  return (
    <Link href={`/${post.slug}/`}>
      <Grid gridTemplateColumns={{sm: "1fr", md: "1fr 1fr"}}  gap="4" marginY="10" alignItems="center">
        <Box position="relative" width="fit-content">
          <NextImage src={post.cover} alt={post.title} />
        </Box>
        <Box>
          <Text textTransform="uppercase">
            {post.category} - {dayjs(post.date).format("MMM DD, YYYY")}
          </Text>
          <Heading fontSize="xl" my="0">{post.title}</Heading>
          <Text>{post.description}</Text>
        </Box>
      </Grid>
    </Link>
  );
}
