import { Box,chakra  } from '@chakra-ui/react'
import Image from "next/image";

const CoverImg = chakra(Image, {
    shouldForwardProp: (prop) => ['width', 'height', 'src', 'alt','quality','placeholder','blurDataURL','loader'].includes(prop),
  })

type Loader = {
  src?: String,
  width?: Number,
  quality?: Number,
}

const myLoader = ({ src, width, quality }: Loader) => {
    return `${src}?w=${width}&q=${quality}`;
  };

export const NextImage = (props: any) => {
  const { src, alt, ...rest } = props
  return (
    <Box pos="relative" cursor="pointer" className="group"  {...rest}>
    <CoverImg
        w="auto"
        h="auto"  
        loader={myLoader}
        width={1280}
        quality={100}
        height={800}
        src={src}
        alt={alt}
        objectFit="contain"
        transition="all 0.5s ease-in-out"
        _groupHover={{
          opacity: '0.7'
          // transform: 'scale(1.05)',
        }}
      />
    </Box>
  )
}

export default NextImage