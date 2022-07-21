import { useEffect, useState } from "react";
import useSWR from "swr";
import NextLink from "@/components/NextLink";
import {
  Text,
  Grid,
  Heading,
  Tooltip,
  Box,
  useColorModeValue,
  Flex,
  Wrap,
  SimpleGrid,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import fetcher from "@/lib/fetcher";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CardBase from "@/components/CardBase"

const Books = () => {
  const { data, error } = useSWR("/api/books", fetcher);

  return (
    <>
     <CardBase title="📚 Recently reading">
        {!data ? (
          <>
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
            <Skeleton width="50%" /> <Skeleton />
          </>
        ) : (
          data.map((item, i) => (
            <Grid
              key={i}
              mb="2"
              borderRadius="2xl"
              gridTemplateColumns="max-content auto"
              gap="2"
            >
              {/* <Text variant="small">{["📚", "📖", "📕", "📒", "📔", "📙","📘"].sample()}</Text> */}
              <Box>
                <NextLink
                  href={item.link}
                  title={`Read more about ${item.name} on Oku`}
                  display="flex"
                  alignItems="center"
                  variant="noeffect"
                  target="_blank"
                  isExternal
                >
                  <Heading
                    my="0"
                    fontSize="md"
                    fontWeight="bold"
                    lineHeight="8"
                    color="text.900" 
                  >
                    {item.name || <Skeleton />}
                  </Heading>
                  <ExternalLinkIcon mx="2" />
                </NextLink>
                <Text m="0" fontSize="xs" textTransform="uppercase">
                  {`by ${item.author}` || <Skeleton />}
                </Text>
              </Box>
            </Grid>
          ))
        )}
      </CardBase>
    </>
  );
};

export default Books;
