import type { ReactNode } from "react";
import { cn } from "@/components/lib/utils";

type Props = {
  children: ReactNode;
  color?: string;
  className?: string;
};

export default function EyebrowLabel({ children, color, className }: Props) {
  return (
    <p
      className={cn(
        "font-eyebrow flex items-center gap-2",
        !color && !className?.includes("text-") && "text-muted-foreground",
        className,
      )}
      style={color ? { color } : undefined}
    >
      <span className="size-3 shrink-0 rounded-full bg-current" aria-hidden />
      {children}
    </p>
  );
}
