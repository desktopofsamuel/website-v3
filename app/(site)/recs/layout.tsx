export default function RecsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="contents" data-scroll-pad-chapters>{children}</div>;
}
