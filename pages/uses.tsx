import { NextPage } from "next";
import Layout from "@/components/Layout";
import useSWR from "swr";
import { Text, Box, Grid, Button, Heading } from "@chakra-ui/react";
import fetcher from "@/lib/fetcher";
import CardResources from "@/components/CardResources";
import NextLink from "@/components/NextLink";
import NextImage from "@/components/NextImage";

type Props = [
  fields: {
    Name: string;
    Description: string;
    Images: any;
  }
];

const UsesPage: NextPage = () => {
  const { data: gadgetsData } = useSWR<Props>("/api/uses-gadgets", fetcher);
  const { data: appsData } = useSWR<Props>("/api/uses-apps", fetcher);
  return (
    <Layout title="Uses">
      <Heading variant="pagetitle">Uses</Heading>
      {!gadgetsData ? (
        <Text>Loading...</Text>
      ) : (
        <Grid gap="4">
          {gadgetsData.map((item: any, i: number) => (
            <Box
              key={i}
              p="4"
              border="1px solid"
              borderColor="outline"
              gridTemplateColumns="max-content auto"
              gridGap="8"
              borderRadius="md"
            >
              <Box>
                <Heading fontSize="xl" my="0" lineHeight="short">
                  {item.fields["Name"]}
                </Heading>
                <Box
                  dangerouslySetInnerHTML={{
                    __html: `${item.fields["Description"]}`,
                  }}
                />
                {item.fields["ExtraLink"] && (
                  <Button>
                    <NextLink href={item.fields["ExtraLink"]}>
                      {item.fields["CTA"]}
                    </NextLink>
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Grid>
      )}
      {/* Apps */}
      <Heading>Apps</Heading>
      {!appsData ? (
        <Text>Loading...</Text>
      ) : (
        <Grid gap="4">
          {appsData.map((item: any, i: number) => (
            <Grid
              key={i}
              p="2"
              border="1px solid"
              borderColor="outline"
              gridTemplateColumns="max-content auto"
              gridGap="8"
              borderRadius="md"
            >
              {item.fields.Image && (
                <Box
                  backgroundColor="indigo.200"
                  borderRadius="36px"
                  display="grid"
                  placeContent="center"
                  p="4"
                  height="128px"
                  width="128px"
                  position="relative"
                >
                  <NextImage
                    src={item.fields.Image[0].thumbnails.large.url}
                    alt={item.fields.Name}
                    height={64}
                    width={64}
                  />
                </Box>
              )}
              <Box>
                <Heading fontSize="xl" my="0" lineHeight="short">
                  {item.fields.Name}
                </Heading>

                <Box
                  dangerouslySetInnerHTML={{
                    __html: `${item.fields.Description}`,
                  }}
                />
                {/* {item.fields.ExtraLink && (
                        <Button>
                          <NextLink href={item.fields.ExtraLink}>
                            {item.fields["CTA"]}
                          </NextLink>
                        </Button>
                      )} */}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
};

export default UsesPage;
