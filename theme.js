import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// import Heading from '@/components/element/heading';

const customTheme = extendTheme({
  config: {
    cssVarPrefix: "dos",
    initialColorMode: "light",
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
    text: {
      100: "lightgray",
      400: "darkgray",
    },
    brand: {
      100: "orange",
      400: "red",
    },
    yellow: {
      100: "#FFF9EF",
      200: "#F2E3CD",
      300: "#EEDDCC",
      800: "4F483B",
      900: "150D00",
    },
    primary: {
      300: "#33aaff",
      400: "#78c7ff",
      500: "#0077CC",
    },
    secondary: {
      300: "rgb(202,20,20,0.7)",
      400: "#ca1414",
    },
    indigo: {
      100: "#EAF4FA",
      200: "#D6E8F6",
      300: "#BBBFCC",
      400: "#9AB2CD",
      500: "#748cad",
      600: "#546D94",
      700: "#3A507C",
      800: "#253764",
      900: "#1A2025",
    },
  },
  semanticTokens: {
    colors: {
      primarytext: {
        default: "yellow.900",
        _dark: "indigo.300",
      },
      secondarytext: {
        default: "yellow.800",
        _dark: "indigo.200",
      },
      background: {
        default: "yellow.100",
        _dark: "indigo.900",
      },
      border: {
        default: "yellow.200",
        _dark: "indigo.800",
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
    Button: {
      baseStyle: (props) => ({
        fontFamily: "Space Grotesk",
        // background: mode('indigo.100', 'indigo.900')(props),
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
          color: mode("primary.500", "primary.400")(props),
          _hover: {
            // backgroundColor: 'primary.500',
            // color: 'white',
            textDecoration: "none",
          },
        }),
        ghost: (props) => ({
          background: "none",
          color: mode("primary.500", "white")(props),
          _hover: {
            background: mode("indigo.100", "whiteAlpha.200")(props),
            color: mode("primary.500", "white")(props),
            textDecoration: "none",
          },
        }),
        outline: (props) => ({
          background: "none",
          color: mode("primary.500", "primary.400")(props),
          borderColor: mode("indigo.200", "indigo.700")(props),
          _hover: {
            background: "none",
            borderColor: mode("indigo.200", "indigo.600")(props),
            color: mode("primary.500", "primary.400")(props),
          }
          
        }),
        brand: (props) => ({
          backgroundColor: mode("primary.500", "primary.400")(props),

          color: "white",
        }),
        disabled: (props) => ({
          color: "primary.500",
        }),
        defaultProps: {
          // colorScheme: 'indigo',
        },
      },
    },
    Text: {
      baseStyle: (props) => ({
        transition: "all 100ms ease-in-out",
        // color: mode('red.900', 'whiteAlpha.100')(props),
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
            color: "initial"
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
            md: "6xl",
          },
          mt: {
            sm: "5vh",
            md: "20vh",
          },
          mb: "8",
          letterSpacing: "tighter",
        }),
        title: (props) => ({
          fontSize: {
            base: "4xl",
            md: "6xl",
          },
          my: "0",
          lineHeight: "tall",
        }),
        heading: (props) => ({
          fontSize: { 
            base: "3xl",
            md: "6xl",
          },
          my: "4",
        }),
        small: (props) => ({
          fontSize: "sm",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "wide",
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
      },
      p: {
        color: "text",
        my: "4",
        fontWeight: "500",
        a: {
          color: mode("primary.500", "primary.400")(props),
          borderBottomWidth: "1px",
          borderBottomColor: mode("primary.500", "primary.400")(props),
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
          color: mode("primary.500", "primary.400")(props),
          borderBottomColor: mode("primary.500", "primary.400")(props),
          borderBottomWidth: "1px",
        },
      },
      h1: {
        fontFamily: "heading",  
        fontWeight: "bold",
        mt: "8",
        mb: "4",
      },
      h2: {
        fontFamily: "heading",
        fontWeight: "bold",
        lineHeight: "taller",
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
        listStyle: "square",
        my: "2",
      },
      li: {
        color: mode("gray.600", "indigo.300")(props),
      },
      pre: {
        my: "2",
        whiteSpace: "pre-wrap",
        fontSize: "sm",
        lineHeight: "short",
        backgroundColor: "border",
      },
      code: {
        padding: "1",
        margin: "2 0",
        backgroundColor: "border",
        borderRadius: "2",
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
