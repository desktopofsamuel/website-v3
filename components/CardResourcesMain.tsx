// import { Box, Text, Heading, Button, Grid, SimpleGrid } from "@chakra-ui/react";
// import React from "react";
// import resources from "../resources.json"
// import NextImage from "./NextImage";
// import NextLink from "./NextLink";

// type Props = {
//   title: string;
//   description: string;
//   cta: string;
//   link: string;
//   photo: string;
// };

// export default function CardResources() {
//   return (
//     <SimpleGrid spacing={8}>
//       {resources.map((item: Props) => (
//         <Grid gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr"}} gap="4" key={item.title}>
//           <Box>
//           <NextLink href={item.link} variant="noeffect">
//             <NextImage src={item.photo} alt={item.title}/>
//             </NextLink>
//           </Box>
//           <Box>
//           <Heading>{item.title}</Heading>
//           <Text>{item.description}</Text>
//           <Button><NextLink href={item.link} variant="noeffect">{item.cta}</NextLink></Button>
//           </Box>
         
//         </Grid>
//       ))}
//     </SimpleGrid>
//   );
// }
