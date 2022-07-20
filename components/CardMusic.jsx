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
  Heading,
  Center,
  Image as ChakraImage,
  keyframes,
} from "@chakra-ui/react";
import Image from "next/image";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CardBase from "@/components/CardBase";
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

const CardMusic = () => {
  function Loader() {
    return (
      <Center textAlign="center" flexDirection="column">
        <Skeleton width="80px" height="80px" circle />
        <Skeleton/>
      </Center>
    );
  }
  const { data } = useSWR("/api/top-artists", fetcher);
  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";

  return (
    <>
      <CardBase title="🎧 Recently listening">
        <SimpleGrid
          columns={2}
          row={2}
          spacingX={4}
          spacingY={8}
          alignItems="center"
          justifyContent="center"
        >
          {/* {console.log(data)} */}
          {!data ? (
            <>
              <Loader /> <Loader /> <Loader /> <Loader />
            </>
          ) : (
            data.map((artist, i) => (
              <Center textAlign="center" flexDirection="column" key={i}>
                <NextLink
                  title={`Listen to ${artist.name} now on Spotify`}
                  target="_blank"
                  href={artist.link}
                  variant="noeffect"
                  isExternal
                >
                  <Box
                    w="80px"
                    h="80px"
                    role="group"
                    borderRadius="50%"
                    position="relative"
                    backgroundColor="transparent"
                    transition="all 500ms ease-in-out"
                    _hover={{
                      backgroundColor: "black",
                    }}
                  >
                    <Box
                      position="absolute"
                      zIndex="100"
                      top="26px"
                      left="26px"
                      opacity={0}
                      w="25px"
                      h="25px"
                      right="0"
                      bottom="0"
                      color="white"
                      transition="all 500ms ease-in-out"
                      _groupHover={{ opacity: 1 }}
                    >
                      {/* <FaVolumeDown size="20px" /> */}
                      <Box
                        position="relative"
                        display="flex"
                        justifyContent="space-between"
                        width="30px"
                        height="30px"
                      >
                        <Box
                          backgroundColor="white"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                        />
                        <Box
                          backgroundColor="white"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-2.2s" }}
                        />
                        <Box
                          backgroundColor="white"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-3.7s" }}
                        />
                        <Box
                          backgroundColor="white"
                          width="4px"
                          height="100%"
                          borderRadius="6px"
                          animation={animation}
                          transformOrigin="bottom"
                          style={{ animationDelay: "-4.2s" }}
                        />
                      </Box>
                    </Box>
                    <Box
                      position="absolute"
                      overflow="hidden"
                      top="0"
                      left="0"
                      zIndex="1"
                      w="80px"
                      h="80px"
                      borderRadius="50%"
                      _groupHover={{ opacity: 0.8 }}
                    >
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        width={80}
                        height={80}
                      />
                    </Box>
                  </Box>
                </NextLink>
                <Heading m="2" fontSize="sm" lineHeight="short">
                  {artist.name}
                </Heading>
              </Center>
            ))
          )}
        </SimpleGrid>
        </CardBase>
    </>
  );
};

export default CardMusic;
