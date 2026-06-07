export type DomHeading = {
  id: string;
  text: string;
  level: number;
};

export const SCROLL_CONTENT_SELECTOR = "[data-scroll-content]";
export const HEADING_SELECTOR = "h2[id], h3[id]";

export function collectHeadingsFromDom(
  root: ParentNode,
  selector = HEADING_SELECTOR
): DomHeading[] {
  return [...root.querySelectorAll(selector)]
    .filter(
      (element) =>
        !element.closest("pre") &&
        !element.closest("code") &&
        Boolean(element.id)
    )
    .map((element) => ({
      id: element.id,
      text: element.textContent?.trim() ?? "",
      level: Number(element.tagName.charAt(1)),
    }));
}

export function getScrollContentRoot(
  selector = SCROLL_CONTENT_SELECTOR
): Element | null {
  return document.querySelector(selector);
}
