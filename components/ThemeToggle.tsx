"use client";

import { useState, useEffect } from "react";
import { TbSun, TbMoon } from "react-icons/tb";

type ThemeToggleProps = {
  variant?: "icon" | "labeled";
};

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

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
