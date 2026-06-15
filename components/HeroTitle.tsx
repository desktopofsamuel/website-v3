"use client";

import { useState, useEffect } from "react";

const WORDS = ["code", "build", "design", "write"] as const;
const ROTATE_MS = 3_000;

export default function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const word = WORDS[index];

  return (
    <h1 className="font-body font-normal text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none text-foreground">
      Product Designer
      <br className="hidden sm:block" />
      {" who "}
      <span key={word} className="message-rotate inline-block" aria-live="polite">
        {word}
      </span>
    </h1>
  );
}
