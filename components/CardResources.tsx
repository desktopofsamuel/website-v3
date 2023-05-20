import NextLink from "@/components/NextLink";
import CardBase from "@/components/CardBase";
import { Box, Heading, Tag, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type Props = {
  title: string;
  description: string;
  url: string;
  tag: string;
};

const CardResources = ({ title, description, url, tag }: Props) => {
  return (
    <NextLink href={url} target="_blank" variant="noeffect">
      <CardBase title="">
        <Tag variant="solid" colorScheme="yellow">
          {tag}
        </Tag>
        <Box>
          <Heading fontSize="xl" my="0" lineHeight="short" display="inline">
            {title}
          </Heading>
          <ExternalLinkIcon mx="2" mb="1" />
        </Box>
        <Text>{description}</Text>
        {/* {item.fields.ExtraLink && (
                        <Button>
                          <NextLink href={item.fields.ExtraLink}>
                            {item.fields["CTA"]}
                          </NextLink>
                        </Button>
                      )} */}
      </CardBase>
    </NextLink>
  );
};

export default CardResources;
