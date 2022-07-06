import "../styles/globals.css";
import "../styles/prism.css";
import "@fontsource/roboto-serif/400.css"
import "@fontsource/roboto-serif/variable.css"
import customTheme from "../theme.js";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true} theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
