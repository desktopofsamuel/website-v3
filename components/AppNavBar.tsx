import Link from "@/components/AppLink";
import NavTicker from "@/components/NavTicker";
import NavLinks from "@/components/NavLinks";
import MobileMenu from "@/components/MobileMenu";
import ThemeToggle from "@/components/ThemeToggle";

type AppNavBarProps = {
  /** Hong Kong current temperature in °C — server-fetched in AppLayout, daily cache. */
  temperature?: number | null;
};

/**
 * Server-rendered shell of the global nav. Three small client islands handle
 * the interactive bits:
 *   - <NavTicker />     — polls /api/currently-playing every 30s, rotates messages
 *   - <NavLinks />      — usePathname() for active-link state (desktop)
 *   - <MobileMenu />    — GSAP overlay + mobile nav links, theme toggle, socials
 *   - <ThemeToggle />   — localStorage-backed dark/light state
 *
 * The mobile menu overlay is a client island with GSAP enter/exit animation;
 * desktop nav links stay server-rendered via <NavLinks />.
 */
export default function AppNavBar({ temperature }: AppNavBarProps) {
  return (
    <>
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

            <MobileMenu />
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
