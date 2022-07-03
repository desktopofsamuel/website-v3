type LayoutProps = {
  title?: string;
  description?: string;
  keywords?: [string];
  children: React.ReactNode;
};


export default function Layout({ title, description, keywords, children }: LayoutProps) {
  return (
    <>
      <h1>Welcome</h1>
      {children}
    </>
  );
}
