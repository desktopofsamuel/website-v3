import React from "react";

import Link from "@/components/AppLink";
import { TbMenu2 } from "react-icons/tb";
import { MENU_ITEMS } from "@/config";

// Mobile menu restored using a hidden checkbox hack (no state)
// Scrolling is disabled when the mobile menu overlay is open using a <style> tag and the :has() CSS selector
export default function AppNavBar() {
  return (
    <>
      {/* Disable scrolling on body when mobile menu is open */}
      <style>{`
        body:has(#mobile-menu-toggle:checked) {
          overflow: hidden !important;
          touch-action: none;
        }
      `}</style>
      <header className="max-w-[1080px] mx-auto px-5">
        <nav className="flex items-center justify-between py-8">
          <Link
            href="/"
            className="text-md font-heading font-bold no-underline text-inherit"
          >
            Desktop of Samuel
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-x-4 font-heading">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="no-underline text-inherit transition-colors border-b-2 border-b-transparent hover:text-primary-500 hover:border-b-2 hover:border-primary-500"
                >
                  {item.label}
                </Link>
              ))}
            </div>
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
                className="mb-8 bg-none border-none text-2xl cursor-pointer select-none self-end"
                aria-label="Close menu"
              >
                ✕
              </label>
              <nav className="flex flex-col gap-y-8 font-heading text-white w-full">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="no-underline text-inherit transition-colors hover:text-primary-500 hover:border-b-2 hover:border-primary-500"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>  
          </div>
        </nav>
      </header>
    </>
  );
}