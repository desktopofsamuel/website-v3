"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/AppLink";
import { MENU_ITEMS } from "@/config";

type NavLinksProps = {
  variant?: "desktop" | "mobile";
};

export default function NavLinks({ variant = "desktop" }: NavLinksProps) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const base =
    variant === "mobile"
      ? "no-underline w-full transition-colors text-2xl"
      : "no-underline text-base transition-colors hover:text-foreground";

  return (
    <>
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`${base} ${
            isActive(item.href) ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
