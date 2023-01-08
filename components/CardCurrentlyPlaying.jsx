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


const bounce = keyframes`
10% {
    transform: scaleY(0.3); /* start by scaling to 30% */
  }

  30% {
    transform: scaleY(1); /* scale up to 100% */
  }

  60% {
    transform: scaleY(0.5); /* scale down to 50% */
  }

  80% {
    transform: scaleY(0.75); /* scale up to 75% */
  }

  100% {
    transform: scaleY(0.6); /* scale down to 60% */
  }
`;

const animation = `${bounce} 2.2s ease infinite alternate`;

const CardCurrentlyPlaying = () => {
  const { data: staticData } = useSWR("/api/recently-played", fetcher);
  const { data: dynamicData } = useSWR("/api/currently-playing", fetcher);

  return dynamicData?.isPlaying ? (
   <CardBase title="🎧 Currently playing">
      <Heading lineHeight="shorter" my="0" fontSize="5xl" display="inline-block">{dynamicData.title}</Heading>
      <Box display="inline-block" ml="4" position="relative" width="48px" height="48px">
                      <Box
                        position="relative"
                        display="flex"
                        justifyContent="space-between"
                        width="24px"
                        height="24px"
                      >
                        <Box
                          backgroundColor="border"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                        />
                        <Box
                          backgroundColor="border"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-2.2s" }}
                        />
                        <Box
                          backgroundColor="border"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-3.7s" }}
                        />
                        <Box
                          backgroundColor="border"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-4.2s" }}
                        /></Box>
                    </Box>
      <Text fontFamily="heading">{dynamicData.artist}</Text>
      </CardBase>
  ) : (
   <CardBase title="🎧 Last played">
      {staticData?.map((song, i) => (
        <Box key={i}>
          <Heading lineHeight="shorter" my="0" fontSize="5xl" >{song.title}</Heading>
          <Text fontFamily="heading">{song.artist}</Text>
        </Box>
      ))}
    </CardBase>
  );
};

export default CardCurrentlyPlaying;
