import NextLink from "@/components/NextLink";
import CardBase from "@/components/CardBase";
import { Heading, Text } from "@chakra-ui/react";

type Props = {
  title: string,
  description: string,
  url: string,
}

const CardResources = ({title, description, url}: Props) => {
  return (
    <NextLink href={url} target="_blank" variant="noeffect">
      <CardBase title="">
        <Heading fontSize="xl" my="0" lineHeight="short">
          {title}
        </Heading>
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
