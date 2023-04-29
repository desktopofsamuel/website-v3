import React, { useRef } from "react";
import Link from "next/link";
import { Button, Box, Flex, Grid, Heading, Text, useColorModeValue, } from "@chakra-ui/react";
import Image from "next/image"
import NextImage from "@/components/NextImage";
import NextLink from "@/components/NextLink";

export default function ListPortfolio({ data }: any) {
  const post = data;

  return (
    <NextLink href={`/work/${post.slug}/`} variant="noeffect">
      <Grid gridTemplateColumns={{ base: "1fr", md: "1fr 2fr"}} gap="4" marginY="10" border="1px solid" borderColor="border" p="8" borderRadius="2xl">
        <Box>
          <Text color="secondarytext" variant="small" my="0">
            {post.subtitle}
          </Text>
          <Heading variant="heading">{post.title}</Heading>
          <Text color="secondarytext">{post.description}</Text>
          <Button variant="solid">View Process</Button>
        </Box>
        <Box>
          <NextImage src={post.cover} alt={post.title}/>
        </Box> 
      </Grid>
    </NextLink>
  );
}
