import { useEffect, useState } from "react";
import useSWR from "swr";
import NextLink from "./NextLink";
import {
  Box,
  Text,
  chakra,
  Grid,
  SimpleGrid,
  useColorModeValue,
  Tooltip,
  Center,
  Heading,
  Image as ChakraImage,
  keyframes,
} from "@chakra-ui/react";
import Image from "next/image";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import Image from "next/image";

const CardCurrentlyPlaying = () => {
  const { data } = useSWR("/api/currently-playing", fetcher);
  return data?.isPlaying ? (
    <Box
      border="1px solid"
      borderColor="border"
      p="4"
      boxShadow="sm"
      transition="all ease-in-out 200ms"
      _hover={{ boxShadow: "md" }}
      borderRadius="16"
      gridColumn={{ base: "span 2", md: "initial" }}
    >
      <Text variant="small">Currently Playing </Text>
      <Heading>{data.title}</Heading>
      <Text>{data.artist}</Text>
    </Box>
  ) : (
    <Box>
      <Text> Samuel is not playing </Text>
    </Box>
  );
};

export default CardCurrentlyPlaying;
