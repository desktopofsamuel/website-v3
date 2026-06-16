import AppLayout from "@/components/AppLayout";

/**
 * Route-group layout shared by every v4 site page.
 * Pages inside `app/(site)/` render their content directly — this layout
 * wraps them in the editorial chrome (nav + footer reveal) once.
 *
 * The `(site)` segment is invisible in the URL, so e.g. `(site)/blog/page.tsx`
 * still serves at `/blog`.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
