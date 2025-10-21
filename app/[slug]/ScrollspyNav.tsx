"use client";

import React from "react";
import Link from "next/link";

type Heading = {
  id: string;
  text: string;
  level: number;
};

type ScrollspyNavProps = {
  headings: Heading[];
};

export default function ScrollspyNav({ headings }: ScrollspyNavProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // To account for a 68px header and trigger when the heading is near the center of the viewport,
        // set rootMargin so the observed point is the center minus header height.
        rootMargin: `-${(window.innerHeight / 2) - 68}px 0px -${(window.innerHeight / 2) - 68}px 0px`,
      }
    );

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

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
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
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