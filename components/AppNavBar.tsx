"use client";
import React, { useState, useEffect } from "react";

import Link from "@/components/AppLink";
import { TbMenu2, TbSun, TbMoon } from "react-icons/tb";
import { MENU_ITEMS } from "@/config";

// Mobile menu restored using a hidden checkbox hack (no state)
// Scrolling is disabled when the mobile menu overlay is open using a <style> tag and the :has() CSS selector
export default function AppNavBar() {
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
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
      <header className="w-full px-5">
        <nav className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-md font-heading font-bold no-underline text-inherit"
          >
            Desktop of Samuel
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 justify-center items-center ">
            <div className="flex gap-x-4 font-heading">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="no-underline text-inherit transition-colors inline-block border-b-2 border-b-transparent hover:text-primary-500 hover:border-primary-500 dark:hover:text-primary-400 dark:hover:border-primary-400 "
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-primary-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <TbMoon className="w-5 h-5" /> : <TbSun className="w-5 h-5" />}
            </button>
          </div>

          {/* Hamburger for mobile */}
          <div className="md:hidden flex items-center">
            {/* Hidden checkbox controls menu open/close */}
            <input
              type="checkbox"
              id="mobile-menu-toggle"
              className="peer hidden"
              tabIndex={-1}
              aria-hidden="true"
            />
            <label
              htmlFor="mobile-menu-toggle"
              className="bg-none border-none text-2xl cursor-pointer select-none"
              aria-label="Open menu"
            >
              <TbMenu2 />
            </label>
            {/* Mobile menu overlay */}
            <div className="fixed inset-0 z-[1000] bg-black bg-opacity-80 hidden peer-checked:flex flex-col items-start p-8 transition-all">
              {/* Close button */}
              <label
                htmlFor="mobile-menu-toggle"
                className="mb-8 bg-none border-none text-2xl cursor-pointer select-none self-end text-white dark:text-white"
                aria-label="Close menu"
              >
                ✕
              </label>
              <nav className="flex flex-col gap-y-8 font-heading text-white w-full">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="no-underline text-inherit w-full transition-colors group"
                  >
                    <span className="group-hover:text-primary-500 group-hover:border-b-2 group-hover:border-primary-500">
                    {item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 transition-colors text-white self-start"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <TbMoon className="w-5 h-5" /> : <TbSun className="w-5 h-5" />}
                  <span>Toggle Theme</span>
                </button>
              </nav>
            </div>  
          </div>
        </nav>
      </header>
    </>
  );
}