import { Box, Wrap, chakra } from "@chakra-ui/react";
import Image from "next/image";

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
  const { src, alt, noeffect, ...rest } = props;
  return (
    <Box display="block" position="relative"
    overflow="hidden" cursor={ noeffect ? "initial" : "pointer"}
    >
      <Box position="relative" width="auto" height="auto" 
        transition={noeffect ? "none" : "all 0.5s ease-in-out"}  
        _hover={noeffect ? {} : {
          opacity: "0.7",
          transform: "scale(1.05)",
        }}
        _groupHover={noeffect ? {} : {
          opacity: "0.7",
          transform: "scale(1.05)",
        }}
      >
        <Image loader={myLoader} quality={70} src={src} alt={alt} width={1200} height="800" style={{ objectFit: "contain"}} {...rest} />
      </Box>
    </Box>
  );
};

export default NextImage;
