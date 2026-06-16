export const readingLineOffset = () => window.innerHeight * 0.4;

/** Matches @fsegurai/scrollspy getOffsetTop — keeps scroll + highlight in sync. */
export function getOffsetTop(element: Element): number {
  let top = 0;
  let node = element as HTMLElement;

  while (node?.offsetParent) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement;
  }

  return top;
}

export function getMaxScrollY(): number {
  return Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
}

function getIdealScrollTop(element: Element): number {
  const reading = readingLineOffset();
  const offsetTopIdeal = getOffsetTop(element) - reading;
  const rectTop = element.getBoundingClientRect().top + window.scrollY;
  const rectIdeal = rectTop - reading;
  return Math.max(offsetTopIdeal, rectIdeal);
}

export function getScrollTopForHeading(element: Element): number {
  const idealTop = getIdealScrollTop(element);
  return Math.min(Math.max(0, idealTop), getMaxScrollY());
}

export function scrollToHeadingAtReadingLine(
  element: Element,
  behavior: ScrollBehavior = "smooth"
): number {
  const top = getScrollTopForHeading(element);
  const distance = Math.abs(top - window.scrollY);
  const effectiveBehavior =
    distance > window.innerHeight * 2 ? "auto" : behavior;

  window.scrollTo({ top, behavior: effectiveBehavior });
  return top;
}
