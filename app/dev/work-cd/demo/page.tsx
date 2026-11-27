import { notFound } from "next/navigation";
import Link from "@/components/AppLink";
import { PRINT_DEMOS } from "@/lib/work-cd/print-demo";

export const metadata = {
  title: "Print demos A–D",
  robots: { index: false, follow: false },
};

export default function PrintDemoIndexPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-16">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Hidden study</p>
      <h1 className="font-heading mt-2 text-4xl">Print demos A–D</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Four comparable studios. Same dummy albums, orbit, zoom, and lid slider. Pick the
        path that stays sharp when you fill the screen with the cover.
      </p>
      <ul className="mt-10 grid gap-4">
        {PRINT_DEMOS.map((demo) => (
          <li key={demo.id}>
            <Link
              href={`/dev/work-cd/demo/${demo.id}`}
              className="block rounded-2xl border border-border bg-card p-5 no-underline transition-colors hover:bg-muted/40"
            >
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Option {demo.letter}
                {demo.usesGlb ? " · jewel-case GLB" : " · planes only"}
              </p>
              <h2 className="font-heading mt-1 text-2xl">{demo.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{demo.blurb}</p>
              <p className="mt-2 text-sm">{demo.zoom}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-muted-foreground">
        <Link href="/work-3d-preview">Studio</Link>
        {" · "}
        <Link href="/dev/work-cd">Cover Flow</Link>
        {" · "}
        <Link href="/work">/work</Link> is unchanged.
      </p>
    </main>
  );
}
