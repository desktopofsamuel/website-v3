/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Parser from "rss-parser";
import NextLink from "./NextLink";
import {
  chakra,
  Text,
  Grid,
  Tooltip,
  Box,
  Tag,
  ImageProps,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardFilms = () => {
  const { data, error } = useSWR("/api/films", fetcher);

  // if (error) return "An error has occurred.";
  // if (!data) return "Loading...";

  function Loader() {
    return (
      <Box
        height={200}
        width="100%"
        borderRadius="4px"
        overflow="hidden"
        transform="scale(0.98)"
      >
        <Skeleton height="200px" width="100%" />
      </Box>
    );
  }

  const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
    <Box display="flex" ref={ref}>
      <Image width={200} height={300} alt="" {...rest} />
    </Box>
  ));

  CustomCard.displayName = "CustomCard";

  return (
    <>
      <Box
        backgroundColor={useColorModeValue("gray.50", "gray.700")}
        p="4"
        borderRadius="16"
        gridColumn="span 2"
        width="100%"
        zIndex="0"
        position="relative"
      >
        <Text variant="small" textTransform="uppercase" letterSpacing="wide">
          🎬 最近看
        </Text>
        <Grid
          display="flex"
          flexDirection="row"
          zIndex="-10"
          position="relative"
        >
          {!data ? (
            <>
              <Loader /> <Loader /> <Loader /> <Loader /> <Loader />
            </>
          ) : (
            data.map((item, i) => (
              <Box
                key={i}
                width="100%"
                borderRadius="4px"
                overflow="hidden"
                transition="all 100ms ease-in-out"
                transform="scale(0.9)"
                boxShadow="2px 0 7px rgba(0,0,0,0.2);"
                _hover={{
                  zIndex: "100",
                  transform: "rotate3d(1, 1, 1,2deg) scale(1)",
                  boxShadow: "6px 0 7px rgba(0,0,0,0.5);",
                }}
                zIndex={-i}
                _notFirst={{
                  ml: "-30px",
                }}
              >
                <NextLink href={item.link} target="_blank" variant="noeffect">
                  <Tooltip label={item.name} fontSize="md" mt="10px">
                    {/* <CustomImage src={item.image} alt={item.name} ref={ref} /> */}
                    <CustomCard src={item.image} alt={item.name} />
                  </Tooltip>
                </NextLink>
              </Box>
            ))
          )}
        </Grid>
      </Box>
    </>
  );
};

export default CardFilms;
