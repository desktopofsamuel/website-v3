import { Box, Wrap, chakra } from "@chakra-ui/react";
import Image from "next/future/image";

const CoverImg = chakra(Image, {
  shouldForwardProp: (prop) =>
    [
      "width",
      "height",
      "src",
      "alt",
      "quality",
      "placeholder",
      "blurDataURL",
      "loader",
    ].includes(prop),
});

type Loader = {
  src?: String;
  width?: Number;
  quality?: Number;
};

const myLoader = ({ src, width, quality }: Loader) => {
  return `${src}?w=${width}&q=${quality}`;
};

export const NextImage = (props: any) => {
  const { src, alt, ...rest } = props;
  return (
    <Box overflow="hidden" cursor="pointer ">
      <Box
        transition="all 0.5s ease-in-out"
        _hover={{
          opacity: "0.7",
          transform: "scale(1.05)",
        }}
      >
        <Image loader={myLoader} quality={100} src={src} alt={alt} {...rest} />
      </Box>
    </Box>
  );
};

export default NextImage;
