import { Box, LinkBox, Text } from "@chakra-ui/react";
import { Work } from "contentlayer/generated";
import React from "react";
import NextLink from "@/components/NextLink";

const NextPrev = ({
  prevPost,
  nextPost,
}: {
  nextPost: Work;
  prevPost: Work;
}) => {
  return (
    <Box my="16">
      {/* {prevPost && (
                <Link href={`/work/${prevPost.slug}`}>
                    <button>Previous: {prevPost.title}</button>
                </Link>
            )} */}

      {nextPost && (
        
          <Box border="1px solid" borderColor="border" px="8" py="6" rounded="md" ><NextLink href={`/work/${nextPost.slug}`}>
            <Text variant="small" color="secondarytext" my="0">
              Read next →
            </Text>
            <Text fontSize="lg" my="0">
              {nextPost.title}
            </Text>  </NextLink>
          </Box>
      
      )}
    </Box>
  );
};

export default NextPrev;
