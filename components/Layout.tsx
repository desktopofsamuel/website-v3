import Link from "next/link";

type LayoutProps = {
  title?: string;
  description?: string;
  keywords?: [string];
  children: React.ReactNode;
};

export default function Layout({
  title,
  description,
  keywords,
  children,
}: LayoutProps) {
  return (
    <>
      <nav>
        <p>Desktop of Samuel</p>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>Blog</li>
          <li>Work</li>
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
}
