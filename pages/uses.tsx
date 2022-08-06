import { GetServerSideProps, NextPage } from "next";
import { Box, Heading, Text } from "@chakra-ui/react";
import Layout from "@/components/Layout";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const UsePage: NextPage<Props> = ({  }) => {
  const { data } = useSWR<Props>("/api/uses", fetcher);
  return (
    <Layout>
      <Heading variant="pagetitle">Use</Heading>
      {console.log(data)}
      {data.entries.map((entry, index) => {
        return (
          
          <Box key={index}>
            <Text>{entry.nameEn.id}</Text>
            {/* <Heading>{entry.properties.NameEn}</Heading>
            <Text>{entry.properties.Model}</Text> */}
          </Box>
        );
      })}
    </Layout>
  );
};

export default UsePage;
