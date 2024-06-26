import { Flex, Button } from "@chakra-ui/react";
import NextLink from "@/components/NextLink";

export default function Pagination({
  numPages,
  currentPage,
}: {
  numPages: number;
  currentPage: number;
}) {
  const isFirst = currentPage === 2; /* First page is p2 as p1 is Blog Index */
  const isLast = currentPage === numPages;
  const prevPage = `/blog/page/${currentPage - 1}`;
  const nextPage = `/blog/page/${currentPage + 1}`;

  if (numPages === 1) return <></>;
  return (
    <Flex justifyContent="space-between" alignItems="center" my="8">
      <NextLink href={prevPage} passHref variant="noeffect">
        <Button isDisabled={isFirst}>Prev</Button>
      </NextLink>
      <NextLink href={nextPage} passHref variant="noeffect">
        <Button isDisabled={isLast}>Next</Button>
      </NextLink>
    </Flex>
  );
}