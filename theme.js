import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// import Heading from '@/components/element/heading';

const customTheme = extendTheme({
  config: {
    cssVarPrefix: "dos",
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    body: "Chivo, Noto Sans HK, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif",
    heading:
      "Space Grotesk, Noto Sans HK, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif",
    mono: "Space Mono, IBM Plex Mono, monospace",
  },
  colors: {
    transparent: "rgba(0,0,0,0)",
    yellow: {
      100: "oklch(98% 0.0147 83.7)",
      200: "oklch(96% 0.0147 83.7)",
      300: "oklch(90% 0.0147 83.7)",
      400: "oklch(86% 0.0147 83.7)",
      500: "oklch(70% 0.0147 83.7)",
      600: "oklch(72% 0.0147 83.7)",
      700: "oklch(55% 0.0147 83.7)",
      800: "oklch(68% 0.0147 83.7)",
      900: "oklch(66% 0.0147 83.7)",
    },
    primary: {
      100: "oklch(97% 0.0148 238.24)",
      200: "oklch(90% 0.0148 238.24)",
      300: "oklch(85% 0.0148 238.24)",
      400: "oklch(74% 0.15 234.83)",
      500: "oklch(70% 0.1875 238.24)",
      600: "oklch(65% 0.1875 238.24)",
      700: "oklch(35% 0.06 237.89)",
      800: "oklch(26% 0.04 237.6)",
      900: "oklch(20% 0.04 237.96)",
    },
  },
  semanticTokens: {
    colors: {
      primarytext: {
        default: "yellow.900",
        _dark: "primary.300",
      },
      secondarytext: {
        default: "yellow.700",
        _dark: "primary.300",
      },
      tertiarytext: {
        default: "primary.800",
        _dark: "primary.300",
      },
      background: {
        default: "yellow.100",
        _dark: "primary.900",
      },
      lift: {
        default: "yellow.200",
        _dark: "primary.800",
      },
      border: {
        default: "yellow.300",
        _dark: "primary.800",
      },
      outline: {
        default: "gray.200",
        _dark: "gray.700",
      },
    },
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: "normal",
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: "2",
    3: ".75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    9: "2.25rem",
    10: "2.5rem",
  },
  letterSpacings: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
  components: {
    Tag: {
      baseStyle: (props) => ({
      
      }),
      variants: {
        outline: (props) => ({
          textTransform: "uppercase",
          backgroundColor: "red",
          letterSpacing: "tight",
          border: "1px solid",
          borderColor: mode("yellow.500", "primary.400")(props),
        }),
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Button: {
      baseStyle: (props) => ({
        fontFamily: "heading",
        _hover: {
          textDecoration: "none",
        },
        // _disabled: {
        //   background: mode('primary.500', 'primary.400')(props),
        //   _hover: {
        //     backgroundColor: mode('primary.500', 'primary.400')(props),
        //   },
        // },
      }),
      variants: {
        solid: (props) => ({
          backgroundColor: mode("primary.100", "primary.800")(props),
          color: mode("primary.500", "primary.500")(props),
          _hover: {
            textDecoration: "none",
            backgroundColor: mode("primary.500", "primary.700")(props),
            color: mode("white", "primary.500")(props),
          },
        }),
        ghost: (props) => ({
          background: "none",
          color: mode("primary.500", "white")(props),
          _hover: {
            background: mode("primary.100", "whiteAlpha.200")(props),
            color: mode("primary.500", "white")(props),
            textDecoration: "none",
          },
        }),
        outline: (props) => ({
          background: "none",
          color: mode("primary.500", "primary.400")(props),
          borderColor: mode("primary.200", "primary.700")(props),
          _hover: {
            background: "none",
            borderColor: mode("primary.200", "primary.600")(props),
            color: mode("primary.500", "primary.400")(props),
          },
        }),
        icon: (props) => ({
          background: mode("primary.100", "primary.800")(props),
          color: mode("primary.500", "primary.400")(props),
          _hover: {
            background: mode("primary.500", "primary.500")(props),
            color: mode("white", "white")(props),
          },
        }),
        brand: (props) => ({
          backgroundColor: mode("primary.500", "primary.400")(props),
          color: "white",
        }),
        disabled: (props) => ({
          border: "1px solid",
          borderColor: mode("yellow.200", "primary.700")(props),
        }),
        defaultProps: {
          variant: "solid",
        },
      },
    },
    Text: {
      baseStyle: (props) => ({
        transition: "all 100ms ease-in-out",
    }),
      variants: {
        caption: (props) => ({
          margin: "0",
          marginBottom: "2",
          fontSize: "sm",
        }),
        small: (props) => ({
          fontSize: "sm",
          fontFamily: "heading",
          fontWeight: "medium",
          textTransform: "uppercase",
          letterSpacing: "wide",
        }),
      },
    },
    Link: {
      baseStyle: (props) => ({
        transition: "all 500ms ease-in-out",
        borderBottomColor: "transparent",
        color: mode("gray.800", "white.300"),
        textDecoration: "none",
        _hover: {
          textDecoration: "none",
        },
      }),
      variants: {
        noeffect: (props) => ({
          _hover: {
            borderBottomColor: "transparent",
            color: "initial",
          },
        }),
        postTitle: (props) => ({
          paddingBottom: "2px",
          borderBottom: "1.5px dotted rgba(0,0,0,0)",
          transition: "all 0.1s ease-in-out",
          display: "inline",
          _hover: {
            textDecoration: "none",
            borderBottom: "1.5px dotted darkgrey",
          },
        }),
        navigation: (props) => ({
          borderBottomWidth: "1px",
          borderBottomColor: "transparent",
          _hover: {
            color: mode("primary.500", "primary.400"),
            borderBottomColor: mode("primary.500", "primary.400"),
            borderBottomWidth: "1px",
            textDecoration: "none",
          },
        }),
      },
    },
    VStack: {
      baseStyle: (props) => ({
        align: "flex-start",
        spacing: "8",
      }),
    },
    Heading: {
      baseStyle: {
        fontSize: "2xl",
        fontWeight: "600",
        letterSpacing: "tight",
      },
      variants: {
        pagetitle: (props) => ({
          fontSize: {
            sm: "5xl",
            md: "8xl",
          },
          mt: {
            sm: "5vh",
            md: "20vh",
          },
          mb: "8",
          letterSpacing: "tighter",
        }),
        title: (props) => ({
          fontSize: "5xl",
          my: "0",
          lineHeight: "tall",
        }),
        heading: (props) => ({
          fontSize: "3xl",
          my: "4",
        }),
        subtitle: (props) => ({
          fontSize: "xl",
          my: "4",
        }),
        small: (props) => ({
          fontSize: "md",
          fontWeight: "black",
          textTransform: "uppercase",
          letterSpacing: "wider",
        }),
      },
      defaultProps: {
        variant: "title",
      },
    },
  },
  styles: {
    global: (props) => ({
      body: {
        lineHeight: "taller",
        background: "background",
        fontFeatureSettings: "zero",
      },
      p: {
        color: "text",
        my: "4",
        fontWeight: "500",
        a: {
          color: mode("primary.500", "primary.500")(props),
          borderBottomWidth: "1px",
          borderBottomColor: mode("primary.500", "primary.500")(props),
        },
      },
      a: {
        // color: mode("primary.500", "primary.400")(props),
        // _hover: {
        //   borderBottomWidth: '1px',
        //   borderBottomColor: 'primary.500',
        //   borderBottomStyle: 'solid',
        // },
        borderBottomWidth: "1px",
        borderBottomColor: "transparent",
        _hover: {
          color: mode("primary.400", "primary.400")(props),
          borderBottomColor: mode("primary.400", "primary.400")(props),
          borderBottomWidth: "1px",
        },
      },
      h1: {
        fontFamily: "heading",
        fontWeight: "bold",
        fontSize: "xl",
        mt: "8",
        mb: "4",
      },
      h2: {
        fontFamily: "heading",
        fontWeight: "bold",
        lineHeight: "taller",
        fontSize: "lg",
        mt: "8",
        mb: "4",
      },
      h3: {
        fontFamily: "heading",
        fontSize: "md",
        fontWeight: "bold",
        mt: "8",
        mb: "4",
      },
      blockquote: {
        fontFamily: "heading",
        margin: "10 0",
      },
      "blockquote > p": {
        fontStyle: "normal",
        fontFamily: "heading",
        fontSize: "2xl",
        lineHeight: "short",
        letterSpacing: "tight",
        padding: "10",
      },
      ul: {
        listStyle: "bullet",
        my: "2",
      },
      ol: {
        listStyle: "decimal",
        listStylePosition: "inside",
      },
      li: {
      },
      pre: {
        my: "2",
        padding: "2px 6px",
        whiteSpace: "pre-wrap",
        fontSize: "sm",
        lineHeight: "short",
        backgroundColor: "lift",
      },
      code: {
        my: "2",
        padding: "2px 6px",
        whiteSpace: "pre-wrap",
        fontSize: "sm",
        lineHeight: "short",
        backgroundColor: "lift",
      },
      iframe: {
        py: "8",
      },
      blockquote: {
        fontSize: "lg",
        fontStyle: "italic",
      },
    }),
  },
});

export default customTheme;
