---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing or reviewing React/Next.js code, implementing data fetching, optimizing bundle size or load times, or refactoring for performance. Covers eliminating waterfalls, bundle optimization, server-side and client-side patterns, re-renders, and rendering performance.
---

# Vercel React Best Practices

Performance optimization guide for React and Next.js (Vercel Engineering). 57 rules across 8 categories, prioritized by impact.

## When to Apply

- Writing new React components or Next.js pages
- Implementing data fetching (client or server)
- Reviewing code for performance issues
- Refactoring React/Next.js code
- Optimizing bundle size or load times

## Rule Categories (by priority)

| Priority | Category | Impact | Key rules |
|----------|----------|--------|-----------|
| 1 | Eliminating Waterfalls | CRITICAL | Defer await; Promise.all(); better-all; start promises early in API routes; Suspense boundaries |
| 2 | Bundle Size | CRITICAL | Direct imports (no barrel); next/dynamic; defer third-party; conditional load; preload on intent |
| 3 | Server-Side | HIGH | Auth in Server Actions; React.cache(); LRU cache; minimize RSC serialization; parallel fetching; after() |
| 4 | Client Data Fetching | MEDIUM-HIGH | SWR dedup; dedupe event listeners; passive listeners; version localStorage |
| 5 | Re-render Optimization | MEDIUM | Defer state reads; memoized components; primitive deps in effects; derived state in render; startTransition; useRef for transient |
| 6 | Rendering Performance | MEDIUM | content-visibility; hoist static JSX; SVG wrapper animation; conditional render (ternary); useTransition for loading |
| 7 | JavaScript Performance | LOW-MEDIUM | Batch DOM/CSS; index Maps; cache in loops; combine iterations; Set/Map lookups; toSorted() |
| 8 | Advanced Patterns | LOW | Event handlers in refs; init once; useLatest/effectEvent |

## Quick patterns

**Waterfalls:** Use `Promise.all()` for independent work; move `await` into branches that need it; in API routes start `auth()` and `fetchConfig()` immediately then await.

**Bundle:** Prefer direct imports (e.g. `lucide-react/dist/esm/icons/check`) or Next.js `optimizePackageImports`; use `next/dynamic` for heavy components; load analytics after hydration.

**Server:** Authenticate inside every Server Action; use `React.cache()` for per-request dedup and LRU for cross-request; pass minimal props across RSC boundary; use `after()` for logging/analytics.

**Client:** Use SWR (or similar) for request dedup; passive scroll listeners; derive state during render instead of in effects.

## Full reference

For detailed explanations, incorrect vs correct examples, and impact notes: [reference.md](reference.md)

Source: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (react-best-practices).
