"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/AppLink";
import { MENU_ITEMS } from "@/config";

type NavLinksProps = {
  variant?: "desktop" | "mobile";
  onItemClick?: () => void;
};

export default function NavLinks({ variant = "desktop", onItemClick }: NavLinksProps) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const base = isMobile
    ? "no-underline w-full transition-colors text-6xl font-regular"
    : "no-underline text-base transition-colors hover:text-foreground";

  return (
    <>
      {MENU_ITEMS.map((item, index) =>
        isMobile ? (
          <div key={item.label} data-menu-item className="w-full">
            <Link
              href={item.href}
              onClick={onItemClick}
              className={`${base} flex items-baseline gap-6 ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums w-6 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
            </Link>
          </div>
        ) : (
          <Link
            key={item.label}
            href={item.href}
            className={`${base} ${
              isActive(item.href) ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </Link>
        )
      )}
    </>
  );
}
