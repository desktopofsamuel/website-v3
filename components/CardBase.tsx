import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

type Props = {
  children: any;
  title: string;
};

const CardBase = ({ children, title}: Props) => {
  return (
    <Box
      border="1px solid"
      borderColor="border"
      p="4"
      boxShadow="sm"
      transition="all ease-in-out 200ms"
      _hover={{ boxShadow: "md" }}
      borderRadius="16"
      gridColumn={{ base: "span 2", md: "initial" }}
      height="100%"
    >
      <Text variant="small" my="2" color="secondarytext">
        {title}
      </Text>
      {children}
    </Box>
  )
};

// const CardBase = React.forwardRef(({ children, title}: Props,  ref )) => (

//   );

export default CardBase;
