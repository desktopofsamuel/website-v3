"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import Link from "@/components/AppLink";
import { TbMenu2, TbSun, TbMoon } from "react-icons/tb";
import { MENU_ITEMS } from "@/config";

const HELLO_MESSAGES = [
  "This is Samuel Wong",
  "Welcome to Desktop of Samuel",
  "Hello from Hong Kong",
  "Crafting bespoke experiences",
];

export default function AppNavBar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<string>("dark");
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % HELLO_MESSAGES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Disable scrolling on body when mobile menu is open */}
      <style>{`
        body:has(#mobile-menu-toggle:checked) {
          overflow: hidden !important;
          touch-action: none;
        }
      `}</style>
      <header className="sticky top-0 z-50 bg-background">
        {/* Ticker row */}
        <div className="border-b border-border px-page flex items-center justify-between gap-4 py-5">
          <Link
            href="/"
            className="no-underline text-foreground font-body text-base leading-none"
            aria-label="Desktop of Samuel — Home"
          >
            Desktop of Samuel
          </Link>

          {/* Curvy line + arrow + rotating hello message */}
          <div
            className="hidden md:flex items-center gap-2 text-foreground"
            aria-live="polite"
          >
            <div
              className="wave-line h-3 w-32 lg:w-48"
              aria-hidden="true"
            />
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              aria-hidden="true"
              className="-ml-1 shrink-0"
            >
              <path
                d="M0 5 L12 5 M8.5 1.5 L12 5 L8.5 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              key={messageIndex}
              className="message-rotate font-body text-base leading-none text-foreground whitespace-nowrap"
            >
              {HELLO_MESSAGES[messageIndex]}
            </span>
          </div>
        </div>

        {/* Subnav row */}
        <nav className="border-b border-border px-page">
          <div className="flex items-center justify-between">
            {/* Desktop subnav */}
            <div className="hidden md:flex items-center gap-6 py-3.5 font-body">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`no-underline text-base transition-colors hover:text-foreground ${
                    isActive(item.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center py-3.5">
              <input
                type="checkbox"
                id="mobile-menu-toggle"
                className="peer hidden"
                tabIndex={-1}
                aria-hidden="true"
              />
              <label
                htmlFor="mobile-menu-toggle"
                className="text-2xl cursor-pointer select-none text-foreground"
                aria-label="Open menu"
              >
                <TbMenu2 />
              </label>

              {/* Mobile menu overlay */}
              <div className="fixed inset-0 z-[1000] bg-background hidden peer-checked:flex flex-col items-start p-8 transition-all">
                <label
                  htmlFor="mobile-menu-toggle"
                  className="mb-8 text-2xl cursor-pointer select-none self-end text-foreground"
                  aria-label="Close menu"
                >
                  ✕
                </label>
                <nav className="flex flex-col gap-y-8 font-body w-full">
                  {MENU_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`no-underline w-full transition-colors text-2xl ${
                        isActive(item.href)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 p-2 transition-colors text-foreground self-start"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <TbSun className="w-5 h-5" />
                    ) : (
                      <TbMoon className="w-5 h-5" />
                    )}
                    <span>Toggle theme</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Theme toggle (desktop) */}
            <button
              onClick={toggleTheme}
              className="hidden md:inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <TbSun className="w-5 h-5" />
              ) : (
                <TbMoon className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
