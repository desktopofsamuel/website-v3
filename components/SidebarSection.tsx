type SidebarSectionProps = {
  label: string;
  children: React.ReactNode;
  leftAside?: React.ReactNode;
};

export default function SidebarSection({ label, children, leftAside }: SidebarSectionProps) {
  return (
    <div className="-mx-overhang px-overhang border-t border-border py-16 grid grid-cols-12 gap-x-8 gap-y-6">
      <div className="col-span-12 md:col-span-3">
        <div className="md:sticky md:top-[120px] flex flex-col gap-4">
          {leftAside}
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {label}
          </span>
        </div>
      </div>
      <div className="col-span-12 md:col-span-9">{children}</div>
    </div>
  );
}
