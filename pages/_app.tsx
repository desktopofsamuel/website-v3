import "../styles/globals.css";
import "../styles/prism.css";
// import "@fontsource/roboto-serif/400.css"
// import "@fontsource/roboto-serif/variable.css"
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import "@fontsource/chivo/400.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import * as ga from "../lib/google-analytics";
import { DefaultSeo } from "next-seo";
import SEO from "../seo-config";
import customTheme from "../theme.js";
import { ChakraProvider } from "@chakra-ui/provider";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}');
      `}
      </Script>
      <ChakraProvider resetCSS={true} theme={customTheme}>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
