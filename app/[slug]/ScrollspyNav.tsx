"use client";

import React from "react";
import ScrollSpy from "@fsegurai/scrollspy";
import { Link } from "@/components/AppLink";
import {
  collectHeadingsFromDom,
  getScrollContentRoot,
  type DomHeading,
} from "../../utils/collectHeadingsFromDom";
import {
  readingLineOffset,
  scrollToHeadingAtReadingLine,
} from "../../utils/scrollToHeading";
import { waitForScrollEnd } from "../../utils/waitForScrollEnd";

const ITEM_CLASS =
  "border-l border-gray-200 dark:border-gray-600 pl-2 py-1 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 [&.active]:border-primary-500 [&.active]:dark:border-primary-500 [&.active]:text-primary-500 [&.active]:font-bold";

function activateNavItem(headingId: string) {
  document
    .querySelectorAll("#scrollspy-nav li.active")
    .forEach((li) => li.classList.remove("active"));
  document
    .querySelector(`#scrollspy-nav a[href="#${headingId}"]`)
    ?.closest("li")
    ?.classList.add("active");
}

function sameHeadingIds(a: DomHeading[], b: DomHeading[]): boolean {
  return (
    a.length === b.length &&
    a.every((heading, index) => heading.id === b[index]?.id)
  );
}

export default function ScrollspyNav() {
  const [headings, setHeadings] = React.useState<DomHeading[]>([]);
  const spyRef = React.useRef<ScrollSpy | null>(null);

  React.useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const root = getScrollContentRoot();
    if (!root) return;

    const refreshHeadings = () => {
      const next = collectHeadingsFromDom(root);
      setHeadings((prev) => (sameHeadingIds(next, prev) ? prev : next));
    };

    refreshHeadings();

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(refreshHeadings, 300);
    });

    observer.observe(root, { childList: true, subtree: true });
    window.addEventListener("load", refreshHeadings);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      window.removeEventListener("load", refreshHeadings);
    };
  }, []);

  React.useEffect(() => {
    if (headings.length === 0) {
      spyRef.current?.destroy();
      spyRef.current = null;
      return;
    }

    spyRef.current?.destroy();
    spyRef.current = new ScrollSpy("#scrollspy-nav", {
      offset: readingLineOffset,
      bottomThreshold: 100,
      reflow: true,
      events: true,
    });

    requestAnimationFrame(() => {
      spyRef.current?.detect();
      if (
        window.scrollY < 50 &&
        !document.querySelector("#scrollspy-nav li.active") &&
        headings[0]
      ) {
        activateNavItem(headings[0].id);
      }
    });

    return () => {
      spyRef.current?.destroy();
      spyRef.current = null;
    };
  }, [headings]);

  const handleHeadingClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, headingId: string) => {
      event.preventDefault();
      const element = document.getElementById(headingId);
      if (!element) return;

      const startY = window.scrollY;
      const targetTop = scrollToHeadingAtReadingLine(element, "smooth");
      waitForScrollEnd(() => activateNavItem(headingId), {
        expectMovement: Math.abs(targetTop - startY) > 1,
        startY,
      });
    },
    []
  );

  if (headings.length === 0) return null;

  return (
    <aside className="fixed top-1/2 right-4 transform -translate-y-1/2 hidden xl:block max-w-48 z-50">
      <nav id="scrollspy-nav" className="text-sm">
        <ul className="list-none">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={ITEM_CLASS}
              style={{ paddingLeft: `${8 + (heading.level - 1) * 8}px` }}
            >
              <Link
                href={`#${heading.id}`}
                className="block hover:text-primary-500 transition-colors"
                onClick={(event) => handleHeadingClick(event, heading.id)}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
