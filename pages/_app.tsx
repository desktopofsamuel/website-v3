import "../styles/globals.css";
import "../styles/prism.css";
// import "@fontsource/roboto-serif/400.css"
// import "@fontsource/roboto-serif/variable.css"
import '@fontsource/chivo/400.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { DefaultSeo } from "next-seo";
import SEO from "../seo-config";
import customTheme from "../theme.js";
import { ChakraProvider } from "@chakra-ui/provider";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true} theme={customTheme}>
        <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
