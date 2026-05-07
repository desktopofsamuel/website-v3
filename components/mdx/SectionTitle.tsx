import type { ElementType, ReactNode } from "react";
import { cn } from "@/components/lib/utils";

type SectionTitleProps = {
  children: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  as?: ElementType;
  className?: string;
};

export default function SectionTitle({
  children,
  eyebrow,
  subtitle,
  as: Heading = "h2",
  className,
}: SectionTitleProps) {
  return (
    <section className={cn("my-10", className)}>
      {eyebrow ? (
        <p className="font-heading text-xs uppercase tracking-wider text-secondarytext mb-3">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-3">
        {children}
      </Heading>
      {subtitle ? <p className="text-secondarytext max-w-2xl">{subtitle}</p> : null}
    </section>
  );
}
