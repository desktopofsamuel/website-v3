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
import CardBase from "@/components/CardBase"
import "react-loading-skeleton/dist/skeleton.css";
// import Image from "next/image";

const CardCurrentlyPlaying = () => {
  const { data: staticData } = useSWR("/api/recently-played", fetcher);
  const { data: dynamicData } = useSWR("/api/currently-playing", fetcher);

  return dynamicData?.isPlaying ? (
   <CardBase title="Currently playing">
      <Heading>{dynamicData.title}</Heading>
      <Text>{dynamicData.artist}</Text>
      </CardBase>
  ) : (
   <CardBase title="Last played">
      {staticData?.map((song, i) => (
        <>
          <Heading my="0" fontSize="6xl">{song.title}</Heading>
          <Text fontFamily="heading">{song.artist}</Text>
        </>
      ))}
    </CardBase>
  );
};

export default CardCurrentlyPlaying;
