import Link from "@/components/AppLink";
import { TbMenu2 } from "react-icons/tb";
import NavTicker from "@/components/NavTicker";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

type AppNavBarProps = {
  /** Hong Kong current temperature in °C — server-fetched in AppLayout, daily cache. */
  temperature?: number | null;
};

/**
 * Server-rendered shell of the global nav. Three small client islands handle
 * the interactive bits:
 *   - <NavTicker />     — polls /api/currently-playing every 30s, rotates messages
 *   - <NavLinks />      — usePathname() for active-link state (desktop + mobile)
 *   - <ThemeToggle />   — localStorage-backed dark/light state
 *
 * The mobile menu overlay is a pure CSS toggle (checkbox + peer-checked) so its
 * structure stays server-rendered; interactivity inside it reuses the same
 * client islands as the desktop nav.
 */
export default function AppNavBar({ temperature }: AppNavBarProps) {
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
        <div className="border-b border-border px-page flex items-center justify-between gap-3 py-5">
          <Link
            href="/"
            className="no-underline text-foreground font-body text-base leading-none shrink-0"
            aria-label="Desktop of Samuel — Home"
          >
            Desktop of Samuel
          </Link>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
            <NavTicker temperature={temperature} />

            {/* Mobile menu — top bar, right side */}
            <div className="flex shrink-0 items-center md:hidden">
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

              <div className="fixed inset-0 z-[1000] bg-background hidden peer-checked:flex flex-col items-start p-8 transition-all">
                <label
                  htmlFor="mobile-menu-toggle"
                  className="mb-8 text-2xl cursor-pointer select-none self-end text-foreground"
                  aria-label="Close menu"
                >
                  ✕
                </label>
                <nav className="flex flex-col gap-y-8 font-body w-full">
                  <NavLinks variant="mobile" />
                  <ThemeToggle variant="labeled" />
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Subnav row — desktop only */}
        <nav className="hidden md:block border-b border-border px-page">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 py-3.5 font-body">
              <NavLinks variant="desktop" />
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
