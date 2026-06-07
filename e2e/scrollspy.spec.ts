import { expect, test } from "@playwright/test";
import {
  activeTocItem,
  activeTocHref,
  activeTocText,
  ARTICLE_FIXTURES,
  assertClickHighlightsTargetNotPrevious,
  assertHeadingAtReadingLine,
  assertScrollTargetMath,
  clickTocLink,
  headingDocTop,
  loadFixture,
  scrollToReadingY,
  THIRD_HEADING_INDEX,
  tocLink,
  waitForActiveTocStable,
  waitForScrollSettle,
  type TocHeading,
} from "./helpers/scrollspy";

function thirdHeading(headings: TocHeading[]): TocHeading {
  return headings[Math.min(THIRD_HEADING_INDEX, headings.length - 1)];
}

for (const article of ARTICLE_FIXTURES) {
  test.describe(`${article.label} — ${article.path}`, () => {
    test.describe("Suite 1 — TOC click scrolls heading to ~40% viewport", () => {
      let headings: TocHeading[];

      test.beforeEach(async ({ page }) => {
        headings = await loadFixture(page, article.path);
        expect(headings.length).toBeGreaterThanOrEqual(3);
      });

      test("1.1 @smoke click middle section lands heading at reading line", async ({
        page,
      }) => {
        const target = thirdHeading(headings);
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
      });

      test("1.2 click last section lands heading at reading line", async ({
        page,
      }) => {
        const target = headings[headings.length - 1];
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
      });

      test("1.3 click first section from deep scroll", async ({ page }) => {
        await page.evaluate(() =>
          window.scrollTo(0, document.documentElement.scrollHeight)
        );
        await waitForScrollSettle(page);

        const target = headings[0];
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
      });

      test("1.4 jump to a distant section", async ({ page }) => {
        test.skip(headings.length < 5, "needs at least 5 headings");

        const target = headings[4];
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
      });

      test("1.5 scroll target math matches implementation", async ({ page }) => {
        const target = thirdHeading(headings);
        await clickTocLink(page, target.id);
        await assertScrollTargetMath(page, target.id);
      });

      test("1.N1 clicking same section twice does not drift", async ({
        page,
      }) => {
        const target = thirdHeading(headings);
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
      });

      test("1.N2 rapid consecutive clicks settle on final section", async ({
        page,
      }) => {
        test.skip(headings.length < 3, "needs at least 3 headings");

        const middle = headings[Math.min(THIRD_HEADING_INDEX, headings.length - 1)];
        const second = headings[1];

        await tocLink(page, middle.id).click();
        if (headings.length >= 5) {
          await tocLink(page, headings[4].id).click();
        }
        const beforeFinalY = await page.evaluate(() => window.scrollY);
        await tocLink(page, second.id).click();
        await waitForScrollSettle(page, {
          timeout: 10000,
          stableFrames: 5,
          startY: beforeFinalY,
          expectMovement: true,
        });

        await assertHeadingAtReadingLine(page, second.id);
      });
    });

    test.describe("Suite 2 — Highlight matches clicked TOC item", () => {
      let headings: TocHeading[];

      test.beforeEach(async ({ page }) => {
        headings = await loadFixture(page, article.path);
      });

      test("2.1 @smoke click middle section highlights correctly", async ({
        page,
      }) => {
        const target = thirdHeading(headings);
        await clickTocLink(page, target.id);
        expect(await activeTocText(page)).toBe(target.text);
      });

      test("2.R1 @smoke @regression click third heading scrolls and highlights third not second", async ({
        page,
      }) => {
        test.skip(
          headings.length <= THIRD_HEADING_INDEX,
          "needs at least 3 headings"
        );

        const previous = headings[THIRD_HEADING_INDEX - 1];
        const target = headings[THIRD_HEADING_INDEX];

        await clickTocLink(page, target.id);
        await assertHeadingAtReadingLine(page, target.id);
        await assertClickHighlightsTargetNotPrevious(page, target, previous);
      });

      test("2.2 clicking every TOC item highlights the clicked item", async ({
        page,
      }) => {
        for (const heading of headings) {
          await clickTocLink(page, heading.id);
          expect(await activeTocText(page)).toBe(heading.text);
        }
      });

      test("2.3 click earlier section from a later section", async ({
        page,
      }) => {
        test.skip(headings.length < 4, "needs at least 4 headings");

        const later = headings[headings.length - 1];
        const earlier = thirdHeading(headings);

        await scrollToReadingY(page, await headingDocTop(page, later.id));
        await clickTocLink(page, earlier.id);
        expect(await activeTocText(page)).toBe(earlier.text);
      });

      test("2.4 active link href matches highlighted item", async ({ page }) => {
        const target = headings[Math.min(3, headings.length - 1)];
        await clickTocLink(page, target.id);
        expect(await activeTocHref(page)).toBe(`#${target.id}`);
      });

      test("2.5 only one TOC item is highlighted", async ({ page }) => {
        const target = headings[Math.min(2, headings.length - 1)];
        await clickTocLink(page, target.id);
        await expect(activeTocItem(page)).toHaveCount(1);
      });

      test("2.T1 @smoke highlight is correct only after scroll settles", async ({
        page,
      }) => {
        const target = thirdHeading(headings);
        await clickTocLink(page, target.id);
        expect(await activeTocText(page)).toBe(target.text);
      });

      test("2.T2 active highlight stays stable after settle", async ({
        page,
      }) => {
        const target = headings[Math.min(3, headings.length - 1)];
        await clickTocLink(page, target.id);
        await waitForActiveTocStable(page, target.text);
      });
    });

    test.describe("Suite 3 — Scroll-driven highlight tracks visible section", () => {
      let headings: TocHeading[];

      test.beforeEach(async ({ page }) => {
        headings = await loadFixture(page, article.path);
      });

      test("3.1 @smoke initial load highlights first section", async ({
        page,
      }) => {
        expect(await activeTocText(page)).toBe(headings[0].text);
      });

      test("3.2 walk through all sections downward", async ({ page }) => {
        for (const heading of headings) {
          await scrollToReadingY(page, await headingDocTop(page, heading.id));
          expect(await activeTocText(page)).toBe(heading.text);
        }
      });

      test("3.3 walk upward through sections", async ({ page }) => {
        await page.evaluate(() =>
          window.scrollTo(0, document.documentElement.scrollHeight)
        );
        await waitForScrollSettle(page);

        for (let i = headings.length - 1; i >= 0; i -= 1) {
          await scrollToReadingY(
            page,
            await headingDocTop(page, headings[i].id)
          );
          expect(await activeTocText(page)).toBe(headings[i].text);
        }
      });

      test("3.4 boundary switches active section at reading line", async ({
        page,
      }) => {
        test.skip(headings.length < 4, "needs at least 4 headings");

        const index = 3;
        const previous = headings[index - 1];
        const current = headings[index];
        const currentTop = await headingDocTop(page, current.id);

        await scrollToReadingY(page, currentTop - 1);
        expect(await activeTocText(page)).toBe(previous.text);

        await scrollToReadingY(page, currentTop);
        expect(await activeTocText(page)).toBe(current.text);
      });

      test("3.5 last section stays active at page bottom", async ({ page }) => {
        await page.evaluate(() =>
          window.scrollTo(0, document.documentElement.scrollHeight)
        );
        await waitForScrollSettle(page);

        const last = headings[headings.length - 1];
        expect(await activeTocText(page)).toBe(last.text);
      });

      test("3.6 slow continuous scroll increases active index monotonically", async ({
        page,
      }) => {
        test.skip(headings.length < 3, "needs at least 3 headings");

        const observedIndexes: number[] = [];
        let lastIndex = -1;

        await page.evaluate(() => window.scrollTo(0, 0));
        await waitForScrollSettle(page);

        for (let step = 0; step < 40; step += 1) {
          await page.mouse.wheel(0, 250);
          await page.waitForTimeout(80);

          const activeText = await activeTocText(page);
          const index = headings.findIndex(
            (heading) => heading.text === activeText
          );
          expect(index).toBeGreaterThanOrEqual(0);

          if (index !== lastIndex) {
            if (lastIndex >= 0) {
              expect(index).toBeGreaterThan(lastIndex);
            }
            observedIndexes.push(index);
            lastIndex = index;
          }
        }

        expect(observedIndexes.length).toBeGreaterThan(0);
      });

      test("3.P1 @smoke programmatic scroll highlights matching section", async ({
        page,
      }) => {
        for (const heading of headings) {
          await scrollToReadingY(
            page,
            await headingDocTop(page, heading.id)
          );
          expect(await activeTocText(page)).toBe(heading.text);
        }
      });
    });

    test.describe("Suite 4 — Cross-cutting resilience", () => {
      test("4.1 viewport resize keeps active section and click behavior", async ({
        page,
      }) => {
        test.skip(
          article.path !==
            "/how-to-create-a-scroll-tracking-table-of-content-in-gatsby",
          "resize scenario needs 6+ headings"
        );

        const headings = await loadFixture(page, article.path);
        const section4 = headings[3];
        const section6 = headings[5];

        await scrollToReadingY(page, await headingDocTop(page, section4.id));
        expect(await activeTocText(page)).toBe(section4.text);

        await page.setViewportSize({ width: 1400, height: 900 });
        await page.waitForTimeout(250);

        expect(await activeTocText(page)).toBe(section4.text);

        await clickTocLink(page, section6.id);
        await assertHeadingAtReadingLine(page, section6.id);
      });
    });
  });
}

test.describe("Suite 4 — Global", () => {
  test("4.2 TOC hidden below xl breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto(
      "/how-to-create-a-scroll-tracking-table-of-content-in-gatsby"
    );
    await expect(page.locator("aside nav")).toBeHidden();
  });
});
