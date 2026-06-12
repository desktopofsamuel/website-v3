import React from "react";

type SidebarSectionProps = {
  label: string;
  children: React.ReactNode;
  leftAside?: React.ReactNode;
};

export default function SidebarSection({
  label,
  children,
  leftAside,
}: SidebarSectionProps) {
  return (
    <section className="mx-divider border-b border-border">
      <div className="grid grid-cols-1 md:grid-cols-[3fr_9fr] gap-10 px-overhang py-10">
        <div
          className={
            leftAside
              ? "flex flex-col gap-6"
              : "md:sticky md:top-[120px] md:self-start"
          }
        >
          <h2 className="font-body text-4xl font-normal leading-none text-foreground pt-1.5">
            {label}
          </h2>
          {leftAside}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
