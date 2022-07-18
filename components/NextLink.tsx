import Link from "next/link";
import { Link as ChakraLink, chakra } from "@chakra-ui/react";

const CustomLink = chakra(Link);

export default function NextLink({
  children,
  href,
  passHref,
  prefetch,
  replace,
  className,
  variant,
  title,
  ...rest
}: LinkProps) {
  const internal = /^\/(?!\/)/.test(href);
  if (internal)
    return (
      <Link href={href} passHref>
        <ChakraLink
          href={href}
          className={className}
          variant={variant}
          {...rest}
        >
          {children}
        </ChakraLink>
      </Link>
    );
  return (
    <ChakraLink
      isExternal
      href={href}
      className={className}
      rel="noreferrer noopener"
      variant={variant}
      {...rest}
    >
      {children}
    </ChakraLink>
  );
}

const defaultProps: LinkProps = {
  target: `_self`,
  className: "",
  children: {},
  href: "",
  passHref: false,
  variant: "",
  title: "",
};

type LinkProps = {
  target?: "_blank" | "_self";
  className?: string;
  children?: React.ReactNode;
  href: string;
  passHref?: boolean;
  prefetch?: boolean;
  replace?: boolean;
  variant?: string;
  title?: string;
};

NextLink.defaultProps = defaultProps;
