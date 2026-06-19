"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TbSun, TbMoon } from "react-icons/tb";

type ThemeToggleProps = {
  variant?: "icon" | "labeled";
};

// Work pages are always presented in light mode, regardless of saved preference.
const isForcedLight = (pathname: string | null) =>
  !!pathname && pathname.startsWith("/work");

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<string>("dark");
  const forcedLight = isForcedLight(pathname);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    const effective = isForcedLight(pathname) ? "light" : saved;
    setTheme(effective);
    document.documentElement.classList.toggle("dark", effective === "dark");
  }, [pathname]);

  const toggle = () => {
    if (forcedLight) return;
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Hide the control on forced-light routes; the effect above still enforces light.
  if (forcedLight) return null;

  if (variant === "labeled") {
    return (
      <button
        onClick={toggle}
        className="flex items-center gap-2 p-2 transition-colors text-foreground self-start"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <TbSun className="w-5 h-5" />
        ) : (
          <TbMoon className="w-5 h-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <TbSun className="w-5 h-5" />
      ) : (
        <TbMoon className="w-5 h-5" />
      )}
    </button>
  );
}
