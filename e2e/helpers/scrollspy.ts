import { expect, type Locator, type Page } from "@playwright/test";
import {
  HEADING_SELECTOR,
  SCROLL_CONTENT_SELECTOR,
} from "../../utils/collectHeadingsFromDom";

export const FIXTURE_PATH =
  "/how-to-create-a-scroll-tracking-table-of-content-in-gatsby";

/** Primary regression article — long post with many headings and edge cases. */
export const CI_ARTICLE = {
  path: FIXTURE_PATH,
  label: "long",
} as const;

export const ARTICLE_FIXTURES = [
  {
    path: "/learn-from-building-a-second-brain",
    label: "short",
  },
  {
    path: "/how-to-create-a-scroll-tracking-table-of-content-in-gatsby",
    label: "long",
  },
  {
    path: "/oklch-explained-for-designers",
    label: "with-images",
  },
  {
    path: "/raycast-tips-for-designers",
    label: "raycast",
  },
  {
    path: "/things-i-built-2025",
    label: "things-built",
  },
  {
    path: "/best-of-2022",
    label: "best-of",
  },
] as const;

export const POSITION_TOLERANCE_PX = 12;
export const THIRD_HEADING_INDEX = 2;

export type TocHeading = {
  id: string;
  text: string;
};

export function ciTag(articlePath: string): string {
  return articlePath === CI_ARTICLE.path ? " @ci" : "";
}

type ScrollTarget = {
  offsetTop: number;
  expectedScrollY: number;
  maxScrollY: number;
};

/** Browser-side scroll math — must stay in sync with utils/scrollToHeading.ts */
export function computeScrollTargetInPage(headingId: string): ScrollTarget | null {
  const el = document.getElementById(headingId);
  if (!el) return null;

  const readingLine = window.innerHeight * 0.4;

  let offsetTop = 0;
  let node = el as HTMLElement;
  while (node?.offsetParent) {
    offsetTop += node.offsetTop;
    node = node.offsetParent as HTMLElement;
  }

  const rectTop = el.getBoundingClientRect().top + window.scrollY;
  const idealScroll = Math.max(
    offsetTop - readingLine,
    rectTop - readingLine
  );
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );

  return {
    offsetTop,
    expectedScrollY: Math.min(Math.max(0, idealScroll), maxScrollY),
    maxScrollY,
  };
}

export async function headingDocTop(page: Page, id: string): Promise<number> {
  const target = await page.evaluate(computeScrollTargetInPage, id);
  if (!target) throw new Error(`Heading #${id} not found`);
  return target.offsetTop;
}

export function activeTocItem(page: Page): Locator {
  return page.locator("aside nav li.active");
}

export function tocLink(page: Page, id: string): Locator {
  return page.locator(`aside nav a[href="#${id}"]`);
}

export async function getValidTocHeadings(page: Page): Promise<TocHeading[]> {
  return page.locator("aside nav a").evaluateAll((links) =>
    links
      .map((link) => ({
        id: link.getAttribute("href")!.slice(1),
        text: link.textContent!.trim(),
      }))
      .filter((heading) => document.getElementById(heading.id) !== null)
  );
}

export async function activeTocText(page: Page): Promise<string> {
  const item = activeTocItem(page);
  await expect(item).toHaveCount(1);
  return item.locator("a").innerText();
}

export async function activeTocHref(page: Page): Promise<string> {
  const item = activeTocItem(page);
  await expect(item).toHaveCount(1);
  return item.locator("a").getAttribute("href") as Promise<string>;
}

export async function assertClickHighlightsTargetNotPrevious(
  page: Page,
  target: TocHeading,
  previous: TocHeading
): Promise<void> {
  await expect(activeTocItem(page)).toHaveCount(1);
  expect(await activeTocText(page)).toBe(target.text);
  expect(await activeTocHref(page)).toBe(`#${target.id}`);
  expect(await activeTocText(page)).not.toBe(previous.text);
  expect(await activeTocHref(page)).not.toBe(`#${previous.id}`);
}

export async function waitForScrollSettle(
  page: Page,
  {
    timeout = 3000,
    stableFrames = 3,
    startY,
    expectMovement = false,
  }: {
    timeout?: number;
    stableFrames?: number;
    startY?: number;
    expectMovement?: boolean;
  } = {}
): Promise<void> {
  await page.waitForFunction(
    ({ frames, initialY, mustMove }) =>
      new Promise<boolean>((resolve) => {
        let last = window.scrollY;
        let stable = 0;
        let hasMoved = !mustMove;

        const tick = () => {
          if (mustMove && Math.abs(window.scrollY - initialY) > 1) {
            hasMoved = true;
          }

          if (window.scrollY !== last) {
            hasMoved = true;
            stable = 0;
            last = window.scrollY;
          } else if (hasMoved) {
            stable += 1;
          }

          if (hasMoved && stable >= frames) {
            resolve(true);
          } else {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      }),
    {
      frames: stableFrames,
      initialY: startY ?? 0,
      mustMove: expectMovement,
    },
    { timeout }
  );
}

export async function scrollToReadingY(
  page: Page,
  targetDocTop: number
): Promise<void> {
  await page.evaluate((top) => {
    const ideal = top - window.innerHeight * 0.4;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    window.scrollTo({
      top: Math.min(Math.max(0, ideal), maxScroll),
      behavior: "auto",
    });
  }, targetDocTop);
  await waitForScrollSettle(page);
}

async function scrollPositionError(page: Page, id: string): Promise<number> {
  const scrollY = await page.evaluate(() => window.scrollY);
  const target = await page.evaluate(computeScrollTargetInPage, id);
  if (!target) return Number.POSITIVE_INFINITY;
  return Math.abs(scrollY - target.expectedScrollY);
}

export async function clickTocLink(page: Page, id: string): Promise<void> {
  const startY = await page.evaluate(() => window.scrollY);
  const target = await page.evaluate(computeScrollTargetInPage, id);
  const expectMovement = target
    ? Math.abs(target.expectedScrollY - startY) > 1
    : false;

  await tocLink(page, id).click();
  await waitForScrollSettle(page, {
    timeout: 10000,
    stableFrames: 5,
    startY,
    expectMovement,
  });
}

export async function assertHeadingAtReadingLine(
  page: Page,
  id: string,
  tolerance = POSITION_TOLERANCE_PX
): Promise<void> {
  expect(await scrollPositionError(page, id)).toBeLessThanOrEqual(tolerance);
}

export async function assertScrollTargetMath(
  page: Page,
  id: string,
  tolerance = POSITION_TOLERANCE_PX
): Promise<void> {
  await assertHeadingAtReadingLine(page, id, tolerance);
}

export async function loadFixture(
  page: Page,
  path: string = FIXTURE_PATH
): Promise<TocHeading[]> {
  await page.goto(path);
  await page.locator("aside nav").waitFor({ state: "visible" });
  await page.waitForFunction(
    ({ contentSelector, headingSelector }) => {
      const root = document.querySelector(contentSelector);
      return (
        root !== null &&
        root.querySelectorAll(headingSelector).length > 0 &&
        document.querySelectorAll("#scrollspy-nav a").length > 0
      );
    },
    {
      contentSelector: SCROLL_CONTENT_SELECTOR,
      headingSelector: HEADING_SELECTOR,
    }
  );
  return getValidTocHeadings(page);
}

export async function waitForActiveTocStable(
  page: Page,
  expectedText: string,
  durationMs = 500
): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < durationMs) {
    expect(await activeTocText(page)).toBe(expectedText);
    await page.waitForTimeout(50);
  }
}
