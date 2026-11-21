---
name: "Handpicked"
description: "Warm, editorial, and locally proud — honey gold, sage green, and cream paper sitting on chocolate-brown ink, like a printed Iceland guide left on a café table. The voice is a picky friend's recommendation, not a listings catalog: intimate, first-person, and lightly playful."
extracted: "2026-11-17"
engine: "dembrandt v0.39.2 (5-page crawl: /, /about-us/, /contacts/, /journal/, /become-a-handpicked-business/)"
target: "desktopofsamuel.com about-page experiment (Next.js + Tailwind)"
colors:
  primary: "#F5C268"
  secondary: "#714E12"
  tertiary: "#ADBC7D"
  surface: "#FFFFFF"
  canvas: "#FAF2E9"
  ink: "#2F1A0E"
  on-surface: "#000000"
  lift: "#FDFAF7"
  hairline: "#CDC2B8"
  muted: "#736257"
typography:
  headline-display:
    fontFamily: "P22 Mackinac Book"
    fontSize: "80px"
    fontWeight: 400
    lineHeight: 1.05
  headline-lg:
    fontFamily: "P22 Mackinac Book"
    fontSize: "50px"
    fontWeight: 400
    lineHeight: 1.22
  headline-md:
    fontFamily: "P22 Mackinac Book"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.1
  body-md:
    fontFamily: "Baton Turbo Regular"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.25
fonts:
  display-name: "P22 Mackinac"
  display-licensing: "Paid — P22"
  display-open-source-substitute: "Fraunces"
  body-name: "Baton Turbo"
  body-licensing: "Paid — Production Type"
  body-open-source-substitute: "Fraunces"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  full: "9999px"
---

# Design System

This file is a portable brand kit for this site.

This branch maps the kit onto `/about` only (`html.design-md-about`). Licensed faces are substituted with a single Google Font: **Fraunces** for both display and body.

## Colors

| Role | Hex | Notes |
|---|---|---|
| Primary | `#F5C268` | Honey gold (`--color-primary-900` on the source). Accent fill, never body text. |
| Secondary | `#714E12` | Deep brown. Hover, eyebrows, secondary emphasis. |
| Tertiary | `#ADBC7D` | Sage. Occasional accent, not chrome. |
| Canvas | `#FAF2E9` | Live page floor (`--color-base-100`). Use this, not white, as the page background. |
| Surface | `#FFFFFF` | Cards and inputs. |
| Lift | `#FDFAF7` | Soft button fill observed on the source. |
| Ink | `#2F1A0E` | Live text and logo (`--color-base-900`). Prefer this over pure black. |
| On-surface | `#000000` | What dembrandt elected. Do not use for body copy. |
| Hairline | `#CDC2B8` | Borders (`--color-base-300`). |
| Muted | `#736257` | Secondary text (`--color-base-700`). |

Primary on ink is AAA (10.04:1). Do not use white text on canvas (1.11:1) or white on taupe `#A99C91` (2.67:1). Mid-gray `#7F7F7F` on white fails AA at 4.0:1.

## Typography

- **Display / section titles:** P22 Mackinac Book, regular. Soft rounded serif, tight line-height. Substitute: Fraunces 400.
- **Body / UI:** Baton Turbo Regular, 14–18px. Experiment substitute: Fraunces 400 (same face as display).
- Hierarchy is size and family, not weight. Do not force 600/700 on display.

## Voice & Copy Register

Quoted from the live site:

- "Let us guide you to places we truly love"
- "We only select businesses that are local, sustainable, and authentic."
- "For over 15 years, my picky friends and I have been handpicking unique local experiences—places we truly love and are excited to share."
- "just like a good friend would."
- "Help you travel better!" / "Feel the love!"

Warm, first-person, editorial. A picky local introducing a favourite café — not catalog copy or booking-engine urgency.

## Do's and Don'ts

**Do**
- Paint the page cream `#FAF2E9`; keep cards white.
- Set body and headings in chocolate `#2F1A0E`.
- Use honey gold `#F5C268` as fill/emphasis only.
- Use Fraunces for both headings and body on this experiment.
- Keep corners modest (6–10px). Pills only for avatars and fully-round chips.

**Don't**
- Don't use pure black for body text.
- Don't use honey gold as a text color.
- Don't write corporate travel-brochure copy.
- Don't apply this theme outside `/about` until the experiment is accepted.

## Assets

Wordmark is an inline header SVG (331×44, fill `#2F1A0E` on cream). Local copy: `public/static/experiments/handpicked-wordmark.svg`.

## Known Gaps

- dembrandt `surface` is white; live canvas is cream `#FAF2E9`.
- dembrandt `on-surface` is black; live ink is `#2F1A0E`.
- Spacing scale from computed styles is noisy (1.89px, 6.56px). Use 8 / 16 / 24 / 40 instead of copying it literally.
- Frontmatter radii undershoot live 10px / 16px controls — prefer 10px for buttons.
- No error color was observed.
- Font substitutes are best-effort; hashed `.woff2` files on the source cannot be hot-linked (licensed).
