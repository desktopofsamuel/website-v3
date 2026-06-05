"use client";

import React from "react";
import Link from "next/link";
import { prepare, layout } from "@chenglou/pretext";

const HEADER_HEIGHT = 68;
const READING_POSITION = () => window.innerHeight * 0.4;

type Heading = {
  id: string;
  text: string;
  level: number;
};

type Section = {
  id: string;
  top: number;   // px from document top
  bottom: number;
};

function getSectionText(fromEl: Element, toEl: Element | null): string {
  let text = "";
  let node: Node | null = fromEl.nextSibling;
  while (node && node !== toEl) {
    if (node.textContent) text += node.textContent + " ";
    node = node.nextSibling;
  }
  return text.trim();
}

function buildSections(headings: Heading[]): Section[] {
  const sections: Section[] = [];

  // Find the article element that wraps all headings
  const firstEl = document.getElementById(headings[0]?.id);
  const article = firstEl?.closest("article") ?? firstEl?.parentElement ?? null;

  // Gather computed font info from the article for pretext
  let font = "16px sans-serif";
  let lineHeightPx = 32; // 16px * 2 (our leading-[2])
  let containerWidth = 672; // max-w-2xl fallback

  if (article) {
    const style = getComputedStyle(article);
    const fontSize = parseFloat(style.fontSize) || 16;
    const fontFamily = style.fontFamily || "sans-serif";
    const lh = parseFloat(style.lineHeight);
    font = `${fontSize}px ${fontFamily}`;
    lineHeightPx = isNaN(lh) ? fontSize * 2 : lh;
    containerWidth = article.clientWidth || containerWidth;
  }

  for (let i = 0; i < headings.length; i++) {
    const el = document.getElementById(headings[i].id);
    if (!el) continue;

    const top = el.getBoundingClientRect().top + window.scrollY;
    const nextEl = headings[i + 1] ? document.getElementById(headings[i + 1].id) : null;

    // Estimate section height via pretext
    let bottom: number;
    if (nextEl) {
      const nextTop = nextEl.getBoundingClientRect().top + window.scrollY;
      // Use pretext to estimate content height, take the larger of DOM measurement vs estimate
      const sectionText = getSectionText(el, nextEl);
      let pretextBottom = top;
      if (sectionText.length > 0) {
        try {
          const prepared = prepare(sectionText, font);
          const measured = layout(prepared, containerWidth, lineHeightPx);
          pretextBottom = top + measured.height;
        } catch {
          pretextBottom = nextTop;
        }
      }
      bottom = Math.max(nextTop, pretextBottom);
    } else {
      // Last section: use pretext estimate, fall back to page bottom
      const sectionText = getSectionText(el, null);
      let pretextBottom = document.documentElement.scrollHeight;
      if (sectionText.length > 0) {
        try {
          const prepared = prepare(sectionText, font);
          const measured = layout(prepared, containerWidth, lineHeightPx);
          pretextBottom = top + measured.height;
        } catch {
          // keep document bottom
        }
      }
      bottom = pretextBottom;
    }

    sections.push({ id: headings[i].id, top, bottom });
  }

  return sections;
}

type ScrollspyNavProps = {
  headings: Heading[];
};

export default function ScrollspyNav({ headings }: ScrollspyNavProps) {
  const [activeId, setActiveId] = React.useState<string>("");
  const sectionsRef = React.useRef<Section[]>([]);
  const rafRef = React.useRef<number | null>(null);
  const resizeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const recalculate = React.useCallback(() => {
    if (headings.length === 0) return;
    sectionsRef.current = buildSections(headings);
  }, [headings]);

  const onScroll = React.useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const sections = sectionsRef.current;
      if (sections.length === 0) return;

      const readingY = window.scrollY + READING_POSITION();

      // Last section whose top is at or above the reading position
      let active = sections[0].id;
      for (const section of sections) {
        if (readingY >= section.top) {
          active = section.id;
        }
      }
      setActiveId(active);
    });
  }, []);

  React.useEffect(() => {
    if (headings.length === 0) return;

    recalculate();
    onScroll(); // set initial active without waiting for a scroll event

    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        recalculate();
        onScroll();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [headings, recalculate, onScroll]);

  if (headings.length === 0) return null;

  return (
    <aside className="fixed top-1/2 right-4 transform -translate-y-1/2 hidden xl:block max-w-48 z-50">
      <nav className="text-sm">
        <ul className="list-none">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={`border-l border-gray-200 dark:border-gray-600 pl-2 py-1 transition-colors ${
                activeId === heading.id
                  ? "border-primary-500 dark:border-primary-500 text-primary-500 font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
              style={{ paddingLeft: `${8 + (heading.level - 1) * 8}px` }}
            >
              <Link
                href={`#${heading.id}`}
                className="block hover:text-primary-500 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(heading.id);
                  if (element) {
                    const top = element.getBoundingClientRect().top + window.scrollY - READING_POSITION();
                    window.scrollTo({ top, behavior: "smooth" });
                  }
                }}
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
