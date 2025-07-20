import Link from "next/link";

type AppLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: "_blank" | "_self";
  title?: string;
  onClick?: () => void;
};

function AppLink({
  href,
  children,
  className = "",
  style = {},
  target = "_self",
  title = "",
  onClick,
  ...rest
}: AppLinkProps) {
  const internal = /^\/(?!\/)/.test(href);
  
  if (internal) {
    return (
      <Link 
        href={href}
        className={className}
        style={style}
        title={title}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <a
      href={href}
      className={className}
      style={style}
      target={target}
      rel={target === "_blank" ? "noreferrer noopener" : undefined}
      title={title}
      onClick={onClick}
      {...rest}
    >
      {children}
    </a>
  );
}

export default AppLink;
export { AppLink as Link }; 