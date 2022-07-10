import React, { useRef } from "react";
import Link from "next/link";
import { Button, Box, Flex, Grid, Heading, Text, useDimensions } from "@chakra-ui/react";
import NextImage from "@/components/NextImage";

export default function ListPortfolio({ data }: any) {
  const post = data;

  return (
    <Link href={`/work/${post.slug}/`} >
      <Grid gridTemplateColumns={{ sm: "1fr", md: "1fr 2fr"}} gap="4" marginY="10" border="1px solid" borderColor="border" p="8" borderRadius="2xl">
        <Box>
          <Text textTransform="uppercase" fontSize="sm">
            {post.subtitle}
          </Text>
          <Heading fontSize="2xl" my="0" color={post.color}>{post.title}</Heading>
          <Text>{post.description}</Text>
          <Button variant="solid">View Process</Button>
        </Box>
        <Box position="relative" width="fit-content">
          <NextImage src={post.cover} alt={post.title} />
        </Box>
      </Grid>
    </Link>
  );
}
