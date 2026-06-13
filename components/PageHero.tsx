import React from "react";

type PageHeroProps = {
  /** Optional eyebrow above the title (e.g. "02 — Writing", a date, "Tagged"). */
  eyebrow?: React.ReactNode;
  /** Title — accepts JSX so callers can use <br /> for line breaks. */
  title: React.ReactNode;
  /** Optional intro paragraph below the title. */
  description?: React.ReactNode;
  /** Visual treatment of the hero. Defaults to "editorial". */
  variant?: "editorial" | "centered";
};

export default function PageHero({
  eyebrow,
  title,
  description,
  variant = "editorial",
}: PageHeroProps) {
  if (variant === "centered") {
    return (
      <header className="max-w-4xl mx-auto px-page pt-12 pb-10 text-center">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="font-body font-normal text-4xl md:text-6xl tracking-tighter leading-none text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-prose mx-auto font-body text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </header>
    );
  }

  // editorial (default)
  return (
    <div className="mx-divider px-overhang pt-16 pb-12 border-b border-border">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
          {eyebrow}
        </p>
      )}
      <h1 className="font-body font-normal text-6xl md:text-8xl tracking-tighter leading-none text-foreground">
        {title}
      </h1>
      {description && (
        <p className="mt-8 max-w-[55ch] font-body text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
