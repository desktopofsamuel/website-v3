"use client";

import { usePathname } from "next/navigation";
import Link from "@/components/AppLink";
import { MENU_ITEMS } from "@/config";

const MOBILE_MENU_TOGGLE_ID = "mobile-menu-toggle";

type NavLinksProps = {
  variant?: "desktop" | "mobile";
};

export default function NavLinks({ variant = "desktop" }: NavLinksProps) {
  const pathname = usePathname();
  const isMobile = variant === "mobile";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const base = isMobile
    ? "no-underline w-full transition-colors text-2xl"
    : "no-underline text-base transition-colors hover:text-foreground";

  return (
    <>
      {MENU_ITEMS.map((item) =>
        isMobile ? (
          <label key={item.label} htmlFor={MOBILE_MENU_TOGGLE_ID} className="w-full cursor-pointer">
            <Link
              href={item.href}
              className={`${base} ${
                isActive(item.href) ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          </label>
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
