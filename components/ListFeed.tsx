import React from "react";
import NextLink from "@/components/NextLink";
import {
  ListItem,
  Button,
  Box,
  Grid,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
export default function ListFeed({ data }: any) {
  const item = data;

  return (
    <ListItem
      maxW="56ch"
      borderLeft="1px solid"
      borderLeftColor="border"
      paddingLeft="8"
      marginLeft="4"
      position="relative"
      paddingBottom="8"
      listStyleType="none"
      _last={{ paddingBottom: "2" }}
      _first={{
      }}
    >
      <Box
        backgroundColor="#6B614F"
        borderRadius="full"
        position="absolute"
        left="-4px"
        top="12px"
        width="8px"
        height="8px"
      ></Box>
      <Flex flexDirection="column" gap="2">
        <Heading fontSize="xl" marginTop="0">
          {item.fields.EntryName}
        </Heading>
        <Text color="secondarytext" margin="0">
          {item.fields.Description}
        </Text><Box>
      {item.fields.CTA && (
        <Button>
          <NextLink href={item.fields.URL}></NextLink>
          {item.fields.CTA}
        </Button>
      )}</Box>
      </Flex>
      
    </ListItem>
  );
}
