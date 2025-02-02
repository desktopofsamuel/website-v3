import React, { useRef } from "react";
import Link from "next/link";
import {
  Button,
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import NextImage from "@/components/NextImage";
import NextLink from "./NextLink";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function ListPortfolio({ data }: any) {
  const post = data;

  return (
    <Grid border="1px solid" borderColor="border" p="6" borderRadius="2xl" height="100%">
      <Box display="inline">
        <NextLink
          variant="noeffect"
          href={post.url ? post.url : `/work/${post.slug}/`}
          target="_blank"
        >
          <HStack>
            <Heading variant="heading" fontSize="2xl">
              {post.subtitle}
            </Heading>
            <ExternalLinkIcon color="secondarytext" />
          </HStack>
        </NextLink>
        <Text my="0" color="secondarytext">
          {post.description}
        </Text>
        <HStack>
          {post.tags.map((tag: string, index: React.Key | null | undefined) => (
            <Text
              key={index}
              fontFamily="heading"
              variant="small"
              color="yellow.500"
            >
              {tag}
            </Text>
          ))}
        </HStack>
      </Box>
      {/* <NextImage src={post.cover} alt={post.title} /> */}
    </Grid>
  );
}
