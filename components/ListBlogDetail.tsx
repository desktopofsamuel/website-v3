import React, { useRef } from "react";
import NextLink from "@/components/NextLink"
import { Box, Grid, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import dayjs from "dayjs";

export default function ListBlogDetail({ data }: any) {
  const post = data;

  return (
    <NextLink href={`/${post.slug}/`}>
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 1fr"}}  gap="10" marginY="10" alignItems="center" cursor="pointer">
        <Box position="relative" width="fit-content">
          <NextImage src={post.cover} alt={post.title} />
        </Box>
        <Box>
          <Text variant="small">
            {post.category} - {dayjs(post.date).format("MMM DD, YYYY")}
          </Text>
          <Heading variant="heading">{post.title}</Heading>
          <Text noOfLines={3}>{post.description}</Text>
        </Box>
      </Grid>
    </NextLink>
  );
}
